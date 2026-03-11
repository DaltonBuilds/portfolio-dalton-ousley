/**
 * Lead Submission API Client
 * 
 * Handles communication with the AWS Lambda backend for lead capture.
 * Implements idempotency and comprehensive error handling.
 * 
 * Security is provided by:
 * - Cloudflare Turnstile (server-side bot protection)
 * - Request validation
 * - Rate limiting (API Gateway + WAF)
 * 
 * @module lead-client
 */

import { v4 as uuidv4 } from "uuid"
import type { LeadSubmission } from "@/lib/validations/lead-form"

/**
 * Configuration for the API client
 */
interface APIConfig {
  /** API Gateway endpoint URL */
  apiUrl: string
  /** Request timeout in milliseconds */
  timeout?: number
  /** Maximum number of retry attempts */
  maxRetries?: number
  /** Base delay for exponential backoff (ms) */
  retryDelay?: number
}

function normalizeLeadApiUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim()

  let parsedUrl: URL
  try {
    parsedUrl = new URL(trimmed)
  } catch {
    throw new LeadSubmissionError(
      "API Gateway URL is invalid. Please set a valid NEXT_PUBLIC_API_GATEWAY_URL.",
      "CONFIG_ERROR"
    )
  }

  const pathname = parsedUrl.pathname.replace(/\/+$/, "")
  parsedUrl.pathname = pathname.endsWith("/leads")
    ? pathname
    : `${pathname}/leads`.replace(/\/{2,}/g, "/")

  return parsedUrl.toString()
}

/**
 * Successful API response
 */
interface SuccessResponse {
  success: true
  leadId: string
  message: string
}

/**
 * Error response from API
 */
interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, unknown>
}

/**
 * Union type for API responses
 */
type APIResponse = SuccessResponse | ErrorResponse

/**
 * Custom error class for API errors
 */
export class LeadSubmissionError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = "LeadSubmissionError"
  }
}

/**
 * Validates required environment variables for API client
 * 
 * @throws LeadSubmissionError if configuration is invalid
 */
function validateAPIConfig(): void {
  if (!process.env.NEXT_PUBLIC_API_GATEWAY_URL) {
    throw new LeadSubmissionError(
      "API Gateway URL not configured. Please set NEXT_PUBLIC_API_GATEWAY_URL.",
      "CONFIG_ERROR"
    )
  }
}

/**
 * Gets API configuration from environment variables
 * 
 * @returns API configuration object
 * @throws LeadSubmissionError if configuration is invalid
 */
function getAPIConfig(): APIConfig {
  validateAPIConfig()

  return {
    apiUrl: normalizeLeadApiUrl(process.env.NEXT_PUBLIC_API_GATEWAY_URL!),
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second base delay
  }
}

/**
 * Generates a unique idempotency key for request deduplication
 * 
 * @returns UUID v4 string
 */
function generateIdempotencyKey(): string {
  return uuidv4()
}

/**
 * Checks if an HTTP status code is retryable
 * 
 * @param statusCode - HTTP status code
 * @returns True if the request should be retried
 */
function isRetryableStatusCode(statusCode: number): boolean {
  // Retry on 5xx server errors and 429 rate limiting
  return statusCode >= 500 || statusCode === 429
}

/**
 * Checks if an error is retryable
 * 
 * @param error - Error object
 * @returns True if the request should be retried
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    // Network errors (fetch failures)
    return true
  }

  if (error instanceof LeadSubmissionError) {
    // Retry on server errors and rate limiting
    return error.statusCode ? isRetryableStatusCode(error.statusCode) : false
  }

  return false
}

/**
 * Delays execution for exponential backoff
 * 
 * @param attempt - Current attempt number (0-indexed)
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise that resolves after delay
 */
async function exponentialBackoff(
  attempt: number,
  baseDelay: number
): Promise<void> {
  // Calculate delay: baseDelay * 2^attempt + random jitter
  const delay = baseDelay * Math.pow(2, attempt)
  const jitter = Math.random() * 1000 // 0-1000ms jitter
  
  await new Promise((resolve) => setTimeout(resolve, delay + jitter))
}

/**
 * Makes an HTTP request with timeout support
 * 
 * @param url - Request URL
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 * @returns Fetch response
 * @throws LeadSubmissionError on timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new LeadSubmissionError(
        "Request timeout. Please try again.",
        "TIMEOUT_ERROR"
      )
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Submits a lead to the API with retry logic
 * 
 * This function handles the complete lead submission flow:
 * 1. Generates idempotency key
 * 2. Sends request to API Gateway with Turnstile token
 * 3. Retries on transient failures
 * 4. Returns structured response
 * 
 * Security is handled server-side via:
 * - Turnstile bot protection verification
 * - Request validation
 * - Rate limiting
 * 
 * @param leadData - Lead form data to submit
 * @returns Promise resolving to success response
 * @throws LeadSubmissionError on validation, network, or server errors
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await submitLead({
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     company: 'Acme Corp',
 *     message: 'Interested in your services',
 *     turnstileToken: 'cf-token-123'
 *   })
 *   console.log('Lead submitted:', result.leadId)
 * } catch (error) {
 *   if (error instanceof LeadSubmissionError) {
 *     console.error('Submission failed:', error.message, error.code)
 *   }
 * }
 * ```
 */
export async function submitLead(
  leadData: LeadSubmission
): Promise<SuccessResponse> {
  const config = getAPIConfig()
  const idempotencyKey = generateIdempotencyKey()

  // Attempt submission with retry logic
  for (let attempt = 0; attempt <= config.maxRetries!; attempt++) {
    try {
      // Prepare request headers (no HMAC - security via Turnstile + server-side validation)
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
        "X-Turnstile-Token": leadData.turnstileToken,
      }

      // Make the API request with timeout
      const response = await fetchWithTimeout(
        config.apiUrl,
        {
          method: "POST",
          headers,
          body: JSON.stringify(leadData),
        },
        config.timeout!
      )

      // Parse response
      const data = (await response.json()) as APIResponse

      // Handle successful response
      if (response.ok && data.success) {
        return data
      }

      // Handle error response
      if (!response.ok) {
        const errorData = data as ErrorResponse

        throw new LeadSubmissionError(
          errorData.error || "Failed to submit lead. Please try again.",
          errorData.code || "API_ERROR",
          response.status,
          errorData.details
        )
      }

      // Unexpected response format
      throw new LeadSubmissionError(
        "Unexpected response from server. Please try again.",
        "INVALID_RESPONSE"
      )
    } catch (error) {
      // If this is the last attempt, throw the error
      if (attempt === config.maxRetries) {
        if (error instanceof LeadSubmissionError) {
          throw error
        }

        // Wrap unexpected errors
        throw new LeadSubmissionError(
          error instanceof Error ? error.message : "Unknown error occurred",
          "UNKNOWN_ERROR"
        )
      }

      // Check if error is retryable
      if (!isRetryableError(error)) {
        // Non-retryable error, throw immediately
        if (error instanceof LeadSubmissionError) {
          throw error
        }

        throw new LeadSubmissionError(
          error instanceof Error ? error.message : "Unknown error occurred",
          "UNKNOWN_ERROR"
        )
      }

      // Wait before retrying with exponential backoff
      await exponentialBackoff(attempt, config.retryDelay!)
    }
  }

  // This should never be reached due to the loop logic above,
  // but TypeScript needs a return statement
  throw new LeadSubmissionError(
    "Maximum retry attempts exceeded",
    "MAX_RETRIES_EXCEEDED"
  )
}

/**
 * Type guard to check if an error is a LeadSubmissionError
 * 
 * @param error - Error to check
 * @returns True if error is LeadSubmissionError
 */
export function isLeadSubmissionError(
  error: unknown
): error is LeadSubmissionError {
  return error instanceof LeadSubmissionError
}

/**
 * Gets a user-friendly error message for display
 * 
 * @param error - Error object
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof LeadSubmissionError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred. Please try again."
}

