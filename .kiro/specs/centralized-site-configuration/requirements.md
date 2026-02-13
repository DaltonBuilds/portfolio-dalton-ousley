# Requirements Document

## Introduction

This document defines the requirements for a centralized site configuration system that consolidates all site-wide variables, contact information, and placeholder values into a single, type-safe configuration structure. The system will eliminate hardcoded values scattered throughout the codebase and provide a consistent way to reference configuration values in React components, MDX content, and metadata.

## Glossary

- **Site_Config**: The centralized configuration object containing all site-wide variables and constants
- **Config_Value**: A specific configuration property (e.g., email address, domain name, company name)
- **MDX_Content**: Markdown files with JSX support used for blog posts and content pages
- **Legal_Pages**: Privacy Policy and Terms of Use pages that require accurate contact and entity information
- **Environment_Override**: Configuration values that can be overridden via environment variables for different deployment environments

## Requirements

### Requirement 1: Centralized Configuration Structure

**User Story:** As a developer, I want all site-wide configuration values defined in a single location, so that I can easily maintain and update them without searching through multiple files.

#### Acceptance Criteria

1. THE Site_Config SHALL define all contact email addresses (general contact, legal, privacy, support)
2. THE Site_Config SHALL define all domain and URL information (site domain, base URL, API endpoints)
3. THE Site_Config SHALL define all company and business information (company name, legal entity name, business address)
4. THE Site_Config SHALL define all social media links and handles
5. THE Site_Config SHALL provide TypeScript type definitions for all configuration properties
6. THE Site_Config SHALL extend the existing `src/config/site.config.ts` structure without breaking existing references

### Requirement 2: Type Safety and Validation

**User Story:** As a developer, I want TypeScript type safety for all configuration values, so that I can catch configuration errors at compile time.

#### Acceptance Criteria

1. THE Site_Config SHALL export TypeScript interfaces defining the structure of all configuration objects
2. WHEN a developer accesses a Config_Value, THE System SHALL provide autocomplete and type checking
3. THE Site_Config SHALL validate that required configuration properties are defined at build time
4. WHEN a Config_Value is missing or invalid, THE System SHALL produce a TypeScript compilation error

### Requirement 3: React Component Integration

**User Story:** As a developer, I want to easily access configuration values in React components, so that I can display dynamic content based on site configuration.

#### Acceptance Criteria

1. THE System SHALL provide a typed import for accessing Site_Config in React components
2. WHEN a React component imports Site_Config, THE System SHALL provide full TypeScript autocomplete
3. THE System SHALL allow configuration values to be used in JSX expressions
4. THE System SHALL allow configuration values to be used in Next.js metadata objects

### Requirement 4: MDX Content Integration

**User Story:** As a content author, I want to use placeholder variables in MDX content, so that contact information and site details are automatically populated from the central configuration.

#### Acceptance Criteria

1. THE System SHALL provide a mechanism to inject Config_Values into MDX content files
2. WHEN an MDX file references a Config_Value placeholder, THE System SHALL replace it with the actual configured value at render time
3. THE System SHALL support Config_Value placeholders in blog posts and content pages
4. WHEN a Config_Value placeholder is invalid or missing, THE System SHALL display a clear error message

### Requirement 5: Environment-Specific Configuration

**User Story:** As a DevOps engineer, I want to override configuration values for different environments, so that I can use different settings for development, staging, and production.

#### Acceptance Criteria

1. WHERE environment variables are defined, THE System SHALL override corresponding Config_Values
2. THE System SHALL support environment-specific overrides for email addresses, domains, and API endpoints
3. THE System SHALL maintain type safety when using environment variable overrides
4. THE System SHALL provide clear documentation of which Config_Values can be overridden via environment variables

### Requirement 6: Migration of Existing Hardcoded Values

**User Story:** As a developer, I want all existing hardcoded values replaced with configuration references, so that the codebase is consistent and maintainable.

#### Acceptance Criteria

1. WHEN Legal_Pages are rendered, THE System SHALL use Config_Values for all email addresses and domain references
2. WHEN blog content is rendered, THE System SHALL use Config_Values for all contact information
3. THE System SHALL replace hardcoded values in Privacy Policy (`privacy@daltonousley.dev`, `daltonousley.dev`)
4. THE System SHALL replace hardcoded values in Terms of Use (`legal@daltonousley.dev`, `daltonousley.dev`)
5. THE System SHALL replace hardcoded values in existing site.config.ts (`example@gmail.com`)
6. THE System SHALL replace hardcoded values in MDX blog content (`example@gmail.com`)

### Requirement 7: Configuration Documentation

**User Story:** As a developer, I want clear documentation of all available configuration values, so that I know what can be configured and how to use it.

#### Acceptance Criteria

1. THE Site_Config SHALL include JSDoc comments describing each configuration property
2. THE System SHALL provide examples of how to use Config_Values in React components
3. THE System SHALL provide examples of how to use Config_Values in MDX content
4. THE System SHALL document which Config_Values can be overridden via environment variables

### Requirement 8: Backward Compatibility

**User Story:** As a developer, I want the new configuration system to be backward compatible with existing code, so that I can migrate gradually without breaking the site.

#### Acceptance Criteria

1. THE System SHALL maintain the existing `siteConfig` export from `src/config/site.config.ts`
2. WHEN existing code imports `siteConfig`, THE System SHALL continue to work without modifications
3. THE System SHALL extend the existing configuration structure rather than replacing it
4. THE System SHALL provide a migration path for updating existing references to use the new structure
