import React from 'react'
import { ContactModalProvider } from '@/contexts/ContactModalContext'

/**
 * Test wrapper that provides necessary context providers
 */
export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      {children}
    </ContactModalProvider>
  )
}
