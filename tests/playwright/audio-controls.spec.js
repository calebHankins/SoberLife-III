const { test, expect } = require('@playwright/test');

test.describe('Audio Controls FAB', () => {
    test('FAB toggles mute/unmute for both music and effects', async ({ page }) => {
        await page.goto('/');

        // Wait for audio manager to be initialized
        await page.waitForFunction(() => window.audioManager && window.audioManager.initialized === true);

        // Ensure initial state is unmuted for both
        const initialMusicMuted = await page.evaluate(() => window.audioManager.preferences.musicMuted);
        const initialEffectsMuted = await page.evaluate(() => window.audioManager.preferences.effectsMuted);

        expect(initialMusicMuted).toBe(false);
        expect(initialEffectsMuted).toBe(false);

        // Click FAB to mute everything
        await page.click('#audio-fab');

        // Wait for preferences to reflect mute state
        await page.waitForFunction(() => window.audioManager.preferences.musicMuted === true && window.audioManager.preferences.effectsMuted === true);

        const mutedMusic = await page.evaluate(() => window.audioManager.preferences.musicMuted);
        const mutedEffects = await page.evaluate(() => window.audioManager.preferences.effectsMuted);

        expect(mutedMusic).toBe(true);
        expect(mutedEffects).toBe(true);

        // Click again to unmute
        await page.click('#audio-fab');
        await page.waitForFunction(() => window.audioManager.preferences.musicMuted === false && window.audioManager.preferences.effectsMuted === false);

        const unmutedMusic = await page.evaluate(() => window.audioManager.preferences.musicMuted);
        const unmutedEffects = await page.evaluate(() => window.audioManager.preferences.effectsMuted);

        expect(unmutedMusic).toBe(false);
        expect(unmutedEffects).toBe(false);
    });

    test('Shift-click on FAB opens audio settings panel', async ({ page }) => {
        await page.goto('/');

        await page.waitForFunction(() => window.audioManager && window.audioManager.initialized === true);

        // Shift-click should open controls panel
        await page.click('#audio-fab', { modifiers: ['Shift'] });

        // Wait for panel to be visible
        await page.waitForSelector('#audio-controls-panel.visible');

        const isVisible = await page.isVisible('#audio-controls-panel.visible');
        expect(isVisible).toBe(true);
    });
});
