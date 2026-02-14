# Accessibility Testing Infrastructure

This document describes the accessibility testing infrastructure for the portfolio site.

## Overview

The accessibility testing strategy follows a multi-layered approach:

1. **Automated axe-core tests** - Run during development and CI/CD
2. **Property-based tests** - Verify universal accessibility properties
3. **Component-level tests** - Test individual components for accessibility
4. **Lighthouse CI** - Automated accessibility audits on every commit
5. **Manual testing** - Screen reader and keyboard navigation testing

## Tools

### axe-core
- Industry-standard accessibility testing engine
- Tests against WCAG 2.1 Level A and AA standards
- Integrated via `vitest-axe` package

### vitest-axe
- Custom Vitest matchers for axe-core
- Provides `toHaveNoViolations()` matcher
- Configured in `vitest.setup.ts`

### Lighthouse CI
- Automated accessibility audits
- Minimum score: 90/100
- Runs on every pull request and push to main

## Running Tests

### Run all accessibility tests
```bash
npm test -- src/__tests__/accessibility/
```

### Run component accessibility tests
```bash
npm test -- src/components/__tests__/*.accessibility.test.tsx
```

### Run specific test file
```bash
npm test -- src/__tests__/accessibility/semantic-html-aria.test.tsx
```

### Run tests in watch mode
```bash
npm run test:watch
```

## Test Structure

### Property-Based Tests
Located in `src/__tests__/accessibility/`, these tests verify universal properties:

- **semantic-html-aria.test.tsx** - Tests HTML structure and ARIA attributes
  - Property 1: Single H1 per page
  - Property 2: Heading hierarchy
  - Property 3: Interactive elements have accessible names
  - Property 4: Icon buttons have ARIA labels
  - Property 5: Form inputs have labels
  - Property 6: Navigation landmarks have labels

- **color-contrast.test.tsx** - Tests color contrast ratios
  - Property 11: Color contrast compliance (WCAG AA)

- **image-alt-text.test.tsx** - Tests image accessibility
  - Property 12: Images have alt text

### Component Accessibility Tests
Located in `src/components/__tests__/`, these test individual components:

- **ContactFormModal.accessibility.test.tsx**
  - No axe violations
  - Keyboard navigation (Tab, Escape)
  - Focus management
  - ARIA attributes
  - Screen reader announcements

- **ThemeToggle.accessibility.test.tsx**
  - No axe violations
  - Keyboard navigation
  - Icon button ARIA labels
  - Focus indicators

- **CookieConsentManager.accessibility.test.tsx**
  - No axe violations
  - Keyboard navigation
  - Touch target sizes
  - ARIA attributes

- **ErrorBoundary.test.tsx** (includes accessibility tests)
  - No axe violations in fallback UI
  - Accessible retry button
  - Proper heading hierarchy

## CI/CD Integration

### GitHub Actions Workflows

#### Accessibility Tests Workflow
File: `.github/workflows/accessibility-tests.yml`

Runs on every pull request and push to main:
1. Installs dependencies
2. Runs all accessibility tests
3. Runs component accessibility tests
4. Generates accessibility report
5. Fails build on critical violations

#### Lighthouse CI Workflow
File: `.github/workflows/lighthouse-ci.yml`

Runs Lighthouse audits on every pull request and push to main:
1. Builds the application
2. Runs Lighthouse CI on multiple pages
3. Asserts minimum accessibility score of 90
4. Fails build if score is below threshold
5. Uploads results as artifacts

## Configuration

### vitest.setup.ts
```typescript
import * as matchers from 'vitest-axe/matchers'
import { expect } from 'vitest'
import { configureAxe } from 'vitest-axe'

// Extend Vitest's expect with axe matchers
expect.extend(matchers)

// Configure axe with WCAG 2.1 AA rules
const axe = configureAxe({
  globalOptions: {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
    }
  },
})
```

### lighthouserc.json
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

## Writing Accessibility Tests

### Basic axe test
```typescript
import { axe } from 'vitest-axe'

it('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Testing keyboard navigation
```typescript
import userEvent from '@testing-library/user-event'

it('should be keyboard accessible', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)
  
  const button = screen.getByRole('button')
  await user.tab()
  expect(button).toHaveFocus()
  
  await user.keyboard('{Enter}')
  // Assert expected behavior
})
```

### Testing ARIA attributes
```typescript
it('should have proper ARIA attributes', () => {
  render(<MyComponent />)
  
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveAttribute('aria-labelledby')
  expect(dialog).toHaveAttribute('aria-describedby')
})
```

### Testing screen reader announcements
```typescript
it('should announce errors to screen readers', async () => {
  render(<MyForm />)
  
  // Trigger validation error
  const submitButton = screen.getByRole('button', { name: /submit/i })
  await user.click(submitButton)
  
  // Check for aria-live region
  const liveRegion = screen.getByRole('status')
  expect(liveRegion).toHaveTextContent(/error/i)
})
```

## Manual Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are reachable via Tab
- [ ] Tab order follows visual layout
- [ ] Focus indicators are visible
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dismisses overlays
- [ ] Arrow keys work in custom widgets (if applicable)

### Screen Reader Testing
- [ ] Test with VoiceOver (macOS) or NVDA (Windows)
- [ ] All content is announced correctly
- [ ] Interactive elements have clear labels
- [ ] Form errors are announced
- [ ] Dynamic content updates are announced
- [ ] Landmarks are properly labeled

### Visual Testing
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Focus indicators are visible
- [ ] Text is readable at 200% zoom
- [ ] Content reflows properly at different viewport sizes
- [ ] No information conveyed by color alone

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Testing Library Accessibility](https://testing-library.com/docs/queries/about/#priority)
- [Lighthouse Accessibility Scoring](https://web.dev/accessibility-scoring/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

## Troubleshooting

### Tests failing with "toHaveNoViolations is not a function"
Ensure `vitest.setup.ts` is properly configured and included in `vitest.config.ts`:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

### Lighthouse CI failing
Check the Lighthouse results artifact in GitHub Actions for detailed information about which accessibility checks failed.

### False positives
If axe-core reports a false positive, you can disable specific rules:
```typescript
const results = await axe(container, {
  rules: {
    'color-contrast': { enabled: false } // Only if truly a false positive
  }
})
```

## Maintenance

- Review and update accessibility tests when adding new components
- Run manual screen reader tests before major releases
- Keep axe-core and vitest-axe packages up to date
- Monitor Lighthouse CI scores and address regressions promptly
- Update this documentation as the testing strategy evolves
