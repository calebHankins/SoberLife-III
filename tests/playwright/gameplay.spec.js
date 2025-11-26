// @ts-check
const { test, expect } = require('@playwright/test');
const helpers = require('./test-helpers.cjs');

test.describe('Blackjack Gameplay', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Start free play mode for quick gameplay testing via helper
        await helpers.enterFreePlaySession(page);
    });

    test('should display player and house cards', async ({ page }) => {
        await expect(page.locator('#playerCards')).toBeVisible();
        await expect(page.locator('#houseCards')).toBeVisible();
        await expect(page.locator('#playerScore')).toBeVisible();
        await expect(page.locator('#houseScore')).toBeVisible();
    });

    test('should have functional hit and stand buttons', async ({ page }) => {
        const hitBtn = page.locator('#hitBtn');
        const standBtn = page.locator('#standBtn');

        await expect(hitBtn).toBeVisible();
        await expect(hitBtn).toBeEnabled();
        await expect(standBtn).toBeVisible();
        await expect(standBtn).toBeEnabled();
    });

    test('should update player score when hitting', async ({ page }) => {
        const initialScore = await page.locator('#playerScore').textContent();
        const initialCardCount = await page.locator('#playerCards .card').count();

        await page.locator('#hitBtn').click();

        // Wait for a new card to be added to the player's hand
        await page.waitForFunction(
            (count) => document.querySelectorAll('#playerCards .card').length > count,
            initialCardCount,
            { timeout: 2000 }
        );

        // Wait for score to update
        await page.waitForFunction(
            (initial) => document.querySelector('#playerScore').textContent !== initial,
            initialScore,
            { timeout: 2000 }
        );

        const newScore = await page.locator('#playerScore').textContent();
        const newCardCount = await page.locator('#playerCards .card').count();

        expect(newCardCount).toBeGreaterThan(initialCardCount);
        expect(newScore).not.toBe(initialScore);
    });

    test('should show round result after standing', async ({ page }) => {
        await page.locator('#standBtn').click();
        await page.waitForTimeout(1000); // Wait for house to play

        await expect(page.locator('#roundResult')).toBeVisible();
    });

    test('should display zen activities panel', async ({ page }) => {
        await expect(page.locator('#zenActivities')).toBeVisible();
        await expect(page.locator('#breathBtn')).toBeVisible();
        await expect(page.locator('#stretchBtn')).toBeVisible();
        await expect(page.locator('#meditationBtn')).toBeVisible();
    });
});

test.describe('Stress Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Navigate to free play overview (do not immediately launch game)
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        // Click Play to begin the session
        await page.locator('#freePlayOverview button:has-text("Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();
    });

    test('should show stress meter with fill', async ({ page }) => {
        await expect(page.locator('.stress-meter')).toBeVisible();
        await expect(page.locator('#stressFill')).toBeVisible();
    });

    test('should display zen points balance', async ({ page }) => {
        const zenPoints = page.locator('#zenPoints');
        await expect(zenPoints).toBeVisible();
        await expect(zenPoints).toContainText('Zen Points:');
    });

    test('should show activity costs and benefits', async ({ page }) => {
        await expect(page.locator('#breathBtn')).toContainText('10 zen points');
        await expect(page.locator('#stretchBtn')).toContainText('25 zen points');
        await expect(page.locator('#meditationBtn')).toContainText('50 zen points');
    });

    test('should update avatar based on stress level', async ({ page }) => {
        const avatar = page.locator('#avatar');
        await expect(avatar).toBeVisible();

        const initialAvatar = await avatar.textContent();
        expect(initialAvatar).toBeTruthy();
    });
});

test.describe('Task Progression', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Start task mode with survey
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        // Complete survey
        await page.locator('input[name="sleep"][value="0"]').click();
        await page.locator('input[name="prepared"][value="0"]').click();
        await page.locator('input[name="day"][value="0"]').click();
        await page.locator('#startTaskBtn').click();
    });

    test('should display task info with step indicator', async ({ page }) => {
        await expect(page.locator('#taskInfo')).toBeVisible();
        await expect(page.locator('#stepIndicator')).toContainText('Step');
        await expect(page.locator('#taskDescription')).toBeVisible();
    });

    test('should show contextual action buttons', async ({ page }) => {
        // In task mode, buttons should have contextual text
        const hitBtn = page.locator('#hitBtn');
        const standBtn = page.locator('#standBtn');

        await expect(hitBtn).toBeVisible();
        await expect(standBtn).toBeVisible();
    });

    test('should allow closing task', async ({ page }) => {
        await expect(page.locator('#taskCloseBtn')).toBeVisible();
    });
});

test.describe('Game Over and Success', () => {
    test('should have game over screen elements', async ({ page }) => {
        await page.goto('/');

        // Check that game over screen exists (even if hidden)
        const gameOverScreen = page.locator('#gameOverScreen');
        await expect(gameOverScreen).toBeAttached();
        await expect(page.locator('#gameOverMessage')).toBeAttached();
        await expect(page.locator('#tryAgainBtn')).toBeAttached();
    });

    test('should have success screen elements', async ({ page }) => {
        await page.goto('/');

        // Check that success screen exists (even if hidden)
        const successScreen = page.locator('#gameSuccessScreen');
        await expect(successScreen).toBeAttached();
        await expect(page.locator('#successMessage')).toBeAttached();
        await expect(page.locator('#playAgainBtn')).toBeAttached();
    });
});
