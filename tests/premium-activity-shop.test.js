// Premium Activity Shop Tests
// Tests for premium activity purchasing, shop UI, and persistence

import {
    campaignState,
    updateCampaignState,
    resetCampaignState,
    activityState,
    unlockPremiumActivity,
    resetActivityState,
    loadActivityStateFromCampaign
} from '../assets/js/game-state.js';

import {
    premiumActivities,
    canPurchasePremiumActivity,
    purchasePremiumActivity,
    purchasePremiumActivityWrapper,
    updateShopUI
} from '../assets/js/shop-system.js';

import { ZenPointsManager } from '../assets/js/zen-points-manager.js';

// Test premium activity shop configuration
export function testPremiumActivityConfiguration() {
    console.log('Testing premium activity shop configuration...');

    try {
        // Check premium activities are properly configured
        console.assert(premiumActivities.mindfulBreathing, 'Mindful breathing should be configured');
        console.assert(premiumActivities.compartmentalize, 'Compartmentalize should be configured');

        // Check required properties
        const mindfulBreathing = premiumActivities.mindfulBreathing;
        console.assert(typeof mindfulBreathing.cost === 'number', 'Should have numeric cost');
        console.assert(typeof mindfulBreathing.name === 'string', 'Should have string name');
        console.assert(typeof mindfulBreathing.description === 'string', 'Should have string description');
        console.assert(typeof mindfulBreathing.emoji === 'string', 'Should have emoji');

        const compartmentalize = premiumActivities.compartmentalize;
        console.assert(compartmentalize.cost > mindfulBreathing.cost, 'Compartmentalize should cost more than mindful breathing');

        console.log('✅ Premium activity configuration tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity configuration tests failed:', error);
        return false;
    }
}

// Test premium activity purchase validation
export function testPremiumActivityPurchaseValidation() {
    console.log('Testing premium activity purchase validation...');

    try {
        // Reset state
        resetCampaignState();
        ZenPointsManager.setBalance(200);

        // Test can purchase with sufficient funds
        console.assert(canPurchasePremiumActivity('mindfulBreathing', 200), 'Should be able to purchase with sufficient funds');

        // Test cannot purchase with insufficient funds
        console.assert(!canPurchasePremiumActivity('mindfulBreathing', 100), 'Should not be able to purchase with insufficient funds');

        // Test cannot purchase invalid activity
        console.assert(!canPurchasePremiumActivity('invalidActivity', 200), 'Should not be able to purchase invalid activity');

        // Test cannot purchase already unlocked activity
        updateCampaignState({
            unlockedActivities: {
                ...campaignState.unlockedActivities,
                mindfulBreathing: true
            }
        });
        console.assert(!canPurchasePremiumActivity('mindfulBreathing', 200), 'Should not be able to purchase already unlocked activity');

        console.log('✅ Premium activity purchase validation tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity purchase validation tests failed:', error);
        return false;
    }
}

// Test premium activity purchase flow
export function testPremiumActivityPurchaseFlow() {
    console.log('Testing premium activity purchase flow...');

    try {
        // Reset state
        resetCampaignState();
        resetActivityState();
        ZenPointsManager.setBalance(200);

        const initialBalance = ZenPointsManager.getCurrentBalance();
        const activityCost = premiumActivities.mindfulBreathing.cost;

        // Test successful purchase
        const result = purchasePremiumActivity('mindfulBreathing', initialBalance);
        console.assert(result.success, 'Should successfully purchase activity');
        console.assert(result.activityId === 'mindfulBreathing', 'Should return correct activity ID');
        console.assert(result.cost === activityCost, 'Should return correct cost');

        // Check zen points were deducted
        const newBalance = ZenPointsManager.getCurrentBalance();
        console.assert(newBalance === initialBalance - activityCost, 'Should deduct correct amount from balance');

        // Check activity was unlocked in campaign state
        console.assert(campaignState.unlockedActivities.mindfulBreathing, 'Should unlock activity in campaign state');

        // Check activity was unlocked in activity state
        console.assert(activityState.availableActivities.mindfulBreathing, 'Should unlock activity in activity state');

        // Check shop upgrades were updated
        console.assert(campaignState.shopUpgrades.totalSpent >= activityCost, 'Should update total spent');

        console.log('✅ Premium activity purchase flow tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity purchase flow tests failed:', error);
        return false;
    }
}

// Test premium activity purchase persistence
export function testPremiumActivityPersistence() {
    console.log('Testing premium activity purchase persistence...');

    try {
        // Reset state and purchase activity
        resetCampaignState();
        resetActivityState();
        ZenPointsManager.setBalance(200);

        const result = purchasePremiumActivity('compartmentalize', 200);
        console.assert(result.success, 'Should successfully purchase compartmentalize');

        // Simulate loading from saved state
        const savedUnlocked = campaignState.unlockedActivities.compartmentalize;
        console.assert(savedUnlocked, 'Should save unlock status to campaign state');

        // Reset activity state and reload from campaign
        resetActivityState();
        console.assert(!activityState.availableActivities.compartmentalize, 'Should reset activity state');

        loadActivityStateFromCampaign();
        console.assert(activityState.availableActivities.compartmentalize, 'Should reload unlock status from campaign');

        console.log('✅ Premium activity persistence tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity persistence tests failed:', error);
        return false;
    }
}

// Test premium activity purchase errors
export function testPremiumActivityPurchaseErrors() {
    console.log('Testing premium activity purchase error handling...');

    try {
        // Test insufficient funds
        resetCampaignState();
        ZenPointsManager.setBalance(50); // Less than any premium activity cost

        const result1 = purchasePremiumActivity('mindfulBreathing', 50);
        console.assert(!result1.success, 'Should fail with insufficient funds');
        console.assert(result1.message.includes('Insufficient'), 'Should return insufficient funds message');

        // Test invalid activity
        ZenPointsManager.setBalance(200);
        const result2 = purchasePremiumActivity('invalidActivity', 200);
        console.assert(!result2.success, 'Should fail with invalid activity');
        console.assert(result2.message.includes('Invalid'), 'Should return invalid activity message');

        // Test already purchased
        updateCampaignState({
            unlockedActivities: {
                ...campaignState.unlockedActivities,
                mindfulBreathing: true
            }
        });

        const result3 = purchasePremiumActivity('mindfulBreathing', 200);
        console.assert(!result3.success, 'Should fail when already purchased');
        console.assert(result3.message.includes('already'), 'Should return already unlocked message');

        console.log('✅ Premium activity purchase error tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity purchase error tests failed:', error);
        return false;
    }
}

// Test premium activity wrapper function
export function testPremiumActivityWrapper() {
    console.log('Testing premium activity wrapper function...');

    try {
        // Reset state
        resetCampaignState();
        ZenPointsManager.setBalance(200);

        // Test wrapper function
        const result = purchasePremiumActivityWrapper('mindfulBreathing');
        console.assert(result.success, 'Wrapper should successfully purchase activity');
        console.assert(campaignState.unlockedActivities.mindfulBreathing, 'Should unlock activity via wrapper');

        // Test wrapper with insufficient funds
        ZenPointsManager.setBalance(50);
        const result2 = purchasePremiumActivityWrapper('compartmentalize');
        console.assert(!result2.success, 'Wrapper should fail with insufficient funds');

        console.log('✅ Premium activity wrapper tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity wrapper tests failed:', error);
        return false;
    }
}

// Test shop UI integration
export function testShopUIIntegration() {
    console.log('Testing shop UI integration...');

    try {
        // Reset state
        resetCampaignState();
        ZenPointsManager.setBalance(200);

        // Create mock DOM elements for testing
        const mockElements = {
            mindfulBreathingStatus: { textContent: '', className: '' },
            mindfulBreathingBtn: { textContent: '', disabled: false },
            mindfulBreathingCard: { classList: { add: () => { }, remove: () => { } } },
            compartmentalizeStatus: { textContent: '', className: '' },
            compartmentalizeBtn: { textContent: '', disabled: false },
            compartmentalizeCard: { classList: { add: () => { }, remove: () => { } } }
        };

        // Mock getElementById
        const originalGetElementById = document.getElementById;
        document.getElementById = (id) => mockElements[id] || null;

        try {
            // Test UI update with locked activities
            updateShopUI(200);
            console.assert(mockElements.mindfulBreathingStatus.textContent === 'Locked', 'Should show locked status');
            console.assert(mockElements.mindfulBreathingBtn.textContent === 'Unlock Activity', 'Should show unlock button text');
            console.assert(!mockElements.mindfulBreathingBtn.disabled, 'Should enable button with sufficient funds');

            // Test UI update with unlocked activity
            updateCampaignState({
                unlockedActivities: {
                    ...campaignState.unlockedActivities,
                    mindfulBreathing: true
                }
            });

            updateShopUI(200);
            console.assert(mockElements.mindfulBreathingStatus.textContent === 'Unlocked', 'Should show unlocked status');
            console.assert(mockElements.mindfulBreathingBtn.textContent === 'Already Unlocked', 'Should show already unlocked text');
            console.assert(mockElements.mindfulBreathingBtn.disabled, 'Should disable button when unlocked');

            // Test UI update with insufficient funds
            updateCampaignState({
                unlockedActivities: {
                    ...campaignState.unlockedActivities,
                    mindfulBreathing: false
                }
            });

            updateShopUI(50); // Less than activity cost
            console.assert(mockElements.mindfulBreathingBtn.textContent === 'Insufficient Zen', 'Should show insufficient funds text');
            console.assert(mockElements.mindfulBreathingBtn.disabled, 'Should disable button with insufficient funds');

        } finally {
            // Restore original getElementById
            document.getElementById = originalGetElementById;
        }

        console.log('✅ Shop UI integration tests passed');
        return true;

    } catch (error) {
        console.error('❌ Shop UI integration tests failed:', error);
        return false;
    }
}

// Test multiple premium activity purchases
export function testMultiplePremiumActivityPurchases() {
    console.log('Testing multiple premium activity purchases...');

    try {
        // Reset state with enough funds for both activities
        resetCampaignState();
        resetActivityState();
        ZenPointsManager.setBalance(500);

        const initialBalance = ZenPointsManager.getCurrentBalance();

        // Purchase first activity
        const result1 = purchasePremiumActivity('mindfulBreathing', ZenPointsManager.getCurrentBalance());
        console.assert(result1.success, 'Should purchase first activity');

        // Purchase second activity
        const result2 = purchasePremiumActivity('compartmentalize', ZenPointsManager.getCurrentBalance());
        console.assert(result2.success, 'Should purchase second activity');

        // Check both are unlocked
        console.assert(campaignState.unlockedActivities.mindfulBreathing, 'First activity should be unlocked');
        console.assert(campaignState.unlockedActivities.compartmentalize, 'Second activity should be unlocked');
        console.assert(activityState.availableActivities.mindfulBreathing, 'First activity should be available');
        console.assert(activityState.availableActivities.compartmentalize, 'Second activity should be available');

        // Check total spent
        const totalCost = premiumActivities.mindfulBreathing.cost + premiumActivities.compartmentalize.cost;
        const finalBalance = ZenPointsManager.getCurrentBalance();
        console.assert(finalBalance === initialBalance - totalCost, 'Should deduct total cost from balance');
        console.assert(campaignState.shopUpgrades.totalSpent >= totalCost, 'Should track total spent');

        console.log('✅ Multiple premium activity purchase tests passed');
        return true;

    } catch (error) {
        console.error('❌ Multiple premium activity purchase tests failed:', error);
        return false;
    }
}

// Run all premium activity shop tests
export function runPremiumActivityShopTests() {
    console.log('🧪 Running Premium Activity Shop Tests...');

    const tests = [
        testPremiumActivityConfiguration,
        testPremiumActivityPurchaseValidation,
        testPremiumActivityPurchaseFlow,
        testPremiumActivityPersistence,
        testPremiumActivityPurchaseErrors,
        testPremiumActivityWrapper,
        testShopUIIntegration,
        testMultiplePremiumActivityPurchases
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        if (test()) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log(`\n📊 Premium Activity Shop Test Results: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runPremiumActivityShopTests();
}