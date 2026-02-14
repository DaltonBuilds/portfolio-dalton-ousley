/**
 * Fetch with Retry Utility
 * 
 * Implements exponential backoff retry logic for external API calls
 */

import { isRetryableError } from './error-handling';

/**
 * Options for retry behavior
 */
export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000, // Start with 1 second
  maxDelayMs: 10000, // Cap at 10 seconds
  timeoutMs: 10000, // 10 second timeout per attempt
};

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 * 
 * @param attempt - Current attempt number (0-indexed)
 * @param baseDelayMs - Base delay in milliseconds
 * @param maxDelayMs - Maximum delay in milliseconds
 * @returns Delay in milliseconds with jitter
 */
function calculateBackoffDelay(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number
): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);
  
  // Cap at maxDelay
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);
  
  // Add jitter (±25%) to prevent thundering herd
  const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
  
  return Math.floor(cappedDelay + jitter);
}

/**
 * Fetches a resource with automatic retry on failure
 * 
 * @param fetchFn - Function that performs the fetch operation
 * @param options - Retry configuration options
 * @returns Promise that resolves with the fetch result
 * @throws Error if all retry attempts fail
 */
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | unknown;

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      // Execute the fetch function
      const result = await fetchFn();
      return result;
    } catch (error) {
      lastError = error;
      
      console.warn(`Fetch attempt ${attempt + 1} failed:`, error);

      // Check if error is retryable
      if (!isRetryableError(error)) {
        console.error('Non-retryable error encountered, aborting retry:', error);
        throw error;
      }

      // Don't wait after the last attempt
      if (attempt < config.maxRetries - 1) {
        const delay = calculateBackoffDelay(attempt, config.baseDelayMs, config.maxDelayMs);
        console.log(`Retrying in ${delay}ms... (attempt ${attempt + 2}/${config.maxRetries})`);
        await sleep(delay);
      }
    }
  }

  // All retries exhausted
  console.error(`All ${config.maxRetries} retry attempts failed`);
  throw lastError;
}

/**
 * Fetches a URL with retry logic
 * 
 * @param url - URL to fetch
 * @param init - Fetch options
 * @param retryOptions - Retry configuration
 * @returns Promise that resolves with the Response
 */
export async function fetchUrlWithRetry(
  url: string,
  init?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return fetchWithRetry(async () => {
    const response = await fetch(url, init);
    
    // Treat 5xx errors as retryable
    if (response.status >= 500) {
      throw Object.assign(new Error(`Server error: ${response.status}`), {
        status: response.status,
      });
    }
    
    // Treat 429 (rate limit) as retryable
    if (response.status === 429) {
      throw Object.assign(new Error('Rate limit exceeded'), {
        status: response.status,
      });
    }
    
    return response;
  }, retryOptions);
}
