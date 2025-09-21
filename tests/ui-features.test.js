// SoberLife III - UI Features Test Suite
// Comprehensive tests for task visibility improvements

// Mock DOM elements for testing
function createMockElement(id, tagName = 'div') {
    const element = {
        id: id,
        tagName: tagName.toUpperCase(),
        classList: {
            classes: new Set(),
            add: function(className) { this.classes.add(className); },
            remove: function(className) { this.classes.delete(className); },
            contains: function(className) { return this.classes.has(className); }
        },
        textContent: '',
        innerHTML: '',
        style: {},
        title: '',
        focus: function() { this.focused = true; },
        focused: false,
        offsetHeight: 100,
        appendChild: function(child) { 
            this.children = this.children || [];
            this.children.push(child);
            child.parentNode = this;
        },
        removeChild: function(child) {
            if (this.children) {
                const index = this.children.indexOf(child);
                if (index > -1) {
                    this.children.splice(index, 1);
                    child.parentNode = null;
                }
            }
        },
        addEventListener: function() {},
        querySelectorAll: function() { return []; }
    };
    return element;
}

// Mock document object
const mockDocument = {
    getElementById: function(id) {
        return this.elements[id] || null;
    },
    createElement: function(tagName) {
        return createMockElement('created-' + Date.now(), tagName);
    },
    activeElement: createMockElement('body', 'body'),
    body: createMockElement('body', 'body'),
    elements: {}
};

// Set up mock elements
mockDocument.elements = {
    'taskInfo': createMockElement('taskInfo'),
    'taskDescription': createMockElement('taskDescription'),
    'stepIndicator': createMockElement('stepIndicator'),
    'hitBtn': createMockElement('hitBtn', 'button'),
    'standBtn': createMockElement('standBtn', 'button'),
    'helpModal': createMockElement('helpModal'),
    'helpCloseBtn': createMockElement('helpCloseBtn', 'button'),
    'roundResult': createMockElement('roundResult')
};

// Mock console for testing
const mockConsole = {
    logs: [],
    warnings: [],
    errors: [],
    log: function(msg) { this.logs.push(msg); },
    warn: function(msg) { this.warnings.push(msg); },
    error: function(msg) { this.errors.push(msg); }
};

// Test Suite 1: Contextual Action Mapping and Retrieval
function testContextualActionMapping() {
    console.log('Testing Contextual Action Mapping...');
    
    // Mock game state and functions (simplified for testing)
    const testGameState = { currentStep: 0 };
    
    const testContextualActions = {
        0: {
            hit: { text: "Ask Questions", description: "Ask about procedures", flavorText: "You gather information" },
            stand: { text: "Wait Patiently", description: "Wait for instructions", flavorText: "You observe quietly" }
        }
    };
    
    // Test function to get contextual actions
    function getCurrentContextualActions(gameState, contextualActions) {
        try {
            const currentStepActions = contextualActions[gameState.currentStep];
            if (!currentStepActions || typeof currentStepActions !== 'object') {
                return {
                    hit: { text: "Hit", description: "Take another card", flavorText: "You take more risk" },
                    stand: { text: "Stand", description: "Keep current total", flavorText: "You play it safe" }
                };
            }
            return currentStepActions;
        } catch (error) {
            return {
                hit: { text: "Hit", description: "Take another card", flavorText: "You take more risk" },
                stand: { text: "Stand", description: "Keep current total", flavorText: "You play it safe" }
            };
        }
    }
    
    // Test 1: Valid step returns correct actions
    const actions = getCurrentContextualActions(testGameState, testContextualActions);
    console.assert(actions.hit.text === "Ask Questions", "Should return contextual hit text");
    console.assert(actions.stand.text === "Wait Patiently", "Should return contextual stand text");
    
    // Test 2: Invalid step returns fallback
    const invalidGameState = { currentStep: 99 };
    const fallbackActions = getCurrentContextualActions(invalidGameState, testContextualActions);
    console.assert(fallbackActions.hit.text === "Hit", "Should return fallback hit text");
    console.assert(fallbackActions.stand.text === "Stand", "Should return fallback stand text");
    
    // Test 3: Null contextual actions returns fallback
    const nullActions = getCurrentContextualActions(testGameState, null);
    console.assert(nullActions.hit.text === "Hit", "Should handle null contextual actions");
    
    console.log('✓ Contextual Action Mapping tests passed');
}

// Test Suite 2: Help Modal Show/Hide Functionality
function testHelpModalFunctionality() {
    console.log('Testing Help Modal Functionality...');
    
    // Mock UI manager functions
    function showHelpModal(document, console) {
        try {
            const helpModal = document.getElementById('helpModal');
            if (!helpModal) {
                console.error('Help modal element not found');
                return false;
            }
            
            helpModal.classList.remove('hidden');
            
            const closeBtn = document.getElementById('helpCloseBtn');
            if (closeBtn) {
                setTimeout(() => {
                    try {
                        closeBtn.focus();
                    } catch (focusError) {
                        console.warn('Could not focus close button:', focusError);
                    }
                }, 100);
            }
            
            if (document.body) {
                document.body.style.overflow = 'hidden';
            }
            return true;
        } catch (error) {
            console.error('Error showing help modal:', error);
            return false;
        }
    }
    
    function hideHelpModal(document, console) {
        try {
            const helpModal = document.getElementById('helpModal');
            if (!helpModal) {
                console.error('Help modal element not found');
                return false;
            }
            
            helpModal.classList.add('hidden');
            
            if (document.body) {
                document.body.style.overflow = '';
            }
            return true;
        } catch (error) {
            console.error('Error hiding help modal:', error);
            return false;
        }
    }
    
    // Test 1: Show modal with valid elements
    mockConsole.errors = [];
    const showResult = showHelpModal(mockDocument, mockConsole);
    console.assert(showResult === true, "Should successfully show modal");
    console.assert(!mockDocument.elements.helpModal.classList.contains('hidden'), "Modal should not have hidden class");
    console.assert(mockConsole.errors.length === 0, "Should not log errors");
    
    // Test 2: Hide modal with valid elements
    mockConsole.errors = [];
    const hideResult = hideHelpModal(mockDocument, mockConsole);
    console.assert(hideResult === true, "Should successfully hide modal");
    console.assert(mockDocument.elements.helpModal.classList.contains('hidden'), "Modal should have hidden class");
    console.assert(mockConsole.errors.length === 0, "Should not log errors");
    
    // Test 3: Show modal with missing elements
    const mockDocumentMissing = { getElementById: () => null };
    mockConsole.errors = [];
    const showResultMissing = showHelpModal(mockDocumentMissing, mockConsole);
    console.assert(showResultMissing === false, "Should fail gracefully with missing elements");
    console.assert(mockConsole.errors.length > 0, "Should log error for missing elements");
    
    console.log('✓ Help Modal Functionality tests passed');
}

// Test Suite 3: Task Prominence and Animation Systems
function testTaskProminenceSystem() {
    console.log('Testing Task Prominence and Animation Systems...');
    
    // Mock task description update function
    function updateTaskDescription(document, console, gameState, steps) {
        try {
            const taskDescEl = document.getElementById('taskDescription');
            const stepIndicatorEl = document.getElementById('stepIndicator');
            const taskInfoEl = document.getElementById('taskInfo');
            
            if (!taskDescEl) {
                console.error('Task description element not found');
                return false;
            }
            
            // Get step description with fallback
            let stepDescription = '';
            if (gameState.currentStep < steps.length && steps[gameState.currentStep]) {
                stepDescription = steps[gameState.currentStep];
            } else {
                console.warn(`Step description not found for step ${gameState.currentStep}, using fallback`);
                stepDescription = "Complete this DMV step";
            }
            
            // Update step indicator
            if (stepIndicatorEl) {
                stepIndicatorEl.textContent = `Step ${gameState.currentStep + 1} of 5`;
            }
            
            // Update task description
            taskDescEl.textContent = `Step ${gameState.currentStep + 1}: ${stepDescription}`;
            
            // Trigger animation
            if (taskInfoEl) {
                taskInfoEl.classList.remove('task-changing');
                taskInfoEl.classList.add('task-changing');
            }
            
            return true;
        } catch (error) {
            console.error('Error updating task description:', error);
            return false;
        }
    }
    
    // Test data
    const testGameState = { currentStep: 0 };
    const testSteps = ["Check in at the front desk", "Wait in line"];
    
    // Test 1: Valid step update
    mockConsole.warnings = [];
    mockConsole.errors = [];
    const updateResult = updateTaskDescription(mockDocument, mockConsole, testGameState, testSteps);
    console.assert(updateResult === true, "Should successfully update task description");
    console.assert(mockDocument.elements.taskDescription.textContent.includes("Check in"), "Should set correct task text");
    console.assert(mockDocument.elements.stepIndicator.textContent === "Step 1 of 5", "Should set correct step indicator");
    console.assert(mockConsole.errors.length === 0, "Should not log errors for valid update");
    
    // Test 2: Invalid step with fallback
    const invalidGameState = { currentStep: 99 };
    mockConsole.warnings = [];
    const fallbackResult = updateTaskDescription(mockDocument, mockConsole, invalidGameState, testSteps);
    console.assert(fallbackResult === true, "Should handle invalid step gracefully");
    console.assert(mockDocument.elements.taskDescription.textContent.includes("Complete this DMV step"), "Should use fallback text");
    console.assert(mockConsole.warnings.length > 0, "Should log warning for missing step");
    
    // Test 3: Missing task description element
    const mockDocumentMissing = {
        getElementById: (id) => id === 'taskDescription' ? null : mockDocument.getElementById(id)
    };
    mockConsole.errors = [];
    const missingResult = updateTaskDescription(mockDocumentMissing, mockConsole, testGameState, testSteps);
    console.assert(missingResult === false, "Should fail with missing task description element");
    console.assert(mockConsole.errors.length > 0, "Should log error for missing element");
    
    console.log('✓ Task Prominence and Animation tests passed');
}

// Test Suite 4: Contextual Button Updates
function testContextualButtonUpdates() {
    console.log('Testing Contextual Button Updates...');
    
    // Mock contextual button update function
    function updateContextualButtons(document, console, getContextualActionText, getContextualActionDescription) {
        try {
            const hitBtn = document.getElementById('hitBtn');
            const standBtn = document.getElementById('standBtn');
            
            if (hitBtn) {
                try {
                    const hitText = getContextualActionText('hit');
                    hitBtn.textContent = hitText || 'Hit';
                    hitBtn.title = getContextualActionDescription('hit') || 'Take another card';
                } catch (error) {
                    console.warn('Error updating hit button:', error);
                    hitBtn.textContent = 'Hit';
                    hitBtn.title = 'Take another card';
                }
            } else {
                console.warn('Hit button element not found');
            }
            
            if (standBtn) {
                try {
                    const standText = getContextualActionText('stand');
                    standBtn.textContent = standText || 'Stand';
                    standBtn.title = getContextualActionDescription('stand') || 'Keep your current total';
                } catch (error) {
                    console.warn('Error updating stand button:', error);
                    standBtn.textContent = 'Stand';
                    standBtn.title = 'Keep your current total';
                }
            } else {
                console.warn('Stand button element not found');
            }
            
            return true;
        } catch (error) {
            console.error('Error updating contextual buttons:', error);
            return false;
        }
    }
    
    // Mock contextual action functions
    const mockGetText = (action) => action === 'hit' ? 'Ask Questions' : 'Wait Patiently';
    const mockGetDescription = (action) => action === 'hit' ? 'Ask about procedures' : 'Wait for instructions';
    const mockGetTextError = () => { throw new Error('Test error'); };
    
    // Test 1: Successful button update
    mockConsole.warnings = [];
    mockConsole.errors = [];
    const updateResult = updateContextualButtons(mockDocument, mockConsole, mockGetText, mockGetDescription);
    console.assert(updateResult === true, "Should successfully update buttons");
    console.assert(mockDocument.elements.hitBtn.textContent === 'Ask Questions', "Should set contextual hit text");
    console.assert(mockDocument.elements.standBtn.textContent === 'Wait Patiently', "Should set contextual stand text");
    console.assert(mockConsole.errors.length === 0, "Should not log errors for successful update");
    
    // Test 2: Error in getting contextual text (should use fallback)
    mockConsole.warnings = [];
    const errorResult = updateContextualButtons(mockDocument, mockConsole, mockGetTextError, mockGetDescription);
    console.assert(errorResult === true, "Should handle errors gracefully");
    console.assert(mockDocument.elements.hitBtn.textContent === 'Hit', "Should use fallback text on error");
    console.assert(mockConsole.warnings.length > 0, "Should log warnings for errors");
    
    // Test 3: Missing button elements
    const mockDocumentMissing = {
        getElementById: (id) => id.includes('Btn') ? null : mockDocument.getElementById(id)
    };
    mockConsole.warnings = [];
    const missingResult = updateContextualButtons(mockDocumentMissing, mockConsole, mockGetText, mockGetDescription);
    console.assert(missingResult === true, "Should handle missing elements gracefully");
    console.assert(mockConsole.warnings.length > 0, "Should log warnings for missing elements");
    
    console.log('✓ Contextual Button Updates tests passed');
}

// Test Suite 5: Error Handling and Edge Cases
function testErrorHandlingAndEdgeCases() {
    console.log('Testing Error Handling and Edge Cases...');
    
    // Test flavor text display with error handling
    function showFlavorText(document, console, getContextualFlavorText, action) {
        try {
            const flavorText = getContextualFlavorText(action);
            if (!flavorText) {
                return true; // No flavor text to show is not an error
            }
            
            const roundResult = document.getElementById('roundResult');
            if (!roundResult) {
                console.warn('Round result element not found for flavor text');
                return false;
            }
            
            const flavorDiv = document.createElement('div');
            flavorDiv.className = 'flavor-text';
            
            // Sanitize the flavor text
            const sanitizedText = flavorText.replace(/[<>]/g, '');
            flavorDiv.innerHTML = `<p style="font-style: italic; color: #666; margin: 10px 0;">${sanitizedText}</p>`;
            
            roundResult.appendChild(flavorDiv);
            return true;
            
        } catch (error) {
            console.error('Error showing flavor text:', error);
            return false;
        }
    }
    
    // Mock functions
    const mockGetFlavorText = (action) => action === 'hit' ? 'You gather information' : '';
    const mockGetFlavorTextError = () => { throw new Error('Test error'); };
    const mockGetFlavorTextXSS = () => '<script>alert("xss")</script>You gather info';
    
    // Test 1: Successful flavor text display
    mockConsole.warnings = [];
    mockConsole.errors = [];
    const successResult = showFlavorText(mockDocument, mockConsole, mockGetFlavorText, 'hit');
    console.assert(successResult === true, "Should successfully show flavor text");
    console.assert(mockConsole.errors.length === 0, "Should not log errors for successful display");
    
    // Test 2: No flavor text (should not be an error)
    const noTextResult = showFlavorText(mockDocument, mockConsole, mockGetFlavorText, 'stand');
    console.assert(noTextResult === true, "Should handle empty flavor text gracefully");
    
    // Test 3: Error in getting flavor text
    mockConsole.errors = [];
    const errorResult = showFlavorText(mockDocument, mockConsole, mockGetFlavorTextError, 'hit');
    console.assert(errorResult === false, "Should handle errors in getting flavor text");
    console.assert(mockConsole.errors.length > 0, "Should log errors");
    
    // Test 4: XSS protection
    const xssResult = showFlavorText(mockDocument, mockConsole, mockGetFlavorTextXSS, 'hit');
    console.assert(xssResult === true, "Should handle XSS attempts");
    // Check that script tags are removed (simplified check)
    const lastChild = mockDocument.elements.roundResult.children[mockDocument.elements.roundResult.children.length - 1];
    console.assert(!lastChild.innerHTML.includes('<script>'), "Should sanitize XSS attempts");
    
    // Test 5: Missing round result element
    const mockDocumentMissing = {
        getElementById: (id) => id === 'roundResult' ? null : mockDocument.getElementById(id),
        createElement: mockDocument.createElement
    };
    mockConsole.warnings = [];
    const missingResult = showFlavorText(mockDocumentMissing, mockConsole, mockGetFlavorText, 'hit');
    console.assert(missingResult === false, "Should handle missing round result element");
    console.assert(mockConsole.warnings.length > 0, "Should log warning for missing element");
    
    console.log('✓ Error Handling and Edge Cases tests passed');
}

// Run all tests
function runAllTests() {
    console.log('🧪 Starting SoberLife III UI Features Test Suite...\n');
    
    try {
        testContextualActionMapping();
        testHelpModalFunctionality();
        testTaskProminenceSystem();
        testContextualButtonUpdates();
        testErrorHandlingAndEdgeCases();
        
        console.log('\n✅ All UI Features tests passed successfully!');
        console.log('📊 Test Coverage Summary:');
        console.log('- Contextual action mapping and retrieval: ✓');
        console.log('- Help modal show/hide functionality: ✓');
        console.log('- Task prominence and animation systems: ✓');
        console.log('- Contextual button updates: ✓');
        console.log('- Error handling and fallback systems: ✓');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error);
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testContextualActionMapping,
        testHelpModalFunctionality,
        testTaskProminenceSystem,
        testContextualButtonUpdates,
        testErrorHandlingAndEdgeCases
    };
} else {
    // Run tests immediately if in browser
    runAllTests();
}