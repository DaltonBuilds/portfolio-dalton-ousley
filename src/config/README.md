# Centralized Site Configuration

This directory contains the centralized configuration system for all site-wide variables, contact information, and placeholder values.

## Files

- **`config.types.ts`** - TypeScript type definitions for the configuration structure
- **`site.config.ts`** - Main configuration file with default values and environment overrides
- **`mdx-components.tsx`** - MDX components for injecting configuration values into content
- **`constants.ts`** - UI constants (colors, spacing, etc.)
- **`cookies.config.ts`** - Cookie consent configuration

## Quick Start

### Using in React Components

```typescript
import { siteConfig } from '@/config/site.config';

export default function ContactPage() {
  return (
    <div>
      <h1>Contact {siteConfig.name}</h1>
      <a href={`mailto:${siteConfig.contact.general}`}>
        Email us at {siteConfig.contact.general}
      </a>
    </div>
  );
}
```

### Using Destructured Exports

```typescript
import { contact, domain, company } from '@/config/site.config';

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} {company.legalName}</p>
      <a href={`mailto:${contact.general}`}>Contact</a>
    </footer>
  );
}
```

### Using in MDX Content

First, ensure `mdx-components.ts` is set up in your project root:

```typescript
// mdx-components.ts
import { useMDXComponents } from '@/config/mdx-components';

export { useMDXComponents };
```

Then use the components in your MDX files:

```mdx
---
title: "Contact Us"
---

# Get in Touch

Contact us at <EmailLink type="general" /> for general inquiries.

For privacy questions, reach out to <EmailLink type="privacy">our privacy team</EmailLink>.

Visit <DomainLink /> to learn more about our services.
```

## Environment Variable Overrides

You can override configuration values for different environments using environment variables.

### Supported Environment Variables

| Environment Variable | Configuration Path | Default Value |
|---------------------|-------------------|---------------|
| `NEXT_PUBLIC_SITE_DOMAIN` | `domain.domain` | `daltonousley.com` |
| `NEXT_PUBLIC_SITE_BASE_URL` | `domain.baseUrl` | `https://daltonousley.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `contact.general` | `contact@daltonousley.com` |
| `NEXT_PUBLIC_LEGAL_EMAIL` | `contact.legal` | `legal@daltonousley.com` |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | `contact.privacy` | `privacy@daltonousley.com` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | `contact.support` | `support@daltonousley.com` |

### Setting Environment Variables

Create a `.env.local` file in your project root:

```bash
# .env.local - Development environment
NEXT_PUBLIC_CONTACT_EMAIL=dev@example.com
NEXT_PUBLIC_SITE_DOMAIN=dev.example.com
NEXT_PUBLIC_SITE_BASE_URL=https://dev.example.com
```

For production, set these variables in your deployment platform (Vercel, Netlify, etc.).

### Why `NEXT_PUBLIC_` Prefix?

Next.js requires the `NEXT_PUBLIC_` prefix for environment variables that need to be accessible in client-side code. Without this prefix, the variables are only available in server-side code.

## Configuration Structure

The configuration is organized into logical sections:

### Contact Information

```typescript
siteConfig.contact = {
  general: string;    // General inquiries
  legal: string;      // Legal matters
  privacy: string;    // Privacy inquiries
  support: string;    // Technical support
}
```

### Domain Configuration

```typescript
siteConfig.domain = {
  domain: string;       // Primary domain (e.g., "example.com")
  baseUrl: string;      // Full URL with protocol (e.g., "https://example.com")
  displayName: string;  // Display name for legal documents
}
```

### Company Information

```typescript
siteConfig.company = {
  legalName: string;
  dbaName: string;
  address: {
    street?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  jurisdiction: {
    state: string;
    country: string;
  };
}
```

### Social Media Links

```typescript
siteConfig.social = {
  github: string;
  linkedin: string;
  twitter?: string;
}
```

### Professional Information

```typescript
siteConfig.professional = {
  role: string;
  location: string;
  company: string;
}
```

### Meta Information

```typescript
siteConfig.meta = {
  keywords: string[];
  themeColor: string;
}
```

### Navigation Paths

```typescript
siteConfig.nav = {
  home: string;
  about: string;
  blog: string;
  projects: string;
  experience: string;
}
```

## Usage Examples

### In Next.js Metadata

```typescript
import { siteConfig } from '@/config/site.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.domain.displayName}`,
  keywords: siteConfig.meta.keywords,
  themeColor: siteConfig.meta.themeColor,
};
```

### In Server Components

```typescript
import { siteConfig } from '@/config/site.config';

export default async function PrivacyPage() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p>
        For privacy inquiries, contact us at{' '}
        <a href={`mailto:${siteConfig.contact.privacy}`}>
          {siteConfig.contact.privacy}
        </a>
      </p>
      <p>This policy applies to {siteConfig.domain.displayName}</p>
    </article>
  );
}
```

### Accessing Social Links

```typescript
import { social } from '@/config/site.config';

export default function SocialLinks() {
  return (
    <div>
      <a href={social.github} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      {social.twitter && (
        <a href={social.twitter} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      )}
    </div>
  );
}
```

### Using Navigation Paths

```typescript
import { nav } from '@/config/site.config';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href={nav.home}>Home</Link>
      <Link href={nav.about}>About</Link>
      <Link href={nav.blog}>Blog</Link>
      <Link href={nav.projects}>Projects</Link>
      <Link href={nav.experience}>Experience</Link>
    </nav>
  );
}
```

### Dynamic Email Links

```typescript
import { contact } from '@/config/site.config';

export default function ContactOptions() {
  const emailTypes = [
    { type: 'general', label: 'General Inquiries', email: contact.general },
    { type: 'support', label: 'Technical Support', email: contact.support },
    { type: 'legal', label: 'Legal Matters', email: contact.legal },
    { type: 'privacy', label: 'Privacy Questions', email: contact.privacy },
  ];

  return (
    <ul>
      {emailTypes.map(({ type, label, email }) => (
        <li key={type}>
          <strong>{label}:</strong>{' '}
          <a href={`mailto:${email}`}>{email}</a>
        </li>
      ))}
    </ul>
  );
}
```

## MDX Components Reference

### ConfigValue

Injects any configuration value using dot notation.

**Props:**
- `path` (string) - Dot-separated path to configuration value

**Examples:**

```mdx
<ConfigValue path="contact.general" />
<ConfigValue path="domain.displayName" />
<ConfigValue path="company.address.city" />
<ConfigValue path="professional.role" />
```

### EmailLink

Creates mailto links for configured email addresses.

**Props:**
- `type` (string) - Type of contact email: `general`, `legal`, `privacy`, or `support`
- `children` (optional) - Custom link text (defaults to email address)

**Examples:**

```mdx
<EmailLink type="general" />
<EmailLink type="privacy">Contact our privacy team</EmailLink>
<EmailLink type="legal">Legal inquiries</EmailLink>
<EmailLink type="support">Get support</EmailLink>
```

### DomainLink

Creates links to the site's base URL.

**Props:**
- `children` (optional) - Custom link text (defaults to domain display name)

**Examples:**

```mdx
<DomainLink />
<DomainLink>Visit our website</DomainLink>
<DomainLink>Learn more at our site</DomainLink>
```

## Error Handling

### Invalid Configuration Paths

If you reference an invalid configuration path in MDX, you'll see an error message:

```mdx
<ConfigValue path="invalid.path" />
<!-- Renders: [Config Error: invalid.path] -->
```

Check the browser console for detailed error messages.

### Invalid Email Types

If you use an invalid email type:

```mdx
<EmailLink type="invalid" />
<!-- Renders: [Email Error: invalid] -->
```

Valid types are: `general`, `legal`, `privacy`, `support`

## Type Safety

All configuration values are fully typed with TypeScript. Your IDE will provide autocomplete and type checking:

```typescript
import { siteConfig } from '@/config/site.config';

// ✅ TypeScript knows this is a string
const email: string = siteConfig.contact.general;

// ❌ TypeScript error: Property 'invalid' does not exist
const invalid = siteConfig.contact.invalid;

// ✅ TypeScript knows this is a string array
const keywords: string[] = siteConfig.meta.keywords;
```

## Backward Compatibility

The configuration system maintains backward compatibility with existing code:

```typescript
// Old way (still works)
import siteConfig from '@/config/site.config';

// New way (recommended)
import { siteConfig } from '@/config/site.config';

// Destructured exports (convenient)
import { contact, domain } from '@/config/site.config';
```

## Best Practices

1. **Use environment variables for sensitive or environment-specific values**
   - Email addresses that differ between dev/staging/production
   - Domain names that change per environment
   - API endpoints

2. **Use destructured exports for cleaner code**
   ```typescript
   // Instead of:
   import { siteConfig } from '@/config/site.config';
   const email = siteConfig.contact.general;
   
   // Prefer:
   import { contact } from '@/config/site.config';
   const email = contact.general;
   ```

3. **Use MDX components in content files**
   - Keeps content DRY (Don't Repeat Yourself)
   - Automatically updates when configuration changes
   - Prevents hardcoded values in content

4. **Never hardcode contact information or domain names**
   - Always use the configuration system
   - Makes updates easier and less error-prone
   - Ensures consistency across the site

5. **Document custom configuration additions**
   - Add JSDoc comments to new configuration properties
   - Update this README when adding new sections
   - Provide usage examples for complex configurations

## Troubleshooting

### Environment variables not working

1. Ensure the variable name starts with `NEXT_PUBLIC_`
2. Restart the development server after changing `.env.local`
3. Check that the variable is set in your deployment platform for production

### MDX components not rendering

1. Verify `mdx-components.ts` exists in your project root
2. Ensure it exports `useMDXComponents` from `@/config/mdx-components`
3. Check the browser console for error messages

### TypeScript errors

1. Ensure you're importing from the correct path: `@/config/site.config`
2. Check that the configuration property exists in `config.types.ts`
3. Run `npm run build` to check for type errors

## Contributing

When adding new configuration values:

1. Add the type definition to `config.types.ts`
2. Add the default value to `site.config.ts`
3. Add environment variable support if needed (using `getEnvVar`)
4. Update this README with usage examples
5. Add JSDoc comments with examples
