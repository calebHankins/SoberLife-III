// SoberLife III - Main Game Controller
// Game initialization and coordination

import { gameState, updateGameState, resetGameState, steps, incrementHitCount, resetHandState, setLastAction, campaignState, handState, activityState, loadActivityStateFromCampaign, canUseActivity, updateCampaignState } from './game-state.js';
import { createDeck, createCustomDeck, shuffleDeck, calculateScore, resetJokerValues, handContainsJokers } from './card-system.js';
import { updateDisplay, updateCards, updateZenActivities, showGameOver, showGameSuccess, hideElement, showElement, updateTaskDescription, showHelpModal, hideHelpModal, updateContextualButtons, showFlavorText, emphasizeTaskInfo, updateOutcomeMessage, showStressManagementTip, showInitialFlavorText, showMindPalace, hideMindPalace, showJokerCalculationFeedback, showJokerPerfectScoreFeedback, updateSplitHandDisplay, showSplitHandsUI, hideSplitHandsUI, updateCompartmentalizedCardDisplay } from './ui-manager.js';
import { calculateSurveyStress, updateStressLevel, switchSplitHand, showZenActivityFeedback, useZenActivity, zenActivities, completeSplitHand, getActiveSplitHand } from './stress-system.js';
import { initializeCampaign, showCampaignOverview, isCampaignMode, getCurrentTask, completeCurrentTask, returnToCampaign, resetCampaign, startCampaignTask, updateCampaignUI } from './campaign-manager.js';
import { openShop, closeShop, purchaseAceUpgrade, purchaseJokerUpgrade, updateShopUI, showPurchaseFeedback, purchasePremiumActivityWrapper } from './shop-system.js';
import { getTaskDefinition, getNextAvailableTask } from './task-definitions.js';
import { ZenPointsManager, ZEN_TRANSACTION_TYPES } from './zen-points-manager.js';
import { AudioManager } from './audio-system.js';

// Global audio manager instance
let audioManager = null;

// Initialize the game when page loads
export async function initializeGame() {
    // Initialize audio system
    try {
        audioManager = new AudioManager();
        await audioManager.init();
        console.log('Main: Audio system initialized');

        // Make audio manager globally accessible
        window.audioManager = audioManager;
    } catch (error) {
        console.error('Main: Failed to initialize audio system:', error);
    }

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

    // Set up close button event listeners
    setupCloseButtons();

    // Initialize campaign system
    initializeCampaign();

    // Show game mode selection by default
    showElement('gameModeSelection');
    hideElement('campaignOverview');
    hideElement('surveySection');
    hideElement('taskInfo');
    hideElement('zenActivities');
    hideElement('gameArea');

    // Set up global button click sound effects
    setupButtonClickSounds();

    // Initial display update
    updateDisplay();
    updateZenActivities();

    // Update adaptive music to match initial stress level
    setTimeout(() => {
        updateAdaptiveMusic();
    }, 1000); // Delay to ensure audio system is initialized
}

// Setup global button click sound effects
function setupButtonClickSounds() {
    document.addEventListener('click', (event) => {
        // Check if the clicked element is a button or has button-like classes
        const target = event.target;
        const isButton = target.tagName === 'BUTTON' ||
            target.classList.contains('btn') ||
            target.classList.contains('primary-btn') ||
            target.classList.contains('secondary-btn') ||
            target.classList.contains('zen-btn') ||
            target.classList.contains('card') ||
            target.id === 'hitBtn' ||
            target.id === 'standBtn' ||
            target.id === 'nextStepBtn';

        if (isButton && audioManager && audioManager.soundEffects) {
            // Play different sounds for different types of interactions
            if (target.classList.contains('card')) {
                audioManager.soundEffects.play('cardClick');
            } else {
                audioManager.soundEffects.play('buttonClick');
            }
        }
    });
}

// Get audio manager instance
export function getAudioManager() {
    return audioManager;
}

// Update adaptive music based on current stress level
export function updateAdaptiveMusic() {
    if (audioManager && audioManager.musicPlayer && audioManager.musicPlayer.updateStressLevel) {
        const currentStressLevel = gameState ? gameState.stressLevel : 0;
        audioManager.musicPlayer.updateStressLevel(currentStressLevel);
        console.log(`Main: Updating adaptive music for stress level: ${currentStressLevel}%`);
    }
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

// Set up close button event listeners for survey, task, and shop
function setupCloseButtons() {
    // Survey close button
    const surveyCloseBtn = document.getElementById('surveyCloseBtn');
    if (surveyCloseBtn) {
        surveyCloseBtn.addEventListener('click', closeSurvey);
    }

    // Task close button
    const taskCloseBtn = document.getElementById('taskCloseBtn');
    if (taskCloseBtn) {
        taskCloseBtn.addEventListener('click', closeTask);
    }

    // Shop close button
    const shopCloseBtn = document.getElementById('shopCloseBtn');
    if (shopCloseBtn) {
        shopCloseBtn.addEventListener('click', closeShopWrapper);
    }
}

// Close survey and return to mode selection or campaign
export function closeSurvey() {
    hideElement('surveySection');

    // Check if we're in true campaign mode or "Jump Into Task" mode
    if (isCampaignMode()) {
        showElement('campaignOverview');
    } else if (campaignState.currentTask) {
        // We're in "Jump Into Task" mode - return to main menu
        // Clear the current task since user cancelled
        updateCampaignState({ currentTask: null });
        showElement('gameModeSelection');
    } else {
        // Regular single task mode
        showElement('gameModeSelection');
    }
}

// Close task and return to campaign or mode selection
export function closeTask() {
    // Confirm before closing if game is in progress
    if (gameState.gameInProgress) {
        const confirmed = confirm('Are you sure you want to exit? Your progress in this task will be lost.');
        if (!confirmed) {
            return;
        }
    }

    // Clean up game state
    resetGameState();
    hideElement('taskInfo');
    hideElement('zenActivities');
    hideElement('gameArea');
    hideElement('gameOverScreen');
    hideElement('gameSuccessScreen');

    // Return to appropriate view
    if (isCampaignMode()) {
        showElement('campaignOverview');
    } else {
        showElement('gameModeSelection');
    }
}

// Close shop wrapper
export function closeShopWrapper() {
    closeShop();
    if (isCampaignMode()) {
        showElement('campaignOverview');
    } else {
        showElement('gameModeSelection');
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

// Start single task mode (jump into next uncompleted task)
export function startSingleTaskMode() {
    // Initialize campaign to get current progress
    initializeCampaign();

    // Find the next available task
    const nextTask = getNextAvailableTask(campaignState.completedTasks);

    if (!nextTask) {
        // All tasks completed - show campaign overview instead
        alert('Congratulations! You\'ve completed all available tasks. Check out Campaign Mode to replay tasks or visit the shop!');
        startCampaignMode();
        return;
    }

    // Set up single task mode with the next available task
    updateGameState({ campaignMode: false });
    updateCampaignState({ currentTask: nextTask.id, campaignMode: false });

    // Hide mode selection and show survey
    hideElement('gameModeSelection');
    hideElement('campaignOverview');
    showElement('surveySection');

    // Update survey for the specific task context
    const surveyDescription = document.getElementById('surveyDescription');
    if (surveyDescription) {
        surveyDescription.textContent = `Before we begin your ${nextTask.name.toLowerCase()}, let's assess your current stress level:`;
    }

    const preparedQuestion = document.getElementById('preparedQuestion');
    if (preparedQuestion) {
        if (nextTask.id === 'dmv') {
            preparedQuestion.textContent = 'How prepared do you feel for the DMV?';
        } else if (nextTask.id === 'jobInterview') {
            preparedQuestion.textContent = 'How prepared do you feel for the job interview?';
        } else {
            preparedQuestion.textContent = 'How prepared do you feel for this task?';
        }
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

    // Calculate initial stress from survey
    const surveyResults = calculateSurveyStress();

    // In campaign mode, preserve existing zen points and add start bonus
    // In single task mode, use survey-based zen points plus start bonus
    if (isCampaignMode()) {
        // Award start bonus to existing balance (this updates the balance internally)
        const taskId = campaignState.currentTask || 'unknown';
        ZenPointsManager.awardTaskStartBonus(taskId, 1.0);
    } else {
        // Single task mode: set survey result as base, then add start bonus
        ZenPointsManager.setBalance(surveyResults.zenPoints);
        ZenPointsManager.awardTaskStartBonus('single-task', 1.0);
    }

    updateGameState({
        currentStep: 0, // Reset to step 0 for new task
        stressLevel: surveyResults.stressLevel,
        // Don't set zenPoints here - let the zen points manager handle it
        surveyCompleted: true,
        initialFlavorTextShown: false // Reset flavor text for new task
    });

    // Load activity state from campaign if in campaign mode
    if (isCampaignMode()) {
        loadActivityStateFromCampaign();
    }

    // Start background music if audio is enabled
    if (audioManager && audioManager.initialized) {
        audioManager.startMusic();
    }

    // Update adaptive music to match initial stress level
    updateAdaptiveMusic();

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
        let playerDeck, houseDeck;
        if (isCampaignMode()) {
            playerDeck = createCustomDeck(campaignState.deckComposition);
            houseDeck = createDeck();
            console.log('[DEBUG] Custom player deck generated:', playerDeck);
            console.log('[DEBUG] Standard house deck generated:', houseDeck);
        } else {
            playerDeck = createDeck();
            houseDeck = createDeck();
            console.log('[DEBUG] Standard player deck generated:', playerDeck);
            console.log('[DEBUG] Standard house deck generated:', houseDeck);
        }
        shuffleDeck(playerDeck);
        shuffleDeck(houseDeck);
        console.log('[DEBUG] Shuffled player deck:', playerDeck);
        console.log('[DEBUG] Shuffled house deck:', houseDeck);

        updateGameState({
            deck: playerDeck,
            houseDeck: houseDeck, // Store house deck in game state
            playerCards: [],
            houseCards: [],
            gameInProgress: true,
            // Clear compartmentalized state for new round
            showCompartmentalizedResult: false,
            compartmentalizedHands: null
        });

        // Deal initial cards
        const playerCard1 = playerDeck.pop();
        const houseCard1 = houseDeck.pop();
        const playerCard2 = playerDeck.pop();
        const houseCard2 = houseDeck.pop();
        gameState.playerCards.push(playerCard1);
        gameState.houseCards.push(houseCard1);
        gameState.playerCards.push(playerCard2);
        gameState.houseCards.push(houseCard2);
        console.log('[DEBUG] Initial cards dealt:', {
            playerCards: [playerCard1, playerCard2],
            houseCards: [houseCard1, houseCard2]
        });

        // Reset Joker values for new hand
        resetJokerValues(gameState.playerCards);
        resetJokerValues(gameState.houseCards);

        // Calculate scores to set joker values BEFORE updating UI
        const playerScore = calculateScore(gameState.playerCards);
        const houseScore = calculateScore(gameState.houseCards);

        // Update UI (jokers now have calculated values)
        updateTaskDescription();
        updateCards();
        updateDisplay();
        updateZenActivities();
        updateContextualButtons();

        // Emphasize task info for new rounds
        emphasizeTaskInfo();

        // Show Joker feedback for any jokers in the starting hand
        const jokersInStartingHand = gameState.playerCards.filter(card => card.isJoker);
        if (jokersInStartingHand.length > 0) {
            jokersInStartingHand.forEach((joker, index) => {
                const jokerValue = joker.getCurrentValue();
                const isOptimal = (playerScore === 21) || (playerScore <= 21 && jokerValue > 1);
                setTimeout(() => {
                    showJokerCalculationFeedback(joker, jokerValue, isOptimal);
                }, 1000 + (index * 500)); // Stagger feedback if multiple jokers
            });

            // Show perfect score feedback if starting with 21
            if (playerScore === 21) {
                setTimeout(() => {
                    showJokerPerfectScoreFeedback();
                }, 1500 + (jokersInStartingHand.length * 500));
            }
        }

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

        // Update adaptive music to match current stress level
        updateAdaptiveMusic();

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

        // Calculate scores to set joker values BEFORE updating UI (fallback path)
        const playerScore = calculateScore(gameState.playerCards);
        const houseScore = calculateScore(gameState.houseCards);

        updateCards();
        updateDisplay();

        // Show Joker feedback for any jokers in the starting hand (fallback path)
        const jokersInStartingHand = gameState.playerCards.filter(card => card.isJoker);
        if (jokersInStartingHand.length > 0) {
            jokersInStartingHand.forEach((joker, index) => {
                const jokerValue = joker.getCurrentValue();
                const isOptimal = (playerScore === 21) || (playerScore <= 21 && jokerValue > 1);
                setTimeout(() => {
                    showJokerCalculationFeedback(joker, jokerValue, isOptimal);
                }, 1000 + (index * 500));
            });

            if (playerScore === 21) {
                setTimeout(() => {
                    showJokerPerfectScoreFeedback();
                }, 1500 + (jokersInStartingHand.length * 500));
            }
        }
    }
}

// Player hits (takes another card)
export function hit() {
    if (!gameState.gameInProgress || gameState.deck.length === 0) return;

    // Handle split hand hit
    if (activityState.compartmentalizeInProgress) {
        handleSplitHandHit();
        return;
    }

    try {
        // Increment hit count for progressive messaging
        incrementHitCount();

        // Show progressive flavor text based on hit count
        showFlavorText('hit');

        // Add card to player's hand
        const newCard = gameState.deck.pop();
        gameState.playerCards.push(newCard);

        // Play card deal sound effect
        if (audioManager && audioManager.soundEffects) {
            audioManager.soundEffects.play('cardDeal');
        }

        // Calculate score FIRST to update all joker values before UI update
        const playerScore = calculateScore(gameState.playerCards);

        // Show Joker feedback if the new card is a Joker
        if (newCard.isJoker) {
            const jokerValue = newCard.getCurrentValue();
            const isOptimal = (playerScore === 21) || (playerScore <= 21 && jokerValue > 1);
            setTimeout(() => {
                showJokerCalculationFeedback(newCard, jokerValue, isOptimal);
                if (playerScore === 21) {
                    setTimeout(() => {
                        showJokerPerfectScoreFeedback();
                    }, 1000);
                }
            }, 500);
        }

        // Update UI after joker values have been recalculated
        updateCards();
        if (playerScore > 21) {
            // Check if compartmentalize is available
            if (checkCompartmentalizeAvailable()) {
                offerCompartmentalize();
            } else {
                // Player exceeded 21 - use DMV-themed messaging
                endRound('bust');
            }
        }

    } catch (error) {
        console.error('Error in hit action:', error);
        // Fallback behavior - still add card but without progressive messaging
        if (gameState.deck.length > 0) {
            gameState.playerCards.push(gameState.deck.pop());
            updateCards();
            const playerScore = calculateScore(gameState.playerCards);
            if (playerScore > 21) {
                // Check if compartmentalize is available
                if (checkCompartmentalizeAvailable()) {
                    offerCompartmentalize();
                } else {
                    endRound('bust');
                }
            }
        }
    }
}

// Player stands (ends their turn)
export function stand() {
    if (!gameState.gameInProgress) return;

    // Handle split hand stand
    if (activityState.compartmentalizeInProgress) {
        handleSplitHandStand();
        return;
    }

    try {
        // Set last action for tracking
        setLastAction('stand');

        // Show contextual flavor text
        showFlavorText('stand');

        // House plays according to standard rules using its own deck
        if (!gameState.houseDeck) {
            // If houseDeck is not set, create and shuffle a new one
            gameState.houseDeck = [];
            if (isCampaignMode()) {
                gameState.houseDeck = createDeck();
            } else {
                gameState.houseDeck = createDeck();
            }
            shuffleDeck(gameState.houseDeck);
        }
        while (calculateScore(gameState.houseCards) < 17 && gameState.houseDeck.length > 0) {
            gameState.houseCards.push(gameState.houseDeck.pop());
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
        if (!gameState.houseDeck) {
            gameState.houseDeck = createDeck();
            shuffleDeck(gameState.houseDeck);
        }
        while (calculateScore(gameState.houseCards) < 17 && gameState.houseDeck.length > 0) {
            gameState.houseCards.push(gameState.houseDeck.pop());
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
        let transactionType = ZEN_TRANSACTION_TYPES.ADMIN_ADJUSTMENT;

        switch (result) {
            case 'win':
                zenChange = 15;
                stressChange = -5;
                transactionType = ZEN_TRANSACTION_TYPES.ROUND_WIN;
                break;
            case 'lose':
                stressChange = 15;
                break;
            case 'tie':
                zenChange = 5;
                stressChange = 5;
                transactionType = ZEN_TRANSACTION_TYPES.ROUND_TIE;
                break;
            case 'bust':
                stressChange = 30;
                break;
            case 'house_bust':
                zenChange = 15;
                stressChange = -5;
                transactionType = ZEN_TRANSACTION_TYPES.HOUSE_BUST;
                break;
        }

        // Play appropriate sound effect based on result
        if (audioManager && audioManager.soundEffects) {
            if (result === 'win' || result === 'house_bust') {
                audioManager.soundEffects.play('handWin');
            } else if (result === 'lose' || result === 'bust') {
                audioManager.soundEffects.play('handLose');
            }
            // No sound for tie - neutral outcome
        }

        // Dispatch adaptive music events
        if (result === 'bust') {
            document.dispatchEvent(new CustomEvent('gameEvent', {
                detail: { type: 'bust', data: { result, stressChange } }
            }));
        } else if (result === 'win' || result === 'house_bust') {
            document.dispatchEvent(new CustomEvent('gameEvent', {
                detail: { type: 'handWin', data: { result, stressChange } }
            }));
        } else if (result === 'lose') {
            document.dispatchEvent(new CustomEvent('gameEvent', {
                detail: { type: 'handLose', data: { result, stressChange } }
            }));
        }

        // Apply zen point changes using the manager
        if (zenChange > 0) {
            ZenPointsManager.addPoints(zenChange, transactionType, true, {
                roundResult: result,
                stressChange: stressChange
            });
        }

        // Apply stress changes
        const oldStressLevel = gameState.stressLevel;
        const newStressLevel = Math.max(0, Math.min(100, gameState.stressLevel + stressChange));
        updateGameState({
            stressLevel: newStressLevel
        });

        // Dispatch stress level change event for adaptive music
        if (oldStressLevel !== newStressLevel) {
            document.dispatchEvent(new CustomEvent('stressLevelChanged', {
                detail: { oldLevel: oldStressLevel, newLevel: newStressLevel }
            }));
        }

        // Update display elements
        updateDisplay();
        updateZenActivities();

        // Show DMV-themed outcome message with educational content
        updateOutcomeMessage(result);

        // Show stress management tip after a brief delay
        setTimeout(() => {
            showStressManagementTip(result);
        }, 1000);
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

        // Play celebration sound
        if (audioManager && audioManager.soundEffects) {
            audioManager.soundEffects.play('taskComplete');
        }

        // Dispatch task completion event for adaptive music
        document.dispatchEvent(new CustomEvent('gameEvent', {
            detail: {
                type: 'taskComplete',
                data: {
                    stressLevel: gameState.stressLevel,
                    taskId: isCampaignMode() ? campaignState.currentTask : 'single-task'
                }
            }
        }));

        // Award completion bonus based on final stress level
        const completionBonus = ZenPointsManager.awardCompletionBonus(
            gameState.stressLevel,
            isCampaignMode() ? campaignState.currentTask : 'single-task'
        );

        if (isCampaignMode()) {
            // Get the final balance after completion bonus
            const finalBalance = ZenPointsManager.getCurrentBalance();
            console.log(`Task completion: Final balance after bonus: ${finalBalance}`);

            // Complete campaign task with final zen points (AFTER completion bonus is awarded)
            completeCurrentTask(finalBalance);
        }

        // Show success screen with completion bonus information
        setTimeout(() => {
            showGameSuccess();
            // Show completion bonus celebration after success screen appears
            setTimeout(() => {
                showCompletionBonusCelebration(completionBonus);
            }, 500);
        }, 1000);
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

export function openCampaignShop() {
    try {
        // Validate campaign mode
        if (!isCampaignMode()) {
            console.warn('Cannot open campaign shop - not in campaign mode');
            return;
        }

        // Get zen points from the manager
        const zenPoints = ZenPointsManager.getCurrentBalance();
        if (zenPoints < 0) {
            console.warn('Invalid zen points value, using 0');
            ZenPointsManager.setBalance(0);
        }

        // Open shop with current zen points from zen points manager
        openShop(zenPoints);

    } catch (error) {
        console.error('Error opening campaign shop:', error);
        // Show user-friendly error message
        showPopupNotification('Unable to open shop. Please try again.', 'error');
    }
}

// Wrapper function for switching split hands
// Check if compartmentalize is available
function checkCompartmentalizeAvailable() {

    return activityState.availableActivities.compartmentalize &&
        canUseActivity('compartmentalize') &&
        ZenPointsManager.getCurrentBalance() >= zenActivities.compartmentalize.cost;
}

// Offer compartmentalize option to player
function offerCompartmentalize() {
    // Show compartmentalize option UI
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
        const compartmentalizeOffer = document.createElement('div');
        compartmentalizeOffer.className = 'compartmentalize-offer';
        compartmentalizeOffer.innerHTML = `
            <div class="compartmentalize-content">
                <h3>🧠 Compartmentalize Available!</h3>
                <p>You've busted, but you can use Compartmentalize to split this overwhelming situation into manageable parts.</p>
                <div class="compartmentalize-actions">
                    <button onclick="useCompartmentalizeWrapper()" class="primary-btn">Use Compartmentalize (100 zen)</button>
                    <button onclick="declineCompartmentalize()" class="secondary-btn">Accept Bust</button>
                </div>
            </div>
        `;
        gameArea.appendChild(compartmentalizeOffer);
    }
}

// Wrapper for using compartmentalize
export function useCompartmentalizeWrapper() {

    const result = useZenActivity('compartmentalize', true);

    if (result.success) {
        // Remove compartmentalize offer
        const offer = document.querySelector('.compartmentalize-offer');
        if (offer) offer.remove();

        // Show split hands UI
        showSplitHandsUI(result.splitHands);

        // Update display
        updateDisplay();
        updateZenActivities();

        // Show feedback
        showZenActivityFeedback('Compartmentalize', result.stressReduction || 25);
    } else {
        console.error('Failed to use compartmentalize:', result);
        declineCompartmentalize();
    }
}

// Decline compartmentalize and proceed with bust
export function declineCompartmentalize() {
    // Remove compartmentalize offer
    const offer = document.querySelector('.compartmentalize-offer');
    if (offer) offer.remove();

    // Proceed with normal bust
    endRound('bust');
}

// Handle hit action for split hands
function handleSplitHandHit() {

    if (!activityState.compartmentalizeInProgress) return false;

    const activeHand = getActiveSplitHand();
    if (!activeHand || activeHand.completed) return false;

    // Add card to active hand
    if (gameState.deck.length > 0) {
        const newCard = gameState.deck.pop();
        activeHand.cards.push(newCard);

        // Calculate score FIRST to update all joker values before UI update
        const score = calculateScore(activeHand.cards);

        // Update game state to reflect active hand (after joker values are calculated)
        updateGameState({
            playerCards: activeHand.cards
        });

        // Check for bust
        if (score > 21) {
            const result = completeSplitHand('bust');
            if (result && result.completed) {
                // Both hands completed, finalize
                finalizeSplitHandGame(result);
            } else {
                // Update split hand display
                updateSplitHandDisplay(activityState.splitHands);
            }
        } else {
            // Update display
            updateCards();
            updateSplitHandDisplay(activityState.splitHands);
        }

        return true;
    }

    return false;
}

// Play house hand according to standard blackjack rules
function playHouseHand() {
    // Ensure house has a deck
    if (!gameState.houseDeck) {
        gameState.houseDeck = createDeck();
        shuffleDeck(gameState.houseDeck);
    }

    // House hits on 16 and below, stands on 17 and above
    while (calculateScore(gameState.houseCards) < 17 && gameState.houseDeck.length > 0) {
        gameState.houseCards.push(gameState.houseDeck.pop());
    }
}

// Handle stand action for split hands
function handleSplitHandStand() {

    if (!activityState.compartmentalizeInProgress) return false;

    const activeHand = getActiveSplitHand();
    if (!activeHand || activeHand.completed) return false;

    // Play house hand and determine outcome
    playHouseHand();

    const playerScore = calculateScore(activeHand.cards);
    const houseScore = calculateScore(gameState.houseCards);

    let outcome;
    if (houseScore > 21) {
        outcome = 'house_bust';
    } else if (playerScore > houseScore) {
        outcome = 'win';
    } else if (playerScore === houseScore) {
        outcome = 'tie';
    } else {
        outcome = 'lose';
    }

    const result = completeSplitHand(outcome);
    if (result && result.completed) {
        // Both hands completed, finalize
        finalizeSplitHandGame(result);
    } else {
        // Update split hand display
        updateSplitHandDisplay(activityState.splitHands);
    }

    return true;
}

// Finalize split hand game and return to normal gameplay
function finalizeSplitHandGame(result) {
    // Show completion message with detailed results
    const completionMessage = `Compartmentalization Complete!\nHand 1: ${result.hand1Result}\nHand 2: ${result.hand2Result}\nOverall Result: ${result.overallOutcome}`;

    // Show detailed feedback
    setTimeout(() => {
        showZenActivityFeedback('Compartmentalize Complete', 0);

        // Show detailed results in round result area
        const roundResult = document.getElementById('roundResult');
        if (roundResult) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'compartmentalize-results';
            resultDiv.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
                    border: 2px solid #4CAF50;
                    border-radius: 10px;
                    padding: 15px;
                    margin: 10px 0;
                    text-align: center;
                ">
                    <h4 style="color: #2E7D32; margin: 0 0 10px 0;">🧠 Compartmentalization Results</h4>
                    <p style="margin: 5px 0; color: #4CAF50;"><strong>Hand 1:</strong> ${result.hand1Result}</p>
                    <p style="margin: 5px 0; color: #4CAF50;"><strong>Hand 2:</strong> ${result.hand2Result}</p>
                    <p style="margin: 10px 0 0 0; color: #2E7D32; font-weight: bold;">Overall: ${result.overallOutcome}</p>
                </div>
            `;
            roundResult.appendChild(resultDiv);
        }
    }, 500);

    // Hide split hands UI
    hideSplitHandsUI();

    // The split hands data is already stored in gameState by finalizeSplitHandResults
    // Just use regular endRound - the updateCards function will handle the display
    endRound(result.overallOutcome);
}



export function switchSplitHandWrapper() {
    if (switchSplitHand()) {
        updateSplitHandDisplay(activityState.splitHands);
        return true;
    }
    return false;
}

// Complete both hands when both are finished
export function completeBothHandsWrapper() {
    if (!activityState.compartmentalizeInProgress || !activityState.splitHands) {
        return false;
    }

    const splitHands = activityState.splitHands;
    if (splitHands.hand1.completed && splitHands.hand2.completed) {
        // Both hands are completed, finalize the results
        const result = {
            completed: true,
            overallOutcome: determineOverallOutcome(splitHands.hand1.outcome, splitHands.hand2.outcome),
            hand1Result: splitHands.hand1.outcome,
            hand2Result: splitHands.hand2.outcome,
            message: `Compartmentalization complete! Hand 1: ${splitHands.hand1.outcome}, Hand 2: ${splitHands.hand2.outcome}`
        };

        finalizeSplitHandGame(result);
        return true;
    }
    return false;
}

// Determine overall outcome from two hand results
function determineOverallOutcome(hand1Result, hand2Result) {
    // If either hand wins, overall is a win
    if (hand1Result === 'win' || hand2Result === 'win' ||
        hand1Result === 'house_bust' || hand2Result === 'house_bust') {
        return 'win';
    }

    // If both hands tie, overall is a tie
    if (hand1Result === 'tie' && hand2Result === 'tie') {
        return 'tie';
    }

    // If one ties and the other doesn't bust, it's a tie
    if ((hand1Result === 'tie' && hand2Result !== 'bust') ||
        (hand2Result === 'tie' && hand1Result !== 'bust')) {
        return 'tie';
    }

    // Otherwise it's a loss
    return 'lose';
}

export function purchaseJoker() {
    try {
        // Validate campaign mode
        if (!isCampaignMode()) {
            console.warn('Cannot purchase Joker - not in campaign mode');
            showPurchaseFeedback({
                success: false,
                message: 'Joker upgrades only available in campaign mode'
            });
            return;
        }

        // Get zen points from the manager
        const zenPoints = ZenPointsManager.getCurrentBalance();
        if (zenPoints < 0) {
            console.warn('Invalid zen points for purchase');
            ZenPointsManager.setBalance(0);
            showPurchaseFeedback({
                success: false,
                message: 'Invalid zen points balance'
            });
            return;
        }

        const result = purchaseJokerUpgrade(zenPoints);

        if (result.success) {
            // Update game state with new balance from zen points manager
            const newBalance = ZenPointsManager.getCurrentBalance();
            updateGameState({ zenPoints: newBalance });

            // Update UI elements
            try {
                updateShopUI(newBalance);
                updateCampaignUI();
            } catch (uiError) {
                console.warn('Error updating UI after purchase:', uiError);
                // Purchase was successful, so don't fail completely
            }
        }

        showPurchaseFeedback(result);

    } catch (error) {
        console.error('Error purchasing Joker:', error);
        showPurchaseFeedback({
            success: false,
            message: 'Purchase failed due to an error. Please try again.'
        });
    }
}

export function continueCampaign() {
    closeShop();
    returnToCampaign();
    // Update campaign UI to reflect any purchases
    updateCampaignUI();
}

export function skipShop() {
    closeShop();
    returnToCampaign();
}

export function closeShopToCampaign() {
    closeShop();
    returnToCampaign();
    // Update campaign UI to reflect any purchases
    updateCampaignUI();
}

export function visitMindPalace() {
    try {
        console.log('visitMindPalace called');

        // Validate campaign mode
        if (!isCampaignMode()) {
            console.warn('Mind Palace only available in campaign mode');
            showPopupNotification('Mind Palace only available in campaign mode', 'error');
            return;
        }

        // Validate campaign state
        if (!campaignState.deckComposition) {
            console.error('Invalid campaign state - missing deck composition');
            showPopupNotification('Unable to load Mind Palace information', 'error');
            return;
        }

        console.log('Current campaign state before showing Mind Palace:', campaignState);
        showMindPalace();

    } catch (error) {
        console.error('Error opening Mind Palace:', error);
        showPopupNotification('Unable to open Mind Palace. Please try again.', 'error');
    }
}

export function closeMindPalace() {
    hideMindPalace();
}

// Make functions available globally for onclick handlers (backup approach)
if (typeof window !== 'undefined') {
    window.startSingleTaskMode = startSingleTaskMode;
    window.startCampaignMode = startCampaignMode;
    window.startTask = startTask;
    window.startGame = startTask;
    window.hit = hit;
    window.stand = stand;
    window.nextStep = nextStep;
    window.restartGame = restartGame;
    window.showHelp = showHelp;
    window.enableGameControls = enableGameControls;
    window.openCampaignShop = openCampaignShop;
    window.openShop = openShopWithZen;
    window.purchaseJokerUpgrade = purchaseJoker;
    window.purchasePremiumActivityWrapper = purchasePremiumActivityWrapper;
    window.switchSplitHandWrapper = switchSplitHandWrapper;
    window.useCompartmentalizeWrapper = useCompartmentalizeWrapper;
    window.declineCompartmentalize = declineCompartmentalize;
    window.continueCampaign = continueCampaign;
    window.closeShopToCampaign = closeShopToCampaign;
    window.visitMindPalace = visitMindPalace;
    window.closeMindPalace = closeMindPalace;
    window.startCampaignTask = startCampaignTask;
    window.resetCampaign = resetCampaign;
    window.returnToCampaign = returnToCampaign;
    window.closeSurvey = closeSurvey;
    window.closeTask = closeTask;
    window.closeShopWrapper = closeShopWrapper;

    // Make debug functions available
    import('./ui-manager.js').then(ui => {
        window.addZenPointsDebug = ui.addZenPointsDebug;
    });

    // Make campaign functions available for game-state.js (needed for internal module communication)
    window.isCampaignMode = isCampaignMode;
    window.getCurrentTask = getCurrentTask;

    // Make UI functions available for zen points manager
    window.showZenPointAnimation = (amount, type, direction) => {
        import('./ui-manager.js').then(ui => ui.showZenPointAnimation(amount, type, direction));
    };
    window.showCompletionBonusCelebration = (breakdown) => {
        import('./ui-manager.js').then(ui => ui.showCompletionBonusCelebration(breakdown));
    };
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}