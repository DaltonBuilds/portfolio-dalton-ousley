import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * SkipLink component for keyboard navigation
 * Provides a visually hidden link that appears on focus, allowing keyboard users
 * to skip repetitive navigation and jump directly to main content.
 * 
 * Requirements: 3.5
 */
export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="skip-link"
      data-testid="skip-link"
    >
      {children}
    </a>
  );
}
