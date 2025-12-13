import { test, expect } from '@playwright/test';

test.describe('Issue #62: Free Play Bust Stats', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Wait for game to initialize
        await page.waitForFunction(() => window.gameFunctionsReady === true, { timeout: 10000 });

        // Mock achievement state to ensure we have a known "Best Run"
        await page.evaluate(() => {
            // Import if possible, or just hack the global state exposed by modules or if we can access it.
            // Since modules are closed scope, we rely on the fact that achievementState is likely singleton or referenced.
            // Wait, we can't easily modify the module state from outside unless it's exposed.
            // However, achievement-manager.js initializes from localStorage.

            const state = {
                unlockedAchievements: [],
                statistics: {
                    campaignCompleted: false,
                    freePlayTasksTotal: 10,
                    freePlayMaxRun: 5, // Set a known best run
                    freePlayMaxRounds: 25, // Set known best rounds
                    zenPointsPeak: 500,
                    currentFreePlayRun: 0
                },
                unlockTimestamps: {}
            };
            localStorage.setItem('soberlife-achievements', JSON.stringify(state));
        });

        // Reload to pick up the localStorage
        await page.reload();
        await page.waitForFunction(() => window.gameFunctionsReady === true, { timeout: 10000 });
    });

    test('should show best run stats on game over', async ({ page }) => {
        // Start Free Play Mode
        await page.click('button[onclick="startFreePlayMode()"]');

        // Verify we are in Free Play
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Check for the "Best Run" text on the landing page
        const landingStatsText = await page.locator('#freePlayStats').textContent();
        console.log('Landing Stats Text:', landingStatsText);
        expect(landingStatsText).toContain('Best: 5');
        expect(landingStatsText).toContain('Best: 25'); // Verify Best Rounds

        await page.click('#freePlayStartBtn');
        await expect(page.locator('#gameArea')).toBeVisible();

        // Manipulate game state to force a bust
        await page.evaluate(() => {
            // Force high stress to ensure game over happens on bust
            // Or better, just force the game over state directly if possible, but playing it out is safer integration test

            // Let's force a bust by giving the player 30 points
            const { updateGameState, showGameOver, gameState } = window.mainModule || {};
            // We might not have direct access to mainModule export if it's not on window.
            // But index.html assigns many things to window.

            // Let's check window exposition in index.html
            // window.hit = mainModule.hit;
            // window.stand = mainModule.stand;

            // We need to bust. We can keep hitting.
        });

        // Script to force bust: keep hitting until score > 21
        // We can hook into the game logic via window functions

        let isGameOver = false;
        while (!isGameOver) {
            const score = await page.evaluate(() => {
                const scoreEl = document.getElementById('playerScore');
                return parseInt(scoreEl.innerText.replace('Score: ', ''));
            });

            if (score > 21) {
                break; // Busted
            }

            // Check if game over screen is visible
            isGameOver = await page.isVisible('#gameOverScreen');
            if (isGameOver) break;

            // Hit
            const hitBtn = page.locator('#hitBtn');
            if (await hitBtn.isEnabled()) {
                await hitBtn.click();
                await page.waitForTimeout(500); // Wait for animation
            } else {
                break;
            }
        }

        // If we just busted a hand, stress increases. We need to reach 100% stress for Game Over screen and "Best Run" stat.
        // "Free play mode bust: show last run and best run stats"
        // The issue description implies "Game Over" (bust of the run), or maybe just "Bust" of a hand?
        // Let's re-read the code I changed.

        // I changed `showGameOver` in `ui-manager.js`.
        // `showGameOver` is called when stress >= 100 or manually invoked.
        // So I need to trigger Game Over.

        await page.evaluate(() => {
            // Force stress to 100 and call showGameOver to simulate run end
            if (window.mainModule) {
                // Try to access internal state if possible, or just set text content to verify my change logic?
                // No, let's try to trigger it naturally or via exposed debug if any.
            }

            // Accessing internal state is hard.
            // But we can just use the provided window functions if they exist.
            // Or write to the DOM directly... no that's cheating.

            // Let's use the 'hit' button until stress is 100.
            // That might take too long.

            // Shortcut: We can inject a script to call showGameOver directly if it was exposed?
            // It's not exposed primarily.

            // Use help modal "Nirvana Mode" to add zen points? No we want stress.

            // We can manipulate the stress level in localStorage? No, it's in-memory variable `gameState`.

            // Wait, `showGameOver` IS NOT exposed on window in index.html.
            // BUT `window.startFreePlayMode` is.

            // Let's just bust repeatedly.
            // Or... we accepted that I can't easily force it without internal access.
            // But I can use `window.updateGameState` if it was exposed? Use `window.mainModule`?
            // `import * as mainModule from './assets/js/main.js?v=0.28.1'; window.startSingleTaskMode = mainModule.startSingleTaskMode;`
            // The module object itself isn't exposed, just specific functions.

            // HOWEVER, I can modify the test to inject a "cheat" function into the page context using addInitScript?
            // Or just rely on the fact that I can loop hit until game over.
            // In Free Play, stress multiplier increases. Busting adds stress.
            // A bust adds 30 stress. So ~4 busts = Game Over.
        });

        // Loop to bust hands until Game Over
        let attempts = 0;
        while (attempts < 10) {
            if (await page.isVisible('#gameOverScreen')) break;

            // Play a hand until bust
            while (await page.locator('#hitBtn').isEnabled()) {
                const scoreText = await page.locator('#playerScore').textContent();
                const score = parseInt(scoreText.replace('Score: ', ''));
                if (score > 21) break; // Busted hand

                await page.click('#hitBtn');
                await page.waitForTimeout(200);
            }

            // If Next Step button is visible, click it to start new round
            if (await page.isVisible('#nextStepBtn') && !await page.isVisible('#gameOverScreen')) {
                await page.click('#nextStepBtn');
                await page.waitForTimeout(500);
            }

            attempts++;
        }

        await expect(page.locator('#gameOverScreen')).toBeVisible();

        // Check for the "Tasks Completed: 0 (Best: 5)" text
        // The ID is 'stepsCompleted' but we replaced the parent innerHTML so accessing #stepsCompleted text might just be "0"
        // We want to verify the parent text content.

        const stepsEl = page.locator('#stepsCompleted');
        const parentText = await stepsEl.evaluate(el => el.parentElement.textContent);
        console.log('Parent Text:', parentText);

        expect(parentText).toContain('Tasks Completed');
        expect(parentText).toContain('Best: 5');
        expect(parentText).not.toContain('/5');

        // Click "Return to Menu" and verify we go to Free Play Overview
        await page.click('#returnToMenuBtnGameOver');
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(page.locator('#gameModeSelection')).not.toBeVisible();

        // Verify stats on landing page reflect the just-finished run (0 tasks)
        // Wait, startFreePlayMode calls showFreePlayOverview which updates UI.
        // GameState still holds the values from the run.
        const overviewStats = await page.locator('#freePlayStats').textContent();
        expect(overviewStats).toContain('Tasks Completed: 0');
    });
});
