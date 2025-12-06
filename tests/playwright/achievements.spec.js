const { test, expect } = require('./fixtures');

test.describe('Achievements System', () => {
    test.beforeEach(async ({ page, ensureGameReady }) => {
        // Navigate to the game
        await page.goto('/');

        // Clear localStorage to start fresh
        await page.evaluate(() => {
            localStorage.clear();
        });

        // Reload state and wait for the inline module to wire exports to window
        await ensureGameReady();
    });

    test('should display achievements in Mind Palace', async ({ page }) => {
        // Start campaign mode to access Mind Palace
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        // Wait for campaign overview
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Click Visit Mind Palace button
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();


        // Wait for Mind Palace modal
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Check that achievements section exists
        await expect(page.locator('#upgradeHistoryContent')).toBeVisible();

        // Check for achievement progress summary
        await expect(page.locator('.achievement-progress-summary')).toBeVisible();

        // Check for statistics section
        await expect(page.locator('.achievement-statistics')).toBeVisible();

        // Check for achievement categories
        await expect(page.locator('.achievement-category')).toHaveCount(3); // Campaign, Free Play, Wealth

        // Check that locked achievements are displayed
        const lockedAchievements = page.locator('.achievement-card.locked');
        await expect(lockedAchievements).toHaveCount(11); // All achievements should be locked initially
    });

    test('should show achievement notification when unlocked', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Manually trigger an achievement unlock for testing
        await page.evaluate(() => {
            // Import and unlock an achievement
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.unlockAchievement('wealth_1000');
            });
        });

        // Wait for notification to appear
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Check notification content
        await expect(page.locator('.achievement-notification-header h3')).toContainText('Achievement Unlocked');
        await expect(page.locator('.achievement-notification-body h4')).toBeVisible();

        // Check that close button exists
        await expect(page.locator('.achievement-notification-close')).toBeVisible();
    });

    test('should unlock campaign master achievement when all tasks completed', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Manually complete all campaign tasks
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.updateStatistic('campaignCompleted', true);
                module.checkAchievement('campaign_master');
            });
        });

        // Wait for achievement notification
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Verify it's the campaign master achievement
        await expect(page.locator('.achievement-notification-body h4')).toContainText('Campaign Master');

        // Open Mind Palace and verify achievement is unlocked
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Check that campaign master achievement is unlocked
        const campaignAchievement = page.locator('[data-achievement-id="campaign_master"]');
        await expect(campaignAchievement).toHaveClass(/unlocked/);
        await expect(campaignAchievement.locator('.status-badge')).toContainText('Unlocked');
    });

    test('should track and display Free Play task milestones', async ({ page }) => {
        // Start campaign mode (to access Mind Palace)
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Simulate completing 5 Free Play tasks
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.updateStatistic('freePlayTasksTotal', 5);
                module.checkMilestones('free_play', 5);
            });
        });

        // Wait for achievement notification
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Verify it's the 5 tasks achievement
        await expect(page.locator('.achievement-notification-body h4')).toContainText('Getting Started');

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Check statistics display
        const statsSection = page.locator('.achievement-statistics');
        await expect(statsSection).toBeVisible();
        await expect(statsSection).toContainText('Total Free Play Tasks');
        await expect(statsSection).toContainText('5 tasks');

        // Check that free_play_5 achievement is unlocked
        const freePlayAchievement = page.locator('[data-achievement-id="free_play_5"]');
        await expect(freePlayAchievement).toHaveClass(/unlocked/);
    });

    test('should track and display wealth milestones', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Simulate accumulating 1000 zen points
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.updateStatistic('zenPointsPeak', 1000);
                module.checkMilestones('wealth', 1000);
            });
        });

        // Wait for achievement notification
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Verify it's the wealth achievement
        await expect(page.locator('.achievement-notification-body h4')).toContainText('Seeds of Calm');

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Check statistics display
        const statsSection = page.locator('.achievement-statistics');
        await expect(statsSection).toBeVisible();
        await expect(statsSection).toContainText('Peak Zen Points');
        await expect(statsSection).toContainText('1,000 points');

        // Check that wealth_1000 achievement is unlocked
        const wealthAchievement = page.locator('[data-achievement-id="wealth_1000"]');
        await expect(wealthAchievement).toHaveClass(/unlocked/);
    });

    test('should persist achievements across browser sessions', async ({ page, ensureGameReady }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Unlock an achievement
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.unlockAchievement('wealth_1000');
            });
        });

        // Wait for notification
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Reload the page (simulating browser session restart) and ensure the app is ready
        await ensureGameReady();

        // Start campaign mode again
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Verify achievement is still unlocked
        const wealthAchievement = page.locator('[data-achievement-id="wealth_1000"]');
        await expect(wealthAchievement).toHaveClass(/unlocked/);
    });

    test('should not show duplicate notifications for already unlocked achievements', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Unlock an achievement
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.unlockAchievement('wealth_1000');
            });
        });

        // Wait for first notification
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Wait for notification to disappear (auto-dismiss after 5 seconds + 350ms animation)
        await page.waitForTimeout(5500);
        await expect(page.locator('.achievement-notification')).not.toBeVisible();

        // Try to unlock the same achievement again
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.unlockAchievement('wealth_1000');
            });
        });

        // Verify no new notification appears
        await page.waitForTimeout(1000);
        await expect(page.locator('.achievement-notification')).not.toBeVisible();
    });

    test('should display max Free Play run statistic', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Set max run statistic
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.updateStatistic('freePlayMaxRun', 7);
            });
        });

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Check statistics display
        const statsSection = page.locator('.achievement-statistics');
        await expect(statsSection).toBeVisible();
        await expect(statsSection).toContainText('Max Free Play Run');
        await expect(statsSection).toContainText('7 tasks');
    });

    test('should auto-dismiss notification after 5 seconds', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Unlock an achievement
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.unlockAchievement('wealth_1000');
            });
        });

        // Wait for notification to appear
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Wait for auto-dismiss (5 seconds + 350ms animation)
        await page.waitForTimeout(5500);
        await expect(page.locator('.achievement-notification')).not.toBeVisible();
    });

    test('should manually close notification when close button clicked', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Unlock an achievement
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.unlockAchievement('wealth_1000');
            });
        });

        // Wait for notification to appear
        await expect(page.locator('.achievement-notification')).toBeVisible({ timeout: 2000 });

        // Click close button
        await page.locator('.achievement-notification-close').click();

        // Verify notification disappears quickly
        await expect(page.locator('.achievement-notification')).not.toBeVisible({ timeout: 1000 });
    });

    test('should show achievement progress percentage', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Unlock a few achievements
        await page.evaluate(() => {
            // @ts-ignore - Dynamic import in browser context
            import('./assets/js/achievement-manager.js').then(module => {
                module.unlockAchievement('wealth_1000');
                module.unlockAchievement('free_play_5');
            });
        });

        // Open Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Check progress summary
        const progressSummary = page.locator('.achievement-progress-summary');
        await expect(progressSummary).toBeVisible();
        await expect(progressSummary).toContainText('2 of 11 achievements unlocked');
        await expect(progressSummary).toContainText('18%'); // 2/11 = ~18%

        // Check progress bar
        const progressFill = page.locator('.progress-fill');
        await expect(progressFill).toBeVisible();
    });
});
