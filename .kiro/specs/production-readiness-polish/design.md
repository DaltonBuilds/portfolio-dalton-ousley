# Design Document: Production Readiness Polish

## Overview

This design addresses production readiness improvements for a Next.js 14+ portfolio site with App Router, focusing on four critical areas: accessibility (WCAG 2.1 AA compliance), mobile responsiveness, performance optimization, and robust error handling.

The site is built with:
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Content**: MDX blog posts processed via Velite
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Cloudflare Pages (via @cloudflare/next-on-pages)

The design follows a pragmatic approach: implement essential accessibility features, optimize for Core Web Vitals, ensure mobile-first responsive design, and add comprehensive error handling without over-engineering. Testing focuses on critical paths and property-based validation of key behaviors.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App Router                    │
├─────────────────────────────────────────────────────────────┤
│  Pages & Layouts                                             │
│  ├─ Root Layout (accessibility setup, error boundaries)     │
│  ├─ Page Routes (semantic HTML, ARIA, keyboard nav)         │
│  └─ API Routes (error handling, validation)                 │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                            │
│  ├─ UI Components (accessible, responsive, touch-friendly)  │
│  ├─ MDX Components (error boundaries, fallbacks)            │
│  ├─ Forms (validation, error handling, accessibility)       │
│  └─ Widgets (GitHub, Cookie Consent - graceful degradation) │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure Layer                                        │
│  ├─ Configuration System (build-time validation)            │
│  ├─ Image Optimization (Next.js Image, WebP/AVIF)          │
│  ├─ Performance Monitoring (Web Vitals tracking)            │
│  └─ Error Logging (structured logging, error boundaries)    │
└─────────────────────────────────────────────────────────────┘
```

### Accessibility Architecture

The accessibility implementation follows a layered approach:

1. **Foundation Layer**: Semantic HTML5 elements provide implicit ARIA roles
2. **Enhancement Layer**: Explicit ARIA attributes where semantic HTML is insufficient
3. **Interaction Layer**: Keyboard navigation, focus management, and screen reader announcements
4. **Validation Layer**: Automated testing with axe-core during development and CI/CD

### Performance Architecture

Performance optimization targets three areas:

1. **Loading Performance**: Code splitting, image optimization, bundle size reduction
2. **Runtime Performance**: Efficient React rendering, minimal JavaScript execution
3. **Perceived Performance**: Loading states, skeleton screens, optimistic UI updates

### Error Handling Architecture

Error handling uses a defense-in-depth strategy:

1. **Prevention**: Build-time validation (config, types, MDX)
2. **Detection**: Runtime validation (forms, API inputs, external data)
3. **Containment**: Error boundaries prevent cascading failures
4. **Recovery**: Graceful degradation, retry logic, fallback UI
5. **Observability**: Structured logging for debugging

## Components and Interfaces

### 1. Accessibility Components

#### SkipLink Component
```typescript
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

// Renders visually hidden link that appears on focus
// Allows keyboard users to skip repetitive navigation
```

#### FocusTrap Component
```typescript
interface FocusTrapProps {
  active: boolean;
  children: React.ReactNode;
  onEscape?: () => void;
  returnFocusOnDeactivate?: boolean;
}

// Traps focus within modal dialogs
// Returns focus to trigger element on close
```

#### LiveRegion Component
```typescript
interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number; // milliseconds
}

// Announces dynamic content changes to screen readers
// Used for form validation, loading states, success messages
```

### 2. Responsive Layout Components

#### ResponsiveContainer Component
```typescript
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  padding?: boolean;
}

// Provides consistent responsive padding and max-width
// Ensures content doesn't stretch too wide on large screens
```

#### TouchTarget Component
```typescript
interface TouchTargetProps {
  children: React.ReactNode;
  minSize?: number; // default 44px
  as?: React.ElementType;
}

// Ensures interactive elements meet minimum touch target size
// Adds invisible padding if visual size is smaller than 44x44px
```

### 3. Performance Components

#### OptimizedImage Component
```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

// Wraps Next.js Image with sensible defaults
// Provides WebP/AVIF with fallbacks, lazy loading, LQIP
```

#### LazyComponent Wrapper
```typescript
interface LazyComponentProps {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

// Dynamic import wrapper with loading and error states
// Used for heavy components not needed immediately
```

### 4. Error Handling Components

#### ErrorBoundary Component
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean; // if true, only affects this section
}

// Catches React errors and displays fallback UI
// Logs errors with component stack trace
// Provides retry mechanism
```

#### ApiErrorHandler Utility
```typescript
interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

function handleApiError(error: unknown): ApiErrorResponse;
function createApiResponse<T>(data: T, status?: number): Response;
function createApiError(message: string, status: number, details?: unknown): Response;

// Standardizes API error responses
// Provides consistent error structure for clients
```

#### RetryWrapper Component
```typescript
interface RetryWrapperProps<T> {
  fetchFn: () => Promise<T>;
  maxRetries?: number;
  backoffMs?: number;
  fallback?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}

// Implements exponential backoff retry logic
// Used for external API calls (GitHub widget)
```

### 5. Form Components

#### AccessibleFormField Component
```typescript
interface AccessibleFormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'textarea';
  required?: boolean;
  error?: string;
  description?: string;
  register: UseFormRegister<any>;
}

// Provides accessible form field with:
// - Associated label
// - Error message with aria-describedby
// - Required indicator
// - Proper ARIA attributes
```

#### FormErrorAnnouncer Component
```typescript
interface FormErrorAnnouncerProps {
  errors: Record<string, { message?: string }>;
}

// Announces form validation errors to screen readers
// Uses aria-live region with assertive politeness
```

### 6. Widget Components

#### GitHubActivityWidget (Enhanced)
```typescript
interface GitHubActivityWidgetProps {
  username: string;
  maxRetries?: number;
  cacheTimeMs?: number;
  fallbackMessage?: string;
}

interface GitHubActivityState {
  data: GitHubActivity | null;
  loading: boolean;
  error: GitHubError | null;
  stale: boolean;
}

// Enhanced with:
// - Retry logic with exponential backoff
// - Response caching
// - Graceful error handling
// - Stale data indicator
// - Timeout handling (5s)
```

#### CookieConsentManager (Enhanced)
```typescript
interface CookieConsentManagerProps {
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}

// Enhanced with:
// - Keyboard navigation
// - Focus trap when open
// - ARIA labels and roles
// - Touch-friendly buttons (44x44px)
```

## Data Models

### Accessibility Models

```typescript
// Focus management state
interface FocusState {
  previousElement: HTMLElement | null;
  trapActive: boolean;
  returnOnDeactivate: boolean;
}

// Live region announcement
interface Announcement {
  id: string;
  message: string;
  politeness: 'polite' | 'assertive';
  timestamp: number;
}

// Keyboard navigation state
interface KeyboardNavState {
  focusableElements: HTMLElement[];
  currentIndex: number;
  trapEnabled: boolean;
}
```

### Performance Models

```typescript
// Web Vitals metrics
interface WebVitalsMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
}

// Image optimization config
interface ImageConfig {
  src: string;
  width: number;
  height: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  quality: number;
  sizes: string;
  priority: boolean;
}

// Bundle analysis result
interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  routes: Record<string, number>;
  largestChunks: Array<{ name: string; size: number }>;
}
```

### Error Handling Models

```typescript
// API error structure
interface ApiError {
  error: string; // Error type/code
  message: string; // Human-readable message
  statusCode: number; // HTTP status code
  details?: unknown; // Additional context
  timestamp: number;
}

// Component error state
interface ComponentErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

// External API error (GitHub)
interface ExternalApiError {
  type: 'timeout' | 'rate_limit' | 'network' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
  retryAfter?: number; // seconds
}

// MDX parsing error
interface MdxError {
  type: 'parse' | 'frontmatter' | 'validation';
  message: string;
  file: string;
  line?: number;
  column?: number;
}

// Configuration validation error
interface ConfigError {
  field: string;
  value: unknown;
  expected: string;
  message: string;
}
```

### Form Models

```typescript
// Form validation state
interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

// Contact form data
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  turnstileToken?: string;
}

// Form submission result
interface FormSubmissionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}
```

### Configuration Models

```typescript
// Site configuration (validated at build time)
interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    github?: string;
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Environment configuration (validated at startup)
interface EnvConfig {
  nodeEnv: 'development' | 'production' | 'test';
  githubToken?: string;
  turnstileSiteKey?: string;
  apiBaseUrl: string;
}

// Cookie preferences
interface CookiePreferences {
  necessary: boolean; // always true
  analytics: boolean;
  marketing: boolean;
  version: number;
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Accessibility Properties

Property 1: Single H1 per page
*For any* page route in the application, the rendered HTML should contain exactly one h1 element.
**Validates: Requirements 1.2**

Property 2: Heading hierarchy integrity
*For any* page route in the application, all heading elements (h1-h6) should follow proper hierarchy without skipping levels (e.g., h1 → h2 → h3, never h1 → h3).
**Validates: Requirements 1.3**

Property 3: Interactive elements have accessible names
*For any* interactive element (button, link, input) in the application, the element should have an accessible name (via text content, aria-label, aria-labelledby, or alt text).
**Validates: Requirements 2.1**

Property 4: Icon buttons have ARIA labels
*For any* button element without visible text content, the button should have an aria-label or aria-labelledby attribute.
**Validates: Requirements 2.2**

Property 5: Form inputs have associated labels
*For any* form input element, the input should be associated with a visible label element (via htmlFor/id or wrapping label).
**Validates: Requirements 2.3**

Property 6: Navigation landmarks have labels
*For any* nav element in the application, the element should have an aria-label attribute to distinguish it from other navigation regions.
**Validates: Requirements 2.5**

Property 7: Keyboard accessibility
*For any* interactive element in the application, the element should be keyboard accessible (focusable via Tab and activatable via Enter or Space).
**Validates: Requirements 3.1**

Property 8: Focus indicators meet contrast requirements
*For any* focusable element in the application, the focus indicator should meet WCAG 2.1 AA contrast requirements (minimum 3:1 against adjacent colors).
**Validates: Requirements 3.2**

Property 9: Modal focus trap
*For any* modal dialog when open, pressing Tab should cycle focus only through elements within the modal, not escape to the page behind.
**Validates: Requirements 3.3**

Property 10: Modal focus return
*For any* modal dialog, when the modal closes, focus should return to the element that triggered the modal.
**Validates: Requirements 3.4**

Property 11: Color contrast compliance
*For any* text element or UI component in the application, the color contrast ratio should meet WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).
**Validates: Requirements 4.1, 4.2, 4.3**

Property 12: Images have alt text
*For any* img element or Next.js Image component in the application, the element should have an alt attribute (empty string for decorative images, descriptive text for content images).
**Validates: Requirements 4.5**

### Mobile Responsiveness Properties

Property 13: Touch target minimum size
*For any* interactive element in the application on mobile viewports, the element should have a minimum touch target size of 44x44 pixels (including padding).
**Validates: Requirements 5.4, 6.1**

Property 14: Touch target spacing
*For any* pair of adjacent interactive elements in the application, the elements should have a minimum spacing of 8 pixels between their touch target areas.
**Validates: Requirements 6.2**

### Performance Properties

Property 15: Largest Contentful Paint threshold
*For any* page route in the application, the Largest Contentful Paint (LCP) metric should be under 2.5 seconds when measured on a simulated mobile connection.
**Validates: Requirements 7.1**

Property 16: First Input Delay threshold
*For any* page route in the application, the First Input Delay (FID) metric should be under 100 milliseconds when measured on a simulated mobile device.
**Validates: Requirements 7.2**

Property 17: Cumulative Layout Shift threshold
*For any* page route in the application, the Cumulative Layout Shift (CLS) metric should be under 0.1 during page load and interaction.
**Validates: Requirements 7.3**

Property 18: Lighthouse performance score
*For any* page route in the application, the Lighthouse performance score should be 90 or higher when audited in production mode.
**Validates: Requirements 7.4**

Property 19: Time to Interactive threshold
*For any* page route in the application, the Time to Interactive (TTI) metric should be under 3.5 seconds when measured on a simulated mobile connection.
**Validates: Requirements 7.5**

Property 20: Image component attributes
*For any* Next.js Image component in the application, the component should have width, height, and sizes attributes specified.
**Validates: Requirements 8.2**

Property 21: Image lazy loading
*For any* Next.js Image component that is not above the fold, the component should have loading="lazy" or should not have priority={true}.
**Validates: Requirements 8.4**

Property 22: Image placeholders
*For any* Next.js Image component in the application, the component should have a placeholder prop set (either "blur" with blurDataURL or "empty").
**Validates: Requirements 8.5**

Property 23: Initial bundle size limit
*For any* production build of the application, the initial JavaScript bundle (first load JS) should be under 200KB when gzipped.
**Validates: Requirements 9.2**

### Error Handling Properties

Property 24: API error status codes
*For any* API route error response, the response should have an appropriate HTTP status code (400 for client errors, 404 for not found, 500 for server errors).
**Validates: Requirements 10.1**

Property 25: API error response structure
*For any* API route error response, the response body should be a JSON object with fields: error (string), message (string), and statusCode (number).
**Validates: Requirements 10.2**

Property 26: External API retry with exponential backoff
*For any* external API call that fails with a retryable error, the system should retry the request with exponentially increasing delays (e.g., 1s, 2s, 4s) up to a maximum number of attempts.
**Validates: Requirements 10.3**

Property 27: External API timeout
*For any* external API call, if the call does not complete within 10 seconds, the system should abort the request and return a timeout error.
**Validates: Requirements 10.4**

Property 28: GitHub widget timeout
*For any* GitHub API request in the GitHub widget, if the request does not complete within 5 seconds, the widget should display a fallback message.
**Validates: Requirements 11.3**

Property 29: GitHub widget caching
*For any* GitHub API request in the GitHub widget, if a cached response exists and is not expired, the widget should use the cached data instead of making a new API call.
**Validates: Requirements 11.4**

Property 30: GitHub widget stale data indicator
*For any* GitHub widget displaying cached data that is older than the cache TTL, the widget should display a visual indicator that the data is stale.
**Validates: Requirements 11.5**

Property 31: MDX frontmatter validation
*For any* MDX file processed by the system, the frontmatter should be validated against the expected schema, and invalid frontmatter should produce a validation error.
**Validates: Requirements 12.4**

Property 32: MDX frontmatter error messages
*For any* MDX file with missing required frontmatter fields, the validation error should clearly indicate which fields are missing.
**Validates: Requirements 12.5**

Property 33: Form inline error messages
*For any* form input with validation errors, the form should display an inline error message adjacent to the invalid input.
**Validates: Requirements 13.1**

Property 34: Form submission error preservation
*For any* form submission that fails, the form should preserve all user input values and display error details without clearing the form.
**Validates: Requirements 13.2**

Property 35: Form validation timing
*For any* form input, validation should occur both on blur (when the input loses focus) and on form submission.
**Validates: Requirements 13.3**

Property 36: Form error announcements
*For any* form validation error, the error should be announced to screen readers via an aria-live region.
**Validates: Requirements 13.4**

Property 37: Form success handling
*For any* successful form submission, the form should display a success message and clear all input fields.
**Validates: Requirements 13.5**

Property 38: Configuration schema validation
*For any* configuration value in the site config, the value should be validated against its defined schema (type, format, required fields) at build time.
**Validates: Requirements 14.1**

Property 39: Configuration error messages
*For any* configuration validation error, the error message should clearly indicate which configuration field is invalid and what value was expected.
**Validates: Requirements 14.3**

Property 40: Environment variable validation
*For any* required environment variable, the system should validate its presence at application startup and fail fast if missing.
**Validates: Requirements 14.4**

Property 41: Environment variable error messages
*For any* missing required environment variable, the error message should clearly indicate which variable is missing and provide guidance on how to set it.
**Validates: Requirements 14.5**

Property 42: Error boundary fallback UI
*For any* component error caught by an error boundary, the error boundary should render a fallback UI for that section instead of crashing the entire page.
**Validates: Requirements 15.2**

Property 43: Error boundary logging
*For any* component error caught by an error boundary, the error should be logged with the component stack trace for debugging.
**Validates: Requirements 15.3**

Property 44: Error boundary retry
*For any* component error caught by an error boundary, the fallback UI should provide a retry button that attempts to re-render the failed component.
**Validates: Requirements 15.4**

Property 45: Error boundary isolation
*For any* component error caught by an error boundary, other page sections outside the error boundary should continue to function normally.
**Validates: Requirements 15.5**

## Error Handling

### Error Handling Strategy

The application implements a layered error handling approach:

1. **Prevention Layer**: Build-time validation catches configuration and type errors before deployment
2. **Detection Layer**: Runtime validation catches invalid inputs and external API failures
3. **Containment Layer**: Error boundaries prevent component errors from cascading
4. **Recovery Layer**: Retry logic and fallback UI provide graceful degradation
5. **Observability Layer**: Structured logging enables debugging and monitoring

### API Route Error Handling

All API routes follow a consistent error handling pattern:

```typescript
// API route structure
export async function POST(request: Request) {
  try {
    // 1. Validate input
    const body = await request.json();
    const validated = schema.parse(body);
    
    // 2. Process request
    const result = await processRequest(validated);
    
    // 3. Return success response
    return createApiResponse(result, 200);
  } catch (error) {
    // 4. Handle errors with appropriate status codes
    if (error instanceof ZodError) {
      return createApiError('Validation failed', 400, error.errors);
    }
    if (error instanceof NotFoundError) {
      return createApiError('Resource not found', 404);
    }
    // Log unexpected errors
    console.error('API error:', error);
    return createApiError('Internal server error', 500);
  }
}
```

Error responses follow this structure:
```json
{
  "error": "validation_error",
  "message": "Invalid input data",
  "statusCode": 400,
  "details": { /* optional additional context */ }
}
```

### External API Error Handling

External API calls (GitHub widget) implement:

1. **Timeout handling**: Abort requests after 5-10 seconds
2. **Retry logic**: Exponential backoff for transient failures
3. **Rate limit handling**: Detect and display rate limit messages
4. **Caching**: Reduce API calls and provide stale data fallback
5. **Graceful degradation**: Display fallback UI when API is unavailable

```typescript
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < options.maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry non-retryable errors
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Wait with exponential backoff
      const delay = options.baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }
  
  throw lastError;
}
```

### MDX Content Error Handling

MDX parsing and validation errors are handled differently in development vs production:

**Development mode**:
- Display detailed error messages with file, line, and column information
- Show error overlay with stack trace
- Provide suggestions for fixing common issues

**Production mode**:
- Display user-friendly error page
- Log errors to server logs without exposing internals
- Provide fallback content or 404 page

Frontmatter validation uses Zod schemas:
```typescript
const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().datetime(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Validate during build
const frontmatter = postFrontmatterSchema.parse(rawFrontmatter);
```

### Form Error Handling

Forms implement comprehensive error handling:

1. **Client-side validation**: Immediate feedback on blur and submit
2. **Server-side validation**: Validate again on API route
3. **Error preservation**: Keep user input on submission failure
4. **Accessible errors**: Announce errors to screen readers
5. **Success feedback**: Clear confirmation messages

```typescript
const onSubmit = async (data: FormData) => {
  try {
    setIsSubmitting(true);
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      setFormError(error.message);
      // Preserve form data - don't reset
      return;
    }
    
    // Success: show message and clear form
    setSuccessMessage('Message sent successfully!');
    reset();
  } catch (error) {
    setFormError('Network error. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

### Configuration Validation

Configuration is validated at two stages:

**Build time** (site config):
```typescript
const siteConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  author: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});

// Validate during build
export const siteConfig = siteConfigSchema.parse(rawConfig);
```

**Runtime** (environment variables):
```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  GITHUB_TOKEN: z.string().optional(),
  TURNSTILE_SITE_KEY: z.string().optional(),
});

// Validate at startup
const env = envSchema.parse(process.env);
```

Validation failures provide clear error messages:
```
Configuration validation failed:
  - site.url: Expected string, received undefined
  - site.author.email: Invalid email format
```

### Error Boundaries

Error boundaries are placed at strategic locations:

1. **Root layout**: Catches errors in global components (header, footer)
2. **Page level**: Catches errors in page-specific content
3. **Section level**: Isolates errors in major page sections (blog list, projects, etc.)
4. **Widget level**: Isolates errors in third-party widgets (GitHub activity)

```typescript
<ErrorBoundary
  fallback={({ error, reset }) => (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>This section encountered an error.</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    console.error('Component error:', error, errorInfo);
  }}
>
  <ComponentThatMightFail />
</ErrorBoundary>
```

## Testing Strategy

### Testing Philosophy

The testing strategy balances comprehensive coverage with pragmatism:

1. **Property-based tests**: Verify universal properties across all inputs
2. **Unit tests**: Test specific examples, edge cases, and error conditions
3. **Integration tests**: Test API routes and component interactions
4. **Accessibility tests**: Automated checks with axe-core
5. **Performance tests**: Lighthouse CI for Core Web Vitals

Both unit tests and property-based tests are necessary and complementary:
- Unit tests catch concrete bugs in specific scenarios
- Property tests verify general correctness across many inputs

### Testing Tools

- **Test runner**: Vitest (fast, ESM-native, compatible with Next.js)
- **React testing**: React Testing Library
- **Accessibility**: axe-core via jest-axe or @axe-core/react
- **Property testing**: fast-check (JavaScript property-based testing library)
- **Performance**: Lighthouse CI
- **E2E**: Playwright (for critical user flows)

### Unit Testing Approach

Unit tests focus on:
- Form validation logic (specific invalid inputs)
- API route error handling (specific error scenarios)
- Configuration validation (specific invalid configs)
- Utility functions (edge cases, boundary conditions)
- Component rendering (specific props combinations)

Example unit test:
```typescript
describe('ContactForm validation', () => {
  it('should reject empty email', () => {
    const result = contactFormSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });
  
  it('should reject invalid email format', () => {
    const result = contactFormSchema.safeParse({ email: 'notanemail' });
    expect(result.success).toBe(false);
  });
  
  it('should accept valid email', () => {
    const result = contactFormSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(true);
  });
});
```

### Property-Based Testing Approach

Property tests verify universal properties with randomized inputs. Each test runs a minimum of 100 iterations to ensure comprehensive coverage.

Example property test:
```typescript
import fc from 'fast-check';

describe('API error responses', () => {
  it('should always return valid error structure', () => {
    // Feature: production-readiness-polish, Property 25: API error response structure
    fc.assert(
      fc.property(
        fc.string(), // error message
        fc.integer({ min: 400, max: 599 }), // status code
        (message, statusCode) => {
          const response = createApiError(message, statusCode);
          const body = JSON.parse(response.body);
          
          expect(body).toHaveProperty('error');
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('statusCode');
          expect(typeof body.error).toBe('string');
          expect(typeof body.message).toBe('string');
          expect(typeof body.statusCode).toBe('number');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Accessibility Testing

Accessibility tests run at multiple levels:

1. **Development**: axe-core browser extension for manual checks
2. **Component tests**: Automated axe checks in component tests
3. **CI/CD**: Automated accessibility audits on every commit
4. **Pre-deployment**: Full Lighthouse accessibility audit

Example accessibility test:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('ContactForm accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should announce form errors to screen readers', async () => {
    const { getByRole } = render(<ContactForm />);
    const submitButton = getByRole('button', { name: /submit/i });
    
    fireEvent.click(submitButton);
    
    // Check for aria-live region with error
    const liveRegion = getByRole('status');
    expect(liveRegion).toHaveTextContent(/error/i);
  });
});
```

### Performance Testing

Performance tests verify Core Web Vitals thresholds:

1. **Local testing**: Lighthouse CLI during development
2. **CI/CD**: Lighthouse CI on every pull request
3. **Production monitoring**: Real User Monitoring (RUM) with web-vitals library

Example Lighthouse CI configuration:
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### Integration Testing

Integration tests verify API routes and component interactions:

```typescript
describe('Contact API route', () => {
  it('should handle valid submission', async () => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
  });
  
  it('should reject invalid email', async () => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid',
        message: 'Test message',
      }),
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});
```

### Test Coverage Goals

- **Unit tests**: 80%+ coverage for utility functions and validation logic
- **Integration tests**: All API routes and critical user flows
- **Property tests**: All correctness properties from design document
- **Accessibility tests**: All interactive components and pages
- **Performance tests**: All page routes

### CI/CD Integration

All tests run automatically in the CI/CD pipeline:

1. **Pre-commit**: Linting and type checking
2. **Pull request**: Unit tests, integration tests, accessibility tests
3. **Pre-deployment**: Full test suite + Lighthouse CI
4. **Post-deployment**: Smoke tests and performance monitoring

Build fails if:
- Any test fails
- Code coverage drops below threshold
- Accessibility violations are detected
- Performance scores fall below 90
- Bundle size exceeds 200KB

