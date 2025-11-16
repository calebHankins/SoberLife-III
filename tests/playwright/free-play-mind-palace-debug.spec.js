const { test, expect } = require('@playwright/test');

test.describe('Free Play Mind Palace Debug', () => {
    test.beforeEach(async ({ page }) => {
        // Enable console logging
        page.on('console', msg => console.log('BROWSER:', msg.text()));

        await page.goto('/');
        await expect(page.locator('#gameModeSelection')).toBeVisible();
    });

    test('debug close Mind Palace navigation', async ({ page }) => {
        // Start Free Play and show overview
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();
        console.log('✓ Free Play overview visible');

        // Check game state
        const gameState = await page.evaluate(() => {
            return {
                freePlayMode: window.gameState?.freePlayMode,
                campaignMode: window.campaignState?.campaignMode
            };
        });
        console.log('Game state before opening Mind Palace:', gameState);

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();
        console.log('✓ Mind Palace opened');

        // Check game state after opening
        const gameStateAfterOpen = await page.evaluate(() => {
            return {
                freePlayMode: window.gameState?.freePlayMode,
                campaignMode: window.campaignState?.campaignMode
            };
        });
        console.log('Game state after opening Mind Palace:', gameStateAfterOpen);

        // Close Mind Palace
        console.log('Clicking close button...');
        await page.locator('#mindPalaceCloseBtn').click();

        // Wait a bit for navigation
        await page.waitForTimeout(500);

        // Check what's visible
        const visibility = await page.evaluate(() => {
            const elements = {
                freePlayOverview: document.getElementById('freePlayOverview'),
                campaignOverview: document.getElementById('campaignOverview'),
                gameModeSelection: document.getElementById('gameModeSelection'),
                mindPalaceModal: document.getElementById('mindPalaceModal')
            };

            return Object.entries(elements).reduce((acc, [key, el]) => {
                acc[key] = el ? {
                    classList: Array.from(el.classList),
                    hasHidden: el.classList.contains('hidden')
                } : 'not found';
                return acc;
            }, {});
        });
        console.log('Element visibility after close:', JSON.stringify(visibility, null, 2));

        // Check game state after closing
        const gameStateAfterClose = await page.evaluate(() => {
            return {
                freePlayMode: window.gameState?.freePlayMode,
                campaignMode: window.campaignState?.campaignMode,
                isCampaignMode: window.isCampaignMode ? window.isCampaignMode() : 'function not found'
            };
        });
        console.log('Game state after closing Mind Palace:', gameStateAfterClose);

        // Verify Mind Palace is hidden
        await expect(page.locator('#mindPalaceModal')).toHaveClass(/hidden/);
        console.log('✓ Mind Palace hidden');

        // Verify we're back at Free Play overview
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        console.log('✓ Free Play overview visible again');
    });
});
