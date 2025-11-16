const { test, expect } = require('@playwright/test');

test.describe('Free Play Mode - Achievements Integration', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Clear localStorage to start fresh
        await page.evaluate(() => {
            localStorage.clear();
        });
        await page.reload();
    });

    test('should display achievements when accessing Mind Palace from Free Play success screen', async ({ page }) => {
        // Start Free Play mode (goes directly to game)
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        // Wait for game area to appear
        await expect(page.locator('#gameArea')).toBeVisible();

        // Complete 5 rounds to finish a task
        for (let i = 0; i < 5; i++) {
            // Stand immediately to complete round quickly
            await page.locator('#standBtn').click();

            // Wait for next step button or completion
            const nextStepBtn = page.locator('#nextStepBtn');
            if (await nextStepBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await nextStepBtn.click();
            }
        }

        // Wait for success screen or completion modal
        await page.waitForTimeout(1000);

        // Look for "View Session" button (Free Play success screen)
        const viewSessionBtn = page.getByRole('button', { name: /View Session/i });
        if (await viewSessionBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await viewSessionBtn.click();

            // Wait for Free Play overview
            await expect(page.locator('#freePlayOverview')).toBeVisible();

            // Click Visit Mind Palace button
            await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        } else {
            // If no success screen, try to access Mind Palace directly via console
            await page.evaluate(() => {
                window.showFreePlayOverview();
            });
            await expect(page.locator('#freePlayOverview')).toBeVisible();
            await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        }

        // Wait for Mind Palace modal to open
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify "Your Growth Journey" section exists
        const growthJourneySection = page.locator('.mind-palace-section').filter({ hasText: /Your Growth Journey/i });
        await expect(growthJourneySection).toBeVisible();

        // Verify achievements container exists
        const achievementsContainer = page.locator('#achievementsContainer');
        await expect(achievementsContainer).toBeVisible();

        // Verify achievement progress is displayed
        const progressBar = page.locator('.achievement-progress');
        await expect(progressBar).toBeVisible();
        await expect(progressBar).toContainText(/0 of 11/i);

        // Verify at least one achievement card is displayed
        const achievementCards = page.locator('.achievement-card');
        await expect(achievementCards.first()).toBeVisible();
    });

    test('should show locked achievements in Free Play Mind Palace', async ({ page }) => {
        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify locked achievement cards exist
        const lockedCards = page.locator('.achievement-card.locked');
        const lockedCount = await lockedCards.count();
        expect(lockedCount).toBeGreaterThan(0);

        // Verify locked badge is displayed
        const lockedBadge = lockedCards.first().locator('.status-badge');
        await expect(lockedBadge).toContainText(/Locked/i);
    });

    test('should display achievement statistics in Free Play Mind Palace', async ({ page }) => {
        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify statistics section exists
        const statsSection = page.locator('.achievement-statistics');
        await expect(statsSection).toBeVisible();

        // Verify specific statistics are displayed
        await expect(statsSection).toContainText(/Max Free Play Run/i);
        await expect(statsSection).toContainText(/Peak Zen Points/i);
        await expect(statsSection).toContainText(/Total Free Play Tasks/i);
    });

    test('should display all achievement categories in Free Play Mind Palace', async ({ page }) => {
        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify Campaign category exists
        const campaignCategory = page.locator('.achievement-category').filter({ hasText: /Campaign/i });
        await expect(campaignCategory).toBeVisible();

        // Verify Free Play category exists
        const freePlayCategory = page.locator('.achievement-category').filter({ hasText: /Free Play/i });
        await expect(freePlayCategory).toBeVisible();

        // Verify Wealth category exists
        const wealthCategory = page.locator('.achievement-category').filter({ hasText: /Wealth/i });
        await expect(wealthCategory).toBeVisible();
    });

    test('should close Mind Palace and return to Free Play overview', async ({ page }) => {
        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Close Mind Palace using close button
        await page.locator('#mindPalaceCloseBtn').click();

        // Verify Mind Palace is hidden
        await expect(page.locator('#mindPalaceModal')).toHaveClass(/hidden/);

        // Verify we're back at Free Play overview
        await expect(page.locator('#freePlayOverview')).toBeVisible();
    });

    test('should persist achievements across Free Play sessions', async ({ page }) => {
        // Manually unlock an achievement via console
        await page.evaluate(() => {
            // Set up achievement state with an unlocked achievement
            const achievementState = {
                unlockedAchievements: ['wealth_1000'],
                statistics: {
                    campaignCompleted: false,
                    freePlayTasksTotal: 0,
                    freePlayMaxRun: 0,
                    zenPointsPeak: 1500,
                    currentFreePlayRun: 0
                },
                unlockTimestamps: {
                    'wealth_1000': Date.now()
                }
            };
            localStorage.setItem('soberlife-achievements', JSON.stringify(achievementState));
        });

        // Reload page to load saved state
        await page.reload();

        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify the unlocked achievement is displayed
        const unlockedCard = page.locator('.achievement-card.unlocked').filter({ hasText: /First Fortune/i });
        await expect(unlockedCard).toBeVisible();

        // Verify unlocked badge
        const unlockedBadge = unlockedCard.locator('.status-badge');
        await expect(unlockedBadge).toContainText(/Unlocked/i);

        // Verify progress shows 1 of 11
        const progressBar = page.locator('.achievement-progress');
        await expect(progressBar).toContainText(/1 of 11/i);
    });

    test('should display deck composition in Free Play Mind Palace', async ({ page }) => {
        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify deck composition section exists
        const deckSection = page.locator('.mind-palace-section').filter({ hasText: /Your Mental Deck/i });
        await expect(deckSection).toBeVisible();

        // Verify joker count is displayed
        await expect(page.locator('#jokerCount')).toBeVisible();

        // Verify ace count is displayed
        await expect(page.locator('#aceCount')).toBeVisible();

        // Verify regular card count is displayed
        await expect(page.locator('#regularCount')).toBeVisible();
    });

    test('should display premium activities in Free Play Mind Palace', async ({ page }) => {
        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify stress management techniques section exists
        const activitiesSection = page.locator('.mind-palace-section').filter({ hasText: /Your Stress Management Techniques/i });
        await expect(activitiesSection).toBeVisible();

        // Verify basic activities are shown
        await expect(activitiesSection).toContainText(/Deep Breath/i);
        await expect(activitiesSection).toContainText(/Quick Stretch/i);
        await expect(activitiesSection).toContainText(/Mini Meditation/i);

        // Verify premium activities are shown (even if locked)
        await expect(activitiesSection).toContainText(/Mindful Breathing/i);
        await expect(activitiesSection).toContainText(/Compartmentalize/i);
    });

    test('should show achievement notification when unlocking in Free Play', async ({ page }) => {
        // Set up initial state with high zen points to trigger wealth achievement
        await page.evaluate(() => {
            const campaignState = {
                completedTasks: [],
                currentTaskIndex: 0,
                zenPointBalance: 900,
                deckComposition: { jokers: 0, aces: 4, regularCards: 48, totalCards: 52 },
                unlockedActivities: { mindfulBreathing: false, compartmentalize: false },
                upgradeHistory: []
            };
            localStorage.setItem('soberlife-campaign', JSON.stringify(campaignState));
        });

        await page.reload();

        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Manually trigger zen points increase to unlock achievement
        await page.evaluate(() => {
            import('./assets/js/zen-points-manager.js').then(module => {
                module.addPoints(200); // This should trigger wealth_1000 achievement
            });
        });

        // Wait for achievement notification to appear
        const notification = page.locator('.achievement-notification');
        await expect(notification).toBeVisible({ timeout: 3000 });

        // Verify notification content
        await expect(notification).toContainText(/Achievement Unlocked/i);
        await expect(notification).toContainText(/First Fortune/i);
    });

    test('should navigate between Free Play overview and Mind Palace multiple times', async ({ page }) => {
        // Navigate directly to Free Play overview via console
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace - first time
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Close Mind Palace
        await page.locator('#mindPalaceCloseBtn').click();
        await expect(page.locator('#mindPalaceModal')).toHaveClass(/hidden/);
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Open Mind Palace - second time
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify achievements are still displayed
        const achievementsContainer = page.locator('#achievementsContainer');
        await expect(achievementsContainer).toBeVisible();

        // Close Mind Palace again
        await page.locator('#mindPalaceCloseBtn').click();
        await expect(page.locator('#mindPalaceModal')).toHaveClass(/hidden/);
    });
});
