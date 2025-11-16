// SoberLife III - Shop Navigation Tests
// Tests for shop exit navigation issues across different game modes

import { test, expect } from '@playwright/test';

test.describe('Shop Navigation Issues', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Shop X button should return to Campaign Mode when opened from Campaign', async ({ page }) => {
        // Start Campaign Mode
        await page.locator('button:has-text("Start Campaign")').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Open shop from campaign overview using specific selector
        await page.locator('#campaignOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Click X button to close shop
        await page.locator('#shopCloseBtn').click();

        // BUG TEST: Should return to Campaign Mode, NOT Free Play Mode
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#freePlayOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();
    });

    test('Shop X button should return to Free Play overview when opened from Free Play', async ({ page }) => {
        // Start Free Play Mode (goes directly to gameplay)
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit the game to show Free Play overview (handle confirmation dialog)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open shop from Free Play overview using specific selector
        await page.locator('#freePlayOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Click X button to close shop
        await page.locator('#shopCloseBtn').click();

        // BUG TEST: Should return to Free Play overview, NOT Campaign Mode
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(page.locator('#campaignOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();
    });

    test('Shop "Continue Campaign" button should return to Campaign Mode when opened from Campaign', async ({ page }) => {
        // Start Campaign Mode
        await page.locator('button:has-text("Start Campaign")').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Open shop from campaign overview using specific selector
        await page.locator('#campaignOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Click "Continue Campaign" button (use visible one in shop)
        await page.locator('#upgradeShop button:has-text("Continue Campaign")').click();

        // Should return to Campaign Mode
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#freePlayOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();
    });

    test('Shop "Continue Free Play" button should return to Free Play overview when opened from Free Play', async ({ page }) => {
        // Start Free Play Mode (goes directly to gameplay)
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit the game to show Free Play overview (handle confirmation dialog)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open shop from Free Play overview using specific selector
        await page.locator('#freePlayOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Verify button text changed to "Continue Free Play"
        await expect(page.locator('button:has-text("Continue Free Play")')).toBeVisible();

        // Click "Continue Free Play" button
        await page.locator('button:has-text("Continue Free Play")').click();

        // BUG TEST: Should return to Free Play overview, NOT Campaign Mode
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(page.locator('#campaignOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();
    });

    test('Shop "Close Shop" button should return to Campaign Mode when opened from Campaign', async ({ page }) => {
        // Start Campaign Mode
        await page.locator('button:has-text("Start Campaign")').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Open shop from campaign overview using specific selector
        await page.locator('#campaignOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Click "Close Shop" button
        await page.locator('button:has-text("Close Shop")').click();

        // Should return to Campaign Mode
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#freePlayOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();
    });

    test('Shop "Close Shop" button should return to Free Play overview when opened from Free Play', async ({ page }) => {
        // Start Free Play Mode (goes directly to gameplay)
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit the game to show Free Play overview (handle confirmation dialog)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open shop from Free Play overview using specific selector
        await page.locator('#freePlayOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Click "Close Shop" button
        await page.locator('button:has-text("Close Shop")').click();

        // BUG TEST: Should return to Free Play overview, NOT Campaign Mode
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(page.locator('#campaignOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();
    });

    test('Free Play shop should allow purchases without Campaign Mode restriction', async ({ page }) => {
        // Start Free Play Mode (goes directly to gameplay)
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit the game to show Free Play overview (handle confirmation dialog)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open shop from Free Play overview using specific selector
        await page.locator('#freePlayOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Check if joker upgrade button is enabled (assuming player has enough zen points)
        // First, let's check the current zen points
        const zenPointsText = await page.locator('#shopZenPoints').textContent();
        console.log('Current zen points:', zenPointsText);

        // The joker upgrade button should NOT be disabled due to "not in campaign mode"
        const jokerBtn = page.locator('#jokerUpgradeBtn');
        const isDisabled = await jokerBtn.isDisabled();
        const buttonText = await jokerBtn.textContent();

        // BUG TEST: Button should not say "Campaign Mode Only" or similar
        expect(buttonText).not.toContain('Campaign');
        expect(buttonText).not.toContain('Mode Only');

        // If player has enough zen points, button should be enabled
        // If disabled, it should only be due to insufficient zen or max jokers reached
        if (isDisabled) {
            expect(buttonText).toMatch(/Insufficient Zen|Max Jokers Reached|Cannot Purchase/);
        }
    });

    test('Shop should remember which mode opened it for proper navigation', async ({ page }) => {
        // Test 1: Campaign Mode
        await page.locator('button:has-text("Start Campaign")').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await page.locator('#campaignOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();
        await page.locator('#shopCloseBtn').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Return to mode selection
        await page.locator('#campaignCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Test 2: Free Play Mode
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit the game to show Free Play overview (handle confirmation dialog)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        await page.locator('#freePlayOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();
        await page.locator('#shopCloseBtn').click();

        // BUG TEST: Should return to Free Play overview, not Campaign
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(page.locator('#campaignOverview')).not.toBeVisible();
    });

    test('Shop "Continue Campaign" button should return to Campaign after Free Play session', async ({ page }) => {
        // REGRESSION TEST: This test catches a bug where gameState.freePlayMode flag
        // remains true after exiting Free Play, causing Campaign shop to incorrectly
        // navigate to Free Play overview instead of Campaign overview.

        // Step 1: Start Free Play to set the freePlayMode flag
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit Free Play (this sets gameState.freePlayMode = true)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Return to mode selection
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Step 2: Now start Campaign Mode (gameState.freePlayMode may still be true)
        await page.locator('button:has-text("Start Campaign")').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Open shop from Campaign
        await page.locator('#campaignOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Verify button text is correct
        await expect(page.locator('#upgradeShop button:has-text("Continue Campaign")')).toBeVisible();

        // Click "Continue Campaign" button
        await page.locator('#upgradeShop button:has-text("Continue Campaign")').click();

        // CRITICAL: Should return to Campaign overview, NOT Free Play overview
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#freePlayOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();

        // Verify we're actually in Campaign Mode by checking the heading
        await expect(page.locator('h2:has-text("Stress Management Campaign")')).toBeVisible();
    });

    test('Shop X button should return to Campaign after Free Play session', async ({ page }) => {
        // REGRESSION TEST: This test catches the same bug as above, but specifically
        // tests the X (close) button instead of the "Continue Campaign" button.

        // Step 1: Start Free Play to set the freePlayMode flag
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit Free Play (this sets gameState.freePlayMode = true)
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Return to mode selection
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Step 2: Now start Campaign Mode (gameState.freePlayMode may still be true)
        await page.locator('button:has-text("Start Campaign")').click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Open shop from Campaign
        await page.locator('#campaignOverview button:has-text("Visit Shop")').click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Click X button to close shop
        await page.locator('#shopCloseBtn').click();

        // CRITICAL: Should return to Campaign overview, NOT Free Play overview
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#freePlayOverview')).not.toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();

        // Verify we're actually in Campaign Mode by checking the heading
        await expect(page.locator('h2:has-text("Stress Management Campaign")')).toBeVisible();
    });
});
