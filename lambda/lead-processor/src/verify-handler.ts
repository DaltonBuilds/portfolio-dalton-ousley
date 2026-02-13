/**
 * Privacy Request Verification Handler
 * 
 * API Gateway Lambda handler for verifying privacy requests
 */

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"
import { verifyPrivacyRequestToken, processVerifiedRequest } from "./privacy-requests"
import { sendResponseEmail } from "./verification-email"
import { getResendApiKey } from "./secrets"

// Environment variables
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME!
const PRIVACY_REQUESTS_TABLE_NAME = process.env.PRIVACY_REQUESTS_TABLE_NAME!

interface APIResponse {
  statusCode: number
  headers: Record<string, string>
  body: string
}

/**
 * Creates a success HTML response
 */
function successHtmlResponse(message: string): APIResponse {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Request Verified</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            color: #28a745;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            margin-bottom: 30px;
          }
          .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="success-icon">✅</div>
        <h1>Privacy Request Verified</h1>
        <p>${message}</p>
        <div class="info-box">
          <strong>What happens next?</strong><br>
          You will receive an email with the results of your privacy request within a few minutes.
        </div>
      </body>
      </html>
    `,
  }
}

/**
 * Creates an error HTML response
 */
function errorHtmlResponse(statusCode: number, message: string): APIResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "text/html",
    },
    body: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .error-icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            color: #dc3545;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            margin-bottom: 30px;
          }
          .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="error-icon">❌</div>
        <h1>Verification Failed</h1>
        <p>${message}</p>
        <div class="info-box">
          <strong>Common reasons:</strong><br>
          • The verification link has expired (24 hour limit)<br>
          • The link has already been used<br>
          • The link is invalid or corrupted<br><br>
          If you need assistance, please contact support.
        </div>
      </body>
      </html>
    `,
  }
}

/**
 * Main Lambda handler for privacy request verification
 */
export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    // Only allow GET requests
    if (event.requestContext.http.method !== "GET") {
      return errorHtmlResponse(405, "Method not allowed")
    }

    // Extract query parameters
    const queryParams = event.queryStringParameters || {}
    const token = queryParams.token
    const requestId = queryParams.id

    if (!token || !requestId) {
      return errorHtmlResponse(400, "Missing verification token or request ID")
    }

    // Verify the token
    const verifiedRequest = await verifyPrivacyRequestToken(
      PRIVACY_REQUESTS_TABLE_NAME,
      requestId,
      token
    )

    if (!verifiedRequest) {
      return errorHtmlResponse(
        400,
        "Invalid or expired verification link. Please submit a new privacy request."
      )
    }

    // Process the verified request
    const result = await processVerifiedRequest(
      DYNAMODB_TABLE_NAME,
      PRIVACY_REQUESTS_TABLE_NAME,
      verifiedRequest
    )

    if (!result.success) {
      return errorHtmlResponse(
        500,
        "Failed to process your privacy request. Please contact support."
      )
    }

    // Send response email
    try {
      const resendApiKey = await getResendApiKey()
      
      const emailResult = {
        data: "data" in result ? result.data : undefined,
        deletedCount: "deletedCount" in result ? result.deletedCount : undefined,
      }
      
      await sendResponseEmail(verifiedRequest, emailResult, resendApiKey)
    } catch (emailError) {
      console.error("Failed to send response email:", emailError)
      // Don't fail the request if email fails
    }

    // Return success response
    const requestTypeLabel = {
      access: "Data Access",
      deletion: "Data Deletion",
      portability: "Data Portability",
    }[verifiedRequest.requestType]

    return successHtmlResponse(
      `Your ${requestTypeLabel} request has been verified and processed successfully.`
    )

  } catch (error) {
    console.error("Unexpected error in verification handler:", error)
    return errorHtmlResponse(
      500,
      "An unexpected error occurred. Please try again later or contact support."
    )
  }
}
