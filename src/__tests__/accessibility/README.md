# Accessibility Testing

This directory contains automated accessibility tests for the portfolio site, ensuring WCAG 2.1 AA compliance.

## Test Files

### color-contrast.test.tsx
Tests color contrast compliance across all pages:
- Normal text: 4.5:1 minimum contrast ratio
- Large text (18pt+ or 14pt+ bold): 3:1 minimum contrast ratio
- UI components and graphical objects: 3:1 minimum contrast ratio

**Status**: ✅ All tests passing

### image-alt-text.test.tsx
Tests that all images have appropriate alt text:
- Content images have descriptive alt text
- Decorative images have empty alt="" attributes

**Status**: ✅ All tests passing

### semantic-html-aria.test.tsx
Tests semantic HTML structure and ARIA attributes:
- Single H1 per page
- Proper heading hierarchy
- Interactive elements have accessible names
- Icon buttons have ARIA labels
- Form inputs have associated labels
- Navigation landmarks have labels

**Status**: ⚠️ Some heading hierarchy issues on projects page (pre-existing)

## Running Tests

Run all accessibility tests:
```bash
npm test -- src/__tests__/accessibility/
```

Run specific test file:
```bash
npm test -- src/__tests__/accessibility/color-contrast.test.tsx
```

## Tools Used

- **axe-core**: Industry-standard accessibility testing engine
- **vitest-axe**: Vitest integration for axe-core
- **@testing-library/react**: React component testing utilities

## Color Tokens

The site uses CSS custom properties for colors, defined in `src/app/globals.css`:

### Light Mode
- Primary: `hsl(222.2 47.4% 11.2%)` - Dark blue-gray
- Primary Foreground: `hsl(210 40% 98%)` - Near white
- Background: `hsl(0 0% 100%)` - White
- Foreground: `hsl(222.2 84% 4.9%)` - Very dark blue

### Dark Mode
- Primary: `hsl(0 0% 98%)` - Near white
- Primary Foreground: `hsl(240 5.9% 10%)` - Very dark gray
- Background: `hsl(240 10% 3.9%)` - Very dark blue-gray
- Foreground: `hsl(0 0% 98%)` - Near white

All color combinations meet WCAG 2.1 AA contrast requirements.

## Image Alt Text Guidelines

When adding new images:

1. **Content Images**: Provide descriptive alt text that conveys the meaning/purpose
   ```tsx
   <Image src="/profile.jpg" alt="Dalton Ousley, DevOps Engineer" />
   ```

2. **Decorative Images**: Use empty alt attribute
   ```tsx
   <Image src="/decoration.svg" alt="" />
   ```

3. **Functional Images**: Describe the function, not the image
   ```tsx
   <Image src="/download-icon.svg" alt="Download CV" />
   ```

4. **Complex Images**: Consider using aria-describedby for detailed descriptions
   ```tsx
   <Image 
     src="/architecture.png" 
     alt="Kubernetes cluster architecture" 
     aria-describedby="arch-description"
   />
   <p id="arch-description" className="sr-only">
     Detailed description of the architecture...
   </p>
   ```

## Next Steps

- Fix heading hierarchy issues on projects page
- Add more comprehensive keyboard navigation tests
- Test with real screen readers (VoiceOver, NVDA, JAWS)
- Set up CI/CD accessibility checks
