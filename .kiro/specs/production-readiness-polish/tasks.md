# Implementation Plan: Production Readiness Polish

## Overview

This implementation plan breaks down the production readiness improvements into discrete, incremental coding tasks. The focus is on implementing accessibility features, mobile responsiveness, performance optimizations, and robust error handling for the Next.js 14+ portfolio site.

Each task builds on previous work and includes testing sub-tasks to validate functionality. Tasks marked with `*` are optional and can be skipped for a faster MVP focused on core features.

## Tasks

- [x] 1. Set up accessibility infrastructure
  - [x] 1.1 Create SkipLink component for keyboard navigation
    - Implement visually hidden link that appears on focus
    - Position at top of page, links to main content
    - Style with proper focus indicators
    - _Requirements: 3.5_
  
  - [x] 1.2 Create FocusTrap component for modal dialogs
    - Implement focus trapping logic
    - Handle Tab and Shift+Tab cycling
    - Support Escape key to close
    - Return focus to trigger element on close
    - _Requirements: 3.3, 3.4_
  
  - [x] 1.3 Create LiveRegion component for screen reader announcements
    - Implement aria-live region with configurable politeness
    - Support auto-clearing after timeout
    - Provide hook for programmatic announcements
    - _Requirements: 2.4_
  
  - [ ]* 1.4 Write property tests for accessibility components
    - **Property 9: Modal focus trap** - verify Tab cycles within modal
    - **Property 10: Modal focus return** - verify focus returns to trigger
    - _Requirements: 3.3, 3.4_

- [x] 2. Implement semantic HTML and ARIA improvements
  - [x] 2.1 Audit and update page layouts with semantic HTML5 elements
    - Ensure header, nav, main, article, section, footer are used appropriately
    - Add landmark roles where semantic elements aren't sufficient
    - Verify exactly one h1 per page
    - Fix heading hierarchy issues
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 2.2 Add ARIA labels to navigation landmarks
    - Add aria-label to nav elements to distinguish them
    - Label primary navigation, footer navigation, etc.
    - _Requirements: 2.5_
  
  - [x] 2.3 Add ARIA labels to icon buttons
    - Audit all buttons without visible text
    - Add aria-label or aria-labelledby attributes
    - _Requirements: 2.2_
  
  - [x] 2.4 Ensure all form inputs have associated labels
    - Audit all form inputs
    - Associate labels via htmlFor/id or wrapping
    - _Requirements: 2.3_
  
  - [x] 2.5 Write property tests for semantic HTML and ARIA
    - **Property 1: Single H1 per page** - verify one h1 per route
    - **Property 2: Heading hierarchy** - verify no skipped levels
    - **Property 3: Interactive elements have accessible names**
    - **Property 4: Icon buttons have ARIA labels**
    - **Property 5: Form inputs have labels**
    - **Property 6: Navigation landmarks have labels**
    - _Requirements: 1.2, 1.3, 2.1, 2.2, 2.3, 2.5_

- [x] 3. Enhance keyboard navigation and focus management
  - [x] 3.1 Add skip-to-content link to root layout
    - Place SkipLink component at top of layout
    - Link to main content area
    - _Requirements: 3.5_
  
  - [x] 3.2 Improve focus indicators across all interactive elements
    - Update global CSS for focus-visible styles
    - Ensure 3:1 contrast ratio for focus indicators
    - Test with keyboard navigation
    - _Requirements: 3.2_
  
  - [x] 3.3 Add focus trap to modal dialogs
    - Integrate FocusTrap component into ContactFormModal
    - Integrate FocusTrap into any other modals
    - Test keyboard navigation within modals
    - _Requirements: 3.3, 3.4_
  
  - [ ]* 3.4 Write property tests for keyboard navigation
    - **Property 7: Keyboard accessibility** - verify Tab and Enter/Space work
    - **Property 8: Focus indicators** - verify contrast requirements
    - _Requirements: 3.1, 3.2_

- [x] 4. Implement color contrast and visual accessibility improvements
  - [x] 4.1 Audit and fix color contrast issues
    - Run axe-core on all pages
    - Fix text contrast issues (4.5:1 for normal, 3:1 for large)
    - Fix UI component contrast issues (3:1 minimum)
    - Update Tailwind color tokens if needed
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 4.2 Add alt text to all images
    - Audit all img and Image components
    - Add descriptive alt text for content images
    - Add empty alt="" for decorative images
    - _Requirements: 4.5_
  
  - [ ]* 4.3 Write property tests for color contrast and images
    - **Property 11: Color contrast compliance** - verify WCAG AA ratios
    - **Property 12: Images have alt text** - verify all images have alt
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 5. Implement mobile-first responsive design improvements
  - [x] 5.1 Add viewport meta tag to root layout
    - Ensure viewport meta tag is present
    - Set width=device-width, initial-scale=1
    - _Requirements: 5.2_
  
  - [x] 5.2 Create TouchTarget wrapper component
    - Implement component that ensures 44x44px minimum size
    - Add invisible padding if visual size is smaller
    - _Requirements: 5.4, 6.1_
  
  - [x] 5.3 Audit and fix touch target sizes
    - Identify all interactive elements smaller than 44x44px
    - Wrap with TouchTarget component or add padding
    - Test on mobile devices
    - _Requirements: 5.4, 6.1_
  
  - [x] 5.4 Ensure adequate spacing between touch targets
    - Audit adjacent interactive elements
    - Add minimum 8px spacing between touch targets
    - _Requirements: 6.2_
  
  - [x] 5.5 Write property tests for mobile responsiveness
    - **Property 13: Touch target minimum size** - verify 44x44px
    - **Property 14: Touch target spacing** - verify 8px spacing
    - _Requirements: 5.4, 6.1, 6.2_

- [x] 6. Checkpoint - Ensure accessibility tests pass
  - Run axe-core on all pages
  - Test keyboard navigation on all interactive elements
  - Test with screen reader (VoiceOver or NVDA)
  - Fix any issues found
  - Ask the user if questions arise

- [x] 7. Optimize images with Next.js Image component
  - [x] 7.1 Create OptimizedImage wrapper component
    - Wrap Next.js Image with sensible defaults
    - Provide WebP/AVIF with fallbacks
    - Add blur placeholder support
    - _Requirements: 8.1, 8.3, 8.5_
  
  - [x] 7.2 Audit and update all image usage
    - Replace img tags with OptimizedImage component
    - Add width, height, and sizes attributes
    - Set priority for above-the-fold images
    - Set loading="lazy" for below-the-fold images
    - Add blur placeholders
    - _Requirements: 8.1, 8.2, 8.4, 8.5_
  
  - [ ]* 7.3 Write property tests for image optimization
    - **Property 20: Image component attributes** - verify width/height/sizes
    - **Property 21: Image lazy loading** - verify loading prop
    - **Property 22: Image placeholders** - verify placeholder prop
    - _Requirements: 8.2, 8.4, 8.5_

- [x] 8. Implement code splitting and bundle optimization
  - [x] 8.1 Identify and dynamically import large components
    - Audit bundle size with next build
    - Identify components > 50KB
    - Wrap with dynamic import and loading states
    - _Requirements: 9.3_
  
  - [x] 8.2 Configure bundle analysis
    - Add @next/bundle-analyzer
    - Run analysis and identify optimization opportunities
    - Document findings
    - _Requirements: 9.5_
  
  - [ ]* 8.3 Write property test for bundle size
    - **Property 23: Initial bundle size limit** - verify < 200KB gzipped
    - _Requirements: 9.2_

- [x] 9. Implement API route error handling
  - [x] 9.1 Create API error handling utilities
    - Implement handleApiError function
    - Implement createApiResponse function
    - Implement createApiError function
    - Define ApiError interface
    - _Requirements: 10.1, 10.2_
  
  - [x] 9.2 Update all API routes with error handling
    - Wrap route handlers in try-catch
    - Return appropriate status codes (400, 404, 500)
    - Return structured error responses
    - Add error logging
    - _Requirements: 10.1, 10.2, 10.5_
  
  - [x] 9.3 Implement retry logic for external API calls
    - Create fetchWithRetry utility
    - Implement exponential backoff
    - Handle retryable vs non-retryable errors
    - _Requirements: 10.3_
  
  - [x] 9.4 Add timeout handling for external API calls
    - Implement timeout wrapper with AbortController
    - Set 10 second timeout for external calls
    - Return timeout error on expiration
    - _Requirements: 10.4_
  
  - [ ]* 9.5 Write property tests for API error handling
    - **Property 24: API error status codes** - verify appropriate codes
    - **Property 25: API error response structure** - verify JSON structure
    - **Property 26: External API retry** - verify exponential backoff
    - **Property 27: External API timeout** - verify 10s timeout
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 9.6 Write unit tests for API routes
    - Test valid request handling
    - Test validation errors (400)
    - Test not found errors (404)
    - Test server errors (500)
    - _Requirements: 10.1, 10.2_

- [x] 10. Enhance GitHub widget with error handling and caching
  - [x] 10.1 Add timeout handling to GitHub widget
    - Set 5 second timeout for GitHub API calls
    - Display fallback message on timeout
    - _Requirements: 11.3_
  
  - [x] 10.2 Implement caching for GitHub API responses
    - Add in-memory cache with TTL
    - Check cache before making API calls
    - Store successful responses in cache
    - _Requirements: 11.4_
  
  - [x] 10.3 Add stale data indicator to GitHub widget
    - Check if cached data is older than TTL
    - Display visual indicator for stale data
    - _Requirements: 11.5_
  
  - [x] 10.4 Add error handling for GitHub API failures
    - Handle unavailable API (network errors)
    - Handle rate limit exceeded (429 status)
    - Display appropriate fallback messages
    - _Requirements: 11.1, 11.2_
  
  - [ ]* 10.5 Write property tests for GitHub widget
    - **Property 28: GitHub widget timeout** - verify 5s timeout
    - **Property 29: GitHub widget caching** - verify cache usage
    - **Property 30: GitHub widget stale data** - verify stale indicator
    - _Requirements: 11.3, 11.4, 11.5_
  
  - [ ]* 10.6 Write unit tests for GitHub widget error cases
    - Test API unavailable scenario
    - Test rate limit exceeded scenario
    - Test timeout scenario
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 11. Implement MDX content error handling
  - [x] 11.1 Create MDX frontmatter validation schema
    - Define Zod schema for post frontmatter
    - Include required fields (title, date)
    - Include optional fields (description, tags)
    - _Requirements: 12.4_
  
  - [x] 11.2 Add frontmatter validation to Velite config
    - Integrate schema validation in velite.config.ts
    - Provide clear error messages for missing fields
    - _Requirements: 12.4, 12.5_
  
  - [x] 11.3 Create MDX error page for production
    - Create user-friendly error page
    - Hide internal error details
    - Provide navigation back to home
    - _Requirements: 12.1, 12.3_
  
  - [x] 11.4 Enhance MDX error display for development
    - Show detailed error information in dev mode
    - Display file, line, and column information
    - Provide suggestions for common issues
    - _Requirements: 12.2_
  
  - [ ]* 11.5 Write property tests for MDX validation
    - **Property 31: MDX frontmatter validation** - verify schema validation
    - **Property 32: MDX frontmatter errors** - verify error messages
    - _Requirements: 12.4, 12.5_
  
  - [ ]* 11.6 Write unit tests for MDX error handling
    - Test invalid MDX parsing
    - Test missing frontmatter fields
    - Test invalid frontmatter values
    - _Requirements: 12.1, 12.4, 12.5_

- [x] 12. Implement form validation and error handling
  - [x] 12.1 Create AccessibleFormField component
    - Implement form field with associated label
    - Add error message display with aria-describedby
    - Add required indicator
    - Style with proper ARIA attributes
    - _Requirements: 13.1, 13.4_
  
  - [x] 12.2 Create FormErrorAnnouncer component
    - Implement aria-live region for error announcements
    - Announce errors with assertive politeness
    - Clear announcements after timeout
    - _Requirements: 13.4_
  
  - [x] 12.3 Update ContactForm with enhanced error handling
    - Add inline error messages for each field
    - Preserve user input on submission failure
    - Add validation on blur and submit
    - Display success message and clear form on success
    - Integrate FormErrorAnnouncer
    - _Requirements: 13.1, 13.2, 13.3, 13.5_
  
  - [ ]* 12.4 Write property tests for form validation
    - **Property 33: Form inline errors** - verify error messages display
    - **Property 34: Form error preservation** - verify input preserved
    - **Property 35: Form validation timing** - verify blur and submit
    - **Property 36: Form error announcements** - verify aria-live
    - **Property 37: Form success handling** - verify clear on success
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 12.5 Write unit tests for form validation logic
    - Test email validation
    - Test required field validation
    - Test message length validation
    - _Requirements: 13.1_

- [x] 13. Implement configuration validation
  - [x] 13.1 Create configuration validation schemas
    - Define Zod schema for site config
    - Define Zod schema for environment variables
    - _Requirements: 14.1, 14.4_
  
  - [x] 13.2 Add build-time validation for site config
    - Validate site config in config file
    - Provide clear error messages for invalid values
    - Prevent build if validation fails
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [x] 13.3 Add runtime validation for environment variables
    - Validate env vars at application startup
    - Fail fast with descriptive errors if missing
    - Provide guidance on setting missing vars
    - _Requirements: 14.4, 14.5_
  
  - [ ]* 13.4 Write property tests for configuration validation
    - **Property 38: Config schema validation** - verify all fields validated
    - **Property 39: Config error messages** - verify clear messages
    - **Property 40: Env var validation** - verify required vars checked
    - **Property 41: Env var error messages** - verify clear messages
    - _Requirements: 14.1, 14.3, 14.4, 14.5_
  
  - [ ]* 13.5 Write unit tests for configuration validation
    - Test invalid config values
    - Test missing required fields
    - Test missing environment variables
    - _Requirements: 14.1, 14.4_

- [~] 14. Implement React Error Boundaries
  - [ ] 14.1 Create ErrorBoundary component
    - Implement React error boundary with fallback UI
    - Add error logging with component stack
    - Add retry functionality
    - Support custom fallback components
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  
  - [ ] 14.2 Add error boundaries to root layout
    - Wrap global components (header, footer)
    - Ensure errors don't crash entire app
    - _Requirements: 15.1_
  
  - [ ] 14.3 Add error boundaries to page sections
    - Wrap major page sections (blog list, projects, etc.)
    - Isolate errors to specific sections
    - _Requirements: 15.1, 15.5_
  
  - [ ] 14.4 Add error boundary to GitHub widget
    - Wrap GitHub widget component
    - Provide widget-specific fallback UI
    - _Requirements: 15.1_
  
  - [ ]* 14.5 Write property tests for error boundaries
    - **Property 42: Error boundary fallback** - verify fallback UI displays
    - **Property 43: Error boundary logging** - verify errors logged
    - **Property 44: Error boundary retry** - verify retry button works
    - **Property 45: Error boundary isolation** - verify other sections work
    - _Requirements: 15.2, 15.3, 15.4, 15.5_
  
  - [ ]* 14.6 Write unit tests for error boundaries
    - Test error caught and fallback displayed
    - Test retry functionality
    - Test error logging
    - _Requirements: 15.2, 15.3, 15.4_

- [ ] 15. Checkpoint - Ensure all error handling works
  - Test API error responses
  - Test GitHub widget error scenarios
  - Test MDX parsing errors
  - Test form validation errors
  - Test configuration validation
  - Test error boundaries
  - Ask the user if questions arise

- [~] 16. Set up performance monitoring and optimization
  - [ ] 16.1 Add Web Vitals tracking
    - Install web-vitals library
    - Add tracking to root layout
    - Log metrics to console in development
    - Send metrics to analytics in production
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ] 16.2 Configure Lighthouse CI
    - Add lighthouse CI configuration
    - Set performance thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1)
    - Set minimum scores (performance: 90, accessibility: 90)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 16.3 Write property tests for performance metrics
    - **Property 15: LCP threshold** - verify < 2.5s
    - **Property 16: FID threshold** - verify < 100ms
    - **Property 17: CLS threshold** - verify < 0.1
    - **Property 18: Lighthouse score** - verify >= 90
    - **Property 19: TTI threshold** - verify < 3.5s
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 17. Set up accessibility testing infrastructure
  - [ ] 17.1 Install accessibility testing tools
    - Install axe-core
    - Install jest-axe or @axe-core/react
    - Configure in test setup
    - _Requirements: 17.1_
  
  - [ ] 17.2 Add accessibility tests to component tests
    - Add axe checks to all interactive components
    - Test keyboard navigation for critical flows
    - _Requirements: 17.2, 17.5_
  
  - [ ] 17.3 Configure accessibility checks in CI/CD
    - Add accessibility audit to CI pipeline
    - Fail build on critical violations
    - Generate accessibility reports
    - _Requirements: 17.3, 17.4_

- [ ] 18. Final integration and testing
  - [ ] 18.1 Run full test suite
    - Run all unit tests
    - Run all property tests
    - Run all integration tests
    - Run accessibility tests
    - Fix any failures
    - _Requirements: 16.5_
  
  - [ ] 18.2 Run Lighthouse audit on all pages
    - Audit home page
    - Audit blog pages
    - Audit project pages
    - Verify all scores >= 90
    - Fix any issues
    - _Requirements: 7.4, 17.3_
  
  - [ ] 18.3 Test on real devices
    - Test on mobile devices (iOS and Android)
    - Test touch interactions
    - Test responsive layouts at various breakpoints
    - Test with screen reader (VoiceOver or TalkBack)
    - _Requirements: 5.1, 5.4, 6.1_
  
  - [ ] 18.4 Verify bundle size
    - Run production build
    - Check initial bundle size < 200KB gzipped
    - Review bundle analysis report
    - _Requirements: 9.2_

- [ ] 19. Final checkpoint - Production readiness verification
  - All tests passing
  - Lighthouse scores >= 90 for performance and accessibility
  - Bundle size < 200KB
  - No critical accessibility violations
  - Error handling working for all scenarios
  - Ask the user if ready for deployment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- Both property tests and unit tests are necessary for comprehensive coverage
