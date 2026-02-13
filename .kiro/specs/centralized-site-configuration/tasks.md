# Implementation Plan: Centralized Site Configuration

## Overview

This implementation plan breaks down the centralized site configuration feature into discrete, incremental coding tasks. Each task builds on previous work, with early validation through tests. The plan focuses on creating the configuration infrastructure first, then integrating it with React and MDX, and finally migrating existing hardcoded values.

## Tasks

- [x] 1. Create TypeScript type definitions for configuration structure
  - Create `src/config/config.types.ts` file
  - Define `ContactConfig`, `DomainConfig`, `CompanyConfig` interfaces
  - Define `SocialConfig`, `ProfessionalConfig`, `MetaConfig`, `NavigationConfig` interfaces
  - Define main `SiteConfig` interface that composes all sub-interfaces
  - Add JSDoc comments for all interfaces and properties
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1_

- [x] 2. Extend site configuration with new structure
  - [x] 2.1 Update `src/config/site.config.ts` with new configuration structure
    - Import type definitions from `config.types.ts`
    - Add `getEnvVar` helper function for environment variable overrides
    - Extend existing config with new sections: `contact`, `domain`, `company`
    - Update existing sections to match new type structure
    - Add environment variable overrides for configurable values
    - Maintain backward compatibility with existing exports
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 5.1, 5.2, 8.1, 8.2, 8.3_
  
  - [ ]* 2.2 Write unit tests for configuration structure
    - Test that all required configuration sections exist
    - Test that email addresses are in valid format
    - Test that URLs are in valid format
    - Test that configuration exports work correctly
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ]* 2.3 Write property test for configuration structure completeness
    - **Property 1: Configuration Structure Completeness**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
    - Generate various configuration objects with different values
    - Verify all required fields are present and non-empty
    - Run minimum 100 iterations

- [x] 3. Implement environment variable override system
  - [x] 3.1 Add environment variable support to configuration
    - Implement `getEnvVar` helper with fallback logic
    - Add environment variable overrides for contact emails
    - Add environment variable overrides for domain values
    - Document supported environment variables in code comments
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [ ]* 3.2 Write unit tests for environment variable overrides
    - Test that setting `NEXT_PUBLIC_CONTACT_EMAIL` overrides `contact.general`
    - Test that setting `NEXT_PUBLIC_SITE_DOMAIN` overrides `domain.domain`
    - Test that missing environment variables fall back to defaults
    - Test that invalid environment variables fall back to defaults
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 3.3 Write property test for environment variable override precedence
    - **Property 4: Environment Variable Override Precedence**
    - **Validates: Requirements 5.1, 5.2**
    - Generate random environment variable values
    - Verify that env vars take precedence over defaults
    - Run minimum 100 iterations

- [x] 4. Create MDX component integration
  - [x] 4.1 Create `src/config/mdx-components.tsx` file
    - Implement `ConfigValue` component for injecting config values
    - Implement `EmailLink` component for email links
    - Implement `DomainLink` component for domain links
    - Add error handling for invalid configuration paths
    - Export `useMDXComponents` function
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 4.2 Write unit tests for MDX components
    - Test `ConfigValue` renders correct value for valid path
    - Test `ConfigValue` renders error message for invalid path
    - Test `EmailLink` generates correct mailto link
    - Test `DomainLink` renders correct domain
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 4.3 Write property test for MDX configuration value injection
    - **Property 2: MDX Configuration Value Injection**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Generate random valid configuration paths
    - Verify ConfigValue component resolves to correct value
    - Run minimum 100 iterations
  
  - [ ]* 4.4 Write property test for MDX error handling
    - **Property 3: MDX Error Handling for Invalid Paths**
    - **Validates: Requirements 4.4**
    - Generate random invalid configuration paths
    - Verify ConfigValue component renders error message
    - Run minimum 100 iterations

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update Privacy Policy page to use configuration
  - [x] 6.1 Replace hardcoded values in `src/app/privacy/page.tsx`
    - Replace `privacy@daltonousley.dev` with `contact.privacy`
    - Replace `daltonousley.dev` references with `domain.displayName`
    - Update metadata to use `siteConfig.name` and `siteConfig.domain.displayName`
    - Import configuration from `@/config/site.config`
    - _Requirements: 6.1, 6.3_
  
  - [ ]* 6.2 Write unit test for Privacy Policy configuration usage
    - Test that Privacy Policy page uses config values
    - Test that no hardcoded email addresses remain
    - Test that no hardcoded domain names remain
    - _Requirements: 6.1, 6.3_

- [x] 7. Update Terms of Use page to use configuration
  - [x] 7.1 Replace hardcoded values in `src/app/terms/page.tsx`
    - Replace `legal@daltonousley.dev` with `contact.legal`
    - Replace `daltonousley.dev` references with `domain.displayName`
    - Update metadata to use `siteConfig.name` and `siteConfig.domain.displayName`
    - Import configuration from `@/config/site.config`
    - _Requirements: 6.1, 6.4_
  
  - [ ]* 7.2 Write unit test for Terms of Use configuration usage
    - Test that Terms of Use page uses config values
    - Test that no hardcoded email addresses remain
    - Test that no hardcoded domain names remain
    - _Requirements: 6.1, 6.4_

- [-] 8. Update blog MDX content to use configuration
  - [-] 8.1 Update `content/blog/hello-world.mdx` to use MDX components
    - Replace `example@gmail.com` with `<EmailLink type="general" />`
    - Add import for MDX components if needed
    - Test that MDX renders correctly with config values
    - _Requirements: 6.2, 6.6_
  
  - [ ]* 8.2 Write unit test for blog MDX configuration usage
    - Test that blog content renders with config values
    - Test that EmailLink component works in MDX context
    - _Requirements: 6.2, 6.6_

- [~] 9. Update existing site.config.ts references
  - [ ] 9.1 Replace old email in site.config.ts
    - Replace `example@gmail.com` with correct contact email
    - Ensure all config values are using new structure
    - _Requirements: 6.5_
  
  - [ ]* 9.2 Write unit test for backward compatibility
    - Test that existing `siteConfig` export still works
    - Test that destructured exports (`contact`, `domain`, etc.) work
    - Test that existing code can import without modifications
    - _Requirements: 8.1, 8.2_

- [~] 10. Create documentation and examples
  - [ ] 10.1 Add usage examples to configuration files
    - Add JSDoc examples for React component usage
    - Add JSDoc examples for MDX component usage
    - Document environment variable overrides
    - Create inline code examples in comments
    - _Requirements: 7.2, 7.3, 7.4_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Verify no hardcoded values remain in legal pages
  - Verify no hardcoded values remain in blog content
  - Verify backward compatibility with existing code

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation maintains backward compatibility throughout
- Environment variable overrides use Next.js standard `NEXT_PUBLIC_` prefix
