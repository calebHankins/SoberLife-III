// SoberLife III - Stress System
// Stress management and zen activities

import { gameState, updateGameState } from './game-state.js';
import { updateDisplay, updateZenActivities } from './ui-manager.js';
import { ZenPointsManager, ZEN_TRANSACTION_TYPES } from './zen-points-manager.js';

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

    // Check if player has enough zen points using the manager
    const currentBalance = ZenPointsManager.getCurrentBalance();
    if (currentBalance < cost) {
        return;
    }

    // Spend zen points using the manager
    const success = ZenPointsManager.spendPoints(cost, ZEN_TRANSACTION_TYPES.ZEN_ACTIVITY, true, {
        activity: activity,
        stressReduction: stressReduction
    });

    if (!success) {
        console.warn('Failed to spend zen points for activity:', activity);
        return;
    }

    // Reduce stress
    updateGameState({
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
    // Create popup notification using the same system as game results
    const popup = document.createElement('div');
    popup.className = 'popup-notification stress-decrease';
    popup.textContent = `${activityName}: -${stressReduction}% stress!`;

    document.body.appendChild(popup);

    // Remove popup after animation completes
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
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