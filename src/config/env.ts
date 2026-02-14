import { envSchema, formatValidationError } from './validation';
import type { ValidatedEnv } from './validation';

/**
 * Validate environment variables at application startup
 * 
 * This function validates all environment variables against the defined schema
 * and fails fast with descriptive errors if required variables are missing or invalid.
 * 
 * The validation runs once when this module is imported, ensuring that the
 * application cannot start with invalid configuration.
 * 
 * @throws {Error} If environment variable validation fails
 * @returns Validated environment variables
 * 
 * @example
 * ```typescript
 * import { env } from '@/config/env';
 * 
 * // Access validated environment variables
 * const githubToken = env.GITHUB_TOKEN;
 * const nodeEnv = env.NODE_ENV;
 * ```
 */
function validateEnv(): ValidatedEnv {
  try {
    const validated = envSchema.parse(process.env);
    
    // Log successful validation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully');
    }
    
    return validated;
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      const formattedError = formatValidationError(error as any);
      
      console.error('\n❌ Environment Variable Validation Failed\n');
      console.error(formattedError);
      console.error('\n📝 How to fix this:\n');
      console.error('1. Create a .env.local file in the project root if it doesn\'t exist');
      console.error('2. Add the missing or invalid environment variables');
      console.error('3. Restart the development server or rebuild the application\n');
      console.error('Example .env.local file:\n');
      console.error('  NODE_ENV=development');
      console.error('  NEXT_PUBLIC_SITE_BASE_URL=https://example.com');
      console.error('  NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com');
      console.error('  GITHUB_TOKEN=your_github_token_here\n');
      
      // Always fail fast on validation errors
      throw new Error('Environment variable validation failed. Application startup aborted.');
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * 
 * This object contains all validated environment variables and is safe to use
 * throughout the application. The validation runs at module import time,
 * ensuring the application cannot start with invalid configuration.
 * 
 * @example
 * ```typescript
 * import { env } from '@/config/env';
 * 
 * // Use in API routes
 * export async function GET() {
 *   const token = env.GITHUB_TOKEN;
 *   // ...
 * }
 * ```
 * 
 * @example
 * ```typescript
 * import { env } from '@/config/env';
 * 
 * // Use in server components
 * export default async function Page() {
 *   const apiUrl = env.API_BASE_URL || 'https://api.example.com';
 *   // ...
 * }
 * ```
 */
export const env = validateEnv();

/**
 * Helper function to check if a specific environment variable is set
 * 
 * @param key - Environment variable key
 * @returns True if the variable is set and not empty
 * 
 * @example
 * ```typescript
 * import { hasEnvVar } from '@/config/env';
 * 
 * if (hasEnvVar('GITHUB_TOKEN')) {
 *   // GitHub integration is enabled
 * }
 * ```
 */
export function hasEnvVar(key: keyof ValidatedEnv): boolean {
  const value = env[key];
  return value !== undefined && value !== null && value !== '';
}

/**
 * Helper function to get an environment variable with a fallback
 * 
 * @param key - Environment variable key
 * @param fallback - Fallback value if the variable is not set
 * @returns Environment variable value or fallback
 * 
 * @example
 * ```typescript
 * import { getEnvVar } from '@/config/env';
 * 
 * const apiUrl = getEnvVar('API_BASE_URL', 'https://api.example.com');
 * ```
 */
export function getEnvVar<K extends keyof ValidatedEnv>(
  key: K,
  fallback: NonNullable<ValidatedEnv[K]>
): NonNullable<ValidatedEnv[K]> {
  const value = env[key];
  return (value ?? fallback) as NonNullable<ValidatedEnv[K]>;
}

/**
 * Helper function to require an environment variable
 * 
 * @param key - Environment variable key
 * @param errorMessage - Custom error message if the variable is not set
 * @throws {Error} If the variable is not set
 * @returns Environment variable value
 * 
 * @example
 * ```typescript
 * import { requireEnvVar } from '@/config/env';
 * 
 * const githubToken = requireEnvVar('GITHUB_TOKEN', 'GitHub token is required for this feature');
 * ```
 */
export function requireEnvVar<K extends keyof ValidatedEnv>(
  key: K,
  errorMessage?: string
): NonNullable<ValidatedEnv[K]> {
  const value = env[key];
  
  if (value === undefined || value === null || value === '') {
    const message = errorMessage || `Required environment variable ${String(key)} is not set`;
    throw new Error(message);
  }
  
  return value as NonNullable<ValidatedEnv[K]>;
}

// Export the type for use in other modules
export type { ValidatedEnv };
