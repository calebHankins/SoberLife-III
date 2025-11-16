// SoberLife III - Free Play Joker Deck Tests
// Tests to verify that shop-purchased jokers are applied to Free Play Mode deck

import { test, expect } from '@playwright/test';

test.describe('Free Play Mode - Joker Deck Integration', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#gameModeSelection')).toBeVisible();
    });

    test('should apply purchased jokers to Free Play deck', async ({ page }) => {
        // Step 1: Start Free Play Mode
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Step 2: Add zen points and many jokers using debug helper (more jokers = higher chance of dealing)
        await page.evaluate(() => {
            window.DebugHelper.addZenPoints(5000);
            window.DebugHelper.addJokers(15); // Increased from 3 to 15 for better probability
        });

        // Step 3: Verify deck composition in campaign state
        const deckComposition = await page.evaluate(() => {
            return window.campaignState.deckComposition;
        });
        expect(deckComposition.jokers).toBe(15);
        console.log('Deck composition after adding jokers:', deckComposition);

        // Step 4: Start a new round to trigger deck creation
        await page.evaluate(() => {
            window.startNewRound();
        });

        // Wait for cards to be dealt
        await expect(page.locator('#playerCards .card')).toHaveCount(2, { timeout: 5000 });

        // Step 5: Verify that the player deck was created with jokers
        const playerDeck = await page.evaluate(() => {
            return window.gameState.deck;
        });

        // Count jokers in the deck
        const jokerCount = playerDeck.filter(card => card.isJoker).length;
        expect(jokerCount).toBe(15);
        console.log(`Player deck contains ${jokerCount} jokers`);

        // Step 6: Play multiple rounds to verify jokers can be dealt
        // With 15 jokers in ~67 cards, probability of dealing at least one in 20 rounds is very high
        let jokerDealt = false;
        for (let i = 0; i < 20; i++) {
            // Check if any jokers in current hand
            const hasJoker = await page.evaluate(() => {
                return window.gameState.playerCards.some(card => card.isJoker);
            });

            if (hasJoker) {
                jokerDealt = true;
                console.log(`Joker dealt in round ${i + 1}`);
                break;
            }

            // Complete the round and start a new one
            await page.evaluate(() => {
                window.stand();
            });

            // Wait for round to complete
            await page.waitForTimeout(500);

            // Start new round
            await page.evaluate(() => {
                window.startNewRound();
            });

            await expect(page.locator('#playerCards .card')).toHaveCount(2, { timeout: 5000 });
        }

        // Verify that at least one joker was dealt in 20 rounds
        expect(jokerDealt).toBe(true);
    });

    test('should purchase joker in shop and apply to Free Play deck', async ({ page }) => {
        // Step 1: Start Free Play Mode
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Step 2: Add zen points for purchase
        await page.evaluate(() => {
            window.DebugHelper.addZenPoints(5000);
        });

        // Step 3: Open shop
        await page.evaluate(() => {
            window.openFreePlayShop();
        });
        await expect(page.locator('#upgradeShop')).toBeVisible();

        // Step 4: Get initial joker count
        const initialJokerCount = await page.evaluate(() => {
            return window.campaignState.deckComposition.jokers;
        });
        console.log('Initial joker count:', initialJokerCount);

        // Step 5: Purchase a joker
        const jokerUpgradeBtn = page.locator('#jokerUpgradeBtn, #aceUpgradeBtn');
        await expect(jokerUpgradeBtn).toBeEnabled();
        await jokerUpgradeBtn.click();

        // Wait for purchase to complete
        await page.waitForTimeout(500);

        // Step 6: Verify joker was added to deck composition
        const newJokerCount = await page.evaluate(() => {
            return window.campaignState.deckComposition.jokers;
        });
        expect(newJokerCount).toBe(initialJokerCount + 1);
        console.log('New joker count after purchase:', newJokerCount);

        // Step 7: Close shop
        await page.evaluate(() => {
            window.closeShopWrapper();
        });

        // Wait for shop to close
        await expect(page.locator('#upgradeShop')).toBeHidden();

        // Start a new round to trigger deck creation
        await page.evaluate(() => {
            window.startNewRound();
        });

        // Wait for cards to be dealt
        await expect(page.locator('#playerCards .card')).toHaveCount(2, { timeout: 5000 });

        // Step 8: Verify that the player deck contains the purchased joker
        const playerDeck = await page.evaluate(() => {
            return window.gameState.deck;
        });

        const jokerCount = playerDeck.filter(card => card.isJoker).length;
        expect(jokerCount).toBe(newJokerCount);
        console.log(`Player deck contains ${jokerCount} joker(s) after purchase`);
    });

    test('should maintain joker count across Free Play sessions', async ({ page }) => {
        // Step 1: Start Free Play Mode
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Step 2: Add jokers using debug helper
        await page.evaluate(() => {
            window.DebugHelper.addZenPoints(5000);
            window.DebugHelper.addJokers(2);
        });

        // Step 3: Verify jokers were added
        const jokerCount1 = await page.evaluate(() => {
            return window.campaignState.deckComposition.jokers;
        });
        expect(jokerCount1).toBe(2);

        // Step 4: Start a new round to verify deck has jokers
        await page.evaluate(() => {
            window.startNewRound();
        });

        // Wait for cards to be dealt
        await expect(page.locator('#playerCards .card')).toHaveCount(2, { timeout: 5000 });

        // Step 5: Verify deck was created with jokers
        const playerDeck = await page.evaluate(() => {
            return window.gameState.deck;
        });

        const deckJokerCount = playerDeck.filter(card => card.isJoker).length;
        expect(deckJokerCount).toBe(2);
        console.log('Joker count persisted and applied to deck');
    });

    test('should display joker cards correctly when dealt in Free Play', async ({ page }) => {
        // Step 1: Start Free Play Mode
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Step 2: Add many jokers to increase chance of dealing one
        await page.evaluate(() => {
            window.DebugHelper.addZenPoints(5000);
            window.DebugHelper.addJokers(10);
        });

        // Step 3: Play rounds until a joker is dealt
        let jokerDealt = false;
        let attempts = 0;
        const maxAttempts = 20;

        while (!jokerDealt && attempts < maxAttempts) {
            attempts++;

            // Check if any jokers in current hand
            const hasJoker = await page.evaluate(() => {
                return window.gameState.playerCards.some(card => card.isJoker);
            });

            if (hasJoker) {
                jokerDealt = true;
                console.log(`Joker dealt in attempt ${attempts}`);

                // Verify joker card is displayed
                const jokerCard = page.locator('#playerCards .card:has-text("🃏")').first();
                await expect(jokerCard).toBeVisible();

                // Verify joker has a calculated value
                const jokerValue = await page.evaluate(() => {
                    const joker = window.gameState.playerCards.find(card => card.isJoker);
                    return joker ? joker.getCurrentValue() : null;
                });
                expect(jokerValue).toBeGreaterThanOrEqual(1);
                expect(jokerValue).toBeLessThanOrEqual(11);
                console.log(`Joker calculated value: ${jokerValue}`);

                break;
            }

            // Complete the round and start a new one
            await page.evaluate(() => {
                window.stand();
            });

            await page.waitForTimeout(500);

            await page.evaluate(() => {
                window.startNewRound();
            });

            await expect(page.locator('#playerCards .card')).toHaveCount(2, { timeout: 5000 });
        }

        expect(jokerDealt).toBe(true);
    });

    test('should calculate joker values optimally in Free Play', async ({ page }) => {
        // Step 1: Start Free Play Mode
        await page.locator('button:has-text("Start Free Play")').click();
        await expect(page.locator('#gameArea')).toBeVisible();

        // Step 2: Add jokers
        await page.evaluate(() => {
            window.DebugHelper.addJokers(5);
        });

        // Step 3: Manually set up a hand with a joker
        await page.evaluate(() => {
            // Import JokerCard class
            const { JokerCard } = window;

            // Create a hand with a joker and a 10
            const joker = new JokerCard();
            const tenCard = { suit: '♠', value: '10', display: '10♠' };

            window.gameState.playerCards = [joker, tenCard];

            // Calculate score (should set joker to 11 for perfect 21)
            const score = window.calculateScore(window.gameState.playerCards);

            return {
                score: score,
                jokerValue: joker.getCurrentValue()
            };
        });

        // Step 4: Verify joker was calculated optimally
        const result = await page.evaluate(() => {
            const joker = window.gameState.playerCards.find(card => card.isJoker);
            const score = window.calculateScore(window.gameState.playerCards);

            return {
                score: score,
                jokerValue: joker ? joker.getCurrentValue() : null
            };
        });

        expect(result.score).toBe(21);
        expect(result.jokerValue).toBe(11);
        console.log('Joker calculated optimally for 21');
    });
});
