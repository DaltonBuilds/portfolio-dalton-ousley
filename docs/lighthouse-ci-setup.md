# Lighthouse CI Setup and Usage

This document explains how to use Lighthouse CI for performance and accessibility monitoring in the portfolio site.

## Overview

Lighthouse CI is configured to run automated audits on every pull request and push to main/master branches. It measures:

- **Performance**: Core Web Vitals (LCP, CLS, TBT, etc.)
- **Accessibility**: WCAG compliance and best practices
- **Best Practices**: Security, modern web standards
- **SEO**: Search engine optimization

## Configuration

The Lighthouse CI configuration is defined in `lighthouserc.json`:

### Performance Thresholds

- **Performance Score**: Minimum 90/100
- **Accessibility Score**: Minimum 90/100
- **First Contentful Paint (FCP)**: < 2.0s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### Audited Pages

The following pages are audited on each run:
- Home page (`/`)
- About page (`/about`)
- Experience page (`/experience`)
- Projects page (`/projects`)
- Blog page (`/blog`)

## Local Usage

### Run Full Lighthouse CI Audit

```bash
npm run lighthouse
```

This command:
1. Builds the production application
2. Starts the production server
3. Runs Lighthouse audits on all configured pages (3 runs each)
4. Asserts against defined thresholds
5. Uploads results to temporary public storage

### Collect Metrics Only

```bash
npm run lighthouse:collect
```

Runs Lighthouse audits without asserting against thresholds.

### Assert Against Thresholds

```bash
npm run lighthouse:assert
```

Checks collected metrics against defined thresholds (requires prior collection).

## CI/CD Integration

Lighthouse CI runs automatically on:
- Pull requests to main/master
- Pushes to main/master

### GitHub Actions Workflow

The workflow (`.github/workflows/lighthouse-ci.yml`):
1. Checks out code
2. Installs dependencies
3. Builds the application
4. Runs Lighthouse CI
5. Uploads results as artifacts

### Viewing Results

Results are available in:
1. **GitHub Actions**: Check the workflow run for detailed logs
2. **Artifacts**: Download the `lighthouse-results` artifact for HTML reports
3. **Temporary Public Storage**: View results at the URL provided in the workflow logs

## Interpreting Results

### Performance Metrics

- **LCP (Largest Contentful Paint)**: Time until the largest content element is visible
  - Good: < 2.5s
  - Needs Improvement: 2.5s - 4.0s
  - Poor: > 4.0s

- **FID (First Input Delay)**: Time from first user interaction to browser response
  - Good: < 100ms
  - Needs Improvement: 100ms - 300ms
  - Poor: > 300ms

- **CLS (Cumulative Layout Shift)**: Visual stability during page load
  - Good: < 0.1
  - Needs Improvement: 0.1 - 0.25
  - Poor: > 0.25

### Accessibility Metrics

Lighthouse checks for:
- Proper heading hierarchy
- ARIA attributes
- Color contrast ratios
- Keyboard navigation
- Form labels
- Image alt text

## Troubleshooting

### Build Fails on Lighthouse CI

1. Check that the application builds successfully: `npm run build`
2. Verify the production server starts: `npm run start`
3. Review Lighthouse CI logs for specific assertion failures

### Performance Threshold Failures

If performance scores fall below thresholds:

1. **Review the Lighthouse report** for specific recommendations
2. **Check bundle size**: Run `npm run build:analyze`
3. **Optimize images**: Ensure all images use Next.js Image component
4. **Review code splitting**: Check for large client-side bundles
5. **Analyze Web Vitals**: Check browser console for real-time metrics

### Accessibility Threshold Failures

If accessibility scores fall below thresholds:

1. **Review the Lighthouse report** for specific violations
2. **Run axe-core tests**: `npm test` to catch issues early
3. **Test with screen reader**: Verify keyboard navigation and ARIA labels
4. **Check color contrast**: Use browser DevTools to verify contrast ratios

## Customization

### Adjusting Thresholds

Edit `lighthouserc.json` to modify thresholds:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]
      }
    }
  }
}
```

### Adding More Pages

Add URLs to the `collect.url` array in `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/new-page"
      ]
    }
  }
}
```

### Mobile vs Desktop

The current configuration uses desktop preset. To test mobile:

```json
{
  "ci": {
    "collect": {
      "settings": {
        "preset": "mobile"
      }
    }
  }
}
```

## Best Practices

1. **Run locally before pushing**: Catch issues early with `npm run lighthouse`
2. **Monitor trends**: Track performance over time, not just absolute scores
3. **Fix regressions quickly**: Address performance drops in the same PR
4. **Balance thresholds**: Set realistic thresholds that encourage improvement
5. **Document exceptions**: If a threshold must be relaxed, document why

## Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring Guide](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
