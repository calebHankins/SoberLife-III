// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Game Mode Selection', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display all three game mode options', async ({ page }) => {
        await expect(page.locator('.game-mode-selection')).toBeVisible();
        await expect(page.getByRole('button', { name: /Start Next Task/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Start Campaign/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Start Free Play/i })).toBeVisible();
    });

    test('should show game header and help button', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('SoberLife - III');
        await expect(page.locator('#helpBtn')).toBeVisible();
    });

    test('should display avatar and stress meter', async ({ page }) => {
        await expect(page.locator('#avatar')).toBeVisible();
        await expect(page.locator('.stress-meter')).toBeVisible();
        await expect(page.locator('#zenPoints')).toContainText('Zen Points:');
    });

    test('should display version footer on landing page', async ({ page }) => {
        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeVisible();
        await expect(versionFooter).toHaveText(/v\d+\.\d+\.\d+/);
    });
});

test.describe('Campaign Mode', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should navigate to campaign overview', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#campaignOverview h2')).toContainText('Stress Management Campaign');
    });

    test('should hide version footer when entering campaign mode', async ({ page }) => {
        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeVisible();

        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(versionFooter).toBeHidden();
    });

    test('should show version footer when returning to mode selection from campaign', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeHidden();

        await page.locator('#campaignCloseBtn').click();
        await expect(versionFooter).toBeVisible();
    });

    test('should display campaign progress and deck status', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#deckComposition')).toBeVisible();
        await expect(page.locator('#campaignProgress')).toBeVisible();
    });

    test('should show task list with available tasks', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#taskList')).toBeVisible();
        const taskCards = page.locator('.task-card');
        await expect(taskCards.first()).toBeVisible();
    });

    test('should have shop and mind palace buttons', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.getByRole('button', { name: /Visit Shop/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Visit Mind Palace/i })).toBeVisible();
    });

    test('should allow closing campaign overview', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();
        await page.locator('#campaignCloseBtn').click();
        await expect(page.locator('#campaignOverview')).toHaveClass(/hidden/);
    });
});

test.describe('Jump Into Task Mode', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should start task mode and show survey', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();
        await expect(page.locator('#surveySection')).toBeVisible();
        await expect(page.locator('#surveySection h3')).toContainText('Pre-Task Assessment');
    });

    test('should hide version footer when entering task mode', async ({ page }) => {
        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeVisible();

        await page.getByRole('button', { name: /Start Next Task/i }).click();
        await expect(versionFooter).toBeHidden();
    });

    test('should show version footer when closing task', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();
        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeHidden();

        await page.locator('#surveyCloseBtn').click();
        await expect(versionFooter).toBeVisible();
    });

    test('should require all survey questions to be answered', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        const startTaskBtn = page.locator('#startTaskBtn');
        await expect(startTaskBtn).toBeDisabled();

        // Answer all questions
        await page.locator('input[name="sleep"][value="10"]').click();
        await page.locator('input[name="prepared"][value="10"]').click();
        await page.locator('input[name="day"][value="10"]').click();

        await expect(startTaskBtn).toBeEnabled();
    });

    test('should show error if survey incomplete', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        // Try to start without answering all questions
        await page.locator('input[name="sleep"][value="10"]').click();

        // Button should still be disabled with only one question answered
        await expect(page.locator('#startTaskBtn')).toBeDisabled();
    });
});

test.describe('Free Play Mode', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should start free play mode directly', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        // Free play should skip survey and go straight to game
        await expect(page.locator('#gameArea')).toBeVisible();
        await expect(page.locator('#hitBtn')).toBeVisible();
        await expect(page.locator('#standBtn')).toBeVisible();
    });

    test('should show generic action buttons in free play', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        // Verify generic button text (not contextual)
        await expect(page.locator('#hitBtn')).toContainText('Hit');
        await expect(page.locator('#standBtn')).toContainText('Stand');
    });

    test('should hide version footer when entering free play mode', async ({ page }) => {
        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeVisible();

        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(versionFooter).toBeHidden();
    });

    test('should show version footer when closing free play', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        // Wait for game area to be visible (ensures Free Play mode has started)
        await expect(page.locator('#gameArea')).toBeVisible();

        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeHidden();

        // Handle confirmation dialog if game is in progress
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();

        // Should show Free Play overview first
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(versionFooter).toBeHidden();

        // Close Free Play overview to return to mode selection
        await page.locator('#freePlayCloseBtn').click();
        await expect(versionFooter).toBeVisible();
    });

    test('should display zen points correctly when returning from free play mode', async ({ page }) => {
        // Get initial zen points from landing page
        const zenPointsElement = page.locator('#zenPoints');
        const initialZenPoints = await zenPointsElement.textContent();

        // Start Free Play Mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Zen points should still be visible in game area
        await expect(zenPointsElement).toBeVisible();

        // Exit to Free Play overview
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();

        // Verify we're at Free Play overview
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Close Free Play overview to return to mode selection
        await page.locator('#freePlayCloseBtn').click();

        // Verify we're back at mode selection
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Verify zen points are displayed and match initial value
        await expect(zenPointsElement).toBeVisible();
        const finalZenPoints = await zenPointsElement.textContent();
        expect(finalZenPoints).toBe(initialZenPoints);
    });
});

test.describe('Screen Navigation - Bug Fix', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should only show mode selection when exiting campaign mode', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Exit campaign mode
        await page.locator('#campaignCloseBtn').click();

        // Verify only mode selection is visible
        await expect(page.locator('#gameModeSelection')).toBeVisible();
        await expect(page.locator('#campaignOverview')).toHaveClass(/hidden/);
        await expect(page.locator('#surveySection')).toHaveClass(/hidden/);
        await expect(page.locator('#taskInfo')).toHaveClass(/hidden/);
        await expect(page.locator('#gameArea')).toHaveClass(/hidden/);
        await expect(page.locator('#upgradeShop')).toHaveClass(/hidden/);
    });

    test('should show free play overview when exiting free play mode early', async ({ page }) => {
        // Start free play mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit free play mode early using close button
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();

        // Verify Free Play overview is shown
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Verify other screens are hidden
        await expect(page.locator('#gameModeSelection')).toHaveClass(/hidden/);
        await expect(page.locator('#campaignOverview')).toHaveClass(/hidden/);
        await expect(page.locator('#taskInfo')).toHaveClass(/hidden/);
        await expect(page.locator('#zenActivities')).toHaveClass(/hidden/);
        await expect(page.locator('#gameArea')).toHaveClass(/hidden/);
        await expect(page.locator('#upgradeShop')).toHaveClass(/hidden/);
    });

    test('should not show campaign overview when exiting free play', async ({ page }) => {
        // Start free play mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit free play mode
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();

        // Specifically verify campaign overview is hidden (the bug was showing it)
        const campaignOverview = page.locator('#campaignOverview');
        await expect(campaignOverview).toHaveClass(/hidden/);

        // Verify it's not visible in the DOM
        const isVisible = await campaignOverview.isVisible();
        expect(isVisible).toBe(false);

        // Verify Free Play overview is shown instead
        await expect(page.locator('#freePlayOverview')).toBeVisible();
    });

    test('should show only mode selection after campaign then free play exit', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Exit campaign
        await page.locator('#campaignCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Start free play mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit free play mode - should show Free Play overview
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Close Free Play overview to return to mode selection
        await page.locator('#freePlayCloseBtn').click();

        // Verify clean state - only mode selection visible
        await expect(page.locator('#gameModeSelection')).toBeVisible();
        await expect(page.locator('#campaignOverview')).toHaveClass(/hidden/);
        await expect(page.locator('#gameArea')).toHaveClass(/hidden/);
    });

    test('should show only mode selection after free play then campaign exit', async ({ page }) => {
        // Start free play mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Exit free play mode - should show Free Play overview
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Close Free Play overview to return to mode selection
        await page.locator('#freePlayCloseBtn').click();
        await expect(page.locator('#gameModeSelection')).toBeVisible();

        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await expect(page.locator('#campaignOverview')).toBeVisible();

        // Exit campaign
        await page.locator('#campaignCloseBtn').click();

        // Verify clean state - only mode selection visible
        await expect(page.locator('#gameModeSelection')).toBeVisible();
        await expect(page.locator('#campaignOverview')).toHaveClass(/hidden/);
        await expect(page.locator('#gameArea')).toHaveClass(/hidden/);
    });

    test('should properly hide all screens when exiting campaign', async ({ page }) => {
        // Start campaign mode
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        // Exit campaign mode
        await page.locator('#campaignCloseBtn').click();

        // Verify all game screens are hidden
        const hiddenScreens = [
            '#campaignOverview',
            '#surveySection',
            '#taskInfo',
            '#zenActivities',
            '#gameArea',
            '#gameOverScreen',
            '#gameSuccessScreen',
            '#upgradeShop'
        ];

        for (const screenId of hiddenScreens) {
            await expect(page.locator(screenId)).toHaveClass(/hidden/);
        }
    });

    test('should properly hide all screens when exiting free play', async ({ page }) => {
        // Start free play mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        // Exit free play mode
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();

        // Verify all game screens are hidden
        const hiddenScreens = [
            '#campaignOverview',
            '#surveySection',
            '#taskInfo',
            '#zenActivities',
            '#gameArea',
            '#gameOverScreen',
            '#gameSuccessScreen',
            '#upgradeShop'
        ];

        for (const screenId of hiddenScreens) {
            await expect(page.locator(screenId)).toHaveClass(/hidden/);
        }
    });
});



test.describe('Free Play Overview', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should show free play overview when exiting game early', async ({ page }) => {
        // Start free play mode
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Set up dialog handler BEFORE clicking close button
        page.once('dialog', dialog => {
            dialog.accept();
        });

        // Exit game early using close button
        await page.locator('#taskCloseBtn').click();

        // Wait a bit for the UI to update
        await page.waitForTimeout(500);

        // Verify Free Play overview is displayed
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await expect(page.locator('#freePlayOverview h2')).toContainText('Free Play Mode');
    });
});
