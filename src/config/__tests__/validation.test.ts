/**
 * Configuration Validation Tests
 * 
 * Tests the configuration validation schemas to ensure:
 * 1. Valid configurations pass validation
 * 2. Invalid configurations fail with clear error messages
 * 3. Environment variable validation works correctly
 */

import { describe, it, expect } from 'vitest';
import { 
  siteConfigSchema, 
  envSchema, 
  formatValidationError 
} from '../validation';
import type { SiteConfig } from '../config.types';

describe('Site Configuration Validation', () => {
  const validConfig: SiteConfig = {
    name: 'Test Site',
    title: 'Test Site - Developer Portfolio',
    description: 'A test portfolio site',
    url: 'https://example.com',
    contact: {
      general: 'contact@example.com',
      legal: 'legal@example.com',
      privacy: 'privacy@example.com',
      support: 'support@example.com',
    },
    domain: {
      domain: 'example.com',
      baseUrl: 'https://example.com',
      displayName: 'example.com',
    },
    company: {
      legalName: 'Test Company',
      dbaName: 'Test Company',
      address: {
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
      },
      jurisdiction: {
        state: 'Test State',
        country: 'Test Country',
      },
    },
    social: {
      github: 'https://github.com/testuser',
      linkedin: 'https://linkedin.com/in/testuser',
    },
    professional: {
      role: 'Developer',
      location: 'Test Location',
      company: 'Test Company',
    },
    meta: {
      keywords: ['test', 'developer'],
      themeColor: '#10b981',
    },
    nav: {
      home: '/',
      about: '/about',
      blog: '/blog',
      projects: '/projects',
      experience: '/experience',
    },
  };

  describe('Valid Configuration', () => {
    it('should accept a valid configuration', () => {
      const result = siteConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
    });

    it('should accept optional twitter field', () => {
      const configWithTwitter = {
        ...validConfig,
        social: {
          ...validConfig.social,
          twitter: 'https://twitter.com/testuser',
        },
      };
      const result = siteConfigSchema.safeParse(configWithTwitter);
      expect(result.success).toBe(true);
    });
  });

  describe('Contact Validation', () => {
    it('should reject invalid email addresses', () => {
      const invalidConfig = {
        ...validConfig,
        contact: {
          ...validConfig.contact,
          general: 'not-an-email',
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it('should reject empty email addresses', () => {
      const invalidConfig = {
        ...validConfig,
        contact: {
          ...validConfig.contact,
          support: '',
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });
  });

  describe('Domain Validation', () => {
    it('should reject invalid URLs', () => {
      const invalidConfig = {
        ...validConfig,
        domain: {
          ...validConfig.domain,
          baseUrl: 'not-a-url',
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it('should reject empty domain', () => {
      const invalidConfig = {
        ...validConfig,
        domain: {
          ...validConfig.domain,
          domain: '',
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });
  });

  describe('Social Links Validation', () => {
    it('should reject invalid GitHub URL', () => {
      const invalidConfig = {
        ...validConfig,
        social: {
          ...validConfig.social,
          github: 'not-a-url',
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it('should reject invalid LinkedIn URL', () => {
      const invalidConfig = {
        ...validConfig,
        social: {
          ...validConfig.social,
          linkedin: 'invalid',
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });
  });

  describe('Meta Validation', () => {
    it('should reject invalid theme color format', () => {
      const invalidConfig = {
        ...validConfig,
        meta: {
          ...validConfig.meta,
          themeColor: 'red', // should be hex format
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it('should reject empty keywords array', () => {
      const invalidConfig = {
        ...validConfig,
        meta: {
          ...validConfig.meta,
          keywords: [],
        },
      };
      const result = siteConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
    });

    it('should accept valid hex color', () => {
      const configWithColor = {
        ...validConfig,
        meta: {
          ...validConfig.meta,
          themeColor: '#FF5733',
        },
      };
      const result = siteConfigSchema.safeParse(configWithColor);
      expect(result.success).toBe(true);
    });
  });

  describe('Required Fields', () => {
    it('should reject missing name', () => {
      const { name, ...configWithoutName } = validConfig;
      const result = siteConfigSchema.safeParse(configWithoutName);
      expect(result.success).toBe(false);
    });

    it('should reject missing title', () => {
      const { title, ...configWithoutTitle } = validConfig;
      const result = siteConfigSchema.safeParse(configWithoutTitle);
      expect(result.success).toBe(false);
    });

    it('should reject missing description', () => {
      const { description, ...configWithoutDesc } = validConfig;
      const result = siteConfigSchema.safeParse(configWithoutDesc);
      expect(result.success).toBe(false);
    });
  });
});

describe('Environment Variable Validation', () => {
  describe('Valid Environment', () => {
    it('should accept minimal valid environment', () => {
      const validEnv = {
        NODE_ENV: 'development',
      };
      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
    });

    it('should accept production environment', () => {
      const validEnv = {
        NODE_ENV: 'production',
      };
      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
    });

    it('should accept optional environment variables', () => {
      const validEnv = {
        NODE_ENV: 'development',
        GITHUB_TOKEN: 'test-token',
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'test-key',
      };
      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
    });
  });

  describe('Email Validation', () => {
    it('should reject invalid email format', () => {
      const invalidEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_CONTACT_EMAIL: 'not-an-email',
      };
      const result = envSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should accept valid email format', () => {
      const validEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_CONTACT_EMAIL: 'test@example.com',
      };
      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
    });
  });

  describe('URL Validation', () => {
    it('should reject invalid URL format', () => {
      const invalidEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_SITE_BASE_URL: 'not-a-url',
      };
      const result = envSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
    });

    it('should accept valid URL format', () => {
      const validEnv = {
        NODE_ENV: 'development',
        NEXT_PUBLIC_SITE_BASE_URL: 'https://example.com',
      };
      const result = envSchema.safeParse(validEnv);
      expect(result.success).toBe(true);
    });
  });

  describe('Default Values', () => {
    it('should default NODE_ENV to development', () => {
      const result = envSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe('development');
      }
    });
  });
});

describe('Error Formatting', () => {
  it('should format validation errors with field paths', () => {
    const result = siteConfigSchema.safeParse({
      name: '',
      url: 'invalid-url',
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatValidationError(result.error);
      expect(formatted).toContain('Configuration validation failed');
      expect(formatted).toContain('name');
    }
  });

  it('should include error messages in formatted output', () => {
    const result = siteConfigSchema.safeParse({
      ...{
        name: 'Test',
        title: 'Test',
        description: 'Test',
        url: 'https://example.com',
        contact: {
          general: 'invalid-email',
          legal: 'legal@example.com',
          privacy: 'privacy@example.com',
          support: 'support@example.com',
        },
      },
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatValidationError(result.error);
      expect(formatted).toContain('email');
    }
  });
});
