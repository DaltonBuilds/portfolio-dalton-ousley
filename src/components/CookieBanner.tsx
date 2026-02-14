'use client';

import React from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { FocusTrap } from '@/components/accessibility/FocusTrap';

/**
 * Cookie Consent Banner Component
 * 
 * This banner is displayed when non-essential cookies are used.
 * Currently NOT displayed because only essential cookies are used.
 * 
 * GDPR Compliance:
 * - Must be shown before setting non-essential cookies
 * - Must allow users to accept or reject
 * - Must link to Privacy Policy
 * - Must not be pre-dismissed
 */

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    setIsVisible(false);
    onReject();
  };

  const handleClose = () => {
    setIsVisible(false);
    onReject(); // Closing without action = reject
  };

  if (!isVisible) {
    return null;
  }

  return (
    <FocusTrap active={isVisible} returnFocusOnDeactivate={false}>
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
        aria-modal="true"
      >
        <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Cookie className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 
                  id="cookie-banner-title" 
                  className="text-lg font-semibold mb-2 text-foreground"
                >
                  Cookie Consent
                </h2>
                
                <p 
                  id="cookie-banner-description" 
                  className="text-sm text-foreground/80 mb-4"
                >
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or 
                  reject non-essential cookies by clicking "Reject".{' '}
                  <Link 
                    href="/privacy" 
                    className="text-primary hover:underline font-medium"
                  >
                    Learn more in our Privacy Policy
                  </Link>
                </p>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleAccept}
                    className="flex-1 sm:flex-none"
                    size="sm"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    size="sm"
                  >
                    Reject Non-Essential
                  </Button>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="flex-shrink-0 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </FocusTrap>
  );
}
