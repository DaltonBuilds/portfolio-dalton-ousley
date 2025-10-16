/**
 * HMAC Verification Module
 * 
 * Verifies HMAC-SHA256 signatures on incoming requests
 */

import { createHmac, timingSafeEqual } from "crypto"

/**
 * Maximum age of request timestamp (5 minutes)
 */
const MAX_TIMESTAMP_AGE_MS = 5 * 60 * 1000

/**
 * Verifies HMAC signature on request
 * 
 * @param secret - HMAC server secret
 * @param payload - Request payload (JSON string)
 * @param signature - HMAC signature from request header
 * @param timestamp - ISO 8601 timestamp from request header
 * @returns True if signature is valid
 * @throws Error if verification fails
 */
export function verifyHMACSignature(
  secret: string,
  payload: string,
  signature: string,
  timestamp: string
): boolean {
  
  // Validate timestamp is recent (prevent replay attacks)
  const requestTime = new Date(timestamp).getTime()
  const currentTime = Date.now()
  const timeDiff = currentTime - requestTime

  if (isNaN(requestTime)) {
    throw new Error("Invalid timestamp format")
  }

  if (timeDiff > MAX_TIMESTAMP_AGE_MS) {
    throw new Error(`Request timestamp too old: ${Math.floor(timeDiff / 1000)}s ago`)
  }

  if (timeDiff < -MAX_TIMESTAMP_AGE_MS) {
    throw new Error("Request timestamp is in the future")
  }

  // Generate expected signature
  const message = `${timestamp}:${payload}`
  const hmac = createHmac("sha256", secret)
  hmac.update(message)
  const expectedSignature = hmac.digest("hex")

  // Timing-safe comparison to prevent timing attacks
  try {
    const signatureBuffer = Buffer.from(signature, "hex")
    const expectedBuffer = Buffer.from(expectedSignature, "hex")

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer)
  } catch (error) {
    console.error("Error verifying HMAC signature", error)
    return false
  }
}

/**
 * Validates HMAC request
 * 
 * @param secret - HMAC server secret
 * @param payload - Request payload (raw string or object)
 * @param signature - HMAC signature
 * @param timestamp - Request timestamp
 * @throws Error if validation fails
 */
export function validateHMACRequest(
  secret: string,
  payload: string | unknown,
  signature: string,
  timestamp: string
): void {
  // Use raw string if provided, otherwise stringify the object
  const payloadString = typeof payload === "string" ? payload : JSON.stringify(payload)
  const isValid = verifyHMACSignature(secret, payloadString, signature, timestamp)

  if (!isValid) {
    throw new Error("Invalid HMAC signature")
  }
}

