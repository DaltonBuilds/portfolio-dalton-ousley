# Configuration Validation

This document explains the configuration validation system implemented for the portfolio site.

## Overview

The configuration validation system ensures that all site configuration and environment variables are valid before the application starts. This helps catch configuration errors early in the development process and prevents runtime issues.

## Features

- **Build-time validation**: Site configuration is validated when the application is built
- **Runtime validation**: Environment variables are validated at application startup
- **Clear error messages**: Validation errors include field paths and descriptive messages
- **Type safety**: TypeScript types are inferred from validation schemas
- **Fail-fast behavior**: Invalid configuration prevents the application from starting

## Site Configuration Validation

### Location

Site configuration is defined in `src/config/site.config.ts` and validated using schemas in `src/config/validation.ts`.

### Validation Rules

The site configuration schema validates:

- **Contact emails**: Must be valid email addresses
- **URLs**: Must be valid URLs (domain.baseUrl, social links)
- **Required fields**: All required fields must be present and non-empty
- **Theme color**: Must be a valid hex color (e.g., `#10b981`)
- **Keywords**: Must have at least one keyword

### Example

```typescript
import { siteConfig } from '@/config/site.config';

// Use validated configuration
const email = siteConfig.contact.general;
const url = siteConfig.domain.baseUrl;
```

### Testing Invalid Configuration

To test the validation, try setting an invalid value in `site.config.ts`:

```typescript
// This will fail validation
const rawSiteConfig: SiteConfig = {
  // ...
  contact: {
    general: 'not-an-email', // Invalid email
    // ...
  },
};
```

Run `npm run build` and you'll see:

```
❌ Site Configuration Validation Failed

Configuration validation failed:
  - contact.general: General contact email must be a valid email address

Please fix the configuration errors in src/config/site.config.ts
```

## Environment Variable Validation

### Location

Environment variables are validated in `src/config/env.ts` using schemas in `src/config/validation.ts`.

### Validation Rules

The environment schema validates:

- **NODE_ENV**: Must be 'development', 'production', or 'test'
- **Email variables**: Must be valid email addresses if provided
- **URL variables**: Must be valid URLs if provided
- **Optional variables**: Most variables are optional with defaults

### Example

```typescript
import { env, hasEnvVar, getEnvVar, requireEnvVar } from '@/config/env';

// Access validated environment variables
const nodeEnv = env.NODE_ENV;
const githubToken = env.GITHUB_TOKEN;

// Check if a variable is set
if (hasEnvVar('GITHUB_TOKEN')) {
  // GitHub integration is enabled
}

// Get with fallback
const apiUrl = getEnvVar('API_BASE_URL', 'https://api.example.com');

// Require a variable (throws if not set)
const token = requireEnvVar('GITHUB_TOKEN', 'GitHub token is required');
```

### Setting Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_SITE_BASE_URL=https://example.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
GITHUB_TOKEN=your_github_token_here
```

### Testing Invalid Environment Variables

To test the validation, set an invalid value in `.env.local`:

```bash
NEXT_PUBLIC_CONTACT_EMAIL=not-an-email
```

Start the application and you'll see:

```
❌ Environment Variable Validation Failed

Configuration validation failed:
  - NEXT_PUBLIC_CONTACT_EMAIL: Invalid email

📝 How to fix this:
1. Create a .env.local file in the project root if it doesn't exist
2. Add the missing or invalid environment variables
3. Restart the development server or rebuild the application
```

## Validation Behavior

### Development Mode

- **Site config**: Logs validation errors but allows build to continue
- **Environment variables**: Fails fast and prevents application startup

### Production Mode

- **Site config**: Fails build if validation fails
- **Environment variables**: Fails fast and prevents application startup

### CI/CD

- **Site config**: Fails build if validation fails (when `CI=true`)
- **Environment variables**: Fails fast and prevents deployment

## Adding New Configuration Fields

### 1. Update the TypeScript Interface

Add the new field to `src/config/config.types.ts`:

```typescript
export interface SiteConfig {
  // ... existing fields
  newField: string;
}
```

### 2. Update the Validation Schema

Add validation rules to `src/config/validation.ts`:

```typescript
export const siteConfigSchema = z.object({
  // ... existing fields
  newField: z.string().min(1, 'New field is required'),
});
```

### 3. Update the Configuration

Add the value to `src/config/site.config.ts`:

```typescript
const rawSiteConfig: SiteConfig = {
  // ... existing fields
  newField: 'value',
};
```

### 4. Add Tests

Add tests to `src/config/__tests__/validation.test.ts`:

```typescript
it('should reject empty newField', () => {
  const invalidConfig = {
    ...validConfig,
    newField: '',
  };
  const result = siteConfigSchema.safeParse(invalidConfig);
  expect(result.success).toBe(false);
});
```

## Adding New Environment Variables

### 1. Update the Validation Schema

Add the variable to `src/config/validation.ts`:

```typescript
export const envSchema = z.object({
  // ... existing fields
  NEW_ENV_VAR: z.string().optional(),
});
```

### 2. Use the Variable

Access it via the `env` object:

```typescript
import { env } from '@/config/env';

const value = env.NEW_ENV_VAR;
```

### 3. Document the Variable

Add documentation to this file explaining:
- What the variable is for
- Whether it's required or optional
- Example values
- Where to get the value (if applicable)

## Troubleshooting

### Build Fails with Validation Error

1. Read the error message carefully - it tells you which field is invalid
2. Check the value in `src/config/site.config.ts`
3. Fix the invalid value
4. Run `npm run build` again

### Application Won't Start

1. Check the console for validation errors
2. Verify your `.env.local` file has all required variables
3. Check that email addresses are valid
4. Check that URLs are valid (include `https://`)
5. Restart the development server

### Tests Fail

1. Run `npm test src/config/__tests__/validation.test.ts`
2. Check which test is failing
3. Verify the validation schema matches the test expectations
4. Update either the schema or the test as needed

## Related Files

- `src/config/validation.ts` - Validation schemas
- `src/config/site.config.ts` - Site configuration with validation
- `src/config/env.ts` - Environment variable validation
- `src/config/config.types.ts` - TypeScript interfaces
- `src/config/__tests__/validation.test.ts` - Validation tests
- `src/app/layout.tsx` - Imports env validation to run at startup
