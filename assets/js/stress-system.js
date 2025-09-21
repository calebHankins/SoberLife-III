// SoberLife III - Stress System
// Stress management and zen activities

import { gameState, updateGameState } from './game-state.js';
import { updateDisplay, updateZenActivities } from './ui-manager.js';

// Zen activity definitions
export const zenActivities = {
    breath: { 
        cost: 10, 
        reduction: 10,
        name: 'Deep Breath',
        emoji: '🌬️'
    },
    stretch: { 
        cost: 25, 
        reduction: 20,
        name: 'Quick Stretch',
        emoji: '🤸'
    },
    meditation: { 
        cost: 50, 
        reduction: 35,
        name: 'Mini Meditation',
        emoji: '🧘'
    }
};

// Use a zen activity to reduce stress
export function useZenActivity(activity) {
    const activityConfig = zenActivities[activity];
    if (!activityConfig) return;

    let cost = activityConfig.cost;
    let stressReduction = activityConfig.reduction;

    // Check if player has enough zen points
    if (gameState.zenPoints < cost) {
        return;
    }

    // Deduct zen points and reduce stress
    updateGameState({
        zenPoints: Math.max(0, gameState.zenPoints - cost),
        stressLevel: Math.max(0, gameState.stressLevel - stressReduction)
    });

    // Update display
    updateDisplay();
    updateZenActivities();

    // Show feedback message
    showZenActivityFeedback(activityConfig.name, stressReduction);
}

// Show feedback when zen activity is used
function showZenActivityFeedback(activityName, stressReduction) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = `${activityName}: -${stressReduction}% stress!`;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #2ECC71, #27AE60);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 18px;
        z-index: 2000;
        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        animation: zenFeedback 2s ease-out forwards;
    `;

    // Add animation keyframes if not already present
    if (!document.querySelector('#zenFeedbackStyle')) {
        const style = document.createElement('style');
        style.id = 'zenFeedbackStyle';
        style.textContent = `
            @keyframes zenFeedback {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                40% { transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -60%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(feedback);

    // Remove feedback after animation
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
}

// Update stress level (can be positive or negative change)
export function updateStressLevel(change) {
    const newStressLevel = Math.max(0, Math.min(100, gameState.stressLevel + change));
    updateGameState({ stressLevel: newStressLevel });
    updateDisplay();
    
    // Check for game over condition
    if (newStressLevel >= 100) {
        return true; // Indicates game over
    }
    return false;
}

// Calculate initial stress from survey responses
export function calculateSurveyStress() {
    const surveyInputs = document.querySelectorAll('input[type="radio"]:checked');
    let initialStress = 0;

    surveyInputs.forEach(input => {
        initialStress += parseInt(input.value);
    });

    // Calculate zen points based on survey (inverse relationship with stress)
    const baseZenPoints = 150;
    const zenPoints = Math.max(50, baseZenPoints - initialStress);

    return {
        stressLevel: Math.min(initialStress, 50), // Cap initial stress at 50%
        zenPoints: zenPoints
    };
}