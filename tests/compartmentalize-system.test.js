// Compartmentalize System Tests
// Integration tests for the compartmentalize functionality and split hand mechanics

import {
    gameState,
    activityState,
    updateGameState,
    resetHandState,
    unlockPremiumActivity,
    resetActivityState
} from '../assets/js/game-state.js';

import {
    handleCompartmentalize,
    switchSplitHand,
    getActiveSplitHand,
    completeSplitHand
} from '../assets/js/stress-system.js';

import { calculateScore } from '../assets/js/card-system.js';
import { ZenPointsManager } from '../assets/js/zen-points-manager.js';

// Test compartmentalize activation
export function testCompartmentalizeActivation() {
    console.log('Testing compartmentalize activation...');

    try {
        // Setup busted hand
        resetHandState();
        resetActivityState();
        unlockPremiumActivity('compartmentalize');
        ZenPointsManager.setBalance(150);

        // Create a busted hand (over 21)
        const bustedCards = [
            { value: 'K', suit: '♠️' },
            { value: '7', suit: '♥️' },
            { value: '8', suit: '♦️' }
        ];

        updateGameState({ playerCards: bustedCards });
        console.assert(calculateScore(bustedCards) > 21, 'Test hand should be busted');

        // Test compartmentalize activation
        const result = handleCompartmentalize();
        console.assert(result.success, 'Should successfully activate compartmentalize');
        console.assert(activityState.compartmentalizeInProgress, 'Should set compartmentalize in progress');
        console.assert(activityState.splitHands !== null, 'Should create split hands');
        console.assert(activityState.usedThisHand, 'Should mark activity as used');

        console.log('✅ Compartmentalize activation tests passed');
        return true;

    } catch (error) {
        console.error('❌ Compartmentalize activation tests failed:', error);
        return false;
    }
}

// Test compartmentalize validation
export function testCompartmentalizeValidation() {
    console.log('Testing compartmentalize validation...');

    try {
        // Test with non-busted hand
        resetHandState();
        resetActivityState();
        unlockPremiumActivity('compartmentalize');
        ZenPointsManager.setBalance(150);

        const nonBustedCards = [
            { value: '10', suit: '♠️' },
            { value: '9', suit: '♥️' }
        ];

        updateGameState({ playerCards: nonBustedCards });
        console.assert(calculateScore(nonBustedCards) <= 21, 'Test hand should not be busted');

        const result = handleCompartmentalize();
        console.assert(!result.success, 'Should fail on non-busted hand');
        console.assert(result.reason === 'not_busted', 'Should fail with not_busted reason');

        // Test with insufficient funds
        const bustedCards = [
            { value: 'K', suit: '♠️' },
            { value: '7', suit: '♥️' },
            { value: '8', suit: '♦️' }
        ];

        updateGameState({ playerCards: bustedCards });
        ZenPointsManager.setBalance(50); // Less than compartmentalize cost (100)

        const result2 = handleCompartmentalize();
        console.assert(!result2.success, 'Should fail with insufficient funds');
        console.assert(result2.reason === 'insufficient_funds', 'Should fail with insufficient_funds reason');

        console.log('✅ Compartmentalize validation tests passed');
        return true;

    } catch (error) {
        console.error('❌ Compartmentalize validation tests failed:', error);
        return false;
    }
}

// Test split hand creation
export function testSplitHandCreation() {
    console.log('Testing split hand creation...');

    try {
        // Setup busted hand
        resetHandState();
        resetActivityState();
        unlockPremiumActivity('compartmentalize');
        ZenPointsManager.setBalance(150);

        // Create a specific busted hand for predictable splitting
        const bustedCards = [
            { value: '10', suit: '♠️' },
            { value: '5', suit: '♥️' },
            { value: '7', suit: '♦️' },
            { value: '2', suit: '♣️' }
        ]; // Total: 24 (busted)

        updateGameState({ playerCards: bustedCards });

        const result = handleCompartmentalize();
        console.assert(result.success, 'Should successfully compartmentalize');

        const splitHands = result.splitHands;
        console.assert(splitHands.hand1.cards.length > 0, 'Hand 1 should have cards');
        console.assert(splitHands.hand2.cards.length > 0, 'Hand 2 should have cards');
        console.assert(splitHands.hand1.cards.length + splitHands.hand2.cards.length === bustedCards.length, 'All cards should be distributed');
        console.assert(splitHands.currentHand === 0, 'Should start with hand 1');
        console.assert(splitHands.hand1.active, 'Hand 1 should be active');
        console.assert(!splitHands.hand2.active, 'Hand 2 should not be active');

        console.log('✅ Split hand creation tests passed');
        return true;

    } catch (error) {
        console.error('❌ Split hand creation tests failed:', error);
        return false;
    }
}

// Test split hand switching
export function testSplitHandSwitching() {
    console.log('Testing split hand switching...');

    try {
        // Setup compartmentalize state
        resetHandState();
        resetActivityState();
        unlockPremiumActivity('compartmentalize');
        ZenPointsManager.setBalance(150);

        const bustedCards = [
            { value: 'K', suit: '♠️' },
            { value: '7', suit: '♥️' },
            { value: '8', suit: '♦️' }
        ];

        updateGameState({ playerCards: bustedCards });
        const result = handleCompartmentalize();
        console.assert(result.success, 'Should successfully compartmentalize');

        // Test initial state
        let activeHand = getActiveSplitHand();
        console.assert(activeHand === activityState.splitHands.hand1, 'Should start with hand 1 active');

        // Test switching
        const switched = switchSplitHand();
        console.assert(switched, 'Should successfully switch hands');

        activeHand = getActiveSplitHand();
        console.assert(activeHand === activityState.splitHands.hand2, 'Should switch to hand 2');
        console.assert(activityState.splitHands.currentHand === 1, 'Should update current hand index');

        // Test switching back
        switchSplitHand();
        activeHand = getActiveSplitHand();
        console.assert(activeHand === activityState.splitHands.hand1, 'Should switch back to hand 1');

        console.log('✅ Split hand switching tests passed');
        return true;

    } catch (error) {
        console.error('❌ Split hand switching tests failed:', error);
        return false;
    }
}

// Test split hand completion
export function testSplitHandCompletion() {
    console.log('Testing split hand completion...');

    try {
        // Setup compartmentalize state
        resetHandState();
        resetActivityState();
        unlockPremiumActivity('compartmentalize');
        ZenPointsManager.setBalance(150);

        const bustedCards = [
            { value: 'K', suit: '♠️' },
            { value: '7', suit: '♥️' },
            { value: '8', suit: '♦️' }
        ];

        updateGameState({ playerCards: bustedCards });
        const result = handleCompartmentalize();
        console.assert(result.success, 'Should successfully compartmentalize');

        // Complete first hand
        const completion1 = completeSplitHand('win');
        console.assert(!completion1.completed, 'Should not be fully completed after first hand');
        console.assert(activityState.splitHands.hand1.completed, 'Hand 1 should be marked completed');
        console.assert(activityState.splitHands.hand1.outcome === 'win', 'Hand 1 should have win outcome');

        // Complete second hand
        const completion2 = completeSplitHand('lose');
        console.assert(completion2.completed, 'Should be fully completed after second hand');
        console.assert(activityState.splitHands.hand2.completed, 'Hand 2 should be marked completed');
        console.assert(completion2.overallOutcome === 'win', 'Overall outcome should be win (at least one hand won)');

        // Check state reset
        console.assert(!activityState.compartmentalizeInProgress, 'Should reset compartmentalize state');
        console.assert(activityState.splitHands === null, 'Should clear split hands');

        console.log('✅ Split hand completion tests passed');
        return true;

    } catch (error) {
        console.error('❌ Split hand completion tests failed:', error);
        return false;
    }
}

// Test split hand outcome logic
export function testSplitHandOutcomes() {
    console.log('Testing split hand outcome logic...');

    try {
        // Test different outcome combinations
        const testCases = [
            { hand1: 'win', hand2: 'lose', expected: 'win' },
            { hand1: 'lose', hand2: 'win', expected: 'win' },
            { hand1: 'tie', hand2: 'tie', expected: 'tie' },
            { hand1: 'tie', hand2: 'lose', expected: 'tie' },
            { hand1: 'lose', hand2: 'tie', expected: 'tie' },
            { hand1: 'lose', hand2: 'lose', expected: 'lose' },
            { hand1: 'bust', hand2: 'bust', expected: 'lose' },
            { hand1: 'win', hand2: 'bust', expected: 'win' }
        ];

        for (const testCase of testCases) {
            // Setup fresh compartmentalize state
            resetHandState();
            resetActivityState();
            unlockPremiumActivity('compartmentalize');
            ZenPointsManager.setBalance(150);

            const bustedCards = [
                { value: 'K', suit: '♠️' },
                { value: '7', suit: '♥️' },
                { value: '8', suit: '♦️' }
            ];

            updateGameState({ playerCards: bustedCards });
            const result = handleCompartmentalize();

            // Complete both hands with test outcomes
            completeSplitHand(testCase.hand1);
            const finalResult = completeSplitHand(testCase.hand2);

            console.assert(finalResult.overallOutcome === testCase.expected,
                `Expected ${testCase.expected} for ${testCase.hand1}+${testCase.hand2}, got ${finalResult.overallOutcome}`);
        }

        console.log('✅ Split hand outcome tests passed');
        return true;

    } catch (error) {
        console.error('❌ Split hand outcome tests failed:', error);
        return false;
    }
}

// Test compartmentalize statistics
export function testCompartmentalizeStatistics() {
    console.log('Testing compartmentalize statistics...');

    try {
        // Reset state
        resetHandState();
        resetActivityState();
        unlockPremiumActivity('compartmentalize');
        ZenPointsManager.setBalance(150);

        const initialUses = activityState.compartmentalizeUses || 0;

        // Use compartmentalize
        const bustedCards = [
            { value: 'K', suit: '♠️' },
            { value: '7', suit: '♥️' },
            { value: '8', suit: '♦️' }
        ];

        updateGameState({ playerCards: bustedCards });
        const result = handleCompartmentalize();
        console.assert(result.success, 'Should successfully use compartmentalize');

        // Check statistics were updated
        // Note: Statistics are updated in the stress system, so we check campaign state
        console.assert(campaignState.activityStats.compartmentalizeUses > initialUses, 'Should increment compartmentalize uses');
        console.assert(campaignState.activityStats.totalActivitiesUsed > 0, 'Should increment total activities used');

        console.log('✅ Compartmentalize statistics tests passed');
        return true;

    } catch (error) {
        console.error('❌ Compartmentalize statistics tests failed:', error);
        return false;
    }
}

// Run all compartmentalize tests
export function runCompartmentalizeTests() {
    console.log('🧪 Running Compartmentalize System Tests...');

    const tests = [
        testCompartmentalizeActivation,
        testCompartmentalizeValidation,
        testSplitHandCreation,
        testSplitHandSwitching,
        testSplitHandCompletion,
        testSplitHandOutcomes,
        testCompartmentalizeStatistics
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

    console.log(`\n📊 Compartmentalize Test Results: ${passed} passed, ${failed} failed`);
    return failed === 0;
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runCompartmentalizeTests();
}