// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Shop System', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /Start Campaign/i }).click();
    });

    test('should open shop from campaign overview', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Shop/i }).click();
        await expect(page.locator('#upgradeShop')).toBeVisible();
        await expect(page.locator('#upgradeShop h2')).toContainText('Mindfulness Upgrades');
    });

    test('should display zen points balance in shop', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Shop/i }).click();
        await expect(page.locator('#shopZenPoints')).toBeVisible();
    });

    test('should show joker upgrade option', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Shop/i }).click();

        await expect(page.locator('#jokerUpgradeCard')).toBeVisible();
        await expect(page.locator('#jokerUpgradeCard')).toContainText('Add Joker to Deck');
        await expect(page.locator('#jokerUpgradeCost')).toBeVisible();
        await expect(page.locator('#currentJokers')).toBeVisible();
    });

    test('should show premium activity upgrades', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Shop/i }).click();

        await expect(page.locator('#mindfulBreathingCard')).toBeVisible();
        await expect(page.locator('#compartmentalizeCard')).toBeVisible();

        await expect(page.locator('#mindfulBreathingCard')).toContainText('Mindful Breathing');
        await expect(page.locator('#compartmentalizeCard')).toContainText('Compartmentalize');
    });

    test('should have shop action buttons', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Shop/i }).click();

        await expect(page.getByRole('button', { name: /Continue Campaign/i })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Close Shop', exact: true })).toBeVisible();
    });

    test('should allow closing shop', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Shop/i }).click();
        await expect(page.locator('#upgradeShop')).toBeVisible();

        await page.locator('#shopCloseBtn').click();
        await expect(page.locator('#upgradeShop')).toHaveClass(/hidden/);
    });
});

test.describe('Mind Palace', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: /Start Campaign/i }).click();
    });

    test('should open mind palace modal', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();
        await expect(page.locator('#mindPalaceTitle')).toContainText('Your Mind Palace');
    });

    test('should display deck composition stats', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();

        await expect(page.locator('#jokerCount')).toBeVisible();
        await expect(page.locator('#aceCount')).toBeVisible();
        await expect(page.locator('#regularCount')).toBeVisible();
    });

    test('should show deck power meter', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();

        await expect(page.locator('.power-meter')).toBeVisible();
        await expect(page.locator('#deckPowerFill')).toBeVisible();
        await expect(page.locator('#deckPowerText')).toBeVisible();
    });

    test('should display stress management techniques', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();

        // Basic activities should always be visible
        await expect(page.locator('.basic-activity').first()).toBeVisible();

        // Premium activities section should exist
        await expect(page.locator('#premiumActivitiesGrid')).toBeVisible();
    });

    test('should allow closing mind palace', async ({ page }) => {
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        await page.locator('#mindPalaceCloseBtn').click();
        await expect(page.locator('#mindPalaceModal')).toHaveClass(/hidden/);
    });
});
