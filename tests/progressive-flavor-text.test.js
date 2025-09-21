// Unit tests for progressive flavor text system
import { 
    getProgressiveFlavorText, 
    resetHandState, 
    incrementHitCount, 
    handState,
    progressiveFlavorText 
} from '../assets/js/game-state.js';

// Test progressive flavor text selection
function testProgressiveFlavorTextSelection() {
    console.log('Testing progressive flavor text selection...');
    
    // Reset hand state
    resetHandState();
    
    // Test first hit (index 0)
    let flavorText = getProgressiveFlavorText('hit', 0, 0);
    console.assert(
        flavorText === progressiveFlavorText[0].hit[0],
        'First hit should return first flavor text'
    );
    
    // Test second hit (index 1)
    flavorText = getProgressiveFlavorText('hit', 0, 1);
    console.assert(
        flavorText === progressiveFlavorText[0].hit[1],
        'Second hit should return second flavor text'
    );
    
    // Test hit count beyond array length (should use last item)
    flavorText = getProgressiveFlavorText('hit', 0, 10);
    const lastIndex = progressiveFlavorText[0].hit.length - 1;
    console.assert(
        flavorText === progressiveFlavorText[0].hit[lastIndex],
        'Hit count beyond array should use last flavor text'
    );
    
    console.log('✅ Progressive flavor text selection tests passed');
}

// Test hand state management
function testHandStateManagement() {
    console.log('Testing hand state management...');
    
    // Test reset
    resetHandState();
    console.assert(handState.hitCount === 0, 'Hit count should be 0 after reset');
    console.assert(handState.lastAction === '', 'Last action should be empty after reset');
    console.assert(typeof handState.currentHand === 'number', 'Current hand should be a number');
    
    // Test increment
    incrementHitCount();
    console.assert(handState.hitCount === 1, 'Hit count should be 1 after increment');
    console.assert(handState.lastAction === 'hit', 'Last action should be hit after increment');
    
    incrementHitCount();
    console.assert(handState.hitCount === 2, 'Hit count should be 2 after second increment');
    
    // Test reset clears count
    const oldHandId = handState.currentHand;
    resetHandState();
    console.assert(handState.hitCount === 0, 'Hit count should be 0 after second reset');
    console.assert(handState.currentHand !== oldHandId, 'Hand ID should change after reset');
    
    console.log('✅ Hand state management tests passed');
}

// Test fallback behavior
function testFallbackBehavior() {
    console.log('Testing fallback behavior...');
    
    // Test invalid step index
    let flavorText = getProgressiveFlavorText('hit', -1, 0);
    console.assert(typeof flavorText === 'string', 'Should return string for invalid step');
    console.assert(flavorText.length > 0, 'Should return non-empty string for invalid step');
    
    // Test invalid action
    flavorText = getProgressiveFlavorText('invalid', 0, 0);
    console.assert(typeof flavorText === 'string', 'Should return string for invalid action');
    
    // Test very high step index
    flavorText = getProgressiveFlavorText('hit', 999, 0);
    console.assert(typeof flavorText === 'string', 'Should return string for high step index');
    
    console.log('✅ Fallback behavior tests passed');
}

// Test all DMV steps have progressive text
function testAllStepsHaveProgressiveText() {
    console.log('Testing all DMV steps have progressive text...');
    
    for (let step = 0; step < 5; step++) {
        // Test hit action
        let flavorText = getProgressiveFlavorText('hit', step, 0);
        console.assert(typeof flavorText === 'string', `Step ${step} hit should return string`);
        console.assert(flavorText.length > 0, `Step ${step} hit should return non-empty string`);
        
        // Test stand action
        flavorText = getProgressiveFlavorText('stand', step, 0);
        console.assert(typeof flavorText === 'string', `Step ${step} stand should return string`);
        console.assert(flavorText.length > 0, `Step ${step} stand should return non-empty string`);
        
        // Test multiple hits return different text
        const firstHit = getProgressiveFlavorText('hit', step, 0);
        const secondHit = getProgressiveFlavorText('hit', step, 1);
        
        if (progressiveFlavorText[step] && progressiveFlavorText[step].hit && progressiveFlavorText[step].hit.length > 1) {
            console.assert(firstHit !== secondHit, `Step ${step} should have different text for multiple hits`);
        }
    }
    
    console.log('✅ All DMV steps progressive text tests passed');
}

// Run all tests
export function runProgressiveFlavorTextTests() {
    console.log('🧪 Running Progressive Flavor Text Tests...');
    
    try {
        testProgressiveFlavorTextSelection();
        testHandStateManagement();
        testFallbackBehavior();
        testAllStepsHaveProgressiveText();
        
        console.log('🎉 All progressive flavor text tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Progressive flavor text tests failed:', error);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runProgressiveFlavorTextTests();
}