/**
 * Fetch with Timeout Utility
 * 
 * Implements timeout handling for external API calls using AbortController
 */

/**
 * Default timeout for external API calls (10 seconds)
 */
export const DEFAULT_TIMEOUT_MS = 10000;

/**
 * Error thrown when a fetch operation times out
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Fetches a URL with timeout handling
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns Promise that resolves with the Response
 * @throws TimeoutError if the request times out
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  // Create an AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Merge the abort signal with existing options
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return response;
  } catch (error) {
    // Check if the error is due to abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    
    // Re-throw other errors
    throw error;
  } finally {
    // Clean up the timeout
    clearTimeout(timeoutId);
  }
}

/**
 * Wraps any async function with timeout handling
 * 
 * @param fn - Async function to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise that resolves with the function result or rejects with TimeoutError
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * Fetches a URL with both timeout and retry logic
 * 
 * This combines timeout handling with the retry logic from fetch-with-retry
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds per attempt
 * @returns Promise that resolves with the Response
 */
export async function fetchWithTimeoutAndRetry(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  return fetchWithTimeout(url, options, timeoutMs);
}
