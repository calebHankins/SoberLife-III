// Initial Flavor Text Tests
// Tests for the initial flavor text modal system

// Import functions to test (these will be available globally in browser)
// import { getInitialFlavorText } from '../assets/js/game-state.js';
// import { showInitialFlavorText, hideInitialFlavorText } from '../assets/js/ui-manager.js';

// Test getInitialFlavorText function
function testGetInitialFlavorText() {
    console.log('Testing getInitialFlavorText function...');
    
    if (typeof getInitialFlavorText !== 'function') {
        console.error('❌ getInitialFlavorText function not available');
        return;
    }
    
    let passed = 0;
    let failed = 0;
    
    // Test all 5 DMV steps
    for (let step = 0; step < 5; step++) {
        try {
            const flavorData = getInitialFlavorText(step);
            
            if (!flavorData) {
                console.error(`❌ Step ${step}: No flavor data returned`);
                failed++;
                continue;
            }
            
            // Check required properties
            const requiredProps = ['title', 'text', 'tips', 'stressTriggers'];
            let stepPassed = true;
            
            requiredProps.forEach(prop => {
                if (!flavorData[prop]) {
                    console.error(`❌ Step ${step}: Missing ${prop}`);
                    stepPassed = false;
                }
            });
            
            // Check data types
            if (typeof flavorData.title !== 'string' || flavorData.title.length < 5) {
                console.error(`❌ Step ${step}: Invalid title`);
                stepPassed = false;
            }
            
            if (typeof flavorData.text !== 'string' || flavorData.text.length < 50) {
                console.error(`❌ Step ${step}: Invalid or too short text content`);
                stepPassed = false;
            }
            
            if (!Array.isArray(flavorData.stressTriggers)) {
                console.error(`❌ Step ${step}: stressTriggers should be an array`);
                stepPassed = false;
            }
            
            if (stepPassed) {
                console.log(`✅ Step ${step}: Valid flavor text data`);
                passed++;
            } else {
                failed++;
            }
            
        } catch (error) {
            console.error(`❌ Step ${step}: Error getting flavor text: ${error.message}`);
            failed++;
        }
    }
    
    // Test invalid indices
    const invalidIndices = [-1, 5, 10, 'invalid', null, undefined];
    invalidIndices.forEach(index => {
        try {
            const flavorData = getInitialFlavorText(index);
            if (flavorData && flavorData.title && flavorData.text) {
                console.log(`✅ Invalid index ${index}: Returned fallback data`);
                passed++;
            } else {
                console.error(`❌ Invalid index ${index}: No fallback data`);
                failed++;
            }
        } catch (error) {
            console.error(`❌ Invalid index ${index}: Threw error: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`getInitialFlavorText tests: ${passed} passed, ${failed} failed\n`);
}

// Test modal display functionality
function testInitialFlavorTextModal() {
    console.log('Testing initial flavor text modal display...');
    
    if (typeof showInitialFlavorText !== 'function') {
        console.error('❌ showInitialFlavorText function not available');
        return;
    }
    
    let passed = 0;
    let failed = 0;
    
    try {
        // Clean up any existing modals
        const existingModal = document.getElementById('initialFlavorTextModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Test showing modal
        showInitialFlavorText(0);
        
        // Check if modal was created
        const modal = document.getElementById('initialFlavorTextModal');
        if (modal) {
            console.log('✅ Modal element created successfully');
            passed++;
            
            // Check modal structure
            const content = modal.querySelector('.initial-flavor-modal-content');
            if (content) {
                console.log('✅ Modal content element found');
                passed++;
            } else {
                console.error('❌ Modal content element not found');
                failed++;
            }
            
            const continueBtn = document.getElementById('continueFlavorTextBtn');
            if (continueBtn) {
                console.log('✅ Continue button found');
                passed++;
            } else {
                console.error('❌ Continue button not found');
                failed++;
            }
            
            // Check if body scroll is disabled
            if (document.body.style.overflow === 'hidden') {
                console.log('✅ Body scroll disabled');
                passed++;
            } else {
                console.error('❌ Body scroll not disabled');
                failed++;
            }
            
            // Test hiding modal
            if (typeof hideInitialFlavorText === 'function') {
                hideInitialFlavorText();
                
                setTimeout(() => {
                    const modalAfterHide = document.getElementById('initialFlavorTextModal');
                    if (!modalAfterHide) {
                        console.log('✅ Modal removed after hide');
                        passed++;
                    } else {
                        console.error('❌ Modal not removed after hide');
                        failed++;
                    }
                    
                    if (document.body.style.overflow !== 'hidden') {
                        console.log('✅ Body scroll restored');
                        passed++;
                    } else {
                        console.error('❌ Body scroll not restored');
                        failed++;
                    }
                }, 350);
            }
            
        } else {
            console.error('❌ Modal element not created');
            failed++;
        }
        
    } catch (error) {
        console.error(`❌ Error testing modal: ${error.message}`);
        failed++;
    }
    
    console.log(`Modal display tests: ${passed} passed, ${failed} failed\n`);
}

// Test modal content quality
function testModalContentQuality() {
    console.log('Testing modal content quality...');
    
    let passed = 0;
    let failed = 0;
    
    try {
        // Test each step's content
        for (let step = 0; step < 5; step++) {
            // Clean up
            const existingModal = document.getElementById('initialFlavorTextModal');
            if (existingModal) {
                existingModal.remove();
            }
            
            showInitialFlavorText(step);
            
            const modal = document.getElementById('initialFlavorTextModal');
            if (!modal) {
                console.error(`❌ Step ${step}: Modal not created`);
                failed++;
                continue;
            }
            
            // Check for title
            const titleElement = modal.querySelector('h2');
            if (titleElement && titleElement.textContent.length > 5) {
                console.log(`✅ Step ${step}: Title present and adequate`);
                passed++;
            } else {
                console.error(`❌ Step ${step}: Title missing or too short`);
                failed++;
            }
            
            // Check for main text content
            const textElements = modal.querySelectorAll('p');
            const hasSubstantialText = Array.from(textElements).some(p => 
                p.textContent.length > 50 && !p.textContent.includes('Tip:')
            );
            
            if (hasSubstantialText) {
                console.log(`✅ Step ${step}: Substantial main text content`);
                passed++;
            } else {
                console.error(`❌ Step ${step}: Insufficient main text content`);
                failed++;
            }
            
            // Check for tip section
            const hasTip = Array.from(textElements).some(p => 
                p.textContent.includes('Tip:') || p.textContent.includes('💡')
            );
            
            if (hasTip) {
                console.log(`✅ Step ${step}: Tip section present`);
                passed++;
            } else {
                console.error(`❌ Step ${step}: Tip section missing`);
                failed++;
            }
            
            // Clean up
            modal.remove();
        }
        
    } catch (error) {
        console.error(`❌ Error testing content quality: ${error.message}`);
        failed++;
    }
    
    console.log(`Content quality tests: ${passed} passed, ${failed} failed\n`);
}

// Run all initial flavor text tests
function runInitialFlavorTextTests() {
    console.log('🧪 Starting Initial Flavor Text Tests...\n');
    
    testGetInitialFlavorText();
    testInitialFlavorTextModal();
    testModalContentQuality();
    
    console.log('✅ Initial Flavor Text tests completed\n');
}

// Export for integration with other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runInitialFlavorTextTests,
        testGetInitialFlavorText,
        testInitialFlavorTextModal,
        testModalContentQuality
    };
} else {
    // Make available globally for browser testing
    window.runInitialFlavorTextTests = runInitialFlavorTextTests;
}
