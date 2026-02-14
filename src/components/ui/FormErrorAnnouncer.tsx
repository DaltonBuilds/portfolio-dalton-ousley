'use client';

import React, { useEffect, useState } from 'react';
import { FieldErrors } from 'react-hook-form';

interface FormErrorAnnouncerProps {
  errors: FieldErrors;
  clearAfter?: number; // milliseconds, default 5000
}

/**
 * FormErrorAnnouncer component
 * Announces form validation errors to screen readers using aria-live region.
 * Uses assertive politeness to interrupt screen reader flow.
 * Clears announcements after a timeout.
 * 
 * Requirements: 13.4
 */
export function FormErrorAnnouncer({
  errors,
  clearAfter = 5000,
}: FormErrorAnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Build error message from errors object
    const errorMessages = Object.entries(errors)
      .filter(([_, error]) => error?.message)
      .map(([field, error]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        return `${fieldName}: ${error?.message}`;
      });

    if (errorMessages.length > 0) {
      const message =
        errorMessages.length === 1
          ? `Form error: ${errorMessages[0]}`
          : `Form has ${errorMessages.length} errors: ${errorMessages.join('. ')}`;
      
      setAnnouncement(message);

      // Clear announcement after timeout
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, clearAfter);

      return () => clearTimeout(timer);
    } else {
      setAnnouncement('');
    }
  }, [errors, clearAfter]);

  // Don't render anything if there's no announcement
  if (!announcement) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
      data-testid="form-error-announcer"
    >
      {announcement}
    </div>
  );
}
