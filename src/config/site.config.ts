import { SiteConfig } from './config.types';

/**
 * Helper function to get environment variable with fallback
 * 
 * @param key - Environment variable key
 * @param fallback - Default value if environment variable is not set
 * @returns Environment variable value or fallback
 * 
 * @example
 * ```typescript
 * const email = getEnvVar('NEXT_PUBLIC_CONTACT_EMAIL', 'contact@example.com');
 * ```
 */
function getEnvVar(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

/**
 * Centralized site configuration
 * 
 * This configuration object serves as the single source of truth for all
 * site-wide variables, contact information, and placeholder values.
 * 
 * Environment variable overrides:
 * - NEXT_PUBLIC_SITE_DOMAIN: Override domain.domain
 * - NEXT_PUBLIC_SITE_BASE_URL: Override domain.baseUrl
 * - NEXT_PUBLIC_CONTACT_EMAIL: Override contact.general
 * - NEXT_PUBLIC_LEGAL_EMAIL: Override contact.legal
 * - NEXT_PUBLIC_PRIVACY_EMAIL: Override contact.privacy
 * - NEXT_PUBLIC_SUPPORT_EMAIL: Override contact.support
 * 
 * @example
 * ```typescript
 * // In React components
 * import { siteConfig } from '@/config/site.config';
 * 
 * export default function ContactPage() {
 *   return <a href={`mailto:${siteConfig.contact.general}`}>Contact Us</a>;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // In Next.js metadata
 * import { siteConfig } from '@/config/site.config';
 * 
 * export const metadata = {
 *   title: `Privacy Policy - ${siteConfig.name}`,
 *   description: `Privacy Policy for ${siteConfig.domain.displayName}`,
 * };
 * ```
 */
export const siteConfig: SiteConfig = {
  name: 'Dalton Ousley',
  title: 'Dalton Ousley - DevOps Engineer & Cloud Architect',
  description: 'DevOps Engineer and Cloud Architect specializing in Kubernetes, cloud infrastructure, and automation.',
  url: getEnvVar('NEXT_PUBLIC_SITE_BASE_URL', 'https://daltonousley.com/'),
  
  // Contact information
  contact: {
    general: getEnvVar('NEXT_PUBLIC_CONTACT_EMAIL', 'contact@daltonousley.com'),
    legal: getEnvVar('NEXT_PUBLIC_LEGAL_EMAIL', 'legal@daltonousley.com'),
    privacy: getEnvVar('NEXT_PUBLIC_PRIVACY_EMAIL', 'privacy@daltonousley.com'),
    support: getEnvVar('NEXT_PUBLIC_SUPPORT_EMAIL', 'support@daltonousley.com'),
  },

  // Domain configuration
  domain: {
    domain: getEnvVar('NEXT_PUBLIC_SITE_DOMAIN', 'daltonousley.com'),
    baseUrl: getEnvVar('NEXT_PUBLIC_SITE_BASE_URL', 'https://daltonousley.com'),
    displayName: 'daltonousley.com',
  },

  // Company information
  company: {
    legalName: 'Dalton Ousley',
    dbaName: 'Dalton Ousley',
    address: {
      city: 'Fort Collins',
      state: 'Colorado',
      country: 'United States',
    },
    jurisdiction: {
      state: 'Texas',
      country: 'United States',
    },
  },
  
  // Social links
  social: {
    github: 'https://github.com/DaltonBuilds',
    linkedin: 'https://linkedin.com/in/dalton-ousley',
    twitter: 'https://twitter.com/dalton-ousley',
  },

  // Professional details
  professional: {
    role: 'DevOps Engineer',
    location: 'Fort Collins, Colorado',
    company: 'Freelance DevOps Consultant',
  },

  // Meta information
  meta: {
    keywords: [
      'DevOps',
      'Cloud Architecture',
      'Kubernetes',
      'Infrastructure as Code',
      'Automation',
      'CI/CD',
      'Cloud Native',
    ],
    themeColor: '#10b981',
  },

  // Navigation
  nav: {
    home: '/',
    about: '/about',
    blog: '/blog',
    projects: '/projects',
    experience: '/experience',
  },
};

// Export individual sections for convenience
export const { contact, domain, company, social, professional, meta, nav } = siteConfig;

// Backward compatibility: maintain existing export structure
export default siteConfig;

