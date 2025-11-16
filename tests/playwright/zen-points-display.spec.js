// @ts-check
import { test, expect } from '@playwright/test';

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
        expect(initialText).not.toBeNull();
        const initialMatch = initialText && initialText.match(/Zen Points:\s*(\d+)/);
        expect(initialMatch).not.toBeNull();
        const initialBalance = initialMatch ? parseInt(initialMatch[1]) : 0;

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
        expect(beforePlayText).not.toBeNull();
        const beforeMatch = beforePlayText?.match(/Zen Points:\s*(\d+)/);
        expect(beforeMatch).not.toBeNull();
        const beforeBalance = beforeMatch ? parseInt(beforeMatch[1]) : 0;

        // Play one round - stand immediately
        await page.locator('#standBtn').click();

        // Wait for round to complete
        await page.waitForTimeout(1000);

        // Get zen points after playing (should be same or slightly different based on round outcome)
        const afterPlayText = await zenPointsElement.textContent();
        expect(afterPlayText).not.toBeNull();
        const afterMatch = afterPlayText?.match(/Zen Points:\s*(\d+)/);
        expect(afterMatch).not.toBeNull();
        const afterBalance = afterMatch ? parseInt(afterMatch[1]) : 0;

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
        expect(finalZenPoints).not.toBeNull();
        const finalMatch = finalZenPoints?.match(/Zen Points:\s*(\d+)/);
        expect(finalMatch).not.toBeNull();
        const finalBalance = finalMatch ? parseInt(finalMatch[1]) : 0;

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
        expect(campaignZenPoints).not.toBeNull();
        const campaignMatch = campaignZenPoints?.match(/Zen Points:\s*(\d+)/);
        expect(campaignMatch).not.toBeNull();
        const campaignBalance = campaignMatch ? parseInt(campaignMatch[1]) : 0;

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
        expect(finalZenPoints).not.toBeNull();
        const finalMatch = finalZenPoints?.match(/Zen Points:\s*(\d+)/);
        expect(finalMatch).not.toBeNull();
        const finalBalance = finalMatch ? parseInt(finalMatch[1]) : 0;

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
        expect(initialText).not.toBeNull();
        const initialMatch = initialText?.match(/Zen Points:\s*(\d+)/);
        expect(initialMatch).not.toBeNull();
        const initialBalance = initialMatch ? parseInt(initialMatch[1]) : 0;

        // Use a zen activity (breath costs 10 points)
        const breathBtn = page.locator('#breathBtn');
        if (await breathBtn.isEnabled()) {
            await breathBtn.click();
            await page.waitForTimeout(500);

            // Verify zen points decreased
            const afterActivityText = await zenPointsElement.textContent();
            expect(afterActivityText).not.toBeNull();
            const afterMatch = afterActivityText?.match(/Zen Points:\s*(\d+)/);
            expect(afterMatch).not.toBeNull();
            const afterBalance = afterMatch ? parseInt(afterMatch[1]) : 0;

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
            expect(finalZenPoints).not.toBeNull();
            const finalMatch = finalZenPoints?.match(/Zen Points:\s*(\d+)/);
            expect(finalMatch).not.toBeNull();
            const finalBalance = finalMatch ? parseInt(finalMatch[1]) : 0;

            console.log('Final balance after activity:', finalBalance);
            expect(finalBalance).toBe(afterBalance);
            expect(finalBalance).not.toBe(100); // Should not reset to default
        }
    });

    test('should maintain zen points display across multiple Free Play sessions', async ({ page }) => {
        const zenPointsElement = page.locator('#zenPoints');

        // Capture page errors
        const pageErrors = [];
        page.on('pageerror', error => {
            pageErrors.push(error.message);
        });

        // Session 1: Start and exit Free Play
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        const session1Text = await zenPointsElement.textContent();
        expect(session1Text).not.toBeNull();
        const session1Match = session1Text?.match(/Zen Points:\s*(\d+)/);
        expect(session1Match).not.toBeNull();
        const session1Balance = session1Match ? parseInt(session1Match[1]) : 0;

        // Set up dialog handler once for this session
        page.once('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Verify balance after session 1
        const afterSession1Text = await zenPointsElement.textContent();
        expect(afterSession1Text).not.toBeNull();
        const afterSession1Match = afterSession1Text?.match(/Zen Points:\s*(\d+)/);
        expect(afterSession1Match).not.toBeNull();
        const afterSession1Balance = afterSession1Match ? parseInt(afterSession1Match[1]) : 0;
        expect(afterSession1Balance).toBe(session1Balance);

        // Session 2: Start and exit Free Play again
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Wait for the game to fully initialize (cards should be dealt)
        // This ensures startFreePlayMode() and startNewRound() have completed
        await expect(page.locator('#playerCards .card')).toHaveCount(2, { timeout: 5000 });

        // Additional wait for mobile devices to ensure all async operations complete
        await page.waitForTimeout(1000);

        // Check if close button is visible and enabled
        const closeBtn = page.locator('#taskCloseBtn');
        await expect(closeBtn).toBeVisible();
        const buttonState = await closeBtn.evaluate(el => {
            // Check if event listeners are attached (can't directly check addEventListener listeners)
            // But we can trigger a click and see if it works
            return {
                enabled: !(el instanceof HTMLButtonElement && el.disabled),
                processing: el.dataset.processing,
                hasOnclick: el.onclick !== null,
                hasAttribute: el.getAttribute('onclick') !== null,
                id: el.id,
                className: el.className
            };
        });
        console.log('Close button state:', buttonState);

        // Wait a bit to ensure any previous processing is complete
        await page.waitForTimeout(1500);

        // Set up dialog handler for session 2 (same as session 1)
        page.once('dialog', dialog => dialog.accept());

        // Click the close button normally (not via evaluate)
        await closeBtn.click();

        // BUG: On mobile, the app gets stuck showing game area instead of Free Play overview
        // This is the navigation bug we're testing for
        await expect(page.locator('#freePlayOverview')).toBeVisible({ timeout: 10000 });
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // BUG TEST: Verify balance is still consistent
        const afterSession2Text = await zenPointsElement.textContent();
        expect(afterSession2Text).not.toBeNull();
        const afterSession2Match = afterSession2Text?.match(/Zen Points:\s*(\d+)/);
        expect(afterSession2Match).not.toBeNull();
        const afterSession2Balance = afterSession2Match ? parseInt(afterSession2Match[1]) : 0;

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
        expect(beforeShopText).not.toBeNull();
        const beforeShopMatch = beforeShopText?.match(/Zen Points:\s*(\d+)/);
        expect(beforeShopMatch).not.toBeNull();
        const beforeShopBalance = beforeShopMatch ? parseInt(beforeShopMatch[1]) : 0;

        // Visit shop
        await page.getByRole('button', { name: /Visit Shop/i }).click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Close shop
        await page.locator('#shopCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Verify zen points unchanged
        const afterShopText = await zenPointsElement.textContent();
        expect(afterShopText).not.toBeNull();
        const afterShopMatch = afterShopText?.match(/Zen Points:\s*(\d+)/);
        expect(afterShopMatch).not.toBeNull();
        const afterShopBalance = afterShopMatch ? parseInt(afterShopMatch[1]) : 0;
        expect(afterShopBalance).toBe(beforeShopBalance);

        // Close Free Play overview
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // BUG TEST: Verify zen points still correct at mode selection
        const finalZenPoints = await zenPointsElement.textContent();
        expect(finalZenPoints).not.toBeNull();
        const finalMatch = finalZenPoints?.match(/Zen Points:\s*(\d+)/);
        expect(finalMatch).not.toBeNull();
        const finalBalance = finalMatch ? parseInt(finalMatch[1]) : 0;

        console.log('Final balance after shop visit:', finalBalance);
        expect(finalBalance).toBe(beforeShopBalance);
    });
});


