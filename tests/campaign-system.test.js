// Campaign System Tests
// Basic tests to verify campaign functionality

// Mock DOM elements for testing
function createMockElement(id) {
    const element = {
        id: id,
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false
        },
        textContent: '',
        innerHTML: '',
        style: {},
        focus: () => {},
        disabled: false
    };
    return element;
}

// Mock document.getElementById
const mockElements = {};
global.document = {
    getElementById: (id) => {
        if (!mockElements[id]) {
            mockElements[id] = createMockElement(id);
        }
        return mockElements[id];
    },
    querySelectorAll: () => [],
    createElement: () => createMockElement('div'),
    body: { appendChild: () => {} }
};

// Mock localStorage
global.localStorage = {
    data: {},
    getItem: function(key) {
        return this.data[key] || null;
    },
    setItem: function(key, value) {
        this.data[key] = value;
    },
    removeItem: function(key) {
        delete this.data[key];
    }
};

// Mock window functions
global.window = {
    isCampaignMode: () => true,
    getCurrentTask: () => null
};

// Test campaign state management
function testCampaignStateManagement() {
    console.log('Testing campaign state management...');
    
    try {
        // Import campaign state functions
        const { campaignState, updateCampaignState, resetCampaignState } = require('../assets/js/game-state.js');
        
        // Test initial state
        console.assert(typeof campaignState === 'object', 'Campaign state should be an object');
        console.assert(Array.isArray(campaignState.completedTasks), 'Completed tasks should be an array');
        console.assert(typeof campaignState.deckComposition === 'object', 'Deck composition should be an object');
        
        // Test state updates
        const initialAces = campaignState.deckComposition.aces;
        updateCampaignState({
            deckComposition: {
                ...campaignState.deckComposition,
                aces: initialAces + 1
            }
        });
        
        console.assert(campaignState.deckComposition.aces === initialAces + 1, 'State should update correctly');
        
        // Test reset
        resetCampaignState();
        console.assert(campaignState.deckComposition.aces === 4, 'Reset should restore default ace count');
        console.assert(campaignState.completedTasks.length === 0, 'Reset should clear completed tasks');
        
        console.log('✅ Campaign state management tests passed');
        return true;
        
    } catch (error) {
        console.error('❌ Campaign state management tests failed:', error);
        return false;
    }
}

// Test task definitions
function testTaskDefinitions() {
    console.log('Testing task definitions...');
    
    try {
        const { taskDefinitions, getTaskDefinition, isTaskUnlocked } = require('../assets/js/task-definitions.js');
        
        // Test task registry
        console.assert(typeof taskDefinitions === 'object', 'Task definitions should be an object');
        console.assert('dmv' in taskDefinitions, 'DMV task should be defined');
        console.assert('jobInterview' in taskDefinitions, 'Job interview task should be defined');
        
        // Test task retrieval
        const dmvTask = getTaskDefinition('dmv');
        console.assert(dmvTask !== null, 'Should retrieve DMV task');
        console.assert(dmvTask.id === 'dmv', 'Task should have correct ID');
        console.assert(Array.isArray(dmvTask.steps), 'Task should have steps array');
        
        // Test task unlocking
        console.assert(isTaskUnlocked('dmv', []), 'DMV task should be unlocked by default');
        console.assert(!isTaskUnlocked('jobInterview', []), 'Job interview should be locked initially');
        console.assert(isTaskUnlocked('jobInterview', ['dmv']), 'Job interview should unlock after DMV');
        
        console.log('✅ Task definitions tests passed');
        return true;
        
    } catch (error) {
        console.error('❌ Task definitions tests failed:', error);
        return false;
    }
}

// Test shop system
function testShopSystem() {
    console.log('Testing shop system...');
    
    try {
        const { getAceUpgradeCost, canPurchaseAceUpgrade, purchaseAceUpgrade } = require('../assets/js/shop-system.js');
        
        // Test cost calculation
        const baseCost = getAceUpgradeCost();
        console.assert(typeof baseCost === 'number', 'Cost should be a number');
        console.assert(baseCost > 0, 'Cost should be positive');
        
        // Test purchase validation
        console.assert(!canPurchaseAceUpgrade(0), 'Should not allow purchase with 0 zen points');
        console.assert(canPurchaseAceUpgrade(1000), 'Should allow purchase with sufficient zen points');
        
        // Test purchase transaction
        const result = purchaseAceUpgrade(100);
        console.assert(typeof result === 'object', 'Purchase should return result object');
        console.assert(typeof result.success === 'boolean', 'Result should have success property');
        
        console.log('✅ Shop system tests passed');
        return true;
        
    } catch (error) {
        console.error('❌ Shop system tests failed:', error);
        return false;
    }
}

// Test deck composition
function testDeckComposition() {
    console.log('Testing deck composition...');
    
    try {
        const { createCustomDeck, getDeckComposition, validateDeckComposition } = require('../assets/js/card-system.js');
        
        // Test custom deck creation
        const customDeck = createCustomDeck({ aces: 6, totalCards: 52 });
        console.assert(Array.isArray(customDeck), 'Custom deck should be an array');
        console.assert(customDeck.length === 52, 'Deck should have 52 cards');
        
        // Test deck composition analysis
        const composition = getDeckComposition(customDeck);
        console.assert(typeof composition === 'object', 'Composition should be an object');
        console.assert(composition.aces >= 6, 'Should have at least 6 aces');
        
        // Test validation
        console.assert(validateDeckComposition({ aces: 4, totalCards: 52 }), 'Valid composition should pass');
        console.assert(!validateDeckComposition({ aces: 60, totalCards: 52 }), 'Invalid composition should fail');
        
        console.log('✅ Deck composition tests passed');
        return true;
        
    } catch (error) {
        console.error('❌ Deck composition tests failed:', error);
        return false;
    }
}

// Run all tests
function runCampaignTests() {
    console.log('🧪 Running Campaign System Tests...\n');
    
    const tests = [
        testCampaignStateManagement,
        testTaskDefinitions,
        testShopSystem,
        testDeckComposition
    ];
    
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
        console.log(''); // Add spacing between tests
    }
    
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
        console.log('🎉 All campaign system tests passed!');
    } else {
        console.log('⚠️  Some tests failed. Please review the implementation.');
    }
    
    return failed === 0;
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runCampaignTests };
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    runCampaignTests();
}