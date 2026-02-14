/**
 * API Utilities
 * 
 * Centralized exports for all API-related utilities
 */

// Error handling utilities
export {
  handleApiError,
  createApiResponse,
  createApiError,
  isRetryableError,
  type ApiError,
} from './error-handling';

// Retry logic utilities
export {
  fetchWithRetry,
  fetchUrlWithRetry,
  type RetryOptions,
} from './fetch-with-retry';

// Timeout handling utilities
export {
  fetchWithTimeout,
  withTimeout,
  fetchWithTimeoutAndRetry,
  TimeoutError,
  DEFAULT_TIMEOUT_MS,
} from './fetch-with-timeout';

// Existing utilities
export { generateHMACSignature, signRequest, validateHMACConfig, getHMACSecret } from './hmac';
export { submitLead } from './lead-client';
