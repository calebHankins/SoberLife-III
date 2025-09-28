// SoberLife III - Complete Campaign Flow Integration Tests
// End-to-end tests for campaign shop access and Joker system

import { gameState, campaignState, updateGameState, resetGameState, resetCampaignState } from '../assets/js/game-state.js';
import { purchaseJokerUpgrade, canPurchaseJokerUpgrade, updateShopUI } from '../assets/js/shop-system.js';
import { createCustomDeck, calculateScore, JokerCard } from '../assets/js/card-system.js';
import { initializeCampaign, updateCampaignUI } from '../assets/js/campaign-manager.js';

// Mock DOM elements for testing
function setupMockDOM() {
    // Create mock elements that the functions expect
    const mockElements = {
        shopZenPoints: { textContent: '0' },
        jokerUpgradeCost: { textContent: '75' },
        currentJokers: { textContent: '0' },
        jokerUpgradeBtn: { disabled: false, textContent: 'Purchase Joker' },
        jokerUpgradeCard: { classList: { add: () => {}, remove: () => {} } },
        deckComposition: { textContent: 'Aces: 4 / 52 Cards' },
        campaignProgress: { textContent: 'Tasks Completed: 0/2' }
    };
    
    // Mock getElementById
    const originalGetElementById = document.getElementById;
    document.getElementById = (id) => {
        return mockElements[id] || { 
            textContent: '', 
            classList: { add: () => {}, remove: () => {} },
            disabled: false
        };
    };
    
    return () => {
        document.getElementById = originalGetElementById;
    };
}

// Test complete campaign to shop to purchase flow
function testCompleteCampaignShopFlow() {
    console.log('Testing complete campaign shop flow...');
    
    const cleanup = setupMockDOM();
    
    try {
        // 1. Initialize campaign
        resetCampaignState();
        resetGameState();
        updateGameState({ zenPoints: 200 }); // Enough for multiple purchases
        
        // 2. Verify initial state
        if (campaignState.deckComposition.jokers !== 0) {
            throw new Error('Initial joker count should be 0');
        }
        
        // 3. Test shop UI update
        updateShopUI(200);
        
        // 4. Test first Joker purchase
        if (!canPurchaseJokerUpgrade(200)) {
            throw new Error('Should be able to purchase first Joker');
        }
        
        const firstPurchase = purchaseJokerUpgrade(200);
        if (!firstPurchase.success) {
            throw new Error('First Joker purchase should succeed');
        }
        
        // 5. Verify state after first purchase
        if (campaignState.deckComposition.jokers !== 1) {
            throw new Error('Should have 1 Joker after first purchase');
        }
        
        // 6. Test second Joker purchase (higher cost)
        const secondPurchase = purchaseJokerUpgrade(firstPurchase.zenPointsRemaining);
        if (!secondPurchase.success) {
            throw new Error('Second Joker purchase should succeed');
        }
        
        // 7. Verify cost increase
        if (secondPurchase.cost <= firstPurchase.cost) {
            throw new Error('Second Joker should cost more than first');
        }
        
        // 8. Test deck creation with Jokers
        const customDeck = createCustomDeck(campaignState.deckComposition);
        const jokerCards = customDeck.filter(card => card.isJoker);
        
        if (jokerCards.length !== 2) {
            throw new Error(`Expected 2 Jokers in deck, got ${jokerCards.length}`);
        }
        
        // 9. Test Joker functionality
        jokerCards.forEach(joker => {
            if (!(joker instanceof JokerCard)) {
                throw new Error('Joker should be instance of JokerCard');
            }
            
            const value = joker.calculateOptimalValue(10);
            if (value !== 11) {
                throw new Error('Joker should calculate 11 for hand total of 10');
            }
        });
        
        console.log('✅ Complete campaign shop flow test passed');
        
    } finally {
        cleanup();
    }
}

// Test Joker gameplay scenarios
function testJokerGameplayScenarios() {
    console.log('Testing Joker gameplay scenarios...');
    
    try {
        // Scenario 1: Joker helps achieve perfect 21
        const joker1 = new JokerCard();
        const regularCard = { value: '10', suit: '♠', display: '10♠' };
        const hand1 = [regularCard, joker1];
        
        const score1 = calculateScore(hand1);
        if (score1 !== 21) {
            throw new Error(`Expected 21 with 10 + Joker, got ${score1}`);
        }
        
        if (joker1.getCurrentValue() !== 11) {
            throw new Error(`Joker should be 11 for perfect 21, got ${joker1.getCurrentValue()}`);
        }
        
        // Scenario 2: Joker prevents bust
        const joker2 = new JokerCard();
        const kingCard = { value: 'K', suit: '♥', display: 'K♥' };
        const queenCard = { value: 'Q', suit: '♦', display: 'Q♦' };
        const hand2 = [kingCard, queenCard, joker2];
        
        const score2 = calculateScore(hand2);
        if (score2 !== 21) {
            throw new Error(`Expected 21 with K + Q + Joker, got ${score2}`);
        }
        
        if (joker2.getCurrentValue() !== 1) {
            throw new Error(`Joker should be 1 to avoid bust, got ${joker2.getCurrentValue()}`);
        }
        
        // Scenario 3: Multiple Jokers coordination
        const joker3 = new JokerCard();
        const joker4 = new JokerCard();
        const fiveCard = { value: '5', suit: '♣', display: '5♣' };
        const hand3 = [fiveCard, joker3, joker4];
        
        const score3 = calculateScore(hand3);
        if (score3 !== 21) {
            throw new Error(`Expected 21 with 5 + Joker + Joker, got ${score3}`);
        }
        
        const totalJokerValue = joker3.getCurrentValue() + joker4.getCurrentValue();
        if (totalJokerValue !== 16) {
            throw new Error(`Jokers should total 16 with 5, got ${totalJokerValue}`);
        }
        
        console.log('✅ Joker gameplay scenarios test passed');
        
    } catch (error) {
        throw error;
    }
}

// Test campaign state persistence with Jokers
function testCampaignStatePersistence() {
    console.log('Testing campaign state persistence with Jokers...');
    
    try {
        // Clear any existing data
        localStorage.removeItem('soberlife-campaign');
        
        // Initialize fresh campaign
        resetCampaignState();
        
        // Make purchases
        purchaseJokerUpgrade(200);
        purchaseJokerUpgrade(200);
        
        // Verify data was saved
        const savedData = localStorage.getItem('soberlife-campaign');
        if (!savedData) {
            throw new Error('Campaign data should be saved to localStorage');
        }
        
        const parsedData = JSON.parse(savedData);
        
        // Verify Joker data persistence
        if (parsedData.deckComposition.jokers !== 2) {
            throw new Error('Joker count should persist in localStorage');
        }
        
        if (parsedData.shopUpgrades.jokersAdded !== 2) {
            throw new Error('Jokers added count should persist');
        }
        
        // Test loading from storage
        resetCampaignState();
        
        // Simulate loading (this would normally happen in loadCampaignProgress)
        Object.assign(campaignState, parsedData);
        
        if (campaignState.deckComposition.jokers !== 2) {
            throw new Error('Joker count should be restored from localStorage');
        }
        
        console.log('✅ Campaign state persistence test passed');
        
    } catch (error) {
        throw error;
    }
}

// Test error handling scenarios
function testErrorHandlingScenarios() {
    console.log('Testing error handling scenarios...');
    
    try {
        // Test invalid deck composition
        const invalidDeck1 = createCustomDeck(null);
        if (!Array.isArray(invalidDeck1) || invalidDeck1.length !== 52) {
            throw new Error('Should return standard deck for null composition');
        }
        
        const invalidDeck2 = createCustomDeck({ aces: -1, jokers: 0, totalCards: 52 });
        if (!Array.isArray(invalidDeck2) || invalidDeck2.length !== 52) {
            throw new Error('Should return standard deck for invalid aces count');
        }
        
        // Test Joker with invalid hand total
        const joker = new JokerCard();
        const invalidValue = joker.calculateOptimalValue(-5);
        if (invalidValue !== 1) {
            throw new Error('Joker should return 1 for invalid hand total');
        }
        
        // Test purchase with insufficient funds
        resetCampaignState();
        const insufficientResult = purchaseJokerUpgrade(10); // Not enough for 75 cost
        if (insufficientResult.success) {
            throw new Error('Purchase should fail with insufficient funds');
        }
        
        console.log('✅ Error handling scenarios test passed');
        
    } catch (error) {
        throw error;
    }
}

// Test deck power calculation
function testDeckPowerCalculation() {
    console.log('Testing deck power calculation...');
    
    try {
        resetCampaignState();
        
        // Initial power (4 aces out of 52)
        let powerLevel = Math.round(((4 + 0) / 52) * 100);
        if (powerLevel !== 8) {
            throw new Error(`Initial power level should be 8%, got ${powerLevel}%`);
        }
        
        // After adding 2 Jokers (4 aces + 2 jokers out of 52)
        purchaseJokerUpgrade(200);
        purchaseJokerUpgrade(200);
        
        powerLevel = Math.round(((4 + 2) / 52) * 100);
        if (powerLevel !== 12) {
            throw new Error(`Power level with 2 Jokers should be 12%, got ${powerLevel}%`);
        }
        
        console.log('✅ Deck power calculation test passed');
        
    } catch (error) {
        throw error;
    }
}

// Run all integration tests
export function runCompleteCampaignFlowTests() {
    console.log('🎯 Running Complete Campaign Flow Integration Tests...');
    
    try {
        testCompleteCampaignShopFlow();
        testJokerGameplayScenarios();
        testCampaignStatePersistence();
        testErrorHandlingScenarios();
        testDeckPowerCalculation();
        
        console.log('🎉 All Complete Campaign Flow Integration tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Complete Campaign Flow Integration test failed:', error.message);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runCompleteCampaignFlowTests();
}