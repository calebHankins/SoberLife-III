// Quick test script to verify joker emoji changes
const { chromium } = require('playwright');

(async () => {
    console.log('🎭 Starting Playwright test for Joker emoji...');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the app
    console.log('📱 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded');

    // Take a screenshot of the initial state
    await page.screenshot({ path: 'test-screenshots/01-initial.png', fullPage: true });
    console.log('📸 Screenshot saved: 01-initial.png');

    // Click Single Task Mode to start
    console.log('🎮 Starting Single Task Mode...');
    await page.click('text=Start DMV Challenge');
    await page.waitForTimeout(1000);

    // Fill out the survey to start the game
    console.log('📋 Filling out pre-task survey...');
    await page.click('input[name="sleep"][value="0"]');
    await page.click('input[name="prepared"][value="0"]');
    await page.click('input[name="day"][value="0"]');
    await page.waitForTimeout(500);

    // Start the task
    console.log('🎯 Starting task...');
    await page.click('#startTaskBtn');
    await page.waitForTimeout(2000);

    // Take a screenshot of the game
    await page.screenshot({ path: 'test-screenshots/02-game-started.png', fullPage: true });
    console.log('📸 Screenshot saved: 02-game-started.png');

    // Check if there are any joker cards visible
    const jokerCards = await page.$$('.card.joker');
    console.log(`🃏 Found ${jokerCards.length} joker cards on the page`);

    if (jokerCards.length > 0) {
        console.log('✨ Joker cards are visible!');

        // Take a focused screenshot of a joker card
        const jokerCard = jokerCards[0];
        await jokerCard.screenshot({ path: 'test-screenshots/03-joker-card.png' });
        console.log('📸 Screenshot saved: 03-joker-card.png');

        // Check if the emoji is present
        const jokerLabel = await jokerCard.$('.joker-label');
        if (jokerLabel) {
            const labelText = await jokerLabel.textContent();
            console.log(`🎨 Joker label text: "${labelText}"`);

            // Check if the animation is applied
            const animation = await jokerLabel.evaluate((el) => {
                return window.getComputedStyle(el).animation;
            });
            console.log(`💫 Animation: ${animation}`);
        }
    } else {
        console.log('⚠️ No joker cards found yet. You may need to have purchased jokers from the shop first.');
        console.log('💡 To test with jokers: Open the help menu (press ?), enable Nirvana Mode, add zen points, visit shop, and buy jokers.');
    }

    console.log('\n🎉 Test complete! Browser will stay open for manual inspection.');
    console.log('Press Ctrl+C to close when done.\n');

    // Keep browser open for manual inspection
    await page.waitForTimeout(300000); // 5 minutes

    await browser.close();
})();
