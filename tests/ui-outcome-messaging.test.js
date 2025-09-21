// Unit tests for UI outcome messaging functions
import { 
    updateOutcomeMessage, 
    showStressManagementTip,
    displayProgressiveFlavorText 
} from '../assets/js/ui-manager.js';

// Mock DOM elements for testing
function createMockDOM() {
    // Create mock roundResult element
    const roundResult = document.createElement('div');
    roundResult.id = 'roundResult';
    document.body.appendChild(roundResult);
    
    return { roundResult };
}

// Clean up mock DOM
function cleanupMockDOM() {
    const roundResult = document.getElementById('roundResult');
    if (roundResult) {
        roundResult.remove();
    }
    
    // Remove any stress tips
    const tips = document.querySelectorAll('.stress-tip');
    tips.forEach(tip => tip.remove());
}

// Test outcome message display
function testOutcomeMessageDisplay() {
    console.log('Testing outcome message display...');
    
    const { roundResult } = createMockDOM();
    
    try {
        // Test each outcome type
        const outcomes = ['win', 'lose', 'tie', 'bust', 'house_bust'];
        
        outcomes.forEach(outcome => {
            updateOutcomeMessage(outcome);
            
            // Check that content was added
            console.assert(roundResult.children.length > 0, `${outcome} should add content to roundResult`);
            
            // Check for DMV-themed content
            const content = roundResult.innerHTML.toLowerCase();
            console.assert(!content.includes('house wins'), `${outcome} should not contain blackjack terms`);
            console.assert(!content.includes('busted'), `${outcome} should not contain blackjack terms`);
            
            // Clear for next test
            roundResult.innerHTML = '';
        });
        
        console.log('✅ Outcome message display tests passed');
    } finally {
        cleanupMockDOM();
    }
}

// Run all tests
export function runUIOutcomeMessagingTests() {
    console.log('🧪 Running UI Outcome Messaging Tests...');
    
    try {
        testOutcomeMessageDisplay();
        
        console.log('🎉 All UI outcome messaging tests passed!');
        return true;
    } catch (error) {
        console.error('❌ UI outcome messaging tests failed:', error);
        return false;
    }
}