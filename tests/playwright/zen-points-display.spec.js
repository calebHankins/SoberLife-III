// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Zen Points Display - Free Play Mode Bug', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should maintain zen points display when exiting Free Play to mode selection', async ({ page }) => {
        // Get initial zen points from landing page
        const zenPointsElement = page.locator('#zenPoints');
        const initialText = await zenPointsElement.textContent();
        console.log('Initial zen points:', initialText);

        // Extract the number from "Zen Points: 100"
        const initialMatch = initialText.match(/Zen Points:\s*(\d+)/);
        expect(initialMatch).not.toBeNull();
        const initialBalance = parseInt(initialMatch[1]);

        // Start Free Play Mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Verify zen points are still displayed correctly in game
        const gameZenPoints = await zenPointsElement.textContent();
        console.log('Zen points in game:', gameZenPoints);
        expect(gameZenPoints).toContain(`Zen Points: ${initialBalance}`);

        // Exit to Free Play overview
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();

        // Verify we're at Free Play overview
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Verify zen points are still correct at overview
        const overviewZenPoints = await zenPointsElement.textContent();
        console.log('Zen points at overview:', overviewZenPoints);
        expect(overviewZenPoints).toContain(`Zen Points: ${initialBalance}`);

        // Close Free Play overview to return to mode selection
        await page.locator('#freePlayCloseBtn').click();

        // Verify we're back at mode selection
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // BUG TEST: Verify zen points are NOT reset to "100"
        const finalZenPoints = await zenPointsElement.textContent();
        console.log('Final zen points at mode selection:', finalZenPoints);

        // This should match the initial balance, not default to 100
        expect(finalZenPoints).toContain(`Zen Points: ${initialBalance}`);
        expect(finalZenPoints).toBe(initialText);
    });

    test('should maintain zen points display after playing Free Play rounds', async ({ page }) => {
        // Start Free Play Mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Get zen points before playing
        const zenPointsElement = page.locator('#zenPoints');
        const beforePlayText = await zenPointsElement.textContent();
        const beforeMatch = beforePlayText.match(/Zen Points:\s*(\d+)/);
        const beforeBalance = parseInt(beforeMatch[1]);

        // Play one round - stand immediately
        await page.locator('#standBtn').click();

        // Wait for round to complete
        await page.waitForTimeout(1000);

        // Get zen points after playing (should be same or slightly different based on round outcome)
        const afterPlayText = await zenPointsElement.textContent();
        const afterMatch = afterPlayText.match(/Zen Points:\s*(\d+)/);
        const afterBalance = parseInt(afterMatch[1]);

        console.log('Before play:', beforeBalance, 'After play:', afterBalance);

        // Exit to Free Play overview
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Close Free Play overview
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // BUG TEST: Verify zen points match the balance after playing, not reset to 100
        const finalZenPoints = await zenPointsElement.textContent();
        const finalMatch = finalZenPoints.match(/Zen Points:\s*(\d+)/);
        const finalBalance = parseInt(finalMatch[1]);

        console.log('Final balance at mode selection:', finalBalance, 'Expected:', afterBalance);
        expect(finalBalance).toBe(afterBalance);

        // The key bug test: zen points should not reset to the default 100
        // unless that happens to be the actual balance
        if (beforeBalance !== 100) {
            expect(finalBalance).not.toBe(100);
        }
    });

    test('should maintain zen points display when navigating: Campaign -> Free Play -> Mode Selection', async ({ page }) => {
        // Start Campaign Mode first
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Get zen points in campaign
        const zenPointsElement = page.locator('#zenPoints');
        const campaignZenPoints = await zenPointsElement.textContent();
        const campaignMatch = campaignZenPoints.match(/Zen Points:\s*(\d+)/);
        const campaignBalance = parseInt(campaignMatch[1]);

        console.log('Campaign zen points:', campaignBalance);

        // Exit campaign
        await page.locator('#campaignCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Start Free Play Mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit to Free Play overview
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Close Free Play overview
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // BUG TEST: Verify zen points still match campaign balance
        const finalZenPoints = await zenPointsElement.textContent();
        const finalMatch = finalZenPoints.match(/Zen Points:\s*(\d+)/);
        const finalBalance = parseInt(finalMatch[1]);

        console.log('Final balance after campaign->freeplay->mode:', finalBalance);
        expect(finalBalance).toBe(campaignBalance);
    });

    test('should maintain zen points display when using zen activities in Free Play', async ({ page }) => {
        // Start Free Play Mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Get initial zen points
        const zenPointsElement = page.locator('#zenPoints');
        const initialText = await zenPointsElement.textContent();
        const initialMatch = initialText.match(/Zen Points:\s*(\d+)/);
        const initialBalance = parseInt(initialMatch[1]);

        // Use a zen activity (breath costs 10 points)
        const breathBtn = page.locator('#breathBtn');
        if (await breathBtn.isEnabled()) {
            await breathBtn.click();
            await page.waitForTimeout(500);

            // Verify zen points decreased
            const afterActivityText = await zenPointsElement.textContent();
            const afterMatch = afterActivityText.match(/Zen Points:\s*(\d+)/);
            const afterBalance = parseInt(afterMatch[1]);

            console.log('After activity:', afterBalance, 'Expected:', initialBalance - 10);
            expect(afterBalance).toBe(initialBalance - 10);

            // Exit to Free Play overview
            page.on('dialog', dialog => dialog.accept());
            await page.locator('#taskCloseBtn').click();
            await expect(page.locator('#freePlayOverview')).toBeVisible();

            // Close Free Play overview
            await page.locator('#freePlayCloseBtn').click();
            await expect(page.locator('#gameModeSelection')).toBeVisible();

            // BUG TEST: Verify zen points still reflect the activity cost
            const finalZenPoints = await zenPointsElement.textContent();
            const finalMatch = finalZenPoints.match(/Zen Points:\s*(\d+)/);
            const finalBalance = parseInt(finalMatch[1]);

            console.log('Final balance after activity:', finalBalance);
            expect(finalBalance).toBe(afterBalance);
            expect(finalBalance).not.toBe(100); // Should not reset to default
        }
    });

    test('should maintain zen points display across multiple Free Play sessions', async ({ page }) => {
        const zenPointsElement = page.locator('#zenPoints');

        // Session 1: Start and exit Free Play
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        const session1Text = await zenPointsElement.textContent();
        const session1Match = session1Text.match(/Zen Points:\s*(\d+)/);
        const session1Balance = parseInt(session1Match[1]);

        // Set up dialog handler once for this session
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Verify balance after session 1
        const afterSession1Text = await zenPointsElement.textContent();
        const afterSession1Match = afterSession1Text.match(/Zen Points:\s*(\d+)/);
        const afterSession1Balance = parseInt(afterSession1Match[1]);
        expect(afterSession1Balance).toBe(session1Balance);

        // Session 2: Start and exit Free Play again
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Check if there's actually a game in progress (maybe no dialog on fresh start)
        const gameInProgress = await page.evaluate(() => window.gameState && window.gameState.gameInProgress);

        if (gameInProgress) {
            // Set up dialog handler only if game is in progress
            page.once('dialog', dialog => dialog.accept());
        }

        await page.locator('#taskCloseBtn').click();

        // Wait a bit for navigation to complete
        await page.waitForTimeout(1000);

        // Check what's actually visible and get state
        const freePlayVisible = await page.locator('#freePlayOverview').isVisible();
        const modeSelectionVisible = await page.locator('#gameModeSelection').isVisible();
        const campaignVisible = await page.locator('#campaignOverview').isVisible();
        const gameAreaVisible = await page.locator('#gameArea').isVisible();

        const allScreens = await page.evaluate(() => {
            const screens = ['gameModeSelection', 'freePlayOverview', 'campaignOverview', 'gameArea', 'taskInfo'];
            return screens.map(id => {
                const el = document.getElementById(id);
                return { id, hidden: el ? el.classList.contains('hidden') : 'not found', visible: el ? !el.classList.contains('hidden') : false };
            });
        });

        console.log('After second close - Screens:', JSON.stringify(allScreens, null, 2));
        console.log('FreePlay visible:', freePlayVisible, 'Mode selection visible:', modeSelectionVisible, 'Campaign visible:', campaignVisible, 'Game area visible:', gameAreaVisible);

        // The app should show Free Play overview
        await expect(page.locator('#freePlayOverview')).toBeVisible({ timeout: 10000 });
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // BUG TEST: Verify balance is still consistent
        const afterSession2Text = await zenPointsElement.textContent();
        const afterSession2Match = afterSession2Text.match(/Zen Points:\s*(\d+)/);
        const afterSession2Balance = parseInt(afterSession2Match[1]);

        console.log('After session 2:', afterSession2Balance, 'Expected:', session1Balance);
        expect(afterSession2Balance).toBe(session1Balance);
    });

    test('should show correct zen points when returning from shop in Free Play', async ({ page }) => {
        // Start Free Play Mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit to Free Play overview
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Get zen points before shop
        const zenPointsElement = page.locator('#zenPoints');
        const beforeShopText = await zenPointsElement.textContent();
        const beforeShopMatch = beforeShopText.match(/Zen Points:\s*(\d+)/);
        const beforeShopBalance = parseInt(beforeShopMatch[1]);

        // Visit shop
        await page.getByRole('button', { name: /Visit Shop/i }).click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Close shop
        await page.locator('#shopCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Verify zen points unchanged
        const afterShopText = await zenPointsElement.textContent();
        const afterShopMatch = afterShopText.match(/Zen Points:\s*(\d+)/);
        const afterShopBalance = parseInt(afterShopMatch[1]);
        expect(afterShopBalance).toBe(beforeShopBalance);

        // Close Free Play overview
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // BUG TEST: Verify zen points still correct at mode selection
        const finalZenPoints = await zenPointsElement.textContent();
        const finalMatch = finalZenPoints.match(/Zen Points:\s*(\d+)/);
        const finalBalance = parseInt(finalMatch[1]);

        console.log('Final balance after shop visit:', finalBalance);
        expect(finalBalance).toBe(beforeShopBalance);
    });
});
