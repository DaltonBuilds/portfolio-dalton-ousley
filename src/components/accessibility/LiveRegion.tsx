'use client';

import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number; // milliseconds
}

/**
 * LiveRegion component for screen reader announcements
 * Implements aria-live region with configurable politeness level.
 * Supports auto-clearing after a timeout.
 * 
 * Requirements: 2.4
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearAfter,
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter && message) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
      data-testid="live-region"
    >
      {currentMessage}
    </div>
  );
}
