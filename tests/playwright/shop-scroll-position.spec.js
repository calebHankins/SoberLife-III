const { test, expect } = require('@playwright/test');

test.describe('Shop/Mind Palace Scroll Position Reset', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should reset scroll position when Mind Palace is closed and reopened in Campaign mode', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await page.waitForTimeout(500);

        // Open Mind Palace from campaign overview (use onclick attribute to be specific)
        await page.locator('button[onclick="visitMindPalace()"]').click();
        await page.waitForTimeout(500);

        // Verify Mind Palace is visible
        const mindPalaceModal = page.locator('#mindPalaceModal');
        await expect(mindPalaceModal).toBeVisible();

        // Get the scrollable container
        const mindPalaceBody = page.locator('#mindPalaceModal .mind-palace-body');

        // Scroll down in the Mind Palace
        await mindPalaceBody.evaluate(el => {
            el.scrollTop = 500; // Scroll down 500px
        });
        await page.waitForTimeout(300);

        // Verify scroll position is not at top
        const scrollPositionBefore = await mindPalaceBody.evaluate(el => el.scrollTop);
        expect(scrollPositionBefore).toBeGreaterThan(0);

        // Close Mind Palace
        await page.locator('#mindPalaceCloseBtn').click();
        await page.waitForTimeout(500);

        // Verify Mind Palace is closed
        await expect(mindPalaceModal).not.toBeVisible();

        // Reopen Mind Palace
        await page.locator('button[onclick="visitMindPalace()"]').click();
        await page.waitForTimeout(500);

        // Verify Mind Palace is visible again
        await expect(mindPalaceModal).toBeVisible();

        // Check scroll position - should be reset to top
        const scrollPositionAfter = await mindPalaceBody.evaluate(el => el.scrollTop);
        expect(scrollPositionAfter).toBe(0);
    });

    test('should reset scroll position when Shop is closed and reopened in Campaign mode', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await page.waitForTimeout(500);

        // Open shop from campaign overview (use onclick attribute to be specific)
        await page.locator('button[onclick="openCampaignShop()"]').click();
        await page.waitForTimeout(500);

        // Verify Shop is visible
        const shopModal = page.locator('#upgradeShop');
        await expect(shopModal).toBeVisible();

        // Get the scrollable container
        const shopContent = page.locator('#upgradeShop .shop-content');

        // Scroll down in the Shop
        await shopContent.evaluate(el => {
            el.scrollTop = 400;
        });
        await page.waitForTimeout(300);

        // Verify scroll position is not at top
        const scrollPositionBefore = await shopContent.evaluate(el => el.scrollTop);
        expect(scrollPositionBefore).toBeGreaterThan(0);

        // Close Shop
        await page.locator('#shopCloseBtn').click();
        await page.waitForTimeout(500);

        // Verify Shop is closed
        await expect(shopModal).not.toBeVisible();

        // Reopen Shop
        await page.locator('button[onclick="openCampaignShop()"]').click();
        await page.waitForTimeout(500);

        // Verify Shop is visible again
        await expect(shopModal).toBeVisible();

        // Check scroll position - should be reset to top
        const scrollPositionAfter = await shopContent.evaluate(el => el.scrollTop);
        expect(scrollPositionAfter).toBe(0);
    });
});
