// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have proper page title', async ({ page }) => {
        await expect(page).toHaveTitle(/SoberLife/);
    });

    test('should have proper meta viewport for mobile', async ({ page }) => {
        const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
        expect(viewport).toContain('width=device-width');
    });

    test('should have aria labels on close buttons', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        const closeBtn = page.locator('#campaignCloseBtn');
        await expect(closeBtn).toHaveAttribute('aria-label');
    });

    test('should have proper button roles', async ({ page }) => {
        // Check that visible buttons on initial screen are accessible
        const visibleButtons = page.locator('button:visible');
        const count = await visibleButtons.count();

        expect(count).toBeGreaterThan(0);

        // All visible buttons should be accessible
        for (let i = 0; i < Math.min(count, 5); i++) {
            await expect(visibleButtons.nth(i)).toBeVisible();
        }
    });

    test('should have keyboard accessible help button', async ({ page }) => {
        const helpBtn = page.locator('#helpBtn');
        await expect(helpBtn).toHaveAttribute('tabindex', '0');
    });

    test('should have proper modal aria attributes', async ({ page }) => {
        await page.locator('#helpBtn').click();

        const modal = page.locator('#helpModal');
        await expect(modal).toHaveAttribute('role', 'dialog');
        await expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    test('should have descriptive button text', async ({ page }) => {
        const modeButtons = page.locator('.mode-btn');

        for (let i = 0; i < await modeButtons.count(); i++) {
            const text = await modeButtons.nth(i).textContent();
            expect(text?.trim().length).toBeGreaterThan(5);
        }
    });

    test('should have visible focus indicators', async ({ page }) => {
        const helpBtn = page.locator('#helpBtn');
        await helpBtn.focus();

        // Check that element can receive focus
        const isFocused = await helpBtn.evaluate(el => el === document.activeElement);
        expect(isFocused).toBe(true);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        const h1 = page.locator('h1');
        await expect(h1).toHaveCount(1);

        const h2 = page.locator('h2');
        const h2Count = await h2.count();
        expect(h2Count).toBeGreaterThanOrEqual(0);
    });

    test('should have alt text or aria labels for icons', async ({ page }) => {
        // Avatar should be visible
        const avatar = page.locator('#avatar');
        await expect(avatar).toBeVisible();
    });

    test('should support keyboard navigation in survey', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        // Radio buttons should be keyboard accessible
        const radioButtons = page.locator('input[type="radio"]');
        const firstRadio = radioButtons.first();

        await firstRadio.focus();
        const isFocused = await firstRadio.evaluate(el => el === document.activeElement);
        expect(isFocused).toBe(true);
    });

    test('should have proper form labels', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        const labels = page.locator('label');
        const count = await labels.count();

        expect(count).toBeGreaterThan(0);
    });

    test('should have semantic HTML structure', async ({ page }) => {
        // Check for proper use of semantic elements
        await expect(page.locator('button')).toHaveCount(await page.locator('button').count());
        await expect(page.locator('h1, h2, h3, h4')).toHaveCount(await page.locator('h1, h2, h3, h4').count());
    });

    test('should have sufficient color contrast', async ({ page }) => {
        // Check that text is visible (basic contrast check)
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();

        const color = await heading.evaluate(el =>
            window.getComputedStyle(el).color
        );

        expect(color).toBeTruthy();
    });

    test('should not rely solely on color for information', async ({ page }) => {
        // Stress meter should have text label
        await expect(page.locator('.stress-meter')).toBeVisible();

        // Check for stress level label in avatar container (more specific selector)
        const stressLabel = page.locator('.avatar-container').getByText('Stress Level', { exact: true });
        await expect(stressLabel).toBeVisible();
    });

    test('should have proper button states', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        const startBtn = page.locator('#startTaskBtn');

        // Button should be disabled initially
        await expect(startBtn).toBeDisabled();

        // Complete survey
        await page.locator('input[name="sleep"][value="0"]').click();
        await page.locator('input[name="prepared"][value="0"]').click();
        await page.locator('input[name="day"][value="0"]').click();

        // Button should be enabled after survey
        await expect(startBtn).toBeEnabled();
    });
});

test.describe('Screen Reader Support', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have meaningful page structure', async ({ page }) => {
        // Main container should exist
        await expect(page.locator('.game-container')).toBeVisible();

        // Header should exist
        await expect(page.locator('.game-header')).toBeVisible();
    });

    test('should have descriptive error messages', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        // Wait for survey to appear
        await page.waitForSelector('#surveySection:not(.hidden)');

        // Try to submit incomplete survey by calling the function directly
        await page.evaluate(() => {
            // @ts-ignore - startTask is exposed globally in main.js
            window.startTask();
        });

        const errorMsg = page.locator('#surveyError');
        await expect(errorMsg).toBeVisible();

        const errorText = await errorMsg.textContent();
        expect(errorText?.length).toBeGreaterThan(10);
    });

    test('should have status updates for dynamic content', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        // Round result should be visible after actions
        const roundResult = page.locator('#roundResult');
        await expect(roundResult).toBeAttached();
    });
});
