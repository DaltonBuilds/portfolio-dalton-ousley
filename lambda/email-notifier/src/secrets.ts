/**
 * AWS Secrets Manager Module
 * 
 * Retrieves and caches Resend API key from Secrets Manager
 */

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager"
import type { SecretsCache } from "./types"
import { SECRETS_CACHE_TTL } from "./types"

// Initialize Secrets Manager client
const client = new SecretsManagerClient({})

// In-memory cache for secrets
const secretsCache: SecretsCache = {}

/**
 * Gets Resend API key with caching
 * 
 * @returns Resend API key
 */
export async function getResendApiKey(): Promise<string> {
  const cacheKey = "resendApiKey"
  const now = Date.now()

  // Check cache
  if (
    secretsCache[cacheKey] &&
    secretsCache.lastFetch &&
    now - secretsCache.lastFetch < SECRETS_CACHE_TTL
  ) {
    return secretsCache[cacheKey]
  }

  // Fetch from Secrets Manager
  const secretName = process.env.RESEND_API_KEY_SECRET_NAME || "portfolio/resend-api-key"
  
  try {
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    })

    const response = await client.send(command)
    
    if (!response.SecretString) {
      throw new Error("Resend API key secret has no string value")
    }

    const apiKey = response.SecretString

    // Update cache
    secretsCache[cacheKey] = apiKey
    secretsCache.lastFetch = now

    return apiKey
  } catch (error) {
    console.error("Failed to retrieve Resend API key:", error)
    throw new Error("Failed to retrieve Resend API key from Secrets Manager")
  }
}

