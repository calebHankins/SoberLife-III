// SoberLife III - UI Manager
// DOM manipulation and visual updates

import { gameState, campaignState, steps, generateSuccessMessage, getContextualActionText, getContextualActionDescription, getContextualFlavorText, getProgressiveFlavorText, handState, getDMVOutcomeMessage, getStressManagementInsight, getInitialFlavorText } from './game-state.js';
import { calculateScore } from './card-system.js';
import { isCampaignMode, getCurrentTask } from './campaign-manager.js';

// Utility functions for showing/hiding elements
// Debug: Add 1000 zen points instantly
export function addZenPointsDebug() {
    gameState.zenPoints += 1000;
    updateDisplay();
}
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
            const cardEl = createCardElement(card);
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
                const fullCardEl = createCardElement(card);
                cardEl.className = fullCardEl.className;
                cardEl.innerHTML = fullCardEl.innerHTML;
                cardEl.style.cssText = fullCardEl.style.cssText;
            }
            houseCardsEl.appendChild(cardEl);
        });
    }

    // Update scores with Joker value indicators
    updateScoreDisplays();
}

// Create a card element with proper styling and effects
function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';

    if (card.isJoker) {
        // Joker visual indicator
        cardEl.classList.add('joker');
        cardEl.textContent = card.display;

        // Add glowing border and label
        cardEl.style.boxShadow = '0 0 16px 6px #FFD700, 0 0 32px 12px #8e44ad';
        cardEl.style.border = '3px solid gold';
        cardEl.style.background = 'linear-gradient(135deg, #fffbe6, #e0c3fc)';
        cardEl.style.position = 'relative';

        // Add "Wild Joker!" label
        const jokerLabel = document.createElement('div');
        jokerLabel.textContent = 'Wild Joker!';
        jokerLabel.style.position = 'absolute';
        jokerLabel.style.top = '-18px';
        jokerLabel.style.left = '50%';
        jokerLabel.style.transform = 'translateX(-50%)';
        jokerLabel.style.background = 'linear-gradient(90deg, #FFD700, #8e44ad)';
        jokerLabel.style.color = 'white';
        jokerLabel.style.fontWeight = 'bold';
        jokerLabel.style.fontSize = '12px';
        jokerLabel.style.padding = '2px 8px';
        jokerLabel.style.borderRadius = '8px';
        jokerLabel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        jokerLabel.style.zIndex = '2';
        cardEl.appendChild(jokerLabel);

        // Add value indicator if Joker has calculated a value
        if (card.calculatedValue !== null) {
            const valueIndicator = document.createElement('div');
            valueIndicator.className = 'joker-value-indicator';
            valueIndicator.textContent = card.calculatedValue;
            valueIndicator.style.position = 'absolute';
            valueIndicator.style.bottom = '-18px';
            valueIndicator.style.left = '50%';
            valueIndicator.style.transform = 'translateX(-50%)';
            valueIndicator.style.background = '#8e44ad';
            valueIndicator.style.color = 'white';
            valueIndicator.style.fontWeight = 'bold';
            valueIndicator.style.fontSize = '12px';
            valueIndicator.style.padding = '2px 8px';
            valueIndicator.style.borderRadius = '8px';
            valueIndicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            valueIndicator.style.zIndex = '2';
            cardEl.appendChild(valueIndicator);

            // Add special effects based on value
            if (card.calculatedValue === 11) {
                cardEl.classList.add('calculating');
            }

            // Check if this Joker helped achieve 21
            const currentScore = calculateScore(gameState.playerCards);
            if (currentScore === 21) {
                cardEl.classList.add('perfect-score');
                setTimeout(() => createJokerCelebrationParticles(cardEl), 100);
            }
        }
    } else {
        // Regular card rendering
        cardEl.textContent = card.display;
        if (card.suit === '♥' || card.suit === '♦') {
            cardEl.classList.add('red');
        }
    }
    return cardEl;
}

// Update score displays with Joker information
function updateScoreDisplays() {
    const playerScore = calculateScore(gameState.playerCards);
    const playerScoreEl = document.getElementById('playerScore');
    if (playerScoreEl) {
        let scoreText = `Score: ${playerScore}`;
        
        // Add Joker contribution info
        const jokers = gameState.playerCards.filter(card => card.isJoker);
        if (jokers.length > 0) {
            const jokerValues = jokers.map(j => j.getCurrentValue()).join(', ');
            scoreText += ` (Jokers: ${jokerValues})`;
        }
        
        playerScoreEl.textContent = scoreText;
    }

    const houseScoreEl = document.getElementById('houseScore');
    if (houseScoreEl) {
        if (gameState.gameInProgress && gameState.houseCards.length > 1) {
            houseScoreEl.textContent = 'Score: ?';
        } else {
            const houseScore = calculateScore(gameState.houseCards);
            let scoreText = `Score: ${houseScore}`;
            
            // Add Joker contribution info for house
            const houseJokers = gameState.houseCards.filter(card => card.isJoker);
            if (houseJokers.length > 0) {
                const jokerValues = houseJokers.map(j => j.getCurrentValue()).join(', ');
                scoreText += ` (Jokers: ${jokerValues})`;
            }
            
            houseScoreEl.textContent = scoreText;
        }
    }
}

// Create celebration particles for perfect Joker plays
function createJokerCelebrationParticles(cardElement) {
    try {
        // Validate card element
        if (!cardElement || !cardElement.getBoundingClientRect) {
            console.warn('Invalid card element for celebration particles');
            return;
        }
        
        const rect = cardElement.getBoundingClientRect();
        
        // Validate rect dimensions
        if (rect.width === 0 || rect.height === 0) {
            console.warn('Card element has no dimensions for particles');
            return;
        }
        
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            try {
                const particle = document.createElement('div');
                particle.className = 'joker-celebration-particle';
                
                // Position particle at card location
                particle.style.position = 'fixed';
                particle.style.left = `${rect.left + rect.width / 2}px`;
                particle.style.top = `${rect.top + rect.height / 2}px`;
                particle.style.zIndex = '1001';
                
                // Random direction and distance
                const angle = (i / particleCount) * 2 * Math.PI;
                const distance = 30 + Math.random() * 20;
                const finalX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
                const finalY = rect.top + rect.height / 2 + Math.sin(angle) * distance;
                
                particle.style.setProperty('--final-x', `${finalX}px`);
                particle.style.setProperty('--final-y', `${finalY}px`);
                
                document.body.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    try {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    } catch (removeError) {
                        console.warn('Error removing celebration particle:', removeError);
                    }
                }, 1000);
                
            } catch (particleError) {
                console.warn('Error creating individual particle:', particleError);
                // Continue with other particles
            }
        }
    } catch (error) {
        console.error('Error creating celebration particles:', error);
    }
}

// Show Joker value calculation feedback
export function showJokerCalculationFeedback(joker, calculatedValue, isOptimal) {
    try {
        const roundResult = document.getElementById('roundResult');
        if (!roundResult) return;
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'joker-feedback';
        
        let message = `🃏 Wild Joker calculated value: ${calculatedValue}`;
        let emoji = '✨';
        
        if (isOptimal) {
            if (calculatedValue === 11) {
                message += ' (Perfect for 21!)';
                emoji = '🎯';
            } else if (calculatedValue === 1) {
                message += ' (Avoiding bust!)';
                emoji = '🛡️';
            } else {
                message += ' (Optimal choice!)';
                emoji = '⭐';
            }
        }
        
        feedbackDiv.innerHTML = `
            <p style="
                font-weight: bold;
                color: #ffd700;
                margin: 10px 0;
                padding: 8px 12px;
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 237, 78, 0.2));
                border: 2px solid #ffd700;
                border-radius: 8px;
                text-align: center;
                animation: jokerFeedbackPulse 0.5s ease-out;
                box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
            ">${emoji} ${message}</p>
        `;
        
        roundResult.appendChild(feedbackDiv);
        
        // Remove feedback after 4 seconds (longer for Joker feedback)
        setTimeout(() => {
            if (feedbackDiv.parentNode) {
                feedbackDiv.style.opacity = '0';
                feedbackDiv.style.transform = 'translateY(-10px)';
                feedbackDiv.style.transition = 'all 0.3s ease-out';
                
                setTimeout(() => {
                    if (feedbackDiv.parentNode) {
                        feedbackDiv.parentNode.removeChild(feedbackDiv);
                    }
                }, 300);
            }
        }, 4000);
        
    } catch (error) {
        console.error('Error showing Joker calculation feedback:', error);
    }
}

// Show special feedback when Jokers help achieve perfect scores
export function showJokerPerfectScoreFeedback() {
    try {
        const roundResult = document.getElementById('roundResult');
        if (!roundResult) return;
        
        const celebrationDiv = document.createElement('div');
        celebrationDiv.className = 'joker-perfect-celebration';
        
        celebrationDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
                background-size: 400% 400%;
                animation: rainbow-shift 2s ease infinite, jokerCelebrationBounce 1s ease-out;
                color: white;
                font-weight: bold;
                font-size: 18px;
                padding: 15px 20px;
                border-radius: 15px;
                text-align: center;
                margin: 15px 0;
                border: 3px solid gold;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            ">
                🎉 JOKER MAGIC! Perfect 21! 🎉
                <br>
                <small style="font-size: 14px; opacity: 0.9;">Your Wild Joker made the perfect play!</small>
            </div>
        `;
        
        roundResult.appendChild(celebrationDiv);
        
        // Remove celebration after 5 seconds
        setTimeout(() => {
            if (celebrationDiv.parentNode) {
                celebrationDiv.style.opacity = '0';
                celebrationDiv.style.transform = 'scale(0.8)';
                celebrationDiv.style.transition = 'all 0.5s ease-out';
                
                setTimeout(() => {
                    if (celebrationDiv.parentNode) {
                        celebrationDiv.parentNode.removeChild(celebrationDiv);
                    }
                }, 500);
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing Joker perfect score feedback:', error);
    }
}

// Generate task-specific success message
function generateTaskSpecificSuccessMessage() {
    try {
        // Check if we're in campaign mode and get task-specific messages
        if (isCampaignMode()) {
            const currentTask = getCurrentTask();
            if (currentTask && currentTask.successMessages && currentTask.successMessages.length > 0) {
                const randomIndex = Math.floor(Math.random() * currentTask.successMessages.length);
                return currentTask.successMessages[randomIndex];
            }
        }
        
        // Fall back to default DMV messages
        return generateSuccessMessage();
        
    } catch (error) {
        console.error('Error generating task-specific success message:', error);
        return generateSuccessMessage();
    }
}

// Generate task-specific stats
function generateTaskSpecificStats() {
    try {
        // Get current task info
        let taskName = 'DMV';
        let totalSteps = 5;
        
        if (isCampaignMode()) {
            const currentTask = getCurrentTask();
            if (currentTask) {
                taskName = currentTask.name;
                totalSteps = currentTask.steps.length;
            }
        }
        
        return `
            <p>Final Stress Level: ${gameState.stressLevel}%</p>
            <p>Zen Points Remaining: ${gameState.zenPoints}</p>
            <p>${taskName} Steps Completed: ${gameState.currentStep}/${totalSteps}</p>
        `;
        
    } catch (error) {
        console.error('Error generating task-specific stats:', error);
        return `
            <p>Final Stress Level: ${gameState.stressLevel}%</p>
            <p>Zen Points Remaining: ${gameState.zenPoints}</p>
            <p>Steps Completed: ${gameState.currentStep}/5</p>
        `;
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

        // Update game over message and subtext dynamically
        let mainMsg = "You've reached maximum stress levels and had a complete meltdown!";
        let subMsg = "Don't worry, it happens to the best of us.";

        // Try to get task-specific bust message
        if (isCampaignMode()) {
            const currentTask = getCurrentTask();
            if (currentTask && currentTask.bustMessages && currentTask.bustMessages.length > 0) {
                const bustMsg = currentTask.bustMessages[Math.floor(Math.random() * currentTask.bustMessages.length)];
                mainMsg = bustMsg.main || mainMsg;
                subMsg = bustMsg.sub || subMsg;
            }
        }

        // Set the message in the DOM
        const gameOverMsgEl = document.getElementById('gameOverMessage');
        if (gameOverMsgEl) {
            gameOverMsgEl.textContent = mainMsg;
        }
        const gameOverSubEl = document.getElementById('gameOverSubtext');
        if (gameOverSubEl) {
            gameOverSubEl.textContent = subMsg;
        }

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
        
        // Generate task-specific success message
        const message = generateTaskSpecificSuccessMessage();
        
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
            // Generate task-specific stats
            const statsHtml = generateTaskSpecificStats();
            successStatsEl.innerHTML = statsHtml;
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
        
        // Get current task steps and info
        let currentSteps = steps;
        let taskName = 'DMV License Renewal & Real ID';
        
        if (isCampaignMode()) {
            const currentTask = getCurrentTask();
            if (currentTask) {
                currentSteps = currentTask.steps;
                taskName = currentTask.name;
            }
        }
        
        // Get step description with fallback
        let stepDescription = '';
        if (gameState.currentStep < currentSteps.length && currentSteps[gameState.currentStep]) {
            stepDescription = currentSteps[gameState.currentStep];
        } else {
            console.warn(`Step description not found for step ${gameState.currentStep}, using fallback`);
            stepDescription = getFallbackStepDescription(gameState.currentStep);
        }
        
        // Update task title if in campaign mode
        const taskTitleEl = taskInfoEl?.querySelector('h3');
        if (taskTitleEl && isCampaignMode()) {
            taskTitleEl.textContent = `🎯 Task: ${taskName}`;
        }
        
        // Update step indicator with error handling
        if (stepIndicatorEl) {
            try {
                stepIndicatorEl.textContent = `Step ${gameState.currentStep + 1} of ${currentSteps.length}`;
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
            // Show Nirvana zone if debug mode (or always for now)
            const nirvanaZone = helpModal.querySelector('.nirvana-zone');
            if (nirvanaZone) {
                nirvanaZone.style.display = '';
                const nirvanaBtn = document.getElementById('nirvanaZenBtn');
                if (nirvanaBtn) {
                    nirvanaBtn.onclick = addZenPointsDebug;
                }
            }
        
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

// Show progressive flavor text for actions with error handling
export function showFlavorText(action) {
    try {
        // Use progressive flavor text system
        const flavorText = getProgressiveFlavorText(action, gameState.currentStep, handState.hitCount);
        if (!flavorText) {
            return; // No flavor text to show
        }
        
        displayProgressiveFlavorText(flavorText);
        
    } catch (error) {
        console.error('Error showing flavor text:', error);
        // Fallback to basic contextual flavor text
        try {
            const fallbackText = getContextualFlavorText(action);
            if (fallbackText) {
                displayProgressiveFlavorText(fallbackText);
            }
        } catch (fallbackError) {
            console.error('Error showing fallback flavor text:', fallbackError);
        }
    }
}

// Display progressive flavor text with enhanced styling
export function displayProgressiveFlavorText(flavorText) {
    try {
        if (!flavorText || typeof flavorText !== 'string') {
            return;
        }
        
        const roundResult = document.getElementById('roundResult');
        if (!roundResult) {
            console.warn('Round result element not found for flavor text');
            return;
        }
        
        const flavorDiv = document.createElement('div');
        flavorDiv.className = 'flavor-text progressive-flavor';
        
        // Sanitize the flavor text to prevent XSS
        const sanitizedText = flavorText.replace(/[<>]/g, '');
        
        // Check if mobile viewport for responsive styling
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile) {
            flavorDiv.innerHTML = `
                <p style="
                    font-style: italic; 
                    color: #555; 
                    margin: 4px 0; 
                    padding: 6px 8px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-left: 2px solid #6c757d;
                    border-radius: 3px;
                    font-size: 11px;
                    line-height: 1.3;
                    animation: fadeInSlide 0.3s ease-out;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    max-width: 100%;
                    box-sizing: border-box;
                ">${sanitizedText}</p>
            `;
        } else {
            flavorDiv.innerHTML = `
                <p style="
                    font-style: italic; 
                    color: #555; 
                    margin: 10px 0; 
                    padding: 8px 12px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-left: 3px solid #6c757d;
                    border-radius: 4px;
                    font-size: 13px;
                    line-height: 1.4;
                    animation: fadeInSlide 0.3s ease-out;
                ">${sanitizedText}</p>
            `;
        }
        
        roundResult.appendChild(flavorDiv);
        
        // Remove flavor text after 4 seconds (slightly longer for progressive text)
        setTimeout(() => {
            try {
                if (flavorDiv && flavorDiv.parentNode) {
                    // Fade out animation
                    flavorDiv.style.opacity = '0';
                    flavorDiv.style.transform = 'translateY(-10px)';
                    flavorDiv.style.transition = 'all 0.3s ease-out';
                    
                    setTimeout(() => {
                        if (flavorDiv.parentNode) {
                            flavorDiv.parentNode.removeChild(flavorDiv);
                        }
                    }, 300);
                }
            } catch (removeError) {
                console.warn('Error removing progressive flavor text:', removeError);
            }
        }, 4000);
        
    } catch (error) {
        console.error('Error displaying progressive flavor text:', error);
    }
}

// Update outcome message display with DMV-themed messaging
export function updateOutcomeMessage(outcome) {
    try {
        const dmvMessage = getDMVOutcomeMessage(outcome);
        const stressInsight = getStressManagementInsight(outcome);
        
        const roundResult = document.getElementById('roundResult');
        if (!roundResult) {
            console.warn('Round result element not found for outcome message');
            return;
        }
        
        // Clear previous content
        roundResult.innerHTML = '';
        
        // Create outcome message container
        const outcomeDiv = document.createElement('div');
        outcomeDiv.className = 'outcome-message dmv-themed';
        
        // Check if mobile viewport for responsive styling
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile) {
            outcomeDiv.innerHTML = `
                <div style="
                    padding: 8px 10px;
                    margin: 4px 0;
                    border-radius: 6px;
                    background: linear-gradient(135deg, #fff, #f8f9fa);
                    border: 1px solid #dee2e6;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    max-width: 100%;
                    box-sizing: border-box;
                ">
                    <p style="
                        font-size: 12px; 
                        font-weight: bold; 
                        margin: 0 0 6px 0;
                        color: #495057;
                        line-height: 1.3;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    ">${dmvMessage.replace(/[<>]/g, '')}</p>
                    <p style="
                        font-size: 10px;
                        color: #6c757d;
                        margin: 0;
                        font-style: italic;
                        line-height: 1.3;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    ">${stressInsight.replace(/[<>]/g, '')}</p>
                </div>
            `;
        } else {
            outcomeDiv.innerHTML = `
                <div style="
                    padding: 12px 16px;
                    margin: 10px 0;
                    border-radius: 8px;
                    background: linear-gradient(135deg, #fff, #f8f9fa);
                    border: 1px solid #dee2e6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                    <p style="
                        font-size: 14px; 
                        font-weight: bold; 
                        margin: 0 0 8px 0;
                        color: #495057;
                    ">${dmvMessage.replace(/[<>]/g, '')}</p>
                    <p style="
                        font-size: 12px;
                        color: #6c757d;
                        margin: 0;
                        font-style: italic;
                        line-height: 1.4;
                    ">${stressInsight.replace(/[<>]/g, '')}</p>
                </div>
            `;
        }
        
        roundResult.appendChild(outcomeDiv);
        
    } catch (error) {
        console.error('Error updating outcome message:', error);
        // Fallback to basic message
        const roundResult = document.getElementById('roundResult');
        if (roundResult) {
            roundResult.innerHTML = `
                <p style="font-size: 14px; font-weight: bold; margin: 8px 0;">
                    You're learning valuable stress management skills!
                </p>
            `;
        }
    }
}

// Show stress management tip based on outcome
export function showStressManagementTip(outcome) {
    try {
        const insight = getStressManagementInsight(outcome);
        if (!insight) {
            return;
        }
        
        // Create a temporary tip display
        const tipDiv = document.createElement('div');
        tipDiv.className = 'stress-tip';
        
        // Check if mobile viewport
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile) {
            tipDiv.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                right: 10px;
                background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                border: 1px solid #2196f3;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 11px;
                color: #1565c0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
                word-wrap: break-word;
                overflow-wrap: break-word;
                max-height: 80px;
                overflow-y: auto;
                line-height: 1.3;
            `;
        } else {
            tipDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                border: 1px solid #2196f3;
                border-radius: 8px;
                padding: 12px 16px;
                max-width: 300px;
                font-size: 12px;
                color: #1565c0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
            `;
        }
        
        tipDiv.innerHTML = `
            <strong>💡 Stress Management Tip:</strong><br>
            ${insight.replace(/[<>]/g, '')}
        `;
        
        document.body.appendChild(tipDiv);
        
        // Remove tip after 6 seconds
        setTimeout(() => {
            if (tipDiv.parentNode) {
                tipDiv.style.opacity = '0';
                tipDiv.style.transform = 'translateX(100%)';
                tipDiv.style.transition = 'all 0.3s ease-out';
                
                setTimeout(() => {
                    if (tipDiv.parentNode) {
                        tipDiv.parentNode.removeChild(tipDiv);
                    }
                }, 300);
            }
        }, 6000);
        
    } catch (error) {
        console.error('Error showing stress management tip:', error);
    }
}

// Store the element that had focus before initial flavor text modal opened
let previouslyFocusedElementForFlavorText = null;

// Store the element that had focus before deck viewer modal opened
let previouslyFocusedElementForDeckViewer = null;

// Show initial flavor text modal
export function showInitialFlavorText(stepIndex) {
    try {
        // Get flavor text data
        const flavorData = getInitialFlavorText(stepIndex);
        if (!flavorData) {
            console.warn('No flavor text data available for step', stepIndex);
            return;
        }
        
        // Store currently focused element
        previouslyFocusedElementForFlavorText = document.activeElement;
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'initialFlavorTextModal';
        modalOverlay.className = 'initial-flavor-modal-overlay';
        
        // Check if mobile viewport for responsive styling
        const isMobile = window.innerWidth <= 767;
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'initial-flavor-modal-content';
        
        if (isMobile) {
            modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: 10px;
                box-sizing: border-box;
                animation: fadeIn 0.3s ease-out;
            `;
            
            modalContent.style.cssText = `
                background: linear-gradient(135deg, #fff, #f8f9fa);
                border-radius: 12px;
                padding: 16px;
                max-width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                border: 2px solid #007bff;
                animation: slideInUp 0.3s ease-out;
                font-family: 'Comic Sans MS', sans-serif;
                box-sizing: border-box;
            `;
        } else {
            modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease-out;
            `;
            
            modalContent.style.cssText = `
                background: linear-gradient(135deg, #fff, #f8f9fa);
                border-radius: 16px;
                padding: 24px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                border: 3px solid #007bff;
                animation: slideInUp 0.3s ease-out;
                font-family: 'Comic Sans MS', sans-serif;
            `;
        }
        
        // Sanitize text content to prevent XSS
        const sanitizedTitle = flavorData.title.replace(/[<>]/g, '');
        const sanitizedText = flavorData.text.replace(/[<>]/g, '');
        const sanitizedTips = flavorData.tips.replace(/[<>]/g, '');
        
        // Create modal HTML content
        if (isMobile) {
            modalContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 12px;">
                    <h2 style="
                        color: #007bff; 
                        margin: 0 0 8px 0; 
                        font-size: 18px;
                        font-weight: bold;
                    ">${sanitizedTitle}</h2>
                </div>
                <div style="margin-bottom: 12px;">
                    <p style="
                        font-size: 13px; 
                        line-height: 1.4; 
                        color: #333; 
                        margin: 0 0 12px 0;
                        text-align: left;
                    ">${sanitizedText}</p>
                    <div style="
                        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                        border-left: 3px solid #2196f3;
                        padding: 8px 10px;
                        border-radius: 4px;
                        margin: 8px 0;
                    ">
                        <p style="
                            font-size: 11px;
                            color: #1565c0;
                            margin: 0;
                            font-style: italic;
                            line-height: 1.3;
                        "><strong>💡 Tip:</strong> ${sanitizedTips}</p>
                    </div>
                </div>
                <div style="text-align: center;">
                    <button id="continueFlavorTextBtn" style="
                        background: linear-gradient(135deg, #007bff, #0056b3);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        font-family: 'Comic Sans MS', sans-serif;
                        min-width: 120px;
                    ">Continue</button>
                </div>
            `;
        } else {
            modalContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 16px;">
                    <h2 style="
                        color: #007bff; 
                        margin: 0 0 12px 0; 
                        font-size: 24px;
                        font-weight: bold;
                    ">${sanitizedTitle}</h2>
                </div>
                <div style="margin-bottom: 20px;">
                    <p style="
                        font-size: 16px; 
                        line-height: 1.6; 
                        color: #333; 
                        margin: 0 0 16px 0;
                        text-align: left;
                    ">${sanitizedText}</p>
                    <div style="
                        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                        border-left: 4px solid #2196f3;
                        padding: 12px 16px;
                        border-radius: 6px;
                        margin: 12px 0;
                    ">
                        <p style="
                            font-size: 14px;
                            color: #1565c0;
                            margin: 0;
                            font-style: italic;
                        "><strong>💡 Tip:</strong> ${sanitizedTips}</p>
                    </div>
                </div>
                <div style="text-align: center;">
                    <button id="continueFlavorTextBtn" style="
                        background: linear-gradient(135deg, #007bff, #0056b3);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                        font-family: 'Comic Sans MS', sans-serif;
                        min-width: 140px;
                        transition: all 0.2s ease;
                    ">Continue</button>
                </div>
            `;
        }
        
        // Add hover effect for continue button (desktop only)
        if (!isMobile) {
            const continueBtn = modalContent.querySelector('#continueFlavorTextBtn');
            if (continueBtn) {
                continueBtn.addEventListener('mouseenter', () => {
                    continueBtn.style.transform = 'translateY(-2px)';
                    continueBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                });
                continueBtn.addEventListener('mouseleave', () => {
                    continueBtn.style.transform = '';
                    continueBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                });
            }
        }
        
        // Append modal to overlay and overlay to body
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Set up event listeners
        const continueBtn = document.getElementById('continueFlavorTextBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', hideInitialFlavorText);
            
            // Focus the continue button for accessibility
            setTimeout(() => {
                try {
                    continueBtn.focus();
                } catch (focusError) {
                    console.warn('Could not focus continue button:', focusError);
                }
            }, 100);
        }
        
        // Close on backdrop click
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                hideInitialFlavorText();
            }
        });
        
        // Keyboard navigation
        modalOverlay.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideInitialFlavorText();
            } else if (event.key === 'Enter' || event.key === ' ') {
                if (event.target === continueBtn) {
                    event.preventDefault();
                    hideInitialFlavorText();
                }
            }
        });
        
    } catch (error) {
        console.error('Error showing initial flavor text modal:', error);
        // Fallback: try to show a simple alert
        try {
            const flavorData = getInitialFlavorText(stepIndex);
            if (flavorData) {
                alert(`${flavorData.title}\n\n${flavorData.text}\n\nTip: ${flavorData.tips}`);
            }
        } catch (fallbackError) {
            console.error('Error showing fallback flavor text:', fallbackError);
        }
    }
}

// Hide initial flavor text modal
export function hideInitialFlavorText() {
    try {
        const modal = document.getElementById('initialFlavorTextModal');
        if (!modal) {
            return;
        }
        
        // Fade out animation
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            try {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            } catch (removeError) {
                console.warn('Error removing initial flavor text modal:', removeError);
            }
        }, 300);
        
        // Restore focus to previously focused element
        if (previouslyFocusedElementForFlavorText) {
            try {
                previouslyFocusedElementForFlavorText.focus();
            } catch (focusError) {
                console.warn('Could not restore focus:', focusError);
            }
            previouslyFocusedElementForFlavorText = null;
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Mark that initial flavor text has been shown for this step
        gameState.initialFlavorTextShown = true;
        
        // Enable game controls
        if (window.enableGameControls) {
            window.enableGameControls();
        }
        
    } catch (error) {
        console.error('Error hiding initial flavor text modal:', error);
        
        // Fallback: try to remove modal directly
        const modal = document.getElementById('initialFlavorTextModal');
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        gameState.initialFlavorTextShown = true;
        
        // Enable game controls
        if (window.enableGameControls) {
            window.enableGameControls();
        }
    }
}

// Deck Viewer Modal Functions
export function showDeckViewer() {
    try {
        const deckViewerModal = document.getElementById('deckViewerModal');
        if (!deckViewerModal) {
            console.error('Deck viewer modal element not found');
            return;
        }
        
        // Store currently focused element
        previouslyFocusedElementForDeckViewer = document.activeElement;
        
        // Update deck composition data
        updateDeckViewerContent();
        
        deckViewerModal.classList.remove('hidden');
        
        // Focus management for accessibility
        const closeBtn = document.getElementById('deckViewerCloseBtn');
        if (closeBtn) {
            setTimeout(() => {
                try {
                    closeBtn.focus();
                } catch (focusError) {
                    console.warn('Could not focus deck viewer close button:', focusError);
                }
            }, 100);
        }
        
        // Prevent body scroll when modal is open
        if (document.body) {
            document.body.style.overflow = 'hidden';
        }
        
        // Set up event listeners
        setupDeckViewerEventListeners();
        
    } catch (error) {
        console.error('Error showing deck viewer:', error);
    }
}

export function hideDeckViewer() {
    try {
        const deckViewerModal = document.getElementById('deckViewerModal');
        if (!deckViewerModal) {
            console.error('Deck viewer modal element not found');
            return;
        }
        
        deckViewerModal.classList.add('hidden');
        
        // Restore focus to previously focused element
        if (previouslyFocusedElementForDeckViewer) {
            try {
                previouslyFocusedElementForDeckViewer.focus();
            } catch (focusError) {
                console.warn('Could not restore focus:', focusError);
            }
            previouslyFocusedElementForDeckViewer = null;
        }
        
        // Restore body scroll
        if (document.body) {
            document.body.style.overflow = '';
        }
        
        // Clean up event listeners
        cleanupDeckViewerEventListeners();
        
    } catch (error) {
        console.error('Error hiding deck viewer:', error);
    }
}

function updateDeckViewerContent() {
    try {
        const { deckComposition, shopUpgrades } = campaignState;
        const { aces, jokers, totalCards } = deckComposition;
        const { acesAdded, jokersAdded, totalSpent } = shopUpgrades;
        
        // Debug logging
        console.log('Updating deck viewer with:', {
            aces,
            jokers,
            totalCards,
            jokersAdded,
            campaignState: campaignState
        });
        
        // Update card counts
        const jokerCountEl = document.getElementById('jokerCount');
        if (jokerCountEl) {
            jokerCountEl.textContent = jokers;
            console.log('Set joker count to:', jokers);
        } else {
            console.error('jokerCount element not found');
        }
        
        const aceCountEl = document.getElementById('aceCount');
        if (aceCountEl) {
            aceCountEl.textContent = aces;
        }
        
        const regularCountEl = document.getElementById('regularCount');
        if (regularCountEl) {
            regularCountEl.textContent = totalCards - aces - jokers;
        }
        
        // Update deck power level
        const specialCards = aces + jokers;
        const powerPercentage = Math.round((specialCards / totalCards) * 100);
        
        const deckPowerFill = document.getElementById('deckPowerFill');
        if (deckPowerFill) {
            deckPowerFill.style.width = `${powerPercentage}%`;
        }
        
        const deckPowerText = document.getElementById('deckPowerText');
        if (deckPowerText) {
            deckPowerText.textContent = `Power Level: ${powerPercentage}% (${specialCards} special cards out of ${totalCards})`;
        }
        
        // Update upgrade history
        const upgradeHistoryContent = document.getElementById('upgradeHistoryContent');
        if (upgradeHistoryContent) {
            let historyHtml = '<p>Base deck: 4 Aces + 48 Regular Cards</p>';
            
            if (jokersAdded > 0) {
                historyHtml += `<p>✨ Added ${jokersAdded} Wild Joker${jokersAdded > 1 ? 's' : ''}</p>`;
            }
            
            if (acesAdded > 0) {
                historyHtml += `<p>🂡 Added ${acesAdded} extra Ace${acesAdded > 1 ? 's' : ''}</p>`;
            }
            
            if (totalSpent > 0) {
                historyHtml += `<p>💎 Total zen points invested: ${totalSpent}</p>`;
            }
            
            if (jokersAdded === 0 && acesAdded === 0) {
                historyHtml += '<p>No upgrades purchased yet. Visit the shop to enhance your deck!</p>';
            }
            
            upgradeHistoryContent.innerHTML = historyHtml;
        }
        
    } catch (error) {
        console.error('Error updating deck viewer content:', error);
    }
}

function setupDeckViewerEventListeners() {
    const closeBtn = document.getElementById('deckViewerCloseBtn');
    const backdrop = document.getElementById('deckViewerBackdrop');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideDeckViewer);
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', hideDeckViewer);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleDeckViewerKeydown);
}

function cleanupDeckViewerEventListeners() {
    const closeBtn = document.getElementById('deckViewerCloseBtn');
    const backdrop = document.getElementById('deckViewerBackdrop');
    
    if (closeBtn) {
        closeBtn.removeEventListener('click', hideDeckViewer);
    }
    
    if (backdrop) {
        backdrop.removeEventListener('click', hideDeckViewer);
    }
    
    document.removeEventListener('keydown', handleDeckViewerKeydown);
}

function handleDeckViewerKeydown(event) {
    const deckViewerModal = document.getElementById('deckViewerModal');
    if (!deckViewerModal || deckViewerModal.classList.contains('hidden')) {
        return;
    }
    
    if (event.key === 'Escape') {
        hideDeckViewer();
    }
}