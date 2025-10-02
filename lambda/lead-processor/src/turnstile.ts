/**
 * Cloudflare Turnstile Verification Module
 * 
 * Verifies Turnstile tokens for bot protection
 */

interface TurnstileResponse {
  success: boolean
  "error-codes"?: string[]
  challenge_ts?: string
  hostname?: string
}

/**
 * Verifies Cloudflare Turnstile token
 * 
 * @param token - Turnstile token from client
 * @param secret - Turnstile secret key
 * @param remoteip - Client IP address (optional)
 * @returns True if token is valid
 * @throws Error if verification fails
 */
export async function verifyTurnstileToken(
  token: string,
  secret: string,
  remoteip?: string
): Promise<boolean> {
  const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

  const formData = new URLSearchParams()
  formData.append("secret", secret)
  formData.append("response", token)
  
  if (remoteip) {
    formData.append("remoteip", remoteip)
  }

  try {
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error(`Turnstile API error: ${response.status}`)
    }

    const data = (await response.json()) as TurnstileResponse

    if (!data.success) {
      const errors = data["error-codes"]?.join(", ") || "unknown error"
      throw new Error(`Turnstile verification failed: ${errors}`)
    }

    return true
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Turnstile verification error: ${error.message}`)
    }
    throw new Error("Turnstile verification error: unknown error")
  }
}

/**
 * Validates Turnstile token
 * 
 * @param token - Turnstile token
 * @param secret - Turnstile secret key
 * @param remoteip - Client IP address (optional)
 * @throws Error if validation fails
 */
export async function validateTurnstileToken(
  token: string,
  secret: string,
  remoteip?: string
): Promise<void> {
  const isValid = await verifyTurnstileToken(token, secret, remoteip)
  
  if (!isValid) {
    throw new Error("Invalid Turnstile token")
  }
}

