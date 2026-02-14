import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import HomePage from '@/app/page'
import BlogPage from '@/app/blog/page'
import ProjectsPage from '@/app/projects/page'
import ExperiencePage from '@/app/experience/page'
import { TestWrapper } from '../test-utils'

/**
 * Color Contrast Accessibility Tests
 * 
 * These tests verify WCAG 2.1 AA color contrast requirements:
 * - Normal text: 4.5:1 minimum contrast ratio
 * - Large text (18pt+ or 14pt+ bold): 3:1 minimum contrast ratio
 * - UI components and graphical objects: 3:1 minimum contrast ratio
 * 
 * Validates: Requirements 4.1, 4.2, 4.3
 */

describe('Color Contrast - Home Page', () => {
  it('should have no color contrast violations on home page', async () => {
    const { container } = render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    })
    
    // Check for violations
    if (results.violations.length > 0) {
      console.log('Color contrast violations found on home page:')
      results.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`)
        console.log(`  Impact: ${violation.impact}`)
        console.log(`  Nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node) => {
          console.log(`    - ${node.html}`)
          console.log(`      ${node.failureSummary}`)
        })
      })
    }
    
    expect(results.violations).toHaveLength(0)
  })
})

describe('Color Contrast - Blog Page', () => {
  it('should have no color contrast violations on blog page', async () => {
    const { container } = render(
      <TestWrapper>
        <BlogPage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    })
    
    if (results.violations.length > 0) {
      console.log('Color contrast violations found on blog page:')
      results.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`)
        console.log(`  Impact: ${violation.impact}`)
        console.log(`  Nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node) => {
          console.log(`    - ${node.html}`)
          console.log(`      ${node.failureSummary}`)
        })
      })
    }
    
    expect(results.violations).toHaveLength(0)
  })
})

describe('Color Contrast - Projects Page', () => {
  it('should have no color contrast violations on projects page', async () => {
    const { container } = render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'heading-order': { enabled: false }, // Only check color contrast
      },
    })
    
    if (results.violations.length > 0) {
      console.log('Color contrast violations found on projects page:')
      results.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`)
        console.log(`  Impact: ${violation.impact}`)
        console.log(`  Nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node) => {
          console.log(`    - ${node.html}`)
          console.log(`      ${node.failureSummary}`)
        })
      })
    }
    
    expect(results.violations).toHaveLength(0)
  })
})

describe('Color Contrast - Experience Page', () => {
  it('should have no color contrast violations on experience page', async () => {
    const { container } = render(
      <TestWrapper>
        <ExperiencePage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    })
    
    if (results.violations.length > 0) {
      console.log('Color contrast violations found on experience page:')
      results.violations.forEach((violation) => {
        console.log(`- ${violation.id}: ${violation.description}`)
        console.log(`  Impact: ${violation.impact}`)
        console.log(`  Nodes: ${violation.nodes.length}`)
        violation.nodes.forEach((node) => {
          console.log(`    - ${node.html}`)
          console.log(`      ${node.failureSummary}`)
        })
      })
    }
    
    expect(results.violations).toHaveLength(0)
  })
})
