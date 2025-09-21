// SoberLife III - UI Manager
// DOM manipulation and visual updates

import { gameState, steps, generateSuccessMessage, getContextualActionText, getContextualActionDescription, getContextualFlavorText } from './game-state.js';
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

// Update task description with animations and error handling
export function updateTaskDescription() {
    try {
        const taskDescEl = document.getElementById('taskDescription');
        const stepIndicatorEl = document.getElementById('stepIndicator');
        const taskInfoEl = document.getElementById('taskInfo');
        
        if (!taskDescEl) {
            console.error('Task description element not found');
            return;
        }
        
        // Get step description with fallback
        let stepDescription = '';
        if (gameState.currentStep < steps.length && steps[gameState.currentStep]) {
            stepDescription = steps[gameState.currentStep];
        } else {
            console.warn(`Step description not found for step ${gameState.currentStep}, using fallback`);
            stepDescription = getFallbackStepDescription(gameState.currentStep);
        }
        
        // Update step indicator with error handling
        if (stepIndicatorEl) {
            try {
                stepIndicatorEl.textContent = `Step ${gameState.currentStep + 1} of 5`;
            } catch (error) {
                console.warn('Error updating step indicator:', error);
            }
        }
        
        // Update task description
        taskDescEl.textContent = `Step ${gameState.currentStep + 1}: ${stepDescription}`;
        
        // Trigger task change animation with error handling
        if (taskInfoEl) {
            try {
                taskInfoEl.classList.remove('task-changing');
                // Force reflow to ensure class removal is processed
                taskInfoEl.offsetHeight;
                taskInfoEl.classList.add('task-changing');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    try {
                        taskInfoEl.classList.remove('task-changing');
                    } catch (animError) {
                        console.warn('Error removing animation class:', animError);
                    }
                }, 1200);
            } catch (animError) {
                console.warn('Error with task change animation:', animError);
            }
        }
    } catch (error) {
        console.error('Error updating task description:', error);
        // Fallback: try to at least show basic step info
        const taskDescEl = document.getElementById('taskDescription');
        if (taskDescEl) {
            taskDescEl.textContent = `Step ${gameState.currentStep + 1}: Complete this DMV step`;
        }
    }
}

// Fallback step descriptions
function getFallbackStepDescription(stepIndex) {
    const fallbackSteps = [
        "Complete the check-in process",
        "Wait for your turn to be called",
        "Submit your required documents",
        "Complete photo and verification",
        "Finalize your DMV visit"
    ];
    
    if (stepIndex >= 0 && stepIndex < fallbackSteps.length) {
        return fallbackSteps[stepIndex];
    }
    
    return "Complete this DMV step";
}

// Emphasize task info as most prominent element
export function emphasizeTaskInfo() {
    const taskInfoEl = document.getElementById('taskInfo');
    const otherElements = [
        document.getElementById('zenActivities'),
        document.getElementById('gameArea'),
        document.getElementById('avatar-container')
    ];
    
    if (taskInfoEl) {
        // Make task info more prominent
        taskInfoEl.style.transform = 'scale(1.02)';
        taskInfoEl.style.zIndex = '15';
        
        // Reduce prominence of other elements temporarily
        otherElements.forEach(el => {
            if (el) {
                el.style.opacity = '0.7';
                el.style.transform = 'scale(0.98)';
            }
        });
        
        // Restore normal state after emphasis period
        setTimeout(() => {
            taskInfoEl.style.transform = '';
            taskInfoEl.style.zIndex = '';
            
            otherElements.forEach(el => {
                if (el) {
                    el.style.opacity = '';
                    el.style.transform = '';
                }
            });
        }, 2000);
    }
}

// Store the element that had focus before modal opened
let previouslyFocusedElement = null;

// Help modal functions with error handling
export function showHelpModal() {
    try {
        const helpModal = document.getElementById('helpModal');
        if (!helpModal) {
            console.error('Help modal element not found');
            return;
        }
        
        // Store currently focused element
        previouslyFocusedElement = document.activeElement;
        
        helpModal.classList.remove('hidden');
        
        // Focus management for accessibility
        const closeBtn = document.getElementById('helpCloseBtn');
        if (closeBtn) {
            // Small delay to ensure modal is visible before focusing
            setTimeout(() => {
                try {
                    closeBtn.focus();
                } catch (focusError) {
                    console.warn('Could not focus close button:', focusError);
                }
            }, 100);
        } else {
            console.warn('Help close button not found');
        }
        
        // Prevent body scroll when modal is open
        if (document.body) {
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error showing help modal:', error);
    }
}

export function hideHelpModal() {
    try {
        const helpModal = document.getElementById('helpModal');
        if (!helpModal) {
            console.error('Help modal element not found');
            return;
        }
        
        helpModal.classList.add('hidden');
        
        // Restore focus to previously focused element
        if (previouslyFocusedElement) {
            try {
                previouslyFocusedElement.focus();
            } catch (focusError) {
                console.warn('Could not restore focus:', focusError);
            }
            previouslyFocusedElement = null;
        }
        
        // Restore body scroll
        if (document.body) {
            document.body.style.overflow = '';
        }
    } catch (error) {
        console.error('Error hiding help modal:', error);
    }
}

// Update contextual action buttons with error handling
export function updateContextualButtons() {
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
    } catch (error) {
        console.error('Error updating contextual buttons:', error);
    }
}

// Show flavor text for actions with error handling
export function showFlavorText(action) {
    try {
        const flavorText = getContextualFlavorText(action);
        if (!flavorText) {
            return; // No flavor text to show
        }
        
        const roundResult = document.getElementById('roundResult');
        if (!roundResult) {
            console.warn('Round result element not found for flavor text');
            return;
        }
        
        const flavorDiv = document.createElement('div');
        flavorDiv.className = 'flavor-text';
        
        // Sanitize the flavor text to prevent XSS
        const sanitizedText = flavorText.replace(/[<>]/g, '');
        flavorDiv.innerHTML = `<p style="font-style: italic; color: #666; margin: 10px 0;">${sanitizedText}</p>`;
        
        roundResult.appendChild(flavorDiv);
        
        // Remove flavor text after 3 seconds with error handling
        setTimeout(() => {
            try {
                if (flavorDiv && flavorDiv.parentNode) {
                    flavorDiv.parentNode.removeChild(flavorDiv);
                }
            } catch (removeError) {
                console.warn('Error removing flavor text:', removeError);
            }
        }, 3000);
        
    } catch (error) {
        console.error('Error showing flavor text:', error);
    }
}