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
        const versionFooter = page.locator('#versionFooter');
        await expect(versionFooter).toBeHidden();

        // Handle confirmation dialog if game is in progress
        page.on('dialog', dialog => dialog.accept());
        await page.locator('#taskCloseBtn').click();

        await expect(versionFooter).toBeVisible();
    });
});
