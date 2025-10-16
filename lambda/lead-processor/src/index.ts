/**
 * Lead Processor Lambda Handler
 * 
 * Processes lead submissions from API Gateway:
 * 1. Verify HMAC signature
 * 2. Verify Cloudflare Turnstile token
 * 3. Validate payload with Zod
 * 4. Check idempotency
 * 5. Store lead in DynamoDB
 * 6. Publish event to EventBridge
 * 7. Return success response
 */

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { ZodError } from "zod"
import { validateLeadSubmission, validateRequestHeaders } from "./validators"
import { validateTurnstileToken } from "./turnstile"
import { checkIdempotency, storeLead } from "./dynamodb"
import { publishLeadSubmittedEvent } from "./eventbridge"
import { getTurnstileSecret } from "./secrets"
import type { APIResponse, SuccessResponse, ErrorResponse, LeadSubmission } from "./types"

// Environment variables
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!
const EVENTBRIDGE_BUS_NAME = process.env.EVENTBRIDGE_BUS_NAME!
const TTL_DAYS = parseInt(process.env.TTL_DAYS || "548", 10)

/**
 * Creates a success response
 */
function successResponse(data: SuccessResponse): APIResponse {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Idempotency-Key,X-Turnstile-Token",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
    body: JSON.stringify(data),
  }
}

/**
 * Creates an error response
 */
function errorResponse(
  statusCode: number,
  error: string,
  code?: string,
  details?: Record<string, unknown>
): APIResponse {
  const response: ErrorResponse = {
    success: false,
    error,
    code,
    details,
  }

  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,X-Idempotency-Key,X-Turnstile-Token",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
    body: JSON.stringify(response),
  }
}

/**
 * Main Lambda handler
 */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {

  try {
    // 1. Validate request method
    if (event.requestContext.http.method !== "POST") {
      return errorResponse(405, "Method not allowed", "METHOD_NOT_ALLOWED")
    }

    // 2. Parse request body
    if (!event.body) {
      return errorResponse(400, "Request body is required", "MISSING_BODY")
    }

    let requestBody: unknown
    try {
      requestBody = JSON.parse(event.body)
    } catch {
      return errorResponse(400, "Invalid JSON in request body", "INVALID_JSON")
    }

    // 3. Validate headers
    let headers
    try {
      headers = validateRequestHeaders(event.headers || {})
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(400, "Missing or invalid headers", "INVALID_HEADERS", {
          errors: error.errors,
        })
      }
      throw error
    }

    // 4. Validate payload
    let leadData: LeadSubmission
    try {
      leadData = validateLeadSubmission(requestBody)
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(400, "Invalid request payload", "VALIDATION_ERROR", {
          errors: error.errors,
        })
      }
      throw error
    }

    // 5. Get Turnstile secret for bot protection
    const turnstileSecret = await getTurnstileSecret()

    // 6. Verify Turnstile token
    const clientIp = event.requestContext.http.sourceIp
    try {
      await validateTurnstileToken(
        headers["x-turnstile-token"],
        turnstileSecret,
        clientIp
      )
    } catch (error) {
      console.error("Turnstile verification failed:", error)
      return errorResponse(403, "Bot protection verification failed", "TURNSTILE_FAILED")
    }

    // 8. Check idempotency
    const idempotencyKey = headers["x-idempotency-key"]
    const existingLeadId = await checkIdempotency(DYNAMODB_TABLE_NAME, idempotencyKey)

    if (existingLeadId) {
      return successResponse({
        success: true,
        leadId: existingLeadId,
        message: "Lead submission received (duplicate request ignored)",
      })
    }

    // 9. Store lead in DynamoDB
    const storedLead = await storeLead(
      DYNAMODB_TABLE_NAME,
      idempotencyKey,
      leadData,
      TTL_DAYS
    )

    // 10. Publish event to EventBridge
    await publishLeadSubmittedEvent(EVENTBRIDGE_BUS_NAME, {
      leadId: storedLead.leadId,
      name: storedLead.name,
      email: storedLead.email,
      company: storedLead.company,
      message: storedLead.message,
      createdAt: storedLead.createdAt,
    })

    // 11. Return success response
    return successResponse({
      success: true,
      leadId: storedLead.leadId,
      message: "Lead submission received successfully",
    })
  } catch (error) {
    // Log error (no PII)
    console.error("Unexpected error:", error)

    // Return generic error response
    return errorResponse(
      500,
      "Internal server error. Please try again later.",
      "INTERNAL_ERROR"
    )
  }
}

