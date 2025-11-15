---
inclusion: always
---

# Testing Guidelines

## Overview

SoberLife III uses Playwright for automated end-to-end testing to ensure quality and prevent regressions. All developers and AI agents should run tests before committing changes.

## Quick Start

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests with visible browser (helpful for debugging)
npm run test:headed

# Run mobile-specific tests
npm run test:mobile
```

## When to Run Tests

### Required Testing Scenarios

1. **Before Every Commit**
   - Run full test suite: `npm test`
   - Fix any failing tests before pushing
   - Add new tests for new features

2. **After UI Changes**
   - Run mobile tests: `npm run test:mobile`
   - Verify responsive design works
   - Check accessibility compliance

3. **After State Management Changes**
   - Test campaign progression flows
   - Verify zen points persistence
   - Check localStorage handling

4. **After Adding New Features**
   - Write tests for new functionality
   - Update existing tests if behavior changed
   - Run full suite to catch regressions

## Test Structure

### Test Files Location
```
tests/playwright/
├── game-modes.spec.js      # Game mode selection and navigation
├── gameplay.spec.js        # Blackjack mechanics and stress management
├── shop-system.spec.js     # Shop and Mind Palace features
├── mobile.spec.js          # Mobile viewport testing
├── accessibility.spec.js   # Accessibility compliance
└── README.md              # Detailed testing documentation
```

### Test Organization

Each test file follows this pattern:
```javascript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Setup steps
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
    await expect(page.locator('#element')).toBeVisible();
  });
});
```

## Writing New Tests

### Best Practices

1. **Use Semantic Locators**
   ```javascript
   // Good - semantic and stable
   await page.getByRole('button', { name: /Start Campaign/i })
   
   // Avoid - brittle and implementation-specific
   await page.locator('.mode-btn:nth-child(2)')
   ```

2. **Test User Behavior, Not Implementation**
   ```javascript
   // Good - tests what user sees
   await expect(page.locator('#zenPoints')).toContainText('Zen Points:')
   
   // Avoid - tests internal state
   expect(gameState.zenPoints).toBe(100)
   ```

3. **Include Mobile Testing**
   ```javascript
   test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE
   ```

4. **Add Accessibility Checks**
   ```javascript
   await expect(button).toHaveAttribute('aria-label');
   await expect(modal).toHaveAttribute('role', 'dialog');
   ```

### Adding Tests for New Features

When adding a new feature:

1. **Create test in appropriate spec file**
   - Game modes → `game-modes.spec.js`
   - Gameplay mechanics → `gameplay.spec.js`
   - Shop/upgrades → `shop-system.spec.js`
   - Mobile-specific → `mobile.spec.js`

2. **Test the happy path first**
   ```javascript
   test('should complete new feature flow', async ({ page }) => {
     // Navigate to feature
     // Interact with feature
     // Verify expected outcome
   });
   ```

3. **Add edge cases**
   ```javascript
   test('should handle error when feature fails', async ({ page }) => {
     // Trigger error condition
     // Verify error handling
   });
   ```

4. **Test mobile viewport**
   ```javascript
   test('should work on mobile', async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     // Test feature on mobile
   });
   ```

## Maintaining Tests

### When Tests Fail

1. **Understand the failure**
   - Read the error message carefully
   - Check the screenshot in `test-results/`
   - Review the test trace if available

2. **Determine if it's a real bug**
   - Does the app actually work correctly?
   - Is the test checking the right thing?
   - Did the UI change intentionally?

3. **Fix appropriately**
   - If bug: Fix the code, verify test passes
   - If test is wrong: Update test to match new behavior
   - If selector changed: Update locator in test

### Updating Tests After Changes

**UI Changes:**
```javascript
// Old selector no longer works
await page.locator('.old-class-name')

// Update to new selector
await page.locator('.new-class-name')
// Or better, use semantic selector
await page.getByRole('button', { name: /Button Text/i })
```

**Behavior Changes:**
```javascript
// Old expectation
await expect(page.locator('#result')).toContainText('Old Message')

// Update to new expectation
await expect(page.locator('#result')).toContainText('New Message')
```

**New Features:**
```javascript
// Add new test for new feature
test('should use new feature', async ({ page }) => {
  await page.getByRole('button', { name: /New Feature/i }).click();
  await expect(page.locator('#newFeature')).toBeVisible();
});
```

## Mobile Testing Priority

Mobile is the most played display mode, so mobile testing is critical:

### Mobile Viewports Tested
- **iPhone SE**: 375x667 (portrait)
- **iPhone SE Landscape**: 667x375
- **iPad Pro**: 768x1024 (portrait)

### Mobile-Specific Checks
- Touch-friendly button sizes (minimum 32x32px)
- No horizontal scroll
- Readable text (minimum 14px)
- Proper layout stacking
- Modal and overlay behavior

### Running Mobile Tests
```bash
# Run all mobile tests
npm run test:mobile

# Run specific mobile test file
npx playwright test tests/playwright/mobile.spec.js --project=mobile
```

## CI/CD Integration

### Automatic Testing

Tests run automatically in GitHub Actions:
- On every push to main/master
- On every pull request
- Before deployment to GitHub Pages

### CI Workflow

1. Install Node.js and dependencies
2. Install Playwright browsers
3. Run validation checks
4. Run Node.js unit tests
5. Run Playwright e2e tests
6. Upload test reports as artifacts

### Viewing CI Results

- Check GitHub Actions tab for test results
- Download test reports from artifacts
- Review screenshots of failures
- Fix failing tests before merging

## Debugging Tests

### Interactive Debugging

```bash
# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Run single test file
npx playwright test tests/playwright/game-modes.spec.js
```

### Common Issues

**Test Timeout:**
```javascript
// Increase timeout for slow operations
test.setTimeout(60000); // 60 seconds
```

**Element Not Found:**
```javascript
// Wait for element explicitly
await page.waitForSelector('#element');
await expect(page.locator('#element')).toBeVisible();
```

**Flaky Tests:**
```javascript
// Add explicit waits
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500); // Use sparingly
```

## Test Coverage Goals

### Current Coverage (93% pass rate)
- ✅ All three game modes
- ✅ Campaign progression
- ✅ Shop and upgrades
- ✅ Mobile viewports
- ✅ Accessibility basics
- ✅ Core gameplay mechanics

### Areas for Expansion
- End-to-end task completion flows
- Error recovery scenarios
- Cross-browser testing
- Performance testing
- Visual regression testing

## Resources

- **Playwright Documentation**: https://playwright.dev
- **Test README**: `tests/playwright/README.md`
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Debugging Guide**: https://playwright.dev/docs/debug

## Summary

**Remember:**
1. Always run tests before committing
2. Write tests for new features
3. Update tests when behavior changes
4. Prioritize mobile testing
5. Fix failing tests immediately
6. Use semantic locators
7. Test user behavior, not implementation

**Quick Commands:**
```bash
npm test              # Run all tests
npm run test:headed   # See browser
npm run test:mobile   # Mobile tests
npm run test:ui       # Debug mode
```
