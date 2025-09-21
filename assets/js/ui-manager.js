// SoberLife III - UI Manager
// DOM manipulation and visual updates

import { gameState, steps, generateSuccessMessage } from './game-state.js';
import { calculateScore } from './card-system.js';

// Utility functions for showing/hiding elements
export function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('hidden');
    }
}

export function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('hidden');
    }
}

// Update main game display (zen points, stress meter, avatar)
export function updateDisplay() {
    // Update zen points
    const zenPointsEl = document.getElementById('zenPoints');
    if (zenPointsEl) {
        zenPointsEl.textContent = `Zen Points: ${gameState.zenPoints}`;
    }

    // Update stress meter
    const stressFill = document.getElementById('stressFill');
    const stressPercent = gameState.stressLevel;
    
    if (stressFill) {
        stressFill.style.width = `${stressPercent}%`;
        
        // Color coding for stress levels
        if (stressPercent < 30) {
            stressFill.style.background = 'linear-gradient(90deg, #2ECC71, #27AE60)';
        } else if (stressPercent < 60) {
            stressFill.style.background = 'linear-gradient(90deg, #F39C12, #E67E22)';
        } else {
            stressFill.style.background = 'linear-gradient(90deg, #E74C3C, #C0392B)';
        }
    }

    // Update avatar based on stress
    const avatar = document.getElementById('avatar');
    if (avatar) {
        if (stressPercent < 20) {
            avatar.textContent = '😊';
            avatar.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';
        } else if (stressPercent < 40) {
            avatar.textContent = '🙂';
            avatar.style.background = 'linear-gradient(135deg, #3498DB, #2980B9)';
        } else if (stressPercent < 60) {
            avatar.textContent = '😐';
            avatar.style.background = 'linear-gradient(135deg, #F39C12, #E67E22)';
        } else if (stressPercent < 80) {
            avatar.textContent = '😰';
            avatar.style.background = 'linear-gradient(135deg, #FF6B6B, #FF5252)';
        } else {
            avatar.textContent = '😵';
            avatar.style.background = 'linear-gradient(135deg, #E74C3C, #C0392B)';
        }
    }
}

// Update card display for both player and house
export function updateCards() {
    const playerCardsEl = document.getElementById('playerCards');
    const houseCardsEl = document.getElementById('houseCards');

    if (playerCardsEl) {
        playerCardsEl.innerHTML = '';
        
        // Player cards
        gameState.playerCards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.textContent = card.display;
            cardEl.className = 'card';
            if (card.suit === '♥' || card.suit === '♦') {
                cardEl.classList.add('red');
            }
            playerCardsEl.appendChild(cardEl);
        });
    }

    if (houseCardsEl) {
        houseCardsEl.innerHTML = '';
        
        // House cards (hide hole card only if game is still in progress)
        gameState.houseCards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            
            if (index === 1 && gameState.gameInProgress) {
                // Hide hole card during active play
                cardEl.textContent = '?';
                cardEl.style.background = 'linear-gradient(135deg, #34495E, #2C3E50)';
                cardEl.style.color = 'white';
            } else {
                cardEl.textContent = card.display;
                if (card.suit === '♥' || card.suit === '♦') {
                    cardEl.classList.add('red');
                }
            }
            houseCardsEl.appendChild(cardEl);
        });
    }

    // Update scores
    const playerScore = calculateScore(gameState.playerCards);
    const playerScoreEl = document.getElementById('playerScore');
    if (playerScoreEl) {
        playerScoreEl.textContent = `Score: ${playerScore}`;
    }

    const houseScoreEl = document.getElementById('houseScore');
    if (houseScoreEl) {
        if (gameState.gameInProgress && gameState.houseCards.length > 1) {
            houseScoreEl.textContent = 'Score: ?';
        } else {
            const houseScore = calculateScore(gameState.houseCards);
            houseScoreEl.textContent = `Score: ${houseScore}`;
        }
    }
}

// Update zen activities button states
export function updateZenActivities() {
    const breathBtn = document.getElementById('breathBtn');
    const stretchBtn = document.getElementById('stretchBtn');
    const meditationBtn = document.getElementById('meditationBtn');

    if (breathBtn) {
        breathBtn.disabled = gameState.zenPoints < 10;
    }
    if (stretchBtn) {
        stretchBtn.disabled = gameState.zenPoints < 25;
    }
    if (meditationBtn) {
        meditationBtn.disabled = gameState.zenPoints < 50;
    }
}

// Show game over screen
export function showGameOver() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) {
        gameOverScreen.classList.remove('hidden');
        
        // Update game over stats
        const finalStressEl = document.getElementById('finalStressLevel');
        if (finalStressEl) {
            finalStressEl.textContent = `${gameState.stressLevel}%`;
        }
        
        const finalZenEl = document.getElementById('finalZenPoints');
        if (finalZenEl) {
            finalZenEl.textContent = gameState.zenPoints;
        }
        
        const stepsCompletedEl = document.getElementById('stepsCompleted');
        if (stepsCompletedEl) {
            stepsCompletedEl.textContent = gameState.currentStep;
        }
    }
}

// Show game success screen
export function showGameSuccess() {
    const gameSuccessScreen = document.getElementById('gameSuccessScreen');
    if (gameSuccessScreen) {
        gameSuccessScreen.classList.remove('hidden');
        
        // Generate and display success message
        const message = generateSuccessMessage();
        
        const successMessageEl = document.getElementById('successMessage');
        if (successMessageEl) {
            successMessageEl.textContent = message.main;
        }
        
        const successSubtextEl = document.getElementById('successSubtext');
        if (successSubtextEl) {
            successSubtextEl.textContent = message.sub;
        }
        
        const successStatsEl = document.getElementById('successStats');
        if (successStatsEl) {
            successStatsEl.innerHTML = `
                <p>Final Stress Level: ${gameState.stressLevel}%</p>
                <p>Zen Points Remaining: ${gameState.zenPoints}</p>
                <p>DMV Steps Completed: ${gameState.currentStep}/5</p>
            `;
        }
    }
}

// Update task description
export function updateTaskDescription() {
    const taskDescEl = document.getElementById('taskDescription');
    if (taskDescEl && gameState.currentStep < steps.length) {
        taskDescEl.textContent = `Step ${gameState.currentStep + 1}: ${steps[gameState.currentStep]}`;
    }
}