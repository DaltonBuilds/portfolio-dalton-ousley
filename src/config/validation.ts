import { z } from 'zod';

/**
 * Validation schema for contact configuration
 */
const contactConfigSchema = z.object({
  general: z.string().email('General contact email must be a valid email address'),
  legal: z.string().email('Legal contact email must be a valid email address'),
  privacy: z.string().email('Privacy contact email must be a valid email address'),
  support: z.string().email('Support contact email must be a valid email address'),
});

/**
 * Validation schema for domain configuration
 */
const domainConfigSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  baseUrl: z.string().url('Base URL must be a valid URL'),
  displayName: z.string().min(1, 'Display name is required'),
});

/**
 * Validation schema for company address
 */
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
});

/**
 * Validation schema for jurisdiction
 */
const jurisdictionSchema = z.object({
  state: z.string().min(1, 'Jurisdiction state is required'),
  country: z.string().min(1, 'Jurisdiction country is required'),
});

/**
 * Validation schema for company configuration
 */
const companyConfigSchema = z.object({
  legalName: z.string().min(1, 'Legal name is required'),
  dbaName: z.string().min(1, 'DBA name is required'),
  address: addressSchema,
  jurisdiction: jurisdictionSchema,
});

/**
 * Validation schema for social media links
 */
const socialConfigSchema = z.object({
  github: z.string().url('GitHub URL must be a valid URL'),
  linkedin: z.string().url('LinkedIn URL must be a valid URL'),
  twitter: z.string().url('Twitter URL must be a valid URL').optional(),
}).catchall(z.string().url().optional());

/**
 * Validation schema for professional information
 */
const professionalConfigSchema = z.object({
  role: z.string().min(1, 'Professional role is required'),
  location: z.string().min(1, 'Location is required'),
  company: z.string().min(1, 'Company is required'),
});

/**
 * Validation schema for meta information
 */
const metaConfigSchema = z.object({
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
  themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Theme color must be a valid hex color (e.g., #10b981)'),
});

/**
 * Validation schema for navigation configuration
 */
const navigationConfigSchema = z.object({
  home: z.string().min(1, 'Home path is required'),
  about: z.string().min(1, 'About path is required'),
  blog: z.string().min(1, 'Blog path is required'),
  projects: z.string().min(1, 'Projects path is required'),
  experience: z.string().min(1, 'Experience path is required'),
}).catchall(z.string());

/**
 * Complete site configuration validation schema
 * 
 * This schema validates all site configuration values at build time
 * to catch configuration errors early in the development process.
 * 
 * @example
 * ```typescript
 * import { siteConfigSchema } from '@/config/validation';
 * 
 * const config = siteConfigSchema.parse(rawConfig);
 * ```
 */
export const siteConfigSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  title: z.string().min(1, 'Site title is required'),
  description: z.string().min(1, 'Site description is required'),
  url: z.string().url('Site URL must be a valid URL'),
  contact: contactConfigSchema,
  domain: domainConfigSchema,
  company: companyConfigSchema,
  social: socialConfigSchema,
  professional: professionalConfigSchema,
  meta: metaConfigSchema,
  nav: navigationConfigSchema,
});

/**
 * Environment variables validation schema
 * 
 * This schema validates required and optional environment variables
 * at application startup to ensure all necessary configuration is present.
 * 
 * @example
 * ```typescript
 * import { envSchema } from '@/config/validation';
 * 
 * const env = envSchema.parse(process.env);
 * ```
 */
export const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Site configuration (optional - have defaults in site.config.ts)
  NEXT_PUBLIC_SITE_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_SITE_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().email().optional(),
  NEXT_PUBLIC_LEGAL_EMAIL: z.string().email().optional(),
  NEXT_PUBLIC_PRIVACY_EMAIL: z.string().email().optional(),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional(),
  
  // GitHub integration (optional)
  GITHUB_TOKEN: z.string().optional(),
  NEXT_PUBLIC_GITHUB_USERNAME: z.string().optional(),
  
  // Cloudflare Turnstile (optional)
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  
  // API configuration (optional)
  NEXT_PUBLIC_API_GATEWAY_URL: z.string().url().optional(),
  API_BASE_URL: z.string().url().optional(),
  
  // AWS configuration (optional - for backend)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Email service (optional - for contact form)
  RESEND_API_KEY: z.string().optional(),
}).passthrough(); // Allow other environment variables to pass through

/**
 * Type inference for validated site config
 */
export type ValidatedSiteConfig = z.infer<typeof siteConfigSchema>;

/**
 * Type inference for validated environment variables
 */
export type ValidatedEnv = z.infer<typeof envSchema>;

/**
 * Helper function to format validation errors into readable messages
 * 
 * @param error - Zod validation error
 * @returns Formatted error message with field-specific details
 */
export function formatValidationError(error: z.ZodError<unknown>): string {
  const issues = error.issues || [];
  const errors = issues.map((err) => {
    const path = err.path.join('.');
    return `  - ${path}: ${err.message}`;
  });
  
  return `Configuration validation failed:\n${errors.join('\n')}`;
}

/**
 * Helper function to format missing environment variable errors
 * 
 * @param missingVars - Array of missing variable names
 * @returns Formatted error message with guidance
 */
export function formatEnvError(missingVars: string[]): string {
  const varList = missingVars.map(v => `  - ${v}`).join('\n');
  
  return `Required environment variables are missing:\n${varList}\n\nPlease set these variables in your .env.local file or environment configuration.`;
}
