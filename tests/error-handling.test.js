// Comprehensive error handling tests for messaging systems
import { 
    getProgressiveFlavorText, 
    getDMVOutcomeMessage, 
    getStressManagementInsight,
    resetHandState,
    incrementHitCount
} from '../assets/js/game-state.js';

// Test progressive flavor text error handling
function testProgressiveFlavorTextErrorHandling() {
    console.log('Testing progressive flavor text error handling...');
    
    // Test invalid step indices
    let result = getProgressiveFlavorText('hit', -1, 0);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle negative step index gracefully');
    
    result = getProgressiveFlavorText('hit', 999, 0);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle high step index gracefully');
    
    // Test invalid actions
    result = getProgressiveFlavorText('invalid_action', 0, 0);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle invalid action gracefully');
    
    // Test invalid hit counts
    result = getProgressiveFlavorText('hit', 0, -1);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle negative hit count gracefully');
    
    result = getProgressiveFlavorText('hit', 0, 1000);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle very high hit count gracefully');
    
    // Test null/undefined inputs
    result = getProgressiveFlavorText(null, 0, 0);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle null action gracefully');
    
    result = getProgressiveFlavorText('hit', null, 0);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle null step gracefully');
    
    console.log('✅ Progressive flavor text error handling tests passed');
}

// Test DMV outcome message error handling
function testDMVOutcomeMessageErrorHandling() {
    console.log('Testing DMV outcome message error handling...');
    
    // Test invalid outcomes
    let result = getDMVOutcomeMessage('invalid_outcome');
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle invalid outcome gracefully');
    
    // Test null/undefined outcomes
    result = getDMVOutcomeMessage(null);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle null outcome gracefully');
    
    result = getDMVOutcomeMessage(undefined);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle undefined outcome gracefully');
    
    // Test empty string outcome
    result = getDMVOutcomeMessage('');
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle empty string outcome gracefully');
    
    console.log('✅ DMV outcome message error handling tests passed');
}

// Test stress management insight error handling
function testStressManagementInsightErrorHandling() {
    console.log('Testing stress management insight error handling...');
    
    // Test invalid outcomes
    let result = getStressManagementInsight('invalid_outcome');
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle invalid outcome gracefully');
    
    // Test null/undefined outcomes
    result = getStressManagementInsight(null);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle null outcome gracefully');
    
    result = getStressManagementInsight(undefined);
    console.assert(typeof result === 'string' && result.length > 0, 
        'Should handle undefined outcome gracefully');
    
    console.log('✅ Stress management insight error handling tests passed');
}

// Test hand state management error handling
function testHandStateErrorHandling() {
    console.log('Testing hand state error handling...');
    
    try {
        // These should not throw errors
        resetHandState();
        incrementHitCount();
        resetHandState();
        
        // Multiple increments should work
        for (let i = 0; i < 100; i++) {
            incrementHitCount();
        }
        
        resetHandState();
        
        console.log('✅ Hand state error handling tests passed');
    } catch (error) {
        console.error('Hand state management threw unexpected error:', error);
        throw error;
    }
}

// Test that all functions return safe values
function testSafeReturnValues() {
    console.log('Testing safe return values...');
    
    const testCases = [
        () => getProgressiveFlavorText('hit', 0, 0),
        () => getProgressiveFlavorText('stand', 1, 2),
        () => getDMVOutcomeMessage('win'),
        () => getDMVOutcomeMessage('lose'),
        () => getStressManagementInsight('tie'),
        () => getStressManagementInsight('bust')
    ];
    
    testCases.forEach((testCase, index) => {
        const result = testCase();
        
        // Should always return a string
        console.assert(typeof result === 'string', 
            `Test case ${index} should return string, got ${typeof result}`);
        
        // Should never return empty string
        console.assert(result.length > 0, 
            `Test case ${index} should return non-empty string`);
        
        // Should not contain HTML tags (basic XSS prevention)
        console.assert(!result.includes('<') && !result.includes('>'), 
            `Test case ${index} should not contain HTML tags`);
    });
    
    console.log('✅ Safe return values tests passed');
}

// Run all error handling tests
export function runErrorHandlingTests() {
    console.log('🧪 Running Error Handling Tests...');
    
    try {
        testProgressiveFlavorTextErrorHandling();
        testDMVOutcomeMessageErrorHandling();
        testStressManagementInsightErrorHandling();
        testHandStateErrorHandling();
        testSafeReturnValues();
        
        console.log('🎉 All error handling tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Error handling tests failed:', error);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runErrorHandlingTests();
}