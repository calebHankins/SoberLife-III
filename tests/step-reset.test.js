// Step Reset Test
// Verify that step counter resets when starting new tasks

// Mock DOM elements
global.document = {
    getElementById: () => ({ 
        classList: { add: () => {}, remove: () => {} },
        textContent: '',
        disabled: false
    }),
    querySelectorAll: () => []
};

// Mock localStorage
global.localStorage = {
    data: {},
    getItem: function(key) { return this.data[key] || null; },
    setItem: function(key, value) { this.data[key] = value; },
    removeItem: function(key) { delete this.data[key]; }
};

// Test step reset functionality
function testStepReset() {
    console.log('🧪 Testing step reset functionality...');
    
    try {
        // Import required modules
        const { gameState, updateGameState, resetGameState } = require('../assets/js/game-state.js');
        
        // Simulate completing several steps
        updateGameState({ currentStep: 4 }); // Set to step 5 (index 4)
        console.assert(gameState.currentStep === 4, 'Step should be set to 4');
        
        // Simulate starting a new task (what should happen in campaign mode)
        updateGameState({
            currentStep: 0, // Reset to step 0 for new task
            stressLevel: 20,
            zenPoints: 80,
            surveyCompleted: true,
            initialFlavorTextShown: false
        });
        
        console.assert(gameState.currentStep === 0, 'Step should reset to 0 for new task');
        console.assert(gameState.initialFlavorTextShown === false, 'Flavor text should reset for new task');
        
        // Test full reset
        updateGameState({ currentStep: 3 }); // Set to some step
        resetGameState(); // Full reset
        
        console.assert(gameState.currentStep === 0, 'Full reset should set step to 0');
        console.assert(gameState.stressLevel === 0, 'Full reset should reset stress');
        console.assert(gameState.zenPoints === 100, 'Full reset should reset zen points');
        
        console.log('✅ Step reset test passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Step reset test failed:', error);
        return false;
    }
}

// Test campaign task switching
function testCampaignTaskSwitching() {
    console.log('🧪 Testing campaign task switching...');
    
    try {
        const { campaignState, updateCampaignState, resetCampaignState } = require('../assets/js/game-state.js');
        
        // Start with fresh campaign state
        resetCampaignState();
        console.assert(campaignState.currentTask === 0, 'Campaign should start with task 0');
        console.assert(campaignState.completedTasks.length === 0, 'Should start with no completed tasks');
        
        // Simulate completing first task
        updateCampaignState({
            completedTasks: ['dmv'],
            currentTask: 'jobInterview'
        });
        
        console.assert(campaignState.completedTasks.includes('dmv'), 'DMV task should be completed');
        console.assert(campaignState.currentTask === 'jobInterview', 'Current task should be job interview');
        
        // Test reset
        resetCampaignState();
        console.assert(campaignState.completedTasks.length === 0, 'Reset should clear completed tasks');
        console.assert(campaignState.currentTask === 0, 'Reset should reset current task');
        
        console.log('✅ Campaign task switching test passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Campaign task switching test failed:', error);
        return false;
    }
}

// Run tests
function runStepResetTests() {
    console.log('🔄 Running Step Reset Tests...\n');
    
    const tests = [testStepReset, testCampaignTaskSwitching];
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        try {
            if (test()) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error('Test execution error:', error);
            failed++;
        }
        console.log('');
    }
    
    console.log(`📊 Step Reset Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('🎉 All step reset tests passed!');
    } else {
        console.log('⚠️  Some tests failed. The step reset functionality may have issues.');
    }
    
    return failed === 0;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runStepResetTests };
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    runStepResetTests();
}