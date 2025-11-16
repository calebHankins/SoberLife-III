// Free Play Shop Tests
// Tests for shop functionality in Free Play mode - specifically joker purchase blocking

import { test, expect } from '@playwright/test';

test.describe('Free Play Shop - Joker Purchase', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should allow joker purchases in Free Play mode (not block with campaign-only message)', async ({ page }) => {
        // Start Free Play Mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit to Free Play overview (handle confirmation dialog)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open shop from Free Play overview
        await page.locator('#freePlayOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Get current zen points
        const zenPointsText = await page.locator('#shopZenPoints').textContent();
        const zenPoints = parseInt(zenPointsText || '0');

        console.log(`Current zen points: ${zenPoints}`);

        // Get joker upgrade cost
        const costText = await page.locator('#jokerUpgradeCost, #aceUpgradeCost').textContent();
        const cost = parseInt(costText || '0');

        console.log(`Joker upgrade cost: ${cost}`);

        // Try to purchase joker
        const purchaseBtn = page.locator('#jokerUpgradeBtn, #aceUpgradeBtn');
        await expect(purchaseBtn).toBeVisible();

        // Click the button regardless of whether we have enough points
        // We want to test the error message
        await purchaseBtn.click();

        // Wait for feedback
        await page.waitForTimeout(1500);

        // Check for notifications
        const notification = page.locator('.popup-notification, .purchase-feedback').first();

        if (await notification.isVisible()) {
            const notificationText = await notification.textContent();
            console.log(`Notification: ${notificationText}`);

            // THE BUG: Should NOT contain "only available in campaign mode"
            // This is the main assertion we're testing
            expect(notificationText).not.toContain('only available in campaign mode');
            expect(notificationText).not.toContain('not in campaign');

            // If we had enough points, should show success
            if (zenPoints >= cost) {
                expect(notificationText).toContain('Joker added');
            } else {
                // If not enough points, should show insufficient zen message
                expect(notificationText).toContain('Insufficient');
            }
        } else {
            // If no notification appeared and we had enough points, that's also a bug
            if (zenPoints >= cost) {
                throw new Error('Expected success notification but none appeared');
            }
        }
    });

    test('should navigate back to Free Play overview from shop', async ({ page }) => {
        // Start Free Play Mode
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit to Free Play overview
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open shop
        await page.locator('#freePlayOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Verify button text says "Continue Free Play"
        const continueBtn = page.locator('.shop-actions .primary-btn');
        await expect(continueBtn).toBeVisible();
        const buttonText = await continueBtn.textContent();
        expect(buttonText).toContain('Free Play');

        // Click to return
        await continueBtn.click();

        // Should return to Free Play overview
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(page.locator('#campaignOverview')).not.toBeVisible();
    });
});
