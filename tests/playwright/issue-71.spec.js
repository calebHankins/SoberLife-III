const { test, expect } = require('@playwright/test');

test('Issue 71: Hit button should be disabled when Compartmentalize is offered', async ({ page }) => {
    // 1. Setup local storage with unlocked Compartmentalize and Zen Points
    await page.goto('/');

    await page.evaluate(() => {
        const campaignState = {
            currentTask: 0,
            completedTasks: [],
            totalZenEarned: 1000,
            zenPointBalance: 1000,
            lastBalanceUpdate: Date.now(),
            campaignMode: true,
            previousStressLevel: 0,
            deckComposition: { aces: 4, jokers: 0, totalCards: 52 },
            shopUpgrades: { acesAdded: 0, jokersAdded: 0, totalSpent: 0 },
            taskProgress: {},
            unlockedActivities: {
                mindfulBreathing: true,
                compartmentalize: true // Unlock Compartmentalize
            },
            activityStats: {
                totalActivitiesUsed: 0,
                compartmentalizeUses: 0,
                premiumActivityUses: 0
            }
        };
        localStorage.setItem('soberlife-campaign', JSON.stringify(campaignState));
    });

    // 2. Reload to apply state
    await page.reload();

    // 3. Start Single Task Mode directly (skips campaign overview)
    await page.evaluate(() => {
        // Override flavor text to speed up test
        window.showFlavorText = () => { };
        // Don't override showInitialFlavorText, instead set the state so it's skipped
        // window.showInitialFlavorText = () => {}; 

        // Start task
        window.startSingleTaskMode();

        // Force initial flavor text shown state
        window.gameState.initialFlavorTextShown = true;

        // Enable buttons just in case
        const hitBtn = document.getElementById('hitBtn');
        if (hitBtn) hitBtn.disabled = false;
    });

    // 5. Complete survey mock
    await page.waitForSelector('#surveySection');
    // 6. Force Compartmentalize Offer directly
    await page.evaluate(() => {
        // Ensure game is "in progress" so buttons would be active otherwise
        window.gameState.gameInProgress = true;
        const hitBtn = document.getElementById('hitBtn');
        if (hitBtn) hitBtn.disabled = false; // Start enabled

        // Call the function that should disable them (but currently doesn't)
        window.offerCompartmentalize();
    });

    // 7. Verify Hit button state
    const hitBtn = await page.$('#hitBtn');
    const isDisabled = await hitBtn.getAttribute('disabled');

    // Before fix: Button should be enabled (isDisabled is null)
    // We expect it to be disabled (not null) for the fix.
    // So this assertion should FAIL if the bug is present.
    expect(isDisabled).not.toBeNull();
});
