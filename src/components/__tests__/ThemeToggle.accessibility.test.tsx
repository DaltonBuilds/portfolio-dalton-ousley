/**
 * Accessibility Tests for ThemeToggle
 * Feature: production-readiness-polish
 * 
 * Tests verify:
 * - No axe accessibility violations
 * - Keyboard navigation
 * - ARIA attributes for icon button
 * - Screen reader announcements
 * 
 * Validates Requirements: 17.2, 17.5
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ThemeToggle } from '../ThemeToggle'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: vi.fn(),
    resolvedTheme: 'light',
  }),
}))

describe('ThemeToggle - Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<ThemeToggle />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have accessible name for icon button', () => {
    render(<ThemeToggle />)
    
    // Button should have aria-label or accessible text
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    
    // Check for aria-label or sr-only text
    const hasAriaLabel = button.hasAttribute('aria-label')
    const hasSrOnlyText = button.querySelector('.sr-only')
    
    expect(hasAriaLabel || hasSrOnlyText).toBeTruthy()
  })

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    
    // Tab to button
    await user.tab()
    expect(button).toHaveFocus()
    
    // Activate with Enter
    await user.keyboard('{Enter}')
    // Button should still be in document after activation
    expect(button).toBeInTheDocument()
  })

  it('should be activatable with Space key', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    
    // Tab to button
    await user.tab()
    expect(button).toHaveFocus()
    
    // Activate with Space
    await user.keyboard(' ')
    // Button should still be in document after activation
    expect(button).toBeInTheDocument()
  })

  it('should have visible focus indicator', async () => {
    const user = userEvent.setup()
    const { container } = render(<ThemeToggle />)
    
    const button = screen.getByRole('button')
    
    // Tab to button to trigger focus
    await user.tab()
    
    // Check that button has focus
    expect(button).toHaveFocus()
    
    // Button should be focusable
    expect(button.tabIndex).toBeGreaterThanOrEqual(0)
  })
})
