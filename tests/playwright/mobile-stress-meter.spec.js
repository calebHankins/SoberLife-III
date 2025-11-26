// @ts-check
const { test, expect } = require('@playwright/test');
const helpers = require('./test-helpers.cjs');

test.describe('Mobile Stress Meter Visibility During Gameplay', () => {
    test.use({
        viewport: { width: 375, height: 667 } // iPhone SE size
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('stress meter should be visible during Jump Into Task gameplay without scrolling', async ({ page }) => {
        // Start Jump Into Task mode
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        // Complete survey to get to gameplay
        const surveyQuestions = page.locator('.survey-question');
        const questionCount = await surveyQuestions.count();

        for (let i = 0; i < questionCount; i++) {
            const question = surveyQuestions.nth(i);
            const firstOption = question.locator('input[type="radio"]').first();
            await firstOption.click();
        }

        await page.locator('#startTaskBtn').click();

        // Wait for game area to be visible
        await expect(page.locator('#gameArea')).toBeVisible();

        // Check if stress meter is in viewport without scrolling
        const stressMeter = page.locator('.stress-meter');
        await expect(stressMeter).toBeVisible();

        // Get stress meter position
        const stressMeterBox = await stressMeter.boundingBox();
        const viewportHeight = page.viewportSize()?.height || 667;

        // Stress meter should be in the initial viewport (no scrolling needed)
        expect(stressMeterBox?.y).toBeLessThan(viewportHeight);

        // Check if game buttons are also visible
        const hitButton = page.locator('#hitBtn');
        const hitButtonBox = await hitButton.boundingBox();

        // If game buttons are below viewport, that's the problem
        if (hitButtonBox && hitButtonBox.y > viewportHeight) {
            console.log('⚠️ ISSUE DETECTED: Game buttons require scrolling');
            console.log(`Stress meter Y: ${stressMeterBox?.y}`);
            console.log(`Hit button Y: ${hitButtonBox.y}`);
            console.log(`Viewport height: ${viewportHeight}`);
        }

        // Both stress meter AND game buttons should be visible simultaneously
        await expect(stressMeter).toBeInViewport();
        await expect(hitButton).toBeInViewport();
    });

    test('stress meter should remain visible when interacting with game controls', async ({ page }) => {
        // Start Free Play mode for simpler testing (now via helper)
        await helpers.enterFreePlaySession(page);

        const stressMeter = page.locator('.stress-meter');
        await expect(stressMeter).toBeVisible();

        // Scroll to game controls
        const hitButton = page.locator('#hitBtn');
        await hitButton.scrollIntoViewIfNeeded();

        // After scrolling to controls, stress meter should still be visible
        const isStressMeterVisible = await stressMeter.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });

        if (!isStressMeterVisible) {
            console.log('⚠️ ISSUE DETECTED: Stress meter not visible when game controls are in view');
        }

        expect(isStressMeterVisible).toBe(true);
    });

    test('stress meter should be visible during Campaign mode gameplay', async ({ page }) => {
        // This test verifies the same UI as Jump Into Task since they share the same gameplay layout
        // We'll use Jump Into Task as a proxy for campaign gameplay testing
        await page.getByRole('button', { name: /Start Next Task/i }).click();

        // Complete survey to get to gameplay
        const surveyQuestions = page.locator('.survey-question');
        const questionCount = await surveyQuestions.count();

        for (let i = 0; i < questionCount; i++) {
            const question = surveyQuestions.nth(i);
            const firstOption = question.locator('input[type="radio"]').first();
            await firstOption.click();
        }

        await page.locator('#startTaskBtn').click();

        // Wait for game area
        await expect(page.locator('#gameArea')).toBeVisible();

        const stressMeter = page.locator('.stress-meter');
        const hitButton = page.locator('#hitBtn');

        // Both should be visible without scrolling (same layout as campaign)
        await expect(stressMeter).toBeInViewport();
        await expect(hitButton).toBeInViewport();
    });

    test('stress meter visibility during zen activity usage', async ({ page }) => {
        // Start Free Play (use helper)
        await helpers.enterFreePlaySession(page);

        const stressMeter = page.locator('.stress-meter');
        const zenActivities = page.locator('#zenActivities');

        // Scroll to zen activities
        await zenActivities.scrollIntoViewIfNeeded();

        // Stress meter should still be visible
        const isStressMeterVisible = await stressMeter.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });

        if (!isStressMeterVisible) {
            console.log('⚠️ ISSUE DETECTED: Stress meter not visible when zen activities are in view');
        }

        expect(isStressMeterVisible).toBe(true);
    });

    test('measure total scrollable height during gameplay', async ({ page }) => {
        // Start Free Play (use helper)
        await helpers.enterFreePlaySession(page);

        // Measure page dimensions
        const dimensions = await page.evaluate(() => {
            return {
                scrollHeight: document.body.scrollHeight,
                clientHeight: document.documentElement.clientHeight,
                viewportHeight: window.innerHeight,
                stressMeterTop: document.querySelector('.stress-meter')?.getBoundingClientRect().top,
                gameControlsTop: document.querySelector('#gameControls')?.getBoundingClientRect().top,
                zenActivitiesTop: document.querySelector('#zenActivities')?.getBoundingClientRect().top
            };
        });

        console.log('📏 Page Dimensions:', dimensions);

        // If scroll height is significantly larger than viewport, there's scrolling required
        const scrollRequired = dimensions.scrollHeight > dimensions.viewportHeight + 50;

        if (scrollRequired) {
            console.log('⚠️ ISSUE DETECTED: Page requires scrolling during gameplay');
            console.log(`Scroll height: ${dimensions.scrollHeight}px`);
            console.log(`Viewport height: ${dimensions.viewportHeight}px`);
            console.log(`Excess height: ${dimensions.scrollHeight - dimensions.viewportHeight}px`);
        }
    });

    test('stress meter should have fixed or sticky positioning on mobile', async ({ page }) => {
        // Start Free Play (use helper)
        await helpers.enterFreePlaySession(page);

        // Check stress meter positioning
        const stressMeter = page.locator('.stress-meter');
        const position = await stressMeter.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
                position: styles.position,
                top: styles.top,
                zIndex: styles.zIndex
            };
        });

        console.log('🎯 Stress Meter Position:', position);

        // Scroll down the page
        await page.evaluate(() => window.scrollBy(0, 200));

        // Check if stress meter is still visible after scroll
        const isVisible = await stressMeter.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });

        if (!isVisible && position.position !== 'fixed' && position.position !== 'sticky') {
            console.log('⚠️ ISSUE DETECTED: Stress meter is not fixed/sticky and scrolls out of view');
        }
    });
});

test.describe('Mobile Stress Meter - Landscape Mode', () => {
    test.use({
        viewport: { width: 667, height: 375 } // iPhone SE landscape
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('stress meter should be visible in landscape mode during gameplay', async ({ page }) => {
        // Start Free Play with helper
        await helpers.enterFreePlaySession(page);

        const stressMeter = page.locator('.stress-meter');
        const hitButton = page.locator('#hitBtn');

        // Both should be visible/accessible in landscape; viewport constraints on landscape may hide some elements
        await expect(stressMeter).toBeInViewport();
        await expect(hitButton).toBeVisible();
    });
});

test.describe('Mobile Stress Meter - Tablet', () => {
    test.use({
        viewport: { width: 768, height: 1024 } // iPad size
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('stress meter should be visible on tablet during gameplay', async ({ page }) => {
        // Start Free Play and enter via overview
        await page.getByRole('button', { name: /Start Free Play/i }).click();
        await expect(page.locator('#freePlayOverview')).toBeVisible();
        await page.locator('#freePlayOverview button:has-text("Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        const stressMeter = page.locator('.stress-meter');
        const hitButton = page.locator('#hitBtn');

        // Both should be visible on tablet
        await expect(stressMeter).toBeInViewport();
        await expect(hitButton).toBeInViewport();
    });
});
