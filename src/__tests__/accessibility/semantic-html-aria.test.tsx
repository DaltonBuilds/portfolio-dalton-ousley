/**
 * Property-Based Tests for Semantic HTML and ARIA
 * Feature: production-readiness-polish
 * 
 * These tests verify universal accessibility properties across the application:
 * - Property 1: Single H1 per page
 * - Property 2: Heading hierarchy
 * - Property 3: Interactive elements have accessible names
 * - Property 4: Icon buttons have ARIA labels
 * - Property 5: Form inputs have labels
 * - Property 6: Navigation landmarks have labels
 * 
 * Validates Requirements: 1.2, 1.3, 2.1, 2.2, 2.3, 2.5
 */

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import fc from 'fast-check'

// Import pages to test
import HomePage from '@/app/page'
import BlogPage from '@/app/blog/page'
import ProjectsPage from '@/app/projects/page'
import AboutPage from '@/app/about/page'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next/font/google', () => ({
  IBM_Plex_Mono: () => ({
    className: 'ibm-plex-mono',
  }),
}))

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
  }),
}))

vi.mock('@/contexts/ContactModalContext', () => ({
  ContactModalProvider: ({ children }: { children: React.ReactNode }) => children,
  useContactModal: () => ({
    openContactModal: vi.fn(),
    closeContactModal: vi.fn(),
  }),
}))

// Helper function to count h1 elements
function countH1Elements(container: HTMLElement): number {
  return container.querySelectorAll('h1').length
}

// Helper function to check heading hierarchy
function checkHeadingHierarchy(container: HTMLElement): { valid: boolean; error?: string } {
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  
  if (headings.length === 0) {
    return { valid: true }
  }
  
  let previousLevel = 0
  
  for (const heading of headings) {
    const currentLevel = parseInt(heading.tagName.substring(1))
    
    // First heading should be h1
    if (previousLevel === 0 && currentLevel !== 1) {
      return { 
        valid: false, 
        error: `First heading should be h1, but found ${heading.tagName}` 
      }
    }
    
    // Check for skipped levels (e.g., h1 -> h3)
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      return { 
        valid: false, 
        error: `Heading hierarchy skipped from h${previousLevel} to h${currentLevel}` 
      }
    }
    
    previousLevel = currentLevel
  }
  
  return { valid: true }
}

// Helper function to check if interactive elements have accessible names
function checkInteractiveElementsAccessibility(container: HTMLElement): { valid: boolean; error?: string } {
  const interactiveElements = container.querySelectorAll('button, a, input, textarea, select')
  
  for (const element of Array.from(interactiveElements)) {
    const tagName = element.tagName.toLowerCase()
    
    // Skip hidden elements
    if (element.hasAttribute('aria-hidden') || element.classList.contains('sr-only')) {
      continue
    }
    
    // Check for accessible name
    const hasTextContent = element.textContent?.trim().length > 0
    const hasAriaLabel = element.hasAttribute('aria-label')
    const hasAriaLabelledBy = element.hasAttribute('aria-labelledby')
    const hasAlt = element.hasAttribute('alt')
    const hasTitle = element.hasAttribute('title')
    
    // For inputs, check for associated label
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
      const id = element.getAttribute('id')
      const hasLabel = id && container.querySelector(`label[for="${id}"]`)
      const isWrappedInLabel = element.closest('label')
      
      if (!hasLabel && !isWrappedInLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        return {
          valid: false,
          error: `${tagName} element without accessible name found`
        }
      }
    } else {
      // For buttons and links
      if (!hasTextContent && !hasAriaLabel && !hasAriaLabelledBy && !hasAlt && !hasTitle) {
        return {
          valid: false,
          error: `${tagName} element without accessible name found`
        }
      }
    }
  }
  
  return { valid: true }
}

// Helper function to check if icon buttons have ARIA labels
function checkIconButtonsHaveAriaLabels(container: HTMLElement): { valid: boolean; error?: string } {
  const buttons = container.querySelectorAll('button')
  
  for (const button of Array.from(buttons)) {
    // Check if button has only icon content (no text)
    const hasOnlyIcon = button.querySelector('svg') && !button.textContent?.trim()
    
    if (hasOnlyIcon) {
      const hasAriaLabel = button.hasAttribute('aria-label')
      const hasAriaLabelledBy = button.hasAttribute('aria-labelledby')
      const hasSrOnlyText = button.querySelector('.sr-only')
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasSrOnlyText) {
        return {
          valid: false,
          error: 'Icon button without ARIA label found'
        }
      }
    }
  }
  
  return { valid: true }
}

// Helper function to check if navigation landmarks have labels
function checkNavigationLandmarksHaveLabels(container: HTMLElement): { valid: boolean; error?: string } {
  const navElements = container.querySelectorAll('nav')
  
  // If there are multiple nav elements, they should have aria-label
  if (navElements.length > 1) {
    for (const nav of Array.from(navElements)) {
      const hasAriaLabel = nav.hasAttribute('aria-label')
      const hasAriaLabelledBy = nav.hasAttribute('aria-labelledby')
      
      if (!hasAriaLabel && !hasAriaLabelledBy) {
        return {
          valid: false,
          error: 'Navigation landmark without aria-label found (multiple nav elements present)'
        }
      }
    }
  }
  
  return { valid: true }
}

// Define page components for property-based testing
const pageComponents = [
  { name: 'HomePage', component: HomePage },
  { name: 'BlogPage', component: BlogPage },
  { name: 'ProjectsPage', component: ProjectsPage },
  { name: 'AboutPage', component: AboutPage },
]

describe('Semantic HTML and ARIA Properties', () => {
  describe('Property 1: Single H1 per page', () => {
    /**
     * **Validates: Requirements 1.2**
     * 
     * Property: For any page route in the application, the rendered HTML 
     * should contain exactly one h1 element.
     */
    it('should have exactly one h1 element across all pages (property-based)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...pageComponents),
          (page) => {
            const { container } = render(<page.component />)
            const h1Count = countH1Elements(container)
            
            // Property: exactly one h1 per page
            expect(h1Count).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have exactly one h1 element on home page', () => {
      const { container } = render(<HomePage />)
      const h1Count = countH1Elements(container)
      expect(h1Count).toBe(1)
    })

    it('should have exactly one h1 element on blog page', () => {
      const { container } = render(<BlogPage />)
      const h1Count = countH1Elements(container)
      expect(h1Count).toBe(1)
    })

    it('should have exactly one h1 element on projects page', () => {
      const { container } = render(<ProjectsPage />)
      const h1Count = countH1Elements(container)
      expect(h1Count).toBe(1)
    })

    it('should have exactly one h1 element on about page', () => {
      const { container } = render(<AboutPage />)
      const h1Count = countH1Elements(container)
      expect(h1Count).toBe(1)
    })
  })

  describe('Property 2: Heading hierarchy integrity', () => {
    /**
     * **Validates: Requirements 1.3**
     * 
     * Property: For any page route in the application, all heading elements (h1-h6) 
     * should follow proper hierarchy without skipping levels (e.g., h1 → h2 → h3, never h1 → h3).
     */
    it('should maintain proper heading hierarchy across all pages (property-based)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...pageComponents),
          (page) => {
            const { container } = render(<page.component />)
            const result = checkHeadingHierarchy(container)
            
            // Property: no skipped heading levels
            if (!result.valid) {
              console.error(`Heading hierarchy error on ${page.name}:`, result.error)
            }
            expect(result.valid).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain proper heading hierarchy on home page', () => {
      const { container } = render(<HomePage />)
      const result = checkHeadingHierarchy(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Heading hierarchy error:', result.error)
      }
    })

    it('should maintain proper heading hierarchy on blog page', () => {
      const { container } = render(<BlogPage />)
      const result = checkHeadingHierarchy(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Heading hierarchy error:', result.error)
      }
    })

    it('should maintain proper heading hierarchy on projects page', () => {
      const { container } = render(<ProjectsPage />)
      const result = checkHeadingHierarchy(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Heading hierarchy error:', result.error)
      }
    })

    it('should maintain proper heading hierarchy on about page', () => {
      const { container } = render(<AboutPage />)
      const result = checkHeadingHierarchy(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Heading hierarchy error:', result.error)
      }
    })
  })

  describe('Property 3: Interactive elements have accessible names', () => {
    /**
     * **Validates: Requirements 2.1**
     * 
     * Property: For any interactive element (button, link, input) in the application, 
     * the element should have an accessible name (via text content, aria-label, 
     * aria-labelledby, or alt text).
     */
    it('should ensure all interactive elements have accessible names across all pages (property-based)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...pageComponents),
          (page) => {
            const { container } = render(<page.component />)
            const result = checkInteractiveElementsAccessibility(container)
            
            // Property: all interactive elements have accessible names
            if (!result.valid) {
              console.error(`Accessibility error on ${page.name}:`, result.error)
            }
            expect(result.valid).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should ensure all interactive elements have accessible names on home page', () => {
      const { container } = render(<HomePage />)
      const result = checkInteractiveElementsAccessibility(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Accessibility error:', result.error)
      }
    })

    it('should ensure all interactive elements have accessible names on blog page', () => {
      const { container } = render(<BlogPage />)
      const result = checkInteractiveElementsAccessibility(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Accessibility error:', result.error)
      }
    })
  })

  describe('Property 4: Icon buttons have ARIA labels', () => {
    /**
     * **Validates: Requirements 2.2**
     * 
     * Property: For any button element without visible text content, 
     * the button should have an aria-label or aria-labelledby attribute.
     */
    it('should ensure icon buttons have ARIA labels across all pages (property-based)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...pageComponents),
          (page) => {
            const { container } = render(<page.component />)
            const result = checkIconButtonsHaveAriaLabels(container)
            
            // Property: icon buttons have ARIA labels
            if (!result.valid) {
              console.error(`Icon button accessibility error on ${page.name}:`, result.error)
            }
            expect(result.valid).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should ensure icon buttons have ARIA labels on home page', () => {
      const { container } = render(<HomePage />)
      const result = checkIconButtonsHaveAriaLabels(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Icon button accessibility error:', result.error)
      }
    })
  })

  describe('Property 5: Form inputs have labels', () => {
    /**
     * **Validates: Requirements 2.3**
     * 
     * Property: For any form input element, the input should be associated 
     * with a visible label element (via htmlFor/id or wrapping label).
     */
    it('should ensure form inputs have labels across all pages (property-based)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...pageComponents),
          (page) => {
            const { container } = render(<page.component />)
            const inputs = container.querySelectorAll('input, textarea, select')
            
            for (const input of Array.from(inputs)) {
              // Skip hidden inputs
              if (input.getAttribute('type') === 'hidden') {
                continue
              }
              
              const id = input.getAttribute('id')
              const hasLabel = id && container.querySelector(`label[for="${id}"]`)
              const isWrappedInLabel = input.closest('label')
              const hasAriaLabel = input.hasAttribute('aria-label')
              const hasAriaLabelledBy = input.hasAttribute('aria-labelledby')
              
              // Property: input has associated label
              const hasAccessibleLabel = hasLabel || isWrappedInLabel || hasAriaLabel || hasAriaLabelledBy
              
              if (!hasAccessibleLabel) {
                console.error(`Form input without label on ${page.name}:`, input.outerHTML.substring(0, 100))
              }
              expect(hasAccessibleLabel).toBe(true)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 6: Navigation landmarks have labels', () => {
    /**
     * **Validates: Requirements 2.5**
     * 
     * Property: For any nav element in the application, when multiple nav elements exist,
     * the element should have an aria-label attribute to distinguish it from other navigation regions.
     */
    it('should ensure navigation landmarks have labels when multiple exist (property-based)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...pageComponents),
          (page) => {
            const { container } = render(<page.component />)
            const result = checkNavigationLandmarksHaveLabels(container)
            
            // Property: multiple nav elements have aria-label
            if (!result.valid) {
              console.error(`Navigation landmark error on ${page.name}:`, result.error)
            }
            expect(result.valid).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should ensure navigation landmarks have labels when multiple nav elements exist', () => {
      const { container } = render(<HomePage />)
      const result = checkNavigationLandmarksHaveLabels(container)
      expect(result.valid).toBe(true)
      if (!result.valid) {
        console.error('Navigation landmark error:', result.error)
      }
    })
  })
})
