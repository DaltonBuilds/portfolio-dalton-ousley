import type { MDXComponents } from 'mdx/types';
import { siteConfig } from './site.config';

/**
 * Configuration value component for MDX
 * 
 * Injects configuration values into MDX content using dot notation paths.
 * 
 * @param path - Dot-separated path to configuration value (e.g., "contact.general", "domain.displayName")
 * @returns Rendered configuration value or error message if path is invalid
 * 
 * @example
 * ```mdx
 * Contact us at <ConfigValue path="contact.general" />
 * Visit our site at <ConfigValue path="domain.displayName" />
 * ```
 */
function ConfigValue({ path }: { path: string }) {
  const value = path.split('.').reduce((obj: any, key) => obj?.[key], siteConfig);
  
  if (value === undefined) {
    console.error(`Configuration path "${path}" not found`);
    return <span className="text-red-500">[Config Error: {path}]</span>;
  }
  
  return <span>{String(value)}</span>;
}

/**
 * Email link component for MDX
 * 
 * Creates a mailto link using configured email addresses.
 * 
 * @param type - Type of contact email (general, legal, privacy, support)
 * @param children - Optional link text (defaults to email address)
 * @returns Rendered email link or error message if type is invalid
 * 
 * @example
 * ```mdx
 * <EmailLink type="general" />
 * <EmailLink type="privacy">Contact our privacy team</EmailLink>
 * ```
 */
function EmailLink({ type, children }: { type: keyof typeof siteConfig.contact; children?: React.ReactNode }) {
  const email = siteConfig.contact[type];
  
  if (!email) {
    console.error(`Email type "${type}" not found in configuration`);
    return <span className="text-red-500">[Email Error: {type}]</span>;
  }
  
  return (
    <a href={`mailto:${email}`} className="text-blue-400 hover:underline">
      {children || email}
    </a>
  );
}

/**
 * Domain link component for MDX
 * 
 * Creates a link to the site's base URL.
 * 
 * @param children - Optional link text (defaults to domain display name)
 * @returns Rendered domain link
 * 
 * @example
 * ```mdx
 * <DomainLink />
 * <DomainLink>Visit our website</DomainLink>
 * ```
 */
function DomainLink({ children }: { children?: React.ReactNode }) {
  return (
    <a href={siteConfig.domain.baseUrl} className="text-blue-400 hover:underline">
      {children || siteConfig.domain.displayName}
    </a>
  );
}

/**
 * Custom MDX components with configuration injection
 * 
 * This function provides custom components that can be used in MDX content
 * to inject configuration values dynamically.
 * 
 * ## Setup
 * 
 * To use these components in your MDX content, create or update the `mdx-components.ts`
 * file in your project root:
 * 
 * ```typescript
 * // mdx-components.ts (root level)
 * import { useMDXComponents } from '@/config/mdx-components';
 * 
 * export { useMDXComponents };
 * ```
 * 
 * ## Available Components
 * 
 * ### ConfigValue
 * 
 * Injects any configuration value using dot notation:
 * 
 * ```mdx
 * Contact us at <ConfigValue path="contact.general" />
 * Visit <ConfigValue path="domain.displayName" />
 * We're located in <ConfigValue path="company.address.city" />
 * ```
 * 
 * ### EmailLink
 * 
 * Creates mailto links for configured email addresses:
 * 
 * ```mdx
 * <EmailLink type="general" />
 * <EmailLink type="privacy">Contact our privacy team</EmailLink>
 * <EmailLink type="legal">Legal inquiries</EmailLink>
 * <EmailLink type="support">Get support</EmailLink>
 * ```
 * 
 * ### DomainLink
 * 
 * Creates links to the site's base URL:
 * 
 * ```mdx
 * <DomainLink />
 * <DomainLink>Visit our website</DomainLink>
 * ```
 * 
 * ## Complete MDX Example
 * 
 * ```mdx
 * ---
 * title: "Contact Information"
 * ---
 * 
 * # Get in Touch
 * 
 * You can reach us at <EmailLink type="general" /> for general inquiries.
 * 
 * For privacy-related questions, please contact <EmailLink type="privacy">our privacy team</EmailLink>.
 * 
 * Visit our website at <DomainLink /> to learn more.
 * 
 * We're based in <ConfigValue path="company.address.city" />, <ConfigValue path="company.address.state" />.
 * ```
 * 
 * @param components - Existing MDX components to merge with
 * @returns Merged MDX components including configuration components
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ConfigValue,
    EmailLink,
    DomainLink,
  };
}
