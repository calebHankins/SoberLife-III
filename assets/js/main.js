// SoberLife III - Main Game Controller
// Game initialization and coordination

import { gameState, updateGameState, resetGameState, steps, incrementHitCount, resetHandState, setLastAction, campaignState } from './game-state.js';
import { createDeck, createCustomDeck, shuffleDeck, calculateScore } from './card-system.js';
import { updateDisplay, updateCards, updateZenActivities, showGameOver, showGameSuccess, hideElement, showElement, updateTaskDescription, showHelpModal, hideHelpModal, updateContextualButtons, showFlavorText, emphasizeTaskInfo, updateOutcomeMessage, showStressManagementTip, showInitialFlavorText } from './ui-manager.js';
import { calculateSurveyStress, updateStressLevel } from './stress-system.js';
import { initializeCampaign, showCampaignOverview, isCampaignMode, getCurrentTask, completeCurrentTask, returnToCampaign, resetCampaign, startCampaignTask } from './campaign-manager.js';
import { openShop, closeShop, purchaseAceUpgrade, updateShopUI, showPurchaseFeedback } from './shop-system.js';
import { getTaskDefinition } from './task-definitions.js';

// Initialize the game when page loads
export function initializeGame() {
    // Set up survey validation
    const surveyInputs = document.querySelectorAll('input[type="radio"]');
    const startTaskBtn = document.getElementById('startTaskBtn');
    
    if (surveyInputs && startTaskBtn) {
        surveyInputs.forEach(input => {
            input.addEventListener('change', validateSurvey);
        });
    }

    // Set up help modal event listeners
    setupHelpModal();

    // Initialize campaign system
    initializeCampaign();

    // Show game mode selection by default
    showElement('gameModeSelection');
    hideElement('campaignOverview');
    hideElement('surveySection');
    hideElement('taskInfo');
    hideElement('zenActivities');
    hideElement('gameArea');

    // Initial display update
    updateDisplay();
    updateZenActivities();
}

// Set up help modal functionality
function setupHelpModal() {
    const helpBtn = document.getElementById('helpBtn');
    const helpCloseBtn = document.getElementById('helpCloseBtn');
    const helpModalBackdrop = document.getElementById('helpModalBackdrop');
    const helpModal = document.getElementById('helpModal');

    // Help button click
    if (helpBtn) {
        helpBtn.addEventListener('click', showHelp);
        
        // Keyboard navigation for help button
        helpBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showHelp();
            }
        });
    }

    // Close button click
    if (helpCloseBtn) {
        helpCloseBtn.addEventListener('click', hideHelp);
        
        // Keyboard navigation for close button
        helpCloseBtn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                hideHelp();
            }
        });
    }

    // Backdrop click to close
    if (helpModalBackdrop) {
        helpModalBackdrop.addEventListener('click', hideHelp);
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (helpModal && !helpModal.classList.contains('hidden')) {
            if (event.key === 'Escape') {
                hideHelp();
            } else if (event.key === 'Tab') {
                // Trap focus within modal
                trapFocusInModal(event, helpModal);
            }
        } else {
            // Game keyboard shortcuts (only when modal is not open)
            handleGameKeyboardShortcuts(event);
        }
    });
}

// Handle keyboard shortcuts for game actions
function handleGameKeyboardShortcuts(event) {
    // Prevent shortcuts when user is typing in form fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    switch (event.key.toLowerCase()) {
        case 'h':
            if (!event.ctrlKey && !event.altKey) {
                event.preventDefault();
                if (gameState.gameInProgress) {
                    hit();
                }
            }
            break;
        case 's':
            if (!event.ctrlKey && !event.altKey) {
                event.preventDefault();
                if (gameState.gameInProgress) {
                    stand();
                }
            }
            break;
        case '?':
        case '/':
            event.preventDefault();
            showHelp();
            break;
        case 'n':
            if (!event.ctrlKey && !event.altKey) {
                event.preventDefault();
                const nextStepBtn = document.getElementById('nextStepBtn');
                if (nextStepBtn && !nextStepBtn.classList.contains('hidden')) {
                    nextStep();
                }
            }
            break;
    }
}

// Trap focus within modal for accessibility
function trapFocusInModal(event, modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        }
    } else {
        // Tab
        if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }
}

// Show help modal
export function showHelp() {
    showHelpModal();
}

// Hide help modal
export function hideHelp() {
    hideHelpModal();
}

// Show popup notification for stress/zen changes
function showPopupNotification(message, type = 'default') {
    const popup = document.createElement('div');
    popup.className = `popup-notification ${type}`;
    popup.textContent = message;
    
    document.body.appendChild(popup);
    
    // Remove popup after animation completes
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 2000);
}

// Start single task mode (original DMV-only experience)
export function startSingleTaskMode() {
    // Set up single task mode
    updateGameState({ campaignMode: false });
    
    // Hide mode selection and show survey
    hideElement('gameModeSelection');
    hideElement('campaignOverview');
    showElement('surveySection');
    
    // Update survey for DMV context
    const surveyDescription = document.getElementById('surveyDescription');
    if (surveyDescription) {
        surveyDescription.textContent = 'Before we begin your DMV visit, let\'s assess your current stress level:';
    }
    
    const preparedQuestion = document.getElementById('preparedQuestion');
    if (preparedQuestion) {
        preparedQuestion.textContent = 'How prepared do you feel for the DMV?';
    }
}

// Start campaign mode
export function startCampaignMode() {
    // Initialize and show campaign
    initializeCampaign();
    showCampaignOverview();
}

// Validate survey completion
function validateSurvey() {
    const sleepAnswer = document.querySelector('input[name="sleep"]:checked');
    const preparedAnswer = document.querySelector('input[name="prepared"]:checked');
    const dayAnswer = document.querySelector('input[name="day"]:checked');
    const startTaskBtn = document.getElementById('startTaskBtn');
    const errorMsg = document.getElementById('surveyError');

    if (sleepAnswer && preparedAnswer && dayAnswer) {
        if (startTaskBtn) startTaskBtn.disabled = false;
        if (errorMsg) errorMsg.style.display = 'none';
    } else {
        if (startTaskBtn) startTaskBtn.disabled = true;
    }
}

// Start the task after survey completion
export function startTask() {
    // Validate that all survey questions are answered
    const sleepAnswer = document.querySelector('input[name="sleep"]:checked');
    const preparedAnswer = document.querySelector('input[name="prepared"]:checked');
    const dayAnswer = document.querySelector('input[name="day"]:checked');

    if (!sleepAnswer || !preparedAnswer || !dayAnswer) {
        const errorMsg = document.getElementById('surveyError');
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
        return;
    }

    // Calculate initial stress and zen points from survey
    const surveyResults = calculateSurveyStress();
    updateGameState({
        currentStep: 0, // Reset to step 0 for new task
        stressLevel: surveyResults.stressLevel,
        zenPoints: surveyResults.zenPoints,
        surveyCompleted: true,
        initialFlavorTextShown: false // Reset flavor text for new task
    });

    // Hide survey and show game elements
    hideElement('surveySection');
    showElement('taskInfo');
    showElement('zenActivities');
    showElement('gameArea');

    // Start first round
    startNewRound();
}

// Legacy function name for backward compatibility
export function startGame() {
    startTask();
}

// Start a new blackjack round
export function startNewRound() {
    try {
        // Reset hand state for fresh progressive flavor text
        resetHandState();
        
        // Create deck based on mode (custom for campaign, standard for single task)
        let deck;
        if (isCampaignMode()) {
            deck = createCustomDeck(campaignState.deckComposition);
        } else {
            deck = createDeck();
        }
        shuffleDeck(deck);
        
        updateGameState({
            deck: deck,
            playerCards: [],
            houseCards: [],
            gameInProgress: true
        });

        // Deal initial cards
        gameState.playerCards.push(gameState.deck.pop());
        gameState.houseCards.push(gameState.deck.pop());
        gameState.playerCards.push(gameState.deck.pop());
        gameState.houseCards.push(gameState.deck.pop());

        // Update UI
        updateTaskDescription();
        updateCards();
        updateDisplay();
        updateZenActivities();
        updateContextualButtons();
        
        // Emphasize task info for new rounds
        emphasizeTaskInfo();

        // Check if initial flavor text should be shown
        const shouldShowFlavorText = !gameState.initialFlavorTextShown;
        
        // Enable/disable game buttons based on flavor text state
        const hitBtn = document.getElementById('hitBtn');
        const standBtn = document.getElementById('standBtn');
        const nextStepBtn = document.getElementById('nextStepBtn');
        
        if (shouldShowFlavorText) {
            // Disable game buttons until flavor text is acknowledged
            if (hitBtn) hitBtn.disabled = true;
            if (standBtn) standBtn.disabled = true;
            
            // Show initial flavor text modal
            setTimeout(() => {
                showInitialFlavorText(gameState.currentStep);
            }, 500); // Small delay to let UI settle
        } else {
            // Enable game buttons normally
            if (hitBtn) hitBtn.disabled = false;
            if (standBtn) standBtn.disabled = false;
        }
        
        if (nextStepBtn) nextStepBtn.classList.add('hidden');

        // Clear previous round result
        const roundResult = document.getElementById('roundResult');
        if (roundResult) roundResult.innerHTML = '';
        
        // Log hand state for debugging
        console.log(`New round started - Hand ID: ${handState.currentHand}, Hit count reset to: ${handState.hitCount}`);
        
    } catch (error) {
        console.error('Error starting new round:', error);
        
        // Fallback behavior - basic round setup
        const deck = createDeck();
        shuffleDeck(deck);
        
        updateGameState({
            deck: deck,
            playerCards: [],
            houseCards: [],
            gameInProgress: true
        });

        // Deal initial cards
        if (gameState.deck.length >= 4) {
            gameState.playerCards.push(gameState.deck.pop());
            gameState.houseCards.push(gameState.deck.pop());
            gameState.playerCards.push(gameState.deck.pop());
            gameState.houseCards.push(gameState.deck.pop());
        }

        updateCards();
        updateDisplay();
    }
}

// Player hits (takes another card)
export function hit() {
    if (!gameState.gameInProgress || gameState.deck.length === 0) return;

    try {
        // Increment hit count for progressive messaging
        incrementHitCount();
        
        // Show progressive flavor text based on hit count
        showFlavorText('hit');

        // Add card to player's hand
        gameState.playerCards.push(gameState.deck.pop());
        updateCards();

        const playerScore = calculateScore(gameState.playerCards);
        if (playerScore > 21) {
            // Player exceeded 21 - use DMV-themed messaging
            endRound('bust');
        }
        
    } catch (error) {
        console.error('Error in hit action:', error);
        // Fallback behavior - still add card but without progressive messaging
        if (gameState.deck.length > 0) {
            gameState.playerCards.push(gameState.deck.pop());
            updateCards();
            
            const playerScore = calculateScore(gameState.playerCards);
            if (playerScore > 21) {
                endRound('bust');
            }
        }
    }
}

// Player stands (ends their turn)
export function stand() {
    if (!gameState.gameInProgress) return;

    try {
        // Set last action for tracking
        setLastAction('stand');
        
        // Show contextual flavor text
        showFlavorText('stand');

    // House plays according to standard rules
    while (calculateScore(gameState.houseCards) < 17 && gameState.deck.length > 0) {
        gameState.houseCards.push(gameState.deck.pop());
    }

        const playerScore = calculateScore(gameState.playerCards);
        const houseScore = calculateScore(gameState.houseCards);

        if (houseScore > 21) {
            endRound('house_bust');
        } else if (playerScore > houseScore) {
            endRound('win');
        } else if (playerScore < houseScore) {
            endRound('lose');
        } else {
            endRound('tie');
        }
        
    } catch (error) {
        console.error('Error in stand action:', error);
        // Fallback behavior - still play house hand
        while (calculateScore(gameState.houseCards) < 17 && gameState.deck.length > 0) {
            gameState.houseCards.push(gameState.deck.pop());
        }
        
        const playerScore = calculateScore(gameState.playerCards);
        const houseScore = calculateScore(gameState.houseCards);

        if (houseScore > 21) {
            endRound('house_bust');
        } else if (playerScore > houseScore) {
            endRound('win');
        } else if (playerScore < houseScore) {
            endRound('lose');
        } else {
            endRound('tie');
        }
    }
}

// End the current round with a result using DMV-themed messaging
export function endRound(result) {
    try {
        updateGameState({ gameInProgress: false });
        
        const hitBtn = document.getElementById('hitBtn');
        const standBtn = document.getElementById('standBtn');
        const nextStepBtn = document.getElementById('nextStepBtn');
        
        if (hitBtn) hitBtn.disabled = true;
        if (standBtn) standBtn.disabled = true;
        
        updateCards();

        // Calculate zen and stress changes based on outcome
        let zenChange = 0;
        let stressChange = 0;

        switch (result) {
            case 'win':
                zenChange = 15;
                stressChange = -5;
                break;
            case 'lose':
                stressChange = 15;
                break;
            case 'tie':
                zenChange = 5;
                stressChange = 5;
                break;
            case 'bust':
                stressChange = 30;
                break;
            case 'house_bust':
                zenChange = 15;
                stressChange = -5;
                break;
        }

        // Apply changes to game state
        updateGameState({
            zenPoints: Math.max(0, gameState.zenPoints + zenChange),
            stressLevel: Math.max(0, Math.min(100, gameState.stressLevel + stressChange))
        });

        // Update display elements
        updateDisplay();
        updateZenActivities();

        // Show DMV-themed outcome message with educational content
        updateOutcomeMessage(result);
        
        // Show stress management tip after a brief delay
        setTimeout(() => {
            showStressManagementTip(result);
        }, 1000);

        // Show popup notifications for changes
        if (zenChange > 0) {
            showPopupNotification(`+${zenChange} Zen Points!`, 'zen-gain');
        }
        if (stressChange !== 0) {
            const stressType = stressChange > 0 ? 'stress-change' : 'stress-decrease';
            const stressText = stressChange > 0 ? `+${stressChange}% Stress` : `${stressChange}% Stress`;
            showPopupNotification(stressText, stressType);
        }

        // Check for game over conditions
        if (gameState.stressLevel >= 100) {
            setTimeout(() => showGameOver(), 2000); // Slightly longer delay for new messaging
            return;
        }

        // Always show next step button - players can progress regardless of outcome
        if (nextStepBtn) {
            nextStepBtn.textContent = 'Next Step';
            nextStepBtn.classList.remove('hidden');
        }
        
    } catch (error) {
        console.error('Error in endRound:', error);
        
        // Fallback behavior - basic game state updates
        updateGameState({ gameInProgress: false });
        
        const hitBtn = document.getElementById('hitBtn');
        const standBtn = document.getElementById('standBtn');
        const nextStepBtn = document.getElementById('nextStepBtn');
        
        if (hitBtn) hitBtn.disabled = true;
        if (standBtn) standBtn.disabled = true;
        
        updateCards();
        updateDisplay();
        updateZenActivities();
        
        // Show basic fallback message
        const roundResult = document.getElementById('roundResult');
        if (roundResult) {
            roundResult.innerHTML = `
                <p style="font-size: 14px; font-weight: bold; margin: 8px 0;">
                    You're learning valuable stress management skills!
                </p>
            `;
        }
        
        if (nextStepBtn) {
            nextStepBtn.textContent = 'Next Step';
            nextStepBtn.classList.remove('hidden');
        }
    }
}

// Move to next step
export function nextStep() {
    // Get current task steps (campaign mode uses task-specific steps)
    let currentSteps;
    if (isCampaignMode()) {
        const currentTask = getCurrentTask();
        currentSteps = currentTask ? currentTask.steps : steps;
    } else {
        currentSteps = steps;
    }
    
    // Always advance to next step
    updateGameState({ 
        currentStep: gameState.currentStep + 1,
        initialFlavorTextShown: false // Reset for new step
    });
    
    if (gameState.currentStep >= currentSteps.length) {
        // Task completed successfully!
        if (isCampaignMode()) {
            // Complete campaign task
            completeCurrentTask(gameState.zenPoints);
        }
        setTimeout(() => showGameSuccess(), 1000);
        return;
    }
    
    // Start new round for next step with extra emphasis
    startNewRound();
    
    // Add extra emphasis when advancing steps
    setTimeout(() => {
        emphasizeTaskInfo();
    }, 500);
}

// Restart the game
export function restartGame() {
    resetGameState();
    
    // Hide game over/success screens
    hideElement('gameOverScreen');
    hideElement('gameSuccessScreen');
    hideElement('upgradeShop');
    
    if (isCampaignMode()) {
        // Return to campaign overview
        returnToCampaign();
    } else {
        // Return to mode selection
        showElement('gameModeSelection');
        hideElement('surveySection');
        hideElement('taskInfo');
        hideElement('zenActivities');
        hideElement('gameArea');
        hideElement('campaignOverview');
    }
    
    // Reset survey
    const surveyInputs = document.querySelectorAll('input[type="radio"]');
    surveyInputs.forEach(input => input.checked = false);
    
    const startTaskBtn = document.getElementById('startTaskBtn');
    if (startTaskBtn) startTaskBtn.disabled = true;
    
    // Update display
    updateDisplay();
    updateZenActivities();
}

// Enable game controls after initial flavor text is acknowledged
export function enableGameControls() {
    try {
        const hitBtn = document.getElementById('hitBtn');
        const standBtn = document.getElementById('standBtn');
        
        if (hitBtn) hitBtn.disabled = false;
        if (standBtn) standBtn.disabled = false;
        
        console.log('Game controls enabled after flavor text acknowledgment');
    } catch (error) {
        console.error('Error enabling game controls:', error);
    }
}

// Shop functions
export function openShopWithZen() {
    openShop(gameState.zenPoints);
}

export function purchaseAce() {
    const result = purchaseAceUpgrade(gameState.zenPoints);
    if (result.success) {
        updateGameState({ zenPoints: result.zenPointsRemaining });
        updateShopUI(result.zenPointsRemaining);
    }
    showPurchaseFeedback(result);
}

export function continueCampaign() {
    closeShop();
    returnToCampaign();
}

export function skipShop() {
    closeShop();
    returnToCampaign();
}

// Make functions available globally for onclick handlers
window.startSingleTaskMode = startSingleTaskMode;
window.startCampaignMode = startCampaignMode;
window.startTask = startTask;
window.startGame = startGame; // Legacy compatibility
window.hit = hit;
window.stand = stand;
window.nextStep = nextStep;
window.restartGame = restartGame;
window.showHelp = showHelp;
window.enableGameControls = enableGameControls;
window.startCampaignTask = startCampaignTask;
window.resetCampaign = resetCampaign;
window.openShop = openShopWithZen;
window.purchaseAceUpgrade = purchaseAce;
window.continueCampaign = continueCampaign;
window.skipShop = skipShop;
window.returnToCampaign = returnToCampaign;

// Make campaign functions available for game-state.js
window.isCampaignMode = isCampaignMode;
window.getCurrentTask = getCurrentTask;

// Import and expose additional campaign functions
import { startNewCampaign } from './campaign-manager.js';
window.startNewCampaign = startNewCampaign;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}