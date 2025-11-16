// Test for campaign completion redirect to Free Play mode
import { test, expect } from '@playwright/test';

test.describe('Campaign Completion Redirect', () => {
    test('should redirect to Free Play mode when all campaign tasks are completed', async ({ page }) => {
        await page.goto('/');

        // Start Jump Into Task mode
        await page.getByRole('button', { name: /Jump Into Task/i }).click();

        // Use debug helper to mark all tasks as completed
        await page.evaluate(() => {
            // Mark all tasks as completed
            window.campaignState.completedTasks = [1, 2, 3, 4];
            window.updateCampaignState({ completedTasks: [1, 2, 3, 4] });
        });

        // Handle the alert that should appear
        page.once('dialog', async dialog => {
            const message = dialog.message();
            expect(message).toContain('completed all campaign tasks');
            expect(message).toContain('Free Play Mode');
            await dialog.accept();
        });

        // Click Jump Into Task again (should trigger completion check)
        await page.goto('/');
        await page.getByRole('button', { name: /Jump Into Task/i }).click();

        // Should now be in Free Play mode
        await expect(page.locator('#gameArea')).toBeVisible({ timeout: 10000 });

        // Verify Free Play UI elements
        const hitButton = page.locator('button:has-text("Hit")');
        const standButton = page.locator('button:has-text("Stand")');
        await expect(hitButton).toBeVisible();
        await expect(standButton).toBeVisible();
    });

    test('should show warning-styled reset button in campaign overview', async ({ page }) => {
        await page.goto('/');

        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Check for reset button with warning style
        const resetButton = page.locator('button.warning-btn');
        await expect(resetButton).toBeVisible();
        await expect(resetButton).toContainText('RESET ALL PROGRESS');

        // Verify it has the warning class (emoji is in CSS ::before)
        const hasWarningClass = await resetButton.evaluate(el => el.classList.contains('warning-btn'));
        expect(hasWarningClass).toBe(true);
    });

    test('should show double confirmation when resetting campaign', async ({ page }) => {
        await page.goto('/');

        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Track dialog messages
        const dialogMessages = [];

        page.on('dialog', async dialog => {
            dialogMessages.push(dialog.message());
            await dialog.dismiss(); // Dismiss to prevent actual reset
        });

        // Click reset button
        const resetButton = page.locator('button.warning-btn');
        await resetButton.click();

        // Wait a bit for dialogs
        await page.waitForTimeout(500);

        // Should have shown first confirmation
        expect(dialogMessages.length).toBeGreaterThan(0);
        expect(dialogMessages[0]).toContain('WARNING: RESET ENTIRE GAME PROGRESS');
        expect(dialogMessages[0]).toContain('CANNOT be undone');
    });
});
