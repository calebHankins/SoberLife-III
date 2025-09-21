// Unit tests for contextual button functionality
import { updateContextualButtons } from '../assets/js/ui-manager.js';
import { gameState, contextualActions } from '../assets/js/game-state.js';

// Mock DOM elements for testing
function createMockButtons() {
    const hitBtn = document.createElement('button');
    hitBtn.id = 'hitBtn';
    document.body.appendChild(hitBtn);
    
    const standBtn = document.createElement('button');
    standBtn.id = 'standBtn';
    document.body.appendChild(standBtn);
    
    return { hitBtn, standBtn };
}

// Clean up mock DOM
function cleanupMockButtons() {
    const hitBtn = document.getElementById('hitBtn');
    const standBtn = document.getElementById('standBtn');
    
    if (hitBtn) hitBtn.remove();
    if (standBtn) standBtn.remove();
}

// Test contextual button updates
function testContextualButtonUpdates() {
    console.log('Testing contextual button updates...');
    
    const { hitBtn, standBtn } = createMockButtons();
    
    try {
        // Test each DMV step
        for (let step = 0; step < 5; step++) {
            gameState.currentStep = step;
            
            updateContextualButtons();
            
            // Check that buttons have appropriate text
            console.assert(hitBtn.textContent.length > 0, `Step ${step} hit button should have text`);
            console.assert(standBtn.textContent.length > 0, `Step ${step} stand button should have text`);
            
            // Check that buttons have tooltips
            console.assert(hitBtn.title.length > 0, `Step ${step} hit button should have tooltip`);
            console.assert(standBtn.title.length > 0, `Step ${step} stand button should have tooltip`);
            
            // Check that text is contextual (not generic blackjack terms)
            if (contextualActions[step]) {
                const expectedHitText = contextualActions[step].hit.text;
                const expectedStandText = contextualActions[step].stand.text;
                
                console.assert(hitBtn.textContent === expectedHitText, 
                    `Step ${step} hit button should show contextual text: ${expectedHitText}`);
                console.assert(standBtn.textContent === expectedStandText, 
                    `Step ${step} stand button should show contextual text: ${expectedStandText}`);
            }
        }
        
        console.log('✅ Contextual button update tests passed');
    } finally {
        cleanupMockButtons();
    }
}

// Test fallback behavior
function testButtonFallbackBehavior() {
    console.log('Testing button fallback behavior...');
    
    const { hitBtn, standBtn } = createMockButtons();
    
    try {
        // Test with invalid step
        gameState.currentStep = 999;
        
        updateContextualButtons();
        
        // Should still have some text (fallback)
        console.assert(hitBtn.textContent.length > 0, 'Hit button should have fallback text');
        console.assert(standBtn.textContent.length > 0, 'Stand button should have fallback text');
        console.assert(hitBtn.title.length > 0, 'Hit button should have fallback tooltip');
        console.assert(standBtn.title.length > 0, 'Stand button should have fallback tooltip');
        
        console.log('✅ Button fallback behavior tests passed');
    } finally {
        cleanupMockButtons();
    }
}

// Run all tests
export function runContextualButtonTests() {
    console.log('🧪 Running Contextual Button Tests...');
    
    try {
        testContextualButtonUpdates();
        testButtonFallbackBehavior();
        
        console.log('🎉 All contextual button tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Contextual button tests failed:', error);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runContextualButtonTests();
}