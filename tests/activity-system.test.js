// Activity System Tests
// Tests for activity cooldown, premium activities, and compartmentalize functionality

import {
    gameState,
    activityState,
    resetHandState,
    canUseActivity,
    markActivityUsed,
    unlockPremiumActivity,
    resetActivityState,
    updateActivityState,
    campaignState,
    updateCampaignState,
    resetCampaignState
} from '../assets/js/game-state.js';

import {
    zenActivities,
    useZenActivity,
    handleCompartmentalize,
    switchSplitHand,
    getActiveSplitHand,
    completeSplitHand
} from '../assets/js/stress-system.js';

import {
    premiumActivities,
    canPurchasePremiumActivity,
    purchasePremiumActivity
} from '../assets/js/shop-system.js';

import { ZenPointsManager } from '../assets/js/zen-points-manager.js';

// Test activity cooldown logic
export function testActivityCooldown() {
    console.log('Testing activity cooldown logic...');

    try {
        // Reset state
        resetHandState();
        resetActivityState();

        // Initially should be able to use activities
        console.assert(canUseActivity('breath'), 'Should be able to use breath initially');
        console.assert(!activityState.usedThisHand, 'Should not have used activity this hand');

        // Mark activity as used
        markActivityUsed();
        console.assert(activityState.usedThisHand, 'Should have marked activity as used');
        console.assert(!canUseActivity('breath'), 'Should not be able to use breath after cooldown');

        // Reset hand state should reset cooldown
        resetHandState();
        console.assert(!activityState.usedThisHand, 'Should reset activity usage on new hand');
        console.assert(canUseActivity('breath'), 'Should be able to use breath after hand reset');

        console.log('✅ Activity cooldown tests passed');
        return true;

    } catch (error) {
        console.error('❌ Activity cooldown tests failed:', error);
        return false;
    }
}

// Test premium activity unlocking
export function testPremiumActivityUnlocking() {
    console.log('Testing premium activity unlocking...');

    try {
        // Reset state
        resetActivityState();
        resetCampaignState();

        // Initially premium activities should be locked
        console.assert(!activityState.availableActivities.mindfulBreathing, 'Mindful breathing should be locked initially');
        console.assert(!activityState.availableActivities.compartmentalize, 'Compartmentalize should be locked initially');

        // Unlock premium activity
        unlockPremiumActivity('mindfulBreathing');
        console.assert(activityState.availableActivities.mindfulBreathing, 'Mindful breathing should be unlocked');

        // Test can use activity with unlock
        console.assert(canUseActivity('mindfulBreathing'), 'Should be able to use unlocked premium activity');

        // Test still can't use locked activity
        console.assert(!canUseActivity('compartmentalize'), 'Should not be able to use locked premium activity');

        console.log('✅ Premium activity unlocking tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity unlocking tests failed:', error);
        return false;
    }
}

// Test activity usage with zen points
export function testActivityUsageWithZenPoints() {
    console.log('Testing activity usage with zen points...');

    try {
        // Reset state
        resetHandState();
        resetActivityState();
        ZenPointsManager.setBalance(100);

        // Test successful activity usage
        const result = useZenActivity('breath');
        console.assert(result.success, 'Should successfully use breath activity');
        console.assert(activityState.usedThisHand, 'Should mark activity as used');

        // Test cooldown prevents second usage
        const result2 = useZenActivity('stretch');
        console.assert(!result2.success, 'Should fail to use second activity due to cooldown');
        console.assert(result2.reason === 'cooldown', 'Should fail due to cooldown reason');

        // Test insufficient funds
        ZenPointsManager.setBalance(5); // Less than breath cost (10)
        resetHandState(); // Reset cooldown

        const result3 = useZenActivity('breath');
        console.assert(!result3.success, 'Should fail due to insufficient funds');
        console.assert(result3.reason === 'insufficient_funds', 'Should fail due to insufficient funds reason');

        console.log('✅ Activity usage with zen points tests passed');
        return true;

    } catch (error) {
        console.error('❌ Activity usage with zen points tests failed:', error);
        return false;
    }
}

// Test premium activity purchasing
export function testPremiumActivityPurchasing() {
    console.log('Testing premium activity purchasing...');

    try {
        // Reset state
        resetCampaignState();
        ZenPointsManager.setBalance(200);

        // Test can purchase check
        console.assert(canPurchasePremiumActivity('mindfulBreathing', 200), 'Should be able to purchase mindful breathing');
        console.assert(!canPurchasePremiumActivity('mindfulBreathing', 100), 'Should not be able to purchase with insufficient funds');

        // Test successful purchase
        const result = purchasePremiumActivity('mindfulBreathing', 200);
        console.assert(result.success, 'Should successfully purchase mindful breathing');
        console.assert(campaignState.unlockedActivities.mindfulBreathing, 'Should unlock in campaign state');

        // Test already purchased
        const result2 = purchasePremiumActivity('mindfulBreathing', 200);
        console.assert(!result2.success, 'Should fail to purchase already unlocked activity');

        console.log('✅ Premium activity purchasing tests passed');
        return true;

    } catch (error) {
        console.error('❌ Premium activity purchasing tests failed:', error);
        return false;
    }
}

// Test activity statistics tracking
export function testActivityStatistics() {
    console.log('Testing activity statistics tracking...');

    try {
        // Reset state
        resetCampaignState();
        resetHandState();
        ZenPointsManager.setBalance(200);

        // Unlock premium activity
        unlockPremiumActivity('mindfulBreathing');

        // Use regular activity
        useZenActivity('breath');
        console.assert(campaignState.activityStats.totalActivitiesUsed === 1, 'Should track total activities used');
        console.assert(campaignState.activityStats.premiumActivityUses === 0, 'Should not count regular activity as premium');

        // Use premium activity
        resetHandState();
        useZenActivity('mindfulBreathing');
        console.assert(campaignState.activityStats.totalActivitiesUsed === 2, 'Should increment total activities used');
        console.assert(campaignState.activityStats.premiumActivityUses === 1, 'Should count premium activity use');

        console.log('✅ Activity statistics tests passed');
        return true;

    } catch (error) {
        console.error('❌ Activity statistics tests failed:', error);
        return false;
    }
}

// Run all activity cooldown tests
export function runActivityCooldownTests() {
    console.log('🧪 Running Activity Cooldown Tests...');

    const tests = [
        testActivityCooldown,
        testPremiumActivityUnlocking,
        testActivityUsageWithZenPoints,
        testPremiumActivityPurchasing,
        testActivityStatistics
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

    console.log(`\n📊 Activity Cooldown Test Results: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runActivityCooldownTests();
}