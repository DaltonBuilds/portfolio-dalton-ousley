/**
 * AWS Secrets Manager Module
 * 
 * Retrieves and caches secrets from Secrets Manager
 */

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager"
import type { SecretsCache } from "./types"
import { SECRETS_CACHE_TTL } from "./types"

// Initialize Secrets Manager client
const client = new SecretsManagerClient({})

// In-memory cache for secrets (persists across warm Lambda invocations)
const secretsCache: SecretsCache = {}

/**
 * Retrieves a secret from Secrets Manager with caching
 * 
 * @param secretName - Secret name in Secrets Manager
 * @returns Secret value
 */
async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({
    SecretId: secretName,
  })

  try {
    const response = await client.send(command)
    
    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} has no string value`)
    }

    return response.SecretString
  } catch (error) {
    console.error(`Failed to retrieve secret ${secretName}:`, error)
    throw new Error(`Failed to retrieve secret: ${secretName}`)
  }
}

/**
 * Gets HMAC server secret with caching
 * 
 * @returns HMAC server secret
 */
export async function getHMACServerSecret(): Promise<string> {
  const cacheKey = "hmacServerSecret"
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
  const secretName = process.env.HMAC_SERVER_SECRET_NAME || "portfolio/hmac-server-secret"
  const secret = await getSecret(secretName)

  // Update cache
  secretsCache[cacheKey] = secret
  secretsCache.lastFetch = now

  return secret
}

/**
 * Gets Turnstile secret key with caching
 * 
 * @returns Turnstile secret key
 */
export async function getTurnstileSecret(): Promise<string> {
  const cacheKey = "turnstileSecret"
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
  const secretName = process.env.TURNSTILE_SECRET_NAME || "portfolio/turnstile-secret"
  const secret = await getSecret(secretName)

  // Update cache
  secretsCache[cacheKey] = secret
  secretsCache.lastFetch = now

  return secret
}

/**
 * Clears the secrets cache (useful for testing)
 */
export function clearSecretsCache(): void {
  secretsCache.hmacServerSecret = undefined
  secretsCache.turnstileSecret = undefined
  secretsCache.lastFetch = undefined
}

