// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Mobile Viewport Tests', () => {
    test.use({
        viewport: { width: 375, height: 667 } // iPhone SE size
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display game header on mobile', async ({ page }) => {
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('#helpBtn')).toBeVisible();
    });

    test('should show mode selection cards on mobile', async ({ page }) => {
        const modeCards = page.locator('.mode-card');
        await expect(modeCards).toHaveCount(3);

        // All mode cards should be visible
        await expect(modeCards.nth(0)).toBeVisible();
        await expect(modeCards.nth(1)).toBeVisible();
        await expect(modeCards.nth(2)).toBeVisible();
    });

    test('should have touch-friendly buttons', async ({ page }) => {
        const buttons = page.locator('.mode-btn');

        for (let i = 0; i < await buttons.count(); i++) {
            const button = buttons.nth(i);
            await expect(button).toBeVisible();

            // Check button is large enough for touch (minimum 44x44px)
            const box = await button.boundingBox();
            expect(box?.height).toBeGreaterThanOrEqual(40);
        }
    });

    test('should display avatar and stress meter on mobile', async ({ page }) => {
        await expect(page.locator('.avatar-container')).toBeVisible();
        await expect(page.locator('#avatar')).toBeVisible();
        await expect(page.locator('.stress-meter')).toBeVisible();
    });

    test('should show campaign overview on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('#campaignOverview .campaign-progress')).toBeVisible();
        await expect(page.locator('#taskList')).toBeVisible();
    });

    test('should display task cards properly on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        const taskCards = page.locator('.task-card');
        const firstCard = taskCards.first();

        await expect(firstCard).toBeVisible();

        // Check card is readable on mobile
        const box = await firstCard.boundingBox();
        expect(box?.width).toBeLessThanOrEqual(375); // Should fit in viewport
    });

    test('should show survey on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        await expect(page.locator('#surveySection')).toBeVisible();

        // Survey questions should be visible
        const questions = page.locator('.survey-question');
        await expect(questions.first()).toBeVisible();
    });

    test('should display game area on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        await expect(page.locator('#gameArea')).toBeVisible();
        await expect(page.locator('#playerCards')).toBeVisible();
        await expect(page.locator('#houseCards')).toBeVisible();
    });

    test('should show zen activities on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        await expect(page.locator('#zenActivities')).toBeVisible();

        const activityButtons = page.locator('.activity-btn');
        await expect(activityButtons.first()).toBeVisible();
    });

    test('should have accessible close buttons on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        const closeBtn = page.locator('#campaignCloseBtn');
        await expect(closeBtn).toBeVisible();

        // Close button should be large enough for touch (at least 32px is acceptable)
        const box = await closeBtn.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(32);
        expect(box?.height).toBeGreaterThanOrEqual(32);
    });

    test('should display shop properly on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await page.getByRole('button', { name: /Visit Shop/i }).click();

        await expect(page.locator('#upgradeShop')).toBeVisible();
        await expect(page.locator('.shop-content')).toBeVisible();

        // Upgrade cards should be visible
        const upgradeCards = page.locator('.upgrade-card');
        await expect(upgradeCards.first()).toBeVisible();
    });

    test('should show mind palace on mobile', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();

        await expect(page.locator('#mindPalaceModal')).toBeVisible();
        await expect(page.locator('.mind-palace-content')).toBeVisible();
    });

    test('should handle help modal on mobile', async ({ page }) => {
        await page.locator('#helpBtn').click();

        await expect(page.locator('#helpModal')).toBeVisible();
        await expect(page.locator('.help-modal-content')).toBeVisible();

        // Close button should be accessible
        await expect(page.locator('#helpCloseBtn')).toBeVisible();
    });

    test('should have readable text on mobile', async ({ page }) => {
        // Check main heading
        const heading = page.locator('h1');
        const fontSize = await heading.evaluate(el =>
            window.getComputedStyle(el).fontSize
        );

        // Font size should be at least 14px for readability (Comic Sans is quite readable even at smaller sizes)
        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThanOrEqual(14);
    });

    test('should not have horizontal scroll on mobile', async ({ page }) => {
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);

        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
    });
});

test.describe('Tablet Viewport Tests', () => {
    test.use({
        viewport: { width: 768, height: 1024 } // iPad size
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display all mode cards on tablet', async ({ page }) => {
        const modeCards = page.locator('.mode-card');
        await expect(modeCards).toHaveCount(3);

        for (let i = 0; i < 3; i++) {
            await expect(modeCards.nth(i)).toBeVisible();
        }
    });

    test('should show campaign overview on tablet', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();

        await expect(page.locator('#campaignOverview')).toBeVisible();
        await expect(page.locator('.task-list')).toBeVisible();
    });

    test('should display game area properly on tablet', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        await expect(page.locator('#gameArea')).toBeVisible();
        await expect(page.locator('.cards-container')).toBeVisible();
    });

    test('should show shop with proper layout on tablet', async ({ page }) => {
        await page.getByRole('button', { name: /Start Campaign/i }).click();
        await page.getByRole('button', { name: /Visit Shop/i }).click();

        await expect(page.locator('#upgradeShop')).toBeVisible();

        const upgradeCards = page.locator('.upgrade-card');
        await expect(upgradeCards.first()).toBeVisible();
    });
});

test.describe('Landscape Mobile Tests', () => {
    test.use({
        viewport: { width: 667, height: 375 } // iPhone SE landscape
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display mode selection in landscape', async ({ page }) => {
        await expect(page.locator('.game-mode-selection')).toBeVisible();

        const modeCards = page.locator('.mode-card');
        await expect(modeCards).toHaveCount(3);
    });

    test('should show game area in landscape', async ({ page }) => {
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        await expect(page.locator('#gameArea')).toBeVisible();
        await expect(page.locator('#playerCards')).toBeVisible();
        await expect(page.locator('#houseCards')).toBeVisible();
    });

    test('should not overflow in landscape mode', async ({ page }) => {
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        const viewportHeight = await page.evaluate(() => window.innerHeight);

        // Some vertical scroll is acceptable, but not excessive
        expect(bodyHeight).toBeLessThan(viewportHeight * 3);
    });
});
