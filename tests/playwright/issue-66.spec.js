const { test, expect } = require('@playwright/test');

test.describe('Issue #66: Mobile Zen Points Visibility', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport

    test('zen points should be visible on mobile', async ({ page }) => {
        await page.goto('/');

        // Wait for the game to load
        await page.waitForSelector('.zen-points');

        const zenPoints = page.locator('.zen-points');

        // Get computed styles
        const color = await zenPoints.evaluate((el) => {
            return window.getComputedStyle(el).color;
        });

        const backgroundColor = await zenPoints.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
        });

        const parentBackgroundColor = await page.locator('.avatar-container').evaluate((el) => {
            return window.getComputedStyle(el).backgroundImage; // It's a gradient
        });

        console.log('Zen Points Color:', color);
        console.log('Zen Points Background:', backgroundColor);
        console.log('Parent Background:', parentBackgroundColor);

        // The issue is that the text is dark green (#2E8B57 -> rgb(46, 139, 87))
        // on a dark blue/purple background.
        // We want to ensure it's NOT dark green on mobile.

        // After the fix, we expect it to be white (rgb(255, 255, 255))
        expect(color).toBe('rgb(255, 255, 255)');
    });
});
