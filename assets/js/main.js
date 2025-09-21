// SoberLife III - Main Game Controller
// Game initialization and coordination

import { gameState, updateGameState, resetGameState, steps } from './game-state.js';
import { createDeck, shuffleDeck, calculateScore } from './card-system.js';
import { updateDisplay, updateCards, updateZenActivities, showGameOver, showGameSuccess, hideElement, showElement, updateTaskDescription } from './ui-manager.js';
import { calculateSurveyStress, updateStressLevel } from './stress-system.js';

// Initialize the game when page loads
export function initializeGame() {
    // Set up survey validation
    const surveyInputs = document.querySelectorAll('input[type="radio"]');
    const startGameBtn = document.getElementById('startGameBtn');
    
    if (surveyInputs && startGameBtn) {
        surveyInputs.forEach(input => {
            input.addEventListener('change', validateSurvey);
        });
    }

    // Initial display update
    updateDisplay();
    updateZenActivities();
}

// Validate survey completion
function validateSurvey() {
    const sleepAnswer = document.querySelector('input[name="sleep"]:checked');
    const preparedAnswer = document.querySelector('input[name="prepared"]:checked');
    const dayAnswer = document.querySelector('input[name="day"]:checked');
    const startGameBtn = document.getElementById('startGameBtn');
    const errorMsg = document.getElementById('surveyError');

    if (sleepAnswer && preparedAnswer && dayAnswer) {
        if (startGameBtn) startGameBtn.disabled = false;
        if (errorMsg) errorMsg.style.display = 'none';
    } else {
        if (startGameBtn) startGameBtn.disabled = true;
    }
}

// Start the game after survey completion
export function startGame() {
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
        stressLevel: surveyResults.stressLevel,
        zenPoints: surveyResults.zenPoints,
        surveyCompleted: true
    });

    // Hide survey and show game elements
    hideElement('surveySection');
    showElement('taskInfo');
    showElement('zenActivities');
    showElement('gameArea');

    // Start first round
    startNewRound();
}

// Start a new blackjack round
export function startNewRound() {
    // Create and shuffle new deck
    const deck = createDeck();
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

    // Enable game buttons
    const hitBtn = document.getElementById('hitBtn');
    const standBtn = document.getElementById('standBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    
    if (hitBtn) hitBtn.disabled = false;
    if (standBtn) standBtn.disabled = false;
    if (nextStepBtn) nextStepBtn.classList.add('hidden');

    // Clear previous round result
    const roundResult = document.getElementById('roundResult');
    if (roundResult) roundResult.innerHTML = '';
}

// Player hits (takes another card)
export function hit() {
    if (!gameState.gameInProgress || gameState.deck.length === 0) return;

    gameState.playerCards.push(gameState.deck.pop());
    updateCards();

    const playerScore = calculateScore(gameState.playerCards);
    if (playerScore > 21) {
        // Player busted
        endRound('bust');
    }
}

// Player stands (ends their turn)
export function stand() {
    if (!gameState.gameInProgress) return;

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
}

// End the current round with a result
export function endRound(result) {
    updateGameState({ gameInProgress: false });
    
    const hitBtn = document.getElementById('hitBtn');
    const standBtn = document.getElementById('standBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    
    if (hitBtn) hitBtn.disabled = true;
    if (standBtn) standBtn.disabled = true;
    
    updateCards();

    let resultText = '';
    let zenChange = 0;
    let stressChange = 0;

    switch (result) {
        case 'win':
            resultText = '🎉 You won! Great job managing the pressure!';
            zenChange = 15;
            stressChange = -5;
            break;
        case 'lose':
            resultText = '😔 House wins. Take a deep breath and try again.';
            stressChange = 15;
            break;
        case 'tie':
            resultText = '🤝 It\'s a tie! Not bad under pressure.';
            zenChange = 5;
            stressChange = 5;
            break;
        case 'bust':
            resultText = '💥 Busted! The stress got to you this time.';
            stressChange = 30;
            break;
        case 'house_bust':
            resultText = '🎊 House busted! Your patience paid off!';
            zenChange = 15;
            stressChange = -5;
            break;
    }

    // Apply changes
    updateGameState({
        zenPoints: Math.max(0, gameState.zenPoints + zenChange),
        stressLevel: Math.max(0, Math.min(100, gameState.stressLevel + stressChange))
    });

    // Update display
    updateDisplay();
    updateZenActivities();

    // Show result
    const roundResult = document.getElementById('roundResult');
    if (roundResult) {
        roundResult.innerHTML = `
            <p style="font-size: 18px; font-weight: bold; margin: 15px 0;">${resultText}</p>
            ${zenChange > 0 ? `<p style="color: #2ECC71;">+${zenChange} Zen Points!</p>` : ''}
            ${stressChange !== 0 ? `<p style="color: ${stressChange > 0 ? '#E74C3C' : '#2ECC71'};">${stressChange > 0 ? '+' : ''}${stressChange}% Stress</p>` : ''}
        `;
    }

    // Check for game over conditions
    if (gameState.stressLevel >= 100) {
        setTimeout(() => showGameOver(), 1500);
        return;
    }

    // Always show next step button - players can progress regardless of win/loss
    if (nextStepBtn) {
        nextStepBtn.textContent = 'Next Step';
        nextStepBtn.classList.remove('hidden');
    }
}

// Move to next DMV step
export function nextStep() {
    // Always advance to next step
    updateGameState({ currentStep: gameState.currentStep + 1 });
    
    if (gameState.currentStep >= steps.length) {
        // Game completed successfully!
        setTimeout(() => showGameSuccess(), 1000);
        return;
    }
    
    // Start new round for next step
    startNewRound();
}

// Restart the game
export function restartGame() {
    resetGameState();
    
    // Hide game over/success screens
    hideElement('gameOverScreen');
    hideElement('gameSuccessScreen');
    
    // Show survey again
    showElement('surveySection');
    hideElement('taskInfo');
    hideElement('zenActivities');
    hideElement('gameArea');
    
    // Reset survey
    const surveyInputs = document.querySelectorAll('input[type="radio"]');
    surveyInputs.forEach(input => input.checked = false);
    
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) startGameBtn.disabled = true;
    
    // Update display
    updateDisplay();
    updateZenActivities();
}

// Make functions available globally for onclick handlers
window.startGame = startGame;
window.hit = hit;
window.stand = stand;
window.nextStep = nextStep;
window.restartGame = restartGame;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}