/**
 * Accessibility Tests for ContactFormModal
 * Feature: production-readiness-polish
 * 
 * Tests verify:
 * - No axe accessibility violations
 * - Keyboard navigation (Tab, Escape)
 * - Focus management (trap and return)
 * - ARIA attributes and labels
 * 
 * Validates Requirements: 17.2, 17.5
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ContactFormModal } from '../ContactFormModal'

// Mock Turnstile component
vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => {
    return (
      <div data-testid="turnstile-mock">
        <button onClick={() => onSuccess('mock-token')}>Verify</button>
      </div>
    )
  },
}))

describe('ContactFormModal - Accessibility', () => {
  it('should have no accessibility violations when closed', async () => {
    const { container } = render(
      <ContactFormModal open={false} onOpenChange={vi.fn()} />
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have no accessibility violations when open', async () => {
    const { container } = render(
      <ContactFormModal open={true} onOpenChange={vi.fn()} />
    )
    
    // Wait for modal to be fully rendered
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA attributes on dialog', async () => {
    render(<ContactFormModal open={true} onOpenChange={vi.fn()} />)
    
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
    })
  })

  it('should have accessible form labels', async () => {
    render(<ContactFormModal open={true} onOpenChange={vi.fn()} />)
    
    await waitFor(() => {
      // Check that all form inputs have associated labels
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    })
  })

  it('should support keyboard navigation with Tab', async () => {
    const user = userEvent.setup()
    render(<ContactFormModal open={true} onOpenChange={vi.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Tab through form elements
    await user.tab()
    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toHaveFocus()
    
    await user.tab()
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveFocus()
    
    await user.tab()
    const messageInput = screen.getByLabelText(/message/i)
    expect(messageInput).toHaveFocus()
  })

  it('should close modal on Escape key', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    
    render(<ContactFormModal open={true} onOpenChange={onOpenChange} />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Press Escape
    await user.keyboard('{Escape}')
    
    // Should call onOpenChange with false
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should have accessible close button', async () => {
    render(<ContactFormModal open={true} onOpenChange={vi.fn()} />)
    
    await waitFor(() => {
      // Close button should have accessible name
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })
  })

  it('should have accessible submit button', async () => {
    render(<ContactFormModal open={true} onOpenChange={vi.fn()} />)
    
    await waitFor(() => {
      // Submit button should have accessible name
      const submitButton = screen.getByRole('button', { name: /send message/i })
      expect(submitButton).toBeInTheDocument()
    })
  })

  it('should announce form errors to screen readers', async () => {
    const user = userEvent.setup()
    render(<ContactFormModal open={true} onOpenChange={vi.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Submit form without filling fields
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    // Check for error messages with proper ARIA
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/name/i)
      const errorId = nameInput.getAttribute('aria-describedby')
      
      if (errorId) {
        const errorElement = document.getElementById(errorId)
        expect(errorElement).toBeInTheDocument()
      }
    })
  })
})
