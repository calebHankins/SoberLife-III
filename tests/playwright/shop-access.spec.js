// Shop Access Tests
// Tests to verify shop accessibility from all game modes
// Specifically tests the fix for the bug where Free Play Mode was blocked from accessing the shop

import { test, expect } from '@playwright/test';

test.describe('Shop Access from All Game Modes', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should allow shop access from Campaign Mode', async ({ page }) => {
        // Start Campaign Mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        // Wait for campaign overview
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Click Visit Shop button
        await page.getByRole('button', { name: /Visit Shop/i }).click();

        // Verify shop is visible
        await expect(page.locator('#upgradeShop')).toBeVisible();
        await expect(page.locator('.shop-header h2')).toContainText('Mindfulness Upgrades');

        // Verify shop content is accessible
        await expect(page.locator('#jokerUpgradeCard, #aceUpgradeCard')).toBeVisible();
    });

    test('should allow shop access from Free Play Mode overview', async ({ page }) => {
        // Listen for console errors to detect if the shop is blocked
        const consoleWarnings = [];
        page.on('console', msg => {
            if (msg.type() === 'warning' && msg.text().includes('Cannot open campaign shop')) {
                consoleWarnings.push(msg.text());
            }
        });

        // Use page.evaluate to directly show Free Play overview
        // This simulates a player who has completed a Free Play session
        await page.evaluate(() => {
            // Show Free Play overview directly
            window.showFreePlayOverview();
        });

        // Wait for Free Play overview to be visible
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Click Visit Shop button - THIS IS THE KEY TEST
        // Before the fix, this would log a warning and return early
        await page.getByRole('button', { name: /Visit Shop/i }).click();

        // Verify no console warnings about mode restrictions
        expect(consoleWarnings).toHaveLength(0);

        // Verify shop is visible and accessible (not blocked by mode check)
        await expect(page.locator('#upgradeShop')).toBeVisible();
        await expect(page.locator('.shop-header h2')).toContainText('Mindfulness Upgrades');

        // Verify shop content is accessible (not blocked)
        await expect(page.locator('#jokerUpgradeCard, #aceUpgradeCard')).toBeVisible();
    });

    test('should allow navigation back from shop in Campaign Mode', async ({ page }) => {
        // Test Campaign Mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await page.getByRole('button', { name: /Visit Shop/i }).click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Close shop
        await page.locator('.shop-close-btn, #shopCloseBtn').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#upgradeShop')).not.toBeVisible();
    });
});
