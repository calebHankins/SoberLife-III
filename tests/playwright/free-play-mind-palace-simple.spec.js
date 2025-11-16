const { test, expect } = require('@playwright/test');

test.describe('Free Play Mind Palace - Simple Verification', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('should open Mind Palace from Free Play overview and show content', async ({ page }) => {
        // Navigate to Free Play overview
        await page.evaluate(() => {
            window.startFreePlayMode();
            window.showFreePlayOverview();
        });

        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Click Visit Mind Palace
        await page.getByRole('button', { name: /Visit Mind Palace/i }).click();

        // Wait for Mind Palace to open
        await expect(page.locator('#mindPalaceModal')).toBeVisible();

        // Take a screenshot to see what's rendered
        await page.screenshot({ path: 'test-results/free-play-mind-palace.png', fullPage: true });

        // Check if Growth Journey section exists
        const growthJourney = page.locator('.mind-palace-section').filter({ hasText: /Your Growth Journey/i });
        await expect(growthJourney).toBeVisible();

        // Check what's inside the container
        const container = page.locator('#upgradeHistoryContent');
        await expect(container).toBeVisible();

        // Log the HTML content for debugging
        const containerHTML = await container.innerHTML();
        console.log('Container HTML:', containerHTML);

        // Check if achievements container was created
        const achievementsContainer = page.locator('#achievementsContainer');
        const hasAchievements = await achievementsContainer.count();
        console.log('Achievements container count:', hasAchievements);
    });
});
