/**
 * HMAC Utility for Request Signing
 * 
 * Implements HMAC-SHA256 signature generation using the Web Crypto API
 * for secure request authentication. Includes timestamp-based replay attack
 * prevention.
 * 
 * @module hmac
 */

/**
 * Configuration for HMAC signature generation
 */
interface HMACConfig {
  /** Secret key for HMAC signature */
  secret: string
  /** Request payload to sign */
  payload: string
  /** ISO 8601 timestamp */
  timestamp: string
}

/**
 * Result of HMAC signature generation
 */
interface HMACResult {
  /** Generated HMAC-SHA256 signature (hex string) */
  signature: string
  /** ISO 8601 timestamp used in signature */
  timestamp: string
}

/**
 * Generates HMAC-SHA256 signature for request authentication
 * 
 * This function creates a cryptographic signature of the request payload
 * combined with a timestamp to prevent replay attacks. The signature is
 * generated using the Web Crypto API (browser-native) for security.
 * 
 * @param config - Configuration object with secret, payload, and timestamp
 * @returns Promise resolving to signature and timestamp
 * 
 * @example
 * ```typescript
 * const { signature, timestamp } = await generateHMACSignature({
 *   secret: 'my-secret-key',
 *   payload: JSON.stringify({ name: 'John', email: 'john@example.com' }),
 *   timestamp: new Date().toISOString()
 * })
 * ```
 */
export async function generateHMACSignature(
  config: HMACConfig
): Promise<HMACResult> {
  const { secret, payload, timestamp } = config

  // Create the message to sign: timestamp + payload
  // This ensures the signature is unique per request and time-bound
  const message = `${timestamp}:${payload}`

  try {
    // Convert secret to ArrayBuffer for Web Crypto API
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(message)

    // Import the secret key for HMAC operations
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    // Generate HMAC-SHA256 signature
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    )

    // Convert signature to hex string for transport
    const signature = bufferToHex(signatureBuffer)

    return { signature, timestamp }
  } catch (error) {
    // Wrap crypto errors with context
    throw new Error(
      `Failed to generate HMAC signature: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

/**
 * Generates HMAC signature for a structured request payload
 * 
 * Convenience wrapper that handles JSON serialization and timestamp
 * generation automatically. This is the primary function to use for
 * signing API requests.
 * 
 * @param secret - HMAC secret key
 * @param payload - Request payload object (will be JSON stringified)
 * @returns Promise resolving to signature and timestamp
 * 
 * @example
 * ```typescript
 * const { signature, timestamp } = await signRequest(
 *   process.env.NEXT_PUBLIC_HMAC_CLIENT_SECRET!,
 *   { name: 'John', email: 'john@example.com' }
 * )
 * ```
 */
export async function signRequest(
  secret: string,
  payload: Record<string, unknown>
): Promise<HMACResult> {
  // Generate timestamp for this request
  const timestamp = new Date().toISOString()
  
  // Serialize payload to JSON (canonical format)
  const payloadString = JSON.stringify(payload)

  return generateHMACSignature({
    secret,
    payload: payloadString,
    timestamp,
  })
}

/**
 * Converts ArrayBuffer to hexadecimal string
 * 
 * @param buffer - ArrayBuffer from crypto operation
 * @returns Hex string representation
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Validates that required environment variables are present
 * 
 * @throws Error if HMAC client secret is not configured
 */
export function validateHMACConfig(): void {
  if (!process.env.NEXT_PUBLIC_HMAC_CLIENT_SECRET) {
    throw new Error(
      "HMAC client secret not configured. Please set NEXT_PUBLIC_HMAC_CLIENT_SECRET in environment variables."
    )
  }
}

/**
 * Gets the HMAC client secret from environment variables
 * 
 * @returns HMAC client secret
 * @throws Error if secret is not configured
 */
export function getHMACSecret(): string {
  const secret = process.env.NEXT_PUBLIC_HMAC_CLIENT_SECRET

  if (!secret) {
    throw new Error(
      "HMAC client secret not configured. Please set NEXT_PUBLIC_HMAC_CLIENT_SECRET in environment variables."
    )
  }

  return secret
}

