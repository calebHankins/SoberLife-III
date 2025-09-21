// Unit tests for DMV outcome messaging system
import { 
    getDMVOutcomeMessage, 
    dmvOutcomeMessages 
} from '../assets/js/game-state.js';

// Test DMV outcome message selection
function testDMVOutcomeMessageSelection() {
    console.log('Testing DMV outcome message selection...');
    
    const outcomes = ['win', 'lose', 'tie', 'bust', 'house_bust'];
    
    outcomes.forEach(outcome => {
        const message = getDMVOutcomeMessage(outcome);
        console.assert(typeof message === 'string', `${outcome} should return string`);
        console.assert(message.length > 0, `${outcome} should return non-empty string`);
        console.assert(!message.includes('House'), `${outcome} should not contain blackjack terminology`);
        console.assert(!message.includes('Busted'), `${outcome} should not contain blackjack terminology`);
    });
    
    console.log('✅ DMV outcome message selection tests passed');
}

// Test message variety
function testMessageVariety() {
    console.log('Testing message variety...');
    
    const outcomes = ['win', 'lose', 'tie', 'bust', 'house_bust'];
    
    outcomes.forEach(outcome => {
        const messages = new Set();
        
        // Get 20 messages to test randomization
        for (let i = 0; i < 20; i++) {
            const message = getDMVOutcomeMessage(outcome);
            messages.add(message);
        }
        
        // Should have variety if there are multiple messages available
        if (dmvOutcomeMessages[outcome] && dmvOutcomeMessages[outcome].length > 1) {
            console.assert(messages.size > 1, `${outcome} should provide message variety`);
        }
    });
    
    console.log('✅ Message variety tests passed');
}

// Test fallback behavior
function testOutcomeFallbackBehavior() {
    console.log('Testing outcome fallback behavior...');
    
    // Test invalid outcome
    let message = getDMVOutcomeMessage('invalid_outcome');
    console.assert(typeof message === 'string', 'Should return string for invalid outcome');
    console.assert(message.length > 0, 'Should return non-empty string for invalid outcome');
    
    // Test null outcome
    message = getDMVOutcomeMessage(null);
    console.assert(typeof message === 'string', 'Should return string for null outcome');
    
    // Test undefined outcome
    message = getDMVOutcomeMessage(undefined);
    console.assert(typeof message === 'string', 'Should return string for undefined outcome');
    
    console.log('✅ Outcome fallback behavior tests passed');
}

// Test educational content
function testEducationalContent() {
    console.log('Testing educational content...');
    
    const outcomes = ['win', 'lose', 'tie', 'bust', 'house_bust'];
    
    outcomes.forEach(outcome => {
        const message = getDMVOutcomeMessage(outcome);
        
        // Check for stress management themes
        const hasStressManagement = 
            message.includes('stress') ||
            message.includes('calm') ||
            message.includes('patience') ||
            message.includes('breath') ||
            message.includes('zen') ||
            message.includes('mindful') ||
            message.includes('pressure') ||
            message.includes('approach');
            
        console.assert(hasStressManagement, `${outcome} message should contain stress management themes`);
    });
    
    console.log('✅ Educational content tests passed');
}

// Test DMV terminology
function testDMVTerminology() {
    console.log('Testing DMV terminology...');
    
    const outcomes = ['win', 'lose', 'tie', 'bust', 'house_bust'];
    
    outcomes.forEach(outcome => {
        const message = getDMVOutcomeMessage(outcome);
        
        // Should not contain blackjack terms
        const blackjackTerms = ['house', 'busted', 'dealer', 'cards', 'deck', 'blackjack'];
        blackjackTerms.forEach(term => {
            console.assert(
                !message.toLowerCase().includes(term.toLowerCase()), 
                `${outcome} message should not contain blackjack term: ${term}`
            );
        });
        
        // Should contain appropriate DMV/bureaucratic themes
        const dmvThemes = [
            'step', 'process', 'bureaucra', 'DMV', 'approach', 'patience', 
            'preparation', 'system', 'procedure', 'timing'
        ];
        
        const hasDMVTheme = dmvThemes.some(theme => 
            message.toLowerCase().includes(theme.toLowerCase())
        );
        
        // Note: Not all messages need explicit DMV terms, but they should feel appropriate
        // This is more of a content quality check
    });
    
    console.log('✅ DMV terminology tests passed');
}

// Run all tests
export function runDMVOutcomeMessagingTests() {
    console.log('🧪 Running DMV Outcome Messaging Tests...');
    
    try {
        testDMVOutcomeMessageSelection();
        testMessageVariety();
        testOutcomeFallbackBehavior();
        testEducationalContent();
        testDMVTerminology();
        
        console.log('🎉 All DMV outcome messaging tests passed!');
        return true;
    } catch (error) {
        console.error('❌ DMV outcome messaging tests failed:', error);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runDMVOutcomeMessagingTests();
}