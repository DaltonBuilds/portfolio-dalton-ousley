'use client';

import { useState, useCallback } from 'react';

interface AnnouncementOptions {
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
}

/**
 * Hook for programmatic screen reader announcements
 * Provides a function to announce messages and manages the announcement state.
 * 
 * Requirements: 2.4
 */
export function useLiveAnnouncer() {
  const [announcement, setAnnouncement] = useState<{
    message: string;
    politeness: 'polite' | 'assertive';
    clearAfter?: number;
  }>({
    message: '',
    politeness: 'polite',
  });

  const announce = useCallback(
    (message: string, options: AnnouncementOptions = {}) => {
      const { politeness = 'polite', clearAfter } = options;
      
      setAnnouncement({
        message,
        politeness,
        clearAfter,
      });
    },
    []
  );

  const clear = useCallback(() => {
    setAnnouncement({
      message: '',
      politeness: 'polite',
    });
  }, []);

  return {
    announce,
    clear,
    announcement,
  };
}
