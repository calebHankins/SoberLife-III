const { test, expect } = require('@playwright/test');

test.describe('Audio FAB Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for game to load
        await page.waitForSelector('.game-container');
    });

    test('FAB should mute/unmute audio on click', async ({ page }) => {
        // Wait for FAB to appear
        const fab = page.locator('#audio-fab');
        await fab.waitFor();

        // Check initial state (should be unmuted)
        // We can check localStorage or evaluate window.audioManager state if accessible
        // Since audioManager is not global, we might need to check localStorage

        // Initial state: audio enabled, not muted
        await expect(async () => {
            const musicMuted = await page.evaluate(() => localStorage.getItem('soberlife_music_muted'));
            const effectsMuted = await page.evaluate(() => localStorage.getItem('soberlife_effects_muted'));
            return musicMuted === 'false' && effectsMuted === 'false';
        }).toBeTruthy();

        // Click FAB to mute
        await fab.click();

        // Check if muted
        await expect(async () => {
            const musicMuted = await page.evaluate(() => localStorage.getItem('soberlife_music_muted'));
            const effectsMuted = await page.evaluate(() => localStorage.getItem('soberlife_effects_muted'));
            return musicMuted === 'true' && effectsMuted === 'true';
        }).toBeTruthy();

        // Click FAB to unmute
        await fab.click();

        // Check if unmuted
        await expect(async () => {
            const musicMuted = await page.evaluate(() => localStorage.getItem('soberlife_music_muted'));
            const effectsMuted = await page.evaluate(() => localStorage.getItem('soberlife_effects_muted'));
            return musicMuted === 'false' && effectsMuted === 'false';
        }).toBeTruthy();
    });

    test('Hover on FAB should show settings panel', async ({ page }) => {
        const fab = page.locator('#audio-fab');
        const panel = page.locator('#audio-controls-panel');

        await fab.waitFor();

        // Panel should be hidden initially
        await expect(panel).not.toHaveClass(/visible/);

        // Hover over FAB
        await fab.hover();

        // Panel should be visible
        await expect(panel).toHaveClass(/visible/);

        // Move mouse away (to body)
        await page.mouse.move(0, 0);

        // Wait for timeout
        await page.waitForTimeout(200);

        // Panel should be hidden
        await expect(panel).not.toHaveClass(/visible/);
    });
});
