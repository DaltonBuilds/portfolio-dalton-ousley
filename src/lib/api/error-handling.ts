/**
 * API Error Handling Utilities
 * 
 * Provides standardized error handling for API routes with:
 * - Consistent error response structure
 * - Appropriate HTTP status codes
 * - Type-safe error handling
 */

/**
 * Standard API error response structure
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Handles various error types and converts them to standardized API error responses
 * 
 * @param error - The error to handle (can be Error, string, or unknown)
 * @returns Response object with appropriate status code and error structure
 */
export function handleApiError(error: unknown): Response {
  console.error('API error:', error);

  // Handle standard Error objects
  if (error instanceof Error) {
    // Check for specific error types
    if (error.name === 'ValidationError' || error.message.includes('validation')) {
      return createApiError('Validation failed', 400, { originalError: error.message });
    }
    
    if (error.name === 'NotFoundError' || error.message.includes('not found')) {
      return createApiError('Resource not found', 404);
    }
    
    // Default to 500 for other Error objects
    return createApiError('Internal server error', 500, { originalError: error.message });
  }

  // Handle string errors
  if (typeof error === 'string') {
    return createApiError(error, 500);
  }

  // Handle unknown error types
  return createApiError('An unexpected error occurred', 500);
}

/**
 * Creates a successful API response with consistent structure
 * 
 * @param data - The data to return in the response
 * @param status - HTTP status code (default: 200)
 * @returns Response object with JSON data
 */
export function createApiResponse<T>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Creates a standardized error response
 * 
 * @param message - Human-readable error message
 * @param statusCode - HTTP status code (400, 404, 500, etc.)
 * @param details - Optional additional error context
 * @returns Response object with error structure
 */
export function createApiError(
  message: string,
  statusCode: number,
  details?: unknown
): Response {
  const errorResponse: ApiError = {
    error: getErrorType(statusCode),
    message,
    statusCode,
  };

  // Only add details if provided
  if (details !== undefined) {
    errorResponse.details = details;
  }

  return new Response(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Maps HTTP status codes to error type strings
 * 
 * @param statusCode - HTTP status code
 * @returns Error type string
 */
function getErrorType(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'bad_request';
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not_found';
    case 429:
      return 'rate_limit_exceeded';
    case 500:
      return 'internal_server_error';
    case 502:
      return 'bad_gateway';
    case 503:
      return 'service_unavailable';
    case 504:
      return 'gateway_timeout';
    default:
      return statusCode >= 400 && statusCode < 500 ? 'client_error' : 'server_error';
  }
}

/**
 * Type guard to check if an error is retryable
 * 
 * @param error - The error to check
 * @returns True if the error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Network errors are retryable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true;
    }
    
    // Timeout errors are retryable
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return true;
    }
  }

  // Check for HTTP status codes that are retryable
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: number }).status;
    // Retry on 429 (rate limit), 502, 503, 504 (server errors)
    return status === 429 || status === 502 || status === 503 || status === 504;
  }

  return false;
}
