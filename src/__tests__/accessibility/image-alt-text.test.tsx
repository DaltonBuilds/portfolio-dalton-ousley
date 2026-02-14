import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import HomePage from '@/app/page'
import BlogPage from '@/app/blog/page'
import ProjectsPage from '@/app/projects/page'
import ExperiencePage from '@/app/experience/page'
import { TestWrapper } from '../test-utils'

/**
 * Image Alt Text Accessibility Tests
 * 
 * These tests verify that all images have appropriate alt text:
 * - Content images have descriptive alt text
 * - Decorative images have empty alt="" attributes
 * 
 * Validates: Requirement 4.5
 */

describe('Image Alt Text - Home Page', () => {
  it('should have alt text for all images on home page', async () => {
    const { container } = render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'image-alt': { enabled: true },
      },
    })
    
    if (results.violations.length > 0) {
      console.log('Image alt text violations found on home page:')
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

describe('Image Alt Text - Blog Page', () => {
  it('should have alt text for all images on blog page', async () => {
    const { container } = render(
      <TestWrapper>
        <BlogPage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'image-alt': { enabled: true },
      },
    })
    
    if (results.violations.length > 0) {
      console.log('Image alt text violations found on blog page:')
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

describe('Image Alt Text - Projects Page', () => {
  it('should have alt text for all images on projects page', async () => {
    const { container } = render(
      <TestWrapper>
        <ProjectsPage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'image-alt': { enabled: true },
        'heading-order': { enabled: false }, // Only check image alt text
      },
    })
    
    if (results.violations.length > 0) {
      console.log('Image alt text violations found on projects page:')
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

describe('Image Alt Text - Experience Page', () => {
  it('should have alt text for all images on experience page', async () => {
    const { container } = render(
      <TestWrapper>
        <ExperiencePage />
      </TestWrapper>
    )
    const results = await axe(container, {
      rules: {
        'image-alt': { enabled: true },
      },
    })
    
    if (results.violations.length > 0) {
      console.log('Image alt text violations found on experience page:')
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
