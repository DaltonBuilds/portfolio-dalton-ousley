'use client';

import React from 'react';
import { CookieBanner } from './CookieBanner';
import { shouldShowCookieBanner } from '@/config/cookies.config';

/**
 * Cookie Consent Manager
 * 
 * This component conditionally displays the cookie banner based on
 * whether non-essential cookies are used.
 * 
 * Current Behavior:
 * - Only essential cookies used → No banner displayed
 * - Non-essential cookies added → Banner displayed
 * 
 * GDPR Compliance:
 * - Banner shown before setting non-essential cookies
 * - User consent stored in localStorage
 * - Consent persists across sessions
 * - User can change preferences via Privacy Policy page
 */

const CONSENT_STORAGE_KEY = 'cookie-consent';

interface CookieConsent {
  accepted: boolean;
  timestamp: number;
}

export function CookieConsentManager() {
  const [showBanner, setShowBanner] = React.useState(false);
  const [consentGiven, setConsentGiven] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Check if we should show the banner at all
    const shouldShow = shouldShowCookieBanner();
    
    if (!shouldShow) {
      // No non-essential cookies, no banner needed
      setShowBanner(false);
      return;
    }

    // Check if user has already given/rejected consent
    const storedConsent = getStoredConsent();
    
    if (storedConsent !== null) {
      // User has already made a choice
      setConsentGiven(storedConsent);
      setShowBanner(false);
      
      // Apply consent preferences
      if (storedConsent) {
        enableNonEssentialCookies();
      } else {
        disableNonEssentialCookies();
      }
    } else {
      // No stored consent, show banner
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setConsentGiven(true);
    storeConsent(true);
    enableNonEssentialCookies();
    setShowBanner(false);
  };

  const handleReject = () => {
    setConsentGiven(false);
    storeConsent(false);
    disableNonEssentialCookies();
    setShowBanner(false);
  };

  // Don't render anything if banner shouldn't be shown
  if (!showBanner) {
    return null;
  }

  return <CookieBanner onAccept={handleAccept} onReject={handleReject} />;
}

/**
 * Get stored consent from localStorage
 * @returns true if accepted, false if rejected, null if no consent stored
 */
function getStoredConsent(): boolean | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const consent: CookieConsent = JSON.parse(stored);
    return consent.accepted;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
}

/**
 * Store consent in localStorage
 */
function storeConsent(accepted: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const consent: CookieConsent = {
      accepted,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch (error) {
    console.error('Error storing cookie consent:', error);
  }
}

/**
 * Enable non-essential cookies (analytics, marketing, etc.)
 * 
 * This function would initialize analytics scripts, marketing pixels, etc.
 * Currently a placeholder since no non-essential cookies are used.
 */
function enableNonEssentialCookies(): void {
  // TODO: Initialize analytics when added
  // Example: window.gtag('consent', 'update', { analytics_storage: 'granted' });
  
  console.log('Non-essential cookies enabled');
}

/**
 * Disable non-essential cookies
 * 
 * This function would remove/disable analytics scripts, marketing pixels, etc.
 * Currently a placeholder since no non-essential cookies are used.
 */
function disableNonEssentialCookies(): void {
  // TODO: Disable analytics when added
  // Example: window.gtag('consent', 'update', { analytics_storage: 'denied' });
  
  console.log('Non-essential cookies disabled');
}

/**
 * Clear stored consent (for testing or user preference reset)
 */
export function clearCookieConsent(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cookie consent:', error);
  }
}
