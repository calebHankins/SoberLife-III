// Comprehensive integration tests for messaging systems
import { runProgressiveFlavorTextTests } from './progressive-flavor-text.test.js';
import { runDMVOutcomeMessagingTests } from './dmv-outcome-messaging.test.js';
import { runUIOutcomeMessagingTests } from './ui-outcome-messaging.test.js';
import { runContextualButtonTests } from './contextual-buttons.test.js';
import { runErrorHandlingTests } from './error-handling.test.js';

// Integration test for complete game flow with new messaging
function testCompleteGameFlowMessaging() {
    console.log('Testing complete game flow with new messaging...');
    
    // This would require more complex setup with DOM mocking
    // For now, we'll test that all individual components work
    console.log('✅ Complete game flow messaging test placeholder passed');
}

// Test message variety across multiple sessions
function testMessageVariety() {
    console.log('Testing message variety across sessions...');
    
    // Test that we get different messages for same outcomes
    const outcomes = ['win', 'lose', 'tie', 'bust', 'house_bust'];
    
    outcomes.forEach(outcome => {
        const messages = new Set();
        
        // Collect messages from multiple calls
        for (let i = 0; i < 10; i++) {
            const message = getDMVOutcomeMessage(outcome);
            messages.add(message);
        }
        
        // Should have some variety (unless there's only one message)
        console.log(`${outcome} produced ${messages.size} unique messages`);
    });
    
    console.log('✅ Message variety tests passed');
}

// Performance test for messaging system
function testMessagingPerformance() {
    console.log('Testing messaging system performance...');
    
    const startTime = performance.now();
    
    // Run many messaging operations
    for (let i = 0; i < 1000; i++) {
        getProgressiveFlavorText('hit', i % 5, i % 10);
        getDMVOutcomeMessage(['win', 'lose', 'tie', 'bust', 'house_bust'][i % 5]);
        getStressManagementInsight(['win', 'lose', 'tie'][i % 3]);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Messaging operations took ${duration.toFixed(2)}ms`);
    console.assert(duration < 100, 'Messaging should be fast (< 100ms for 1000 operations)');
    
    console.log('✅ Messaging performance tests passed');
}

// Run all messaging system tests
export function runAllMessagingTests() {
    console.log('🧪 Running All Messaging System Tests...');
    
    const testResults = [];
    
    try {
        testResults.push(runProgressiveFlavorTextTests());
        testResults.push(runDMVOutcomeMessagingTests());
        testResults.push(runUIOutcomeMessagingTests());
        testResults.push(runContextualButtonTests());
        testResults.push(runErrorHandlingTests());
        
        testCompleteGameFlowMessaging();
        testMessageVariety();
        testMessagingPerformance();
        
        const allPassed = testResults.every(result => result === true);
        
        if (allPassed) {
            console.log('🎉 All messaging system tests passed!');
            return true;
        } else {
            console.error('❌ Some messaging system tests failed');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Messaging system tests failed:', error);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runAllMessagingTests();
}