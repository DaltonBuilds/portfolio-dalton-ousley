/**
 * Contact information for various purposes
 */
export interface ContactConfig {
  /** General contact email for inquiries */
  general: string;
  /** Legal inquiries and terms-related contact */
  legal: string;
  /** Privacy policy and data protection inquiries */
  privacy: string;
  /** Technical support contact */
  support: string;
}

/**
 * Domain and URL configuration
 */
export interface DomainConfig {
  /** Primary site domain (e.g., "daltonousley.com") */
  domain: string;
  /** Full base URL including protocol (e.g., "https://daltonousley.com") */
  baseUrl: string;
  /** Display name for the domain in legal documents */
  displayName: string;
}

/**
 * Company and legal entity information
 */
export interface CompanyConfig {
  /** Legal entity name */
  legalName: string;
  /** Doing business as (DBA) name */
  dbaName: string;
  /** Business address for legal documents */
  address: {
    /** Street address (optional) */
    street?: string;
    /** City */
    city: string;
    /** State or province */
    state: string;
    /** Country */
    country: string;
    /** Postal or ZIP code (optional) */
    postalCode?: string;
  };
  /** Jurisdiction for legal matters */
  jurisdiction: {
    /** State or province of jurisdiction */
    state: string;
    /** Country of jurisdiction */
    country: string;
  };
}

/**
 * Social media links and handles
 */
export interface SocialConfig {
  /** GitHub profile URL */
  github: string;
  /** LinkedIn profile URL */
  linkedin: string;
  /** Twitter/X profile URL (optional) */
  twitter?: string;
  /** Additional social media links */
  [key: string]: string | undefined;
}

/**
 * Professional information
 */
export interface ProfessionalConfig {
  /** Professional role or title */
  role: string;
  /** Current location */
  location: string;
  /** Current company or organization */
  company: string;
}

/**
 * Meta information for SEO and branding
 */
export interface MetaConfig {
  /** SEO keywords */
  keywords: string[];
  /** Theme color for browser UI */
  themeColor: string;
}

/**
 * Navigation paths
 */
export interface NavigationConfig {
  /** Home page path */
  home: string;
  /** About page path */
  about: string;
  /** Blog page path */
  blog: string;
  /** Projects page path */
  projects: string;
  /** Experience page path */
  experience: string;
  /** Additional navigation paths */
  [key: string]: string;
}

/**
 * Complete site configuration structure
 * 
 * This interface defines the centralized configuration for all site-wide
 * variables, contact information, and placeholder values.
 */
export interface SiteConfig {
  /** Site name */
  name: string;
  /** Full site title for SEO */
  title: string;
  /** Site description for SEO */
  description: string;
  /** Base URL of the site */
  url: string;
  /** Contact information */
  contact: ContactConfig;
  /** Domain configuration */
  domain: DomainConfig;
  /** Company and legal entity information */
  company: CompanyConfig;
  /** Social media links */
  social: SocialConfig;
  /** Professional information */
  professional: ProfessionalConfig;
  /** Meta information for SEO and branding */
  meta: MetaConfig;
  /** Navigation paths */
  nav: NavigationConfig;
}
