/**
 * Cookie Configuration
 * 
 * This configuration determines whether a cookie consent banner is displayed.
 * 
 * GDPR/ePrivacy Rules:
 * - Essential cookies: No consent required
 * - Non-essential cookies (analytics, marketing, functional): Consent required
 * 
 * If hasNonEssentialCookies is true, a cookie banner will be displayed.
 * If hasNonEssentialCookies is false, no banner is shown (current state).
 */

export interface CookieConfig {
  hasNonEssentialCookies: boolean;
  essentialCookies: string[];
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  functionalEnabled: boolean;
}

/**
 * Current cookie configuration for daltonousley.com
 * 
 * Status: Only essential cookies are used
 * Banner Required: No
 */
export const cookieConfig: CookieConfig = {
  // Set to true if you add analytics, marketing, or functional cookies
  hasNonEssentialCookies: false,
  
  // List of essential cookies (for documentation)
  essentialCookies: [
    'cf_clearance',      // Cloudflare Turnstile
    '__cf_bm',           // Cloudflare bot management
    'next-session',      // Next.js session (if used)
  ],
  
  // Non-essential cookie categories (all disabled)
  analyticsEnabled: false,    // Google Analytics, etc.
  marketingEnabled: false,    // Advertising cookies
  functionalEnabled: false,   // Preference cookies
};

/**
 * Check if cookie consent banner should be displayed
 * 
 * @returns true if non-essential cookies are used, false otherwise
 */
export function shouldShowCookieBanner(): boolean {
  return cookieConfig.hasNonEssentialCookies;
}

/**
 * Check if any non-essential cookie category is enabled
 * 
 * @returns true if analytics, marketing, or functional cookies are enabled
 */
export function hasNonEssentialCookies(): boolean {
  return (
    cookieConfig.analyticsEnabled ||
    cookieConfig.marketingEnabled ||
    cookieConfig.functionalEnabled
  );
}
