# Playwright Test Suite

Comprehensive end-to-end regression tests for SoberLife III using Playwright.

## Overview

This test suite provides automated browser testing across multiple viewports and devices, with a focus on mobile testing since that's the most played display mode.

## Test Files

### `game-modes.spec.js`
Tests for all three game modes:
- Game mode selection screen
- Campaign mode navigation and UI
- Jump Into Task mode with survey
- Free Play mode direct gameplay

### `gameplay.spec.js`
Core gameplay mechanics:
- Blackjack card dealing and scoring
- Hit and stand button functionality
- Stress management system
- Zen activities panel
- Task progression
- Game over and success screens

### `shop-system.spec.js`
Shop and progression features:
- Shop opening and navigation
- Joker deck upgrades
- Premium activity purchases
- Mind Palace modal
- Deck composition display

### `mobile.spec.js`
Mobile-specific tests (primary focus):
- iPhone SE viewport (375x667)
- iPad tablet viewport (768x1024)
- Landscape orientation
- Touch-friendly button sizes
- Responsive layout
- No horizontal scroll
- Readable text sizes

### `accessibility.spec.js`
Accessibility compliance:
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Semantic HTML
- Screen reader support
- Form labels and error messages

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests (Non-Interactive)
```bash
npm test
```
Tests run in non-interactive mode by default, outputting results to the console. The HTML report is generated but not automatically opened.

### View HTML Report
```bash
npm run test:report
```
Opens the detailed HTML report in your browser after tests have completed.

### Run Tests in Headed Mode (see browser)
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Mobile Tests Only
```bash
npm run test:mobile
```

### Run Specific Test File
```bash
npx playwright test tests/playwright/mobile.spec.js
```

## Test Configuration

Tests are configured in `playwright.config.js` with:

- **Base URL**: http://localhost:8000
- **Projects**: 
  - Desktop Chrome
  - Mobile (iPhone 12)
  - Tablet (iPad Pro)
- **Web Server**: Automatically starts local server on port 8000
- **Screenshots**: Captured on failure
- **Traces**: Captured on first retry
- **Retries**: 2 retries in CI, 0 locally

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to main/master branch
- Pull requests

The workflow:
1. Installs Node.js and dependencies
2. Installs Playwright browsers
3. Runs validation checks
4. Runs Node.js unit tests
5. Runs Playwright e2e tests
6. Uploads test reports as artifacts

## Mobile Testing Focus

Since mobile is the most played display mode, mobile tests cover:

### Viewport Sizes Tested
- **iPhone SE**: 375x667 (portrait)
- **iPhone SE Landscape**: 667x375
- **iPad**: 768x1024 (portrait)

### Mobile-Specific Checks
- ✅ Touch-friendly button sizes (minimum 40x40px)
- ✅ No horizontal scroll
- ✅ Readable text (minimum 16px)
- ✅ Proper layout stacking
- ✅ Modal and overlay behavior
- ✅ Card display and readability
- ✅ Form input accessibility

## Writing New Tests

Follow these patterns:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Setup steps
  });

  test('should do something', async ({ page }) => {
    // Test steps
    await expect(page.locator('#element')).toBeVisible();
  });
});
```

### Best Practices
- Use descriptive test names
- Test user flows, not implementation
- Focus on visible behavior
- Use semantic locators (role, text)
- Test mobile viewports
- Include accessibility checks
- Keep tests independent

## Debugging Failed Tests

### View Test Report
```bash
npm run test:report
# or
npx playwright show-report
```

### Run Single Test in Debug Mode
```bash
npx playwright test --debug tests/playwright/mobile.spec.js
```

### View Screenshots
Failed test screenshots are saved in `test-results/`

### View Traces
Traces are captured on first retry and can be viewed with:
```bash
npx playwright show-trace trace.zip
```

## Automation-Friendly Testing

Tests are configured to run in non-interactive mode by default, making them suitable for:
- **CI/CD pipelines**: No user input required
- **Automated testing**: Results output directly to console
- **Agent workflows**: AI agents can consume test results immediately
- **Batch testing**: Run multiple test suites without interruption

The HTML report is always generated but only opened when explicitly requested with `npm run test:report`.

## Test Coverage

Current test coverage includes:

### Core Features
- ✅ All three game modes
- ✅ Survey system
- ✅ Blackjack gameplay
- ✅ Stress management
- ✅ Zen activities
- ✅ Task progression
- ✅ Campaign system
- ✅ Shop and upgrades
- ✅ Mind Palace

### Mobile Support
- ✅ Portrait orientation
- ✅ Landscape orientation
- ✅ Tablet sizes
- ✅ Touch interactions
- ✅ Responsive layouts

### Accessibility
- ✅ Keyboard navigation
- ✅ ARIA attributes
- ✅ Focus management
- ✅ Screen reader support
- ✅ Form accessibility

## Continuous Improvement

To add new tests:
1. Create test file in `tests/playwright/`
2. Follow existing patterns
3. Include mobile viewport tests
4. Add accessibility checks
5. Update this README
6. Run tests locally before committing

## Troubleshooting

### Tests Timing Out
- Increase timeout in test: `test.setTimeout(60000)`
- Check if server is starting properly
- Verify network conditions

### Element Not Found
- Use `await page.waitForSelector('#element')`
- Check if element is in viewport
- Verify element exists in HTML

### Flaky Tests
- Add explicit waits
- Use `waitForLoadState('networkidle')`
- Check for race conditions
- Increase retry count

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
