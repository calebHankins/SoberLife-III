// SoberLife III - Campaign Shop Integration Tests
// Tests for campaign overview shop access and Joker system

import { campaignState, updateCampaignState, resetCampaignState } from '../assets/js/game-state.js';
import { purchaseJokerUpgrade, getJokerUpgradeCost, canPurchaseJokerUpgrade } from '../assets/js/shop-system.js';
import { createCustomDeck, getDeckComposition } from '../assets/js/card-system.js';

// Test campaign shop integration
function testCampaignShopIntegration() {
    console.log('Testing campaign shop integration...');
    
    // Reset campaign state
    resetCampaignState();
    
    // Verify initial state
    if (campaignState.deckComposition.jokers !== 0) {
        throw new Error('Initial joker count should be 0');
    }
    
    if (campaignState.deckComposition.aces !== 4) {
        throw new Error('Initial ace count should be 4');
    }
    
    // Test Joker purchase
    const initialZen = 100;
    const cost = getJokerUpgradeCost();
    
    if (!canPurchaseJokerUpgrade(initialZen)) {
        throw new Error('Should be able to purchase first Joker with 100 zen points');
    }
    
    const result = purchaseJokerUpgrade(initialZen);
    
    if (!result.success) {
        throw new Error('Joker purchase should succeed');
    }
    
    if (result.zenPointsRemaining !== initialZen - cost) {
        throw new Error(`Zen points should be ${initialZen - cost}, got ${result.zenPointsRemaining}`);
    }
    
    if (campaignState.deckComposition.jokers !== 1) {
        throw new Error('Joker count should be 1 after purchase');
    }
    
    console.log('✅ Campaign shop integration test passed');
}

// Test deck creation with Jokers
function testDeckCreationWithJokers() {
    console.log('Testing deck creation with Jokers...');
    
    // Set up campaign state with Jokers
    updateCampaignState({
        deckComposition: {
            aces: 4,
            jokers: 2,
            totalCards: 52
        }
    });
    
    const deck = createCustomDeck(campaignState.deckComposition);
    const composition = getDeckComposition(deck);
    
    if (composition.jokers !== 2) {
        throw new Error(`Expected 2 Jokers in deck, got ${composition.jokers}`);
    }
    
    if (composition.aces !== 4) {
        throw new Error(`Expected 4 Aces in deck, got ${composition.aces}`);
    }
    
    if (composition.total !== 52) {
        throw new Error(`Expected 52 total cards, got ${composition.total}`);
    }
    
    // Verify Jokers are actual JokerCard instances
    const jokers = deck.filter(card => card.isJoker);
    if (jokers.length !== 2) {
        throw new Error(`Expected 2 Joker instances, got ${jokers.length}`);
    }
    
    console.log('✅ Deck creation with Jokers test passed');
}

// Test shop cost progression
function testShopCostProgression() {
    console.log('Testing shop cost progression...');
    
    resetCampaignState();
    
    const firstCost = getJokerUpgradeCost();
    
    // Purchase first Joker
    purchaseJokerUpgrade(200);
    
    const secondCost = getJokerUpgradeCost();
    
    if (secondCost <= firstCost) {
        throw new Error('Second Joker should cost more than first');
    }
    
    const expectedIncrease = 50; // From shop config
    if (secondCost !== firstCost + expectedIncrease) {
        throw new Error(`Expected cost increase of ${expectedIncrease}, got ${secondCost - firstCost}`);
    }
    
    console.log('✅ Shop cost progression test passed');
}

// Test campaign state persistence
function testCampaignStatePersistence() {
    console.log('Testing campaign state persistence...');
    
    resetCampaignState();
    
    // Make some purchases
    purchaseJokerUpgrade(200);
    purchaseJokerUpgrade(200);
    
    const beforeState = JSON.parse(JSON.stringify(campaignState));
    
    // Simulate page reload by resetting and loading
    const savedData = localStorage.getItem('soberlife-campaign');
    if (!savedData) {
        throw new Error('Campaign data should be saved to localStorage');
    }
    
    const loadedData = JSON.parse(savedData);
    
    if (loadedData.deckComposition.jokers !== 2) {
        throw new Error('Joker count should persist');
    }
    
    if (loadedData.shopUpgrades.jokersAdded !== 2) {
        throw new Error('Jokers added count should persist');
    }
    
    console.log('✅ Campaign state persistence test passed');
}

// Run all tests
export function runCampaignShopIntegrationTests() {
    console.log('🛒 Running Campaign Shop Integration Tests...');
    
    try {
        testCampaignShopIntegration();
        testDeckCreationWithJokers();
        testShopCostProgression();
        testCampaignStatePersistence();
        
        console.log('🎉 All Campaign Shop Integration tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Campaign Shop Integration test failed:', error.message);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runCampaignShopIntegrationTests();
}