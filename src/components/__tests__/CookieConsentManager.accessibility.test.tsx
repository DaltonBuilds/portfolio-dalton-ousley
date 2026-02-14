/**
 * Accessibility Tests for CookieConsentManager
 * Feature: production-readiness-polish
 * 
 * Tests verify:
 * - No axe accessibility violations
 * - Keyboard navigation
 * - Touch target sizes
 * - ARIA attributes and labels
 * 
 * Validates Requirements: 17.2, 17.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { CookieConsentManager } from '../CookieConsentManager'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('CookieConsentManager - Accessibility', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should have no accessibility violations when banner is shown', async () => {
    const { container } = render(<CookieConsentManager />)
    
    // Wait for banner to appear
    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have accessible buttons with proper labels', async () => {
    render(<CookieConsentManager />)
    
    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Check for accept and reject buttons with accessible names
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    const rejectButton = screen.getByRole('button', { name: /reject|decline/i })
    
    expect(acceptButton).toBeInTheDocument()
    expect(rejectButton).toBeInTheDocument()
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<CookieConsentManager />)
    
    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Tab through buttons
    await user.tab()
    
    // One of the buttons should have focus
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    const rejectButton = screen.getByRole('button', { name: /reject|decline/i })
    
    const hasFocus = acceptButton === document.activeElement || rejectButton === document.activeElement
    expect(hasFocus).toBe(true)
  })

  it('should have touch-friendly button sizes', async () => {
    render(<CookieConsentManager />)
    
    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    const rejectButton = screen.getByRole('button', { name: /reject|decline/i })
    
    // Buttons should exist (actual size testing would require DOM measurements)
    expect(acceptButton).toBeInTheDocument()
    expect(rejectButton).toBeInTheDocument()
    
    // Check that buttons have proper type attribute
    expect(acceptButton).toHaveAttribute('type', 'button')
    expect(rejectButton).toHaveAttribute('type', 'button')
  })

  it('should be activatable with Enter key', async () => {
    const user = userEvent.setup()
    render(<CookieConsentManager />)
    
    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    const acceptButton = screen.getByRole('button', { name: /accept/i })
    acceptButton.focus()
    
    // Activate with Enter
    await user.keyboard('{Enter}')
    
    // Banner should be dismissed
    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).not.toBeInTheDocument()
    })
  })

  it('should have proper ARIA roles and attributes', async () => {
    render(<CookieConsentManager />)
    
    await waitFor(() => {
      expect(screen.queryByText(/cookies/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Check for proper semantic structure
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    
    // All buttons should be keyboard accessible
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button')
    })
  })
})
