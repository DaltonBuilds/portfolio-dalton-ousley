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
 * ## Environment Variable Overrides
 * 
 * The following environment variables can be used to override default configuration values.
 * All environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in client-side code.
 * 
 * | Environment Variable | Configuration Path | Default Value |
 * |---------------------|-------------------|---------------|
 * | `NEXT_PUBLIC_SITE_DOMAIN` | `domain.domain` | `daltonousley.com` |
 * | `NEXT_PUBLIC_SITE_BASE_URL` | `domain.baseUrl` | `https://daltonousley.com` |
 * | `NEXT_PUBLIC_CONTACT_EMAIL` | `contact.general` | `contact@daltonousley.com` |
 * | `NEXT_PUBLIC_LEGAL_EMAIL` | `contact.legal` | `legal@daltonousley.com` |
 * | `NEXT_PUBLIC_PRIVACY_EMAIL` | `contact.privacy` | `privacy@daltonousley.com` |
 * | `NEXT_PUBLIC_SUPPORT_EMAIL` | `contact.support` | `support@daltonousley.com` |
 * 
 * ### Setting Environment Variables
 * 
 * Create a `.env.local` file in the project root:
 * 
 * ```bash
 * # .env.local
 * NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
 * NEXT_PUBLIC_SITE_DOMAIN=example.com
 * NEXT_PUBLIC_SITE_BASE_URL=https://example.com
 * ```
 * 
 * ## Usage Examples
 * 
 * ### In React Components
 * 
 * ```typescript
 * import { siteConfig } from '@/config/site.config';
 * 
 * export default function ContactPage() {
 *   return (
 *     <div>
 *       <h1>Contact {siteConfig.name}</h1>
 *       <a href={`mailto:${siteConfig.contact.general}`}>
 *         Email us at {siteConfig.contact.general}
 *       </a>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ### Using Destructured Exports
 * 
 * ```typescript
 * import { contact, domain, company } from '@/config/site.config';
 * 
 * export default function Footer() {
 *   return (
 *     <footer>
 *       <p>© {new Date().getFullYear()} {company.legalName}</p>
 *       <p>Located in {company.address.city}, {company.address.state}</p>
 *       <a href={`mailto:${contact.general}`}>Contact</a>
 *     </footer>
 *   );
 * }
 * ```
 * 
 * ### In Next.js Metadata
 * 
 * ```typescript
 * import { siteConfig } from '@/config/site.config';
 * import type { Metadata } from 'next';
 * 
 * export const metadata: Metadata = {
 *   title: `Privacy Policy - ${siteConfig.name}`,
 *   description: `Privacy Policy for ${siteConfig.domain.displayName}`,
 *   keywords: siteConfig.meta.keywords,
 *   themeColor: siteConfig.meta.themeColor,
 * };
 * ```
 * 
 * ### In Server Components
 * 
 * ```typescript
 * import { siteConfig } from '@/config/site.config';
 * 
 * export default async function PrivacyPage() {
 *   return (
 *     <article>
 *       <h1>Privacy Policy</h1>
 *       <p>
 *         For privacy inquiries, contact us at{' '}
 *         <a href={`mailto:${siteConfig.contact.privacy}`}>
 *           {siteConfig.contact.privacy}
 *         </a>
 *       </p>
 *       <p>This policy applies to {siteConfig.domain.displayName}</p>
 *     </article>
 *   );
 * }
 * ```
 * 
 * ### Accessing Social Links
 * 
 * ```typescript
 * import { social } from '@/config/site.config';
 * 
 * export default function SocialLinks() {
 *   return (
 *     <div>
 *       <a href={social.github}>GitHub</a>
 *       <a href={social.linkedin}>LinkedIn</a>
 *       {social.twitter && <a href={social.twitter}>Twitter</a>}
 *     </div>
 *   );
 * }
 * ```
 * 
 * ### Using Navigation Paths
 * 
 * ```typescript
 * import { nav } from '@/config/site.config';
 * import Link from 'next/link';
 * 
 * export default function Navigation() {
 *   return (
 *     <nav>
 *       <Link href={nav.home}>Home</Link>
 *       <Link href={nav.about}>About</Link>
 *       <Link href={nav.blog}>Blog</Link>
 *       <Link href={nav.projects}>Projects</Link>
 *     </nav>
 *   );
 * }
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
/**
 * Contact configuration
 * 
 * @example
 * ```typescript
 * import { contact } from '@/config/site.config';
 * 
 * <a href={`mailto:${contact.general}`}>Contact Us</a>
 * <a href={`mailto:${contact.support}`}>Get Support</a>
 * ```
 */
export const { contact, domain, company, social, professional, meta, nav } = siteConfig;

// Backward compatibility: maintain existing export structure
export default siteConfig;

