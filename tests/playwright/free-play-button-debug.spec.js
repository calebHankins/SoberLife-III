// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Free Play Button Text Debug', () => {
    test('should show correct button text on first visit', async ({ page }) => {
        // Enable console logging
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        await page.goto('/');

        // Click Start Free Play
        await page.getByRole('button', { name: /Start Free Play/i }).click();

        // Wait for overview to be visible
        await expect(page.locator('#freePlayOverview')).toBeVisible();

        // Wait a bit for JavaScript to execute
        await page.waitForTimeout(1000);

        // Get all buttons with onclick="launchFreePlayGame()"
        const buttons = await page.locator('button[onclick="launchFreePlayGame()"]').all();
        console.log(`Found ${buttons.length} button(s)`);

        for (let i = 0; i < buttons.length; i++) {
            const text = await buttons[i].textContent();
            console.log(`Button ${i} text: "${text}"`);
        }

        // Check button text
        const button = page.locator('button[onclick="launchFreePlayGame()"]');
        const buttonText = await button.textContent();
        console.log(`Button text: "${buttonText}"`);

        // The button should say "Play" on first visit
        expect(buttonText?.trim()).toBe('Play');
    });
});
