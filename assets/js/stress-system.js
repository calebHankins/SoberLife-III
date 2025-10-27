// SoberLife III - Stress System
// Stress management and zen activities

import { gameState, updateGameState, activityState, canUseActivity, markActivityUsed, campaignState, updateCampaignState } from './game-state.js';
import { calculateScore, getCardValue } from './card-system.js';
import { updateDisplay, updateZenActivities } from './ui-manager.js';
import { ZenPointsManager, ZEN_TRANSACTION_TYPES } from './zen-points-manager.js';

// Zen activity definitions
export const zenActivities = {
    // Default activities (always available)
    breath: {
        cost: 10,
        reduction: 10,
        name: 'Deep Breath',
        emoji: '🌬️',
        type: 'default',
        description: 'A quick breathing exercise to center yourself'
    },
    stretch: {
        cost: 25,
        reduction: 20,
        name: 'Quick Stretch',
        emoji: '🤸',
        type: 'default',
        description: 'Gentle stretching to release physical tension'
    },
    meditation: {
        cost: 50,
        reduction: 35,
        name: 'Mini Meditation',
        emoji: '🧘',
        type: 'default',
        description: 'Brief mindfulness practice for mental clarity'
    },
    // Premium activities (purchasable)
    mindfulBreathing: {
        cost: 75,
        reduction: 50,
        name: 'Mindful Breathing',
        emoji: '🌸',
        type: 'premium',
        description: 'Advanced breathing technique with focused awareness for significant stress relief'
    },
    compartmentalize: {
        cost: 100,
        reduction: 0,  // Special - doesn't reduce stress, prevents bust
        name: 'Compartmentalize',
        emoji: '🧠',
        type: 'reactive',
        description: 'Split overwhelming situations into manageable parts - can be used to recover from bust'
    }
};

// Use a zen activity to reduce stress
export function useZenActivity(activity, isCompartmentalize = false) {
    const activityConfig = zenActivities[activity];
    if (!activityConfig) {
        return { success: false, reason: 'invalid_activity' };
    }

    // Check cooldown unless this is a compartmentalize call
    if (!isCompartmentalize && !canUseActivity(activity)) {
        if (activityState.usedThisHand) {
            return { success: false, reason: 'cooldown', message: 'Activities are on cooldown until next hand' };
        }
        if (!activityState.availableActivities[activity]) {
            return { success: false, reason: 'locked', message: 'This activity must be purchased in the shop first' };
        }
    }

    let cost = activityConfig.cost;
    let stressReduction = activityConfig.reduction;

    // Check if player has enough zen points using the manager
    const currentBalance = ZenPointsManager.getCurrentBalance();
    if (currentBalance < cost) {
        return { success: false, reason: 'insufficient_funds', message: `Need ${cost} zen points (have ${currentBalance})` };
    }

    // Special handling for compartmentalize
    if (activity === 'compartmentalize') {
        return handleCompartmentalize();
    }

    // Spend zen points using the manager
    const success = ZenPointsManager.spendPoints(cost, ZEN_TRANSACTION_TYPES.ZEN_ACTIVITY, true, {
        activity: activity,
        stressReduction: stressReduction
    });

    if (!success) {
        console.warn('Failed to spend zen points for activity:', activity);
        return { success: false, reason: 'transaction_failed' };
    }

    // Mark activity as used for this hand
    markActivityUsed();

    // Update activity statistics
    updateCampaignState({
        activityStats: {
            ...campaignState.activityStats,
            totalActivitiesUsed: campaignState.activityStats.totalActivitiesUsed + 1,
            premiumActivityUses: activityConfig.type === 'premium' ?
                campaignState.activityStats.premiumActivityUses + 1 :
                campaignState.activityStats.premiumActivityUses
        }
    });

    // Reduce stress
    const oldStressLevel = gameState.stressLevel;
    const newStressLevel = Math.max(0, gameState.stressLevel - stressReduction);
    updateGameState({
        stressLevel: newStressLevel
    });

    // Dispatch stress level change event for adaptive music
    if (oldStressLevel !== newStressLevel) {
        document.dispatchEvent(new CustomEvent('stressLevelChanged', {
            detail: { oldLevel: oldStressLevel, newLevel: newStressLevel }
        }));
    }

    // Play zen completion sound effect
    if (window.audioManager && window.audioManager.soundEffects) {
        window.audioManager.soundEffects.play('zenComplete');
    }

    // Update display
    updateDisplay();
    updateZenActivities();

    // Update adaptive music to match new stress level
    if (window.audioManager && window.audioManager.musicPlayer && window.audioManager.musicPlayer.updateStressLevel) {
        window.audioManager.musicPlayer.updateStressLevel(newStressLevel);
        console.log(`Stress System: Updated adaptive music for new stress level: ${newStressLevel}%`);
    }

    // Show feedback message
    showZenActivityFeedback(activityConfig.name, stressReduction);

    return {
        success: true,
        stressReduction: stressReduction,
        message: `${activityConfig.name}: -${stressReduction}% stress!`
    };
}

// Handle compartmentalize special activity
export function handleCompartmentalize() {

    const playerCards = gameState.playerCards;

    // Validate bust condition
    if (calculateScore(playerCards) <= 21) {
        return { success: false, reason: 'not_busted', message: 'Compartmentalize can only be used when you have busted' };
    }

    const cost = zenActivities.compartmentalize.cost;
    const currentBalance = ZenPointsManager.getCurrentBalance();

    if (currentBalance < cost) {
        return { success: false, reason: 'insufficient_funds', message: `Need ${cost} zen points (have ${currentBalance})` };
    }

    // Spend zen points
    const success = ZenPointsManager.spendPoints(cost, ZEN_TRANSACTION_TYPES.ZEN_ACTIVITY, true, {
        activity: 'compartmentalize',
        type: 'bust_recovery'
    });

    if (!success) {
        return { success: false, reason: 'transaction_failed' };
    }

    // Mark activity as used
    markActivityUsed();

    // Split the hand into two manageable hands
    const splitResult = splitBustedHand(playerCards);

    // Update activity state for split hand play
    activityState.compartmentalizeInProgress = true;
    activityState.splitHands = splitResult;

    // Update statistics
    updateCampaignState({
        activityStats: {
            ...campaignState.activityStats,
            totalActivitiesUsed: campaignState.activityStats.totalActivitiesUsed + 1,
            compartmentalizeUses: campaignState.activityStats.compartmentalizeUses + 1
        }
    });

    // Reduce stress from successful compartmentalization
    updateGameState({
        stressLevel: Math.max(0, gameState.stressLevel - 25) // Moderate stress reduction for the technique
    });

    return {
        success: true,
        splitHands: splitResult,
        message: 'You compartmentalize the overwhelming situation into manageable parts!',
        stressReduction: 25
    };
}

// Split a busted hand into two manageable hands
function splitBustedHand(cards) {

    const hand1 = [];
    const hand2 = [];
    let hand1Score = 0;
    let hand2Score = 0;

    // Sort cards by value for optimal distribution
    const sortedCards = [...cards].sort((a, b) => getCardValue(a) - getCardValue(b));

    // Distribute cards to keep both hands under 21 if possible
    for (const card of sortedCards) {
        const cardValue = getCardValue(card);

        if (hand1Score + cardValue <= 21 && hand1Score <= hand2Score) {
            hand1.push(card);
            hand1Score += cardValue;
        } else if (hand2Score + cardValue <= 21) {
            hand2.push(card);
            hand2Score += cardValue;
        } else {
            // If both would bust, add to the hand with lower score
            if (hand1Score <= hand2Score) {
                hand1.push(card);
                hand1Score += cardValue;
            } else {
                hand2.push(card);
                hand2Score += cardValue;
            }
        }
    }

    return {
        hand1: { cards: hand1, score: hand1Score, active: true, completed: false },
        hand2: { cards: hand2, score: hand2Score, active: false, completed: false },
        currentHand: 0
    };
}

// Switch between split hands
export function switchSplitHand() {
    if (!activityState.compartmentalizeInProgress || !activityState.splitHands) {
        return false;
    }

    const splitHands = activityState.splitHands;
    const currentHand = splitHands.currentHand;
    const nextHand = currentHand === 0 ? 1 : 0;

    // Mark current hand as inactive
    if (currentHand === 0) {
        splitHands.hand1.active = false;
        splitHands.hand2.active = true;
    } else {
        splitHands.hand2.active = false;
        splitHands.hand1.active = true;
    }

    splitHands.currentHand = nextHand;
    return true;
}

// Get the currently active split hand
export function getActiveSplitHand() {
    if (!activityState.compartmentalizeInProgress || !activityState.splitHands) {
        return null;
    }

    const splitHands = activityState.splitHands;
    return splitHands.currentHand === 0 ? splitHands.hand1 : splitHands.hand2;
}

// Complete the current split hand
export function completeSplitHand(outcome) {
    if (!activityState.compartmentalizeInProgress || !activityState.splitHands) {
        return false;
    }

    const splitHands = activityState.splitHands;
    const currentHandData = getActiveSplitHand();

    if (currentHandData) {
        currentHandData.completed = true;
        currentHandData.outcome = outcome;
    }

    // Check if both hands are completed
    if (splitHands.hand1.completed && splitHands.hand2.completed) {
        return finalizeSplitHandResults();
    }

    // Switch to the other hand if it's not completed
    const otherHand = splitHands.currentHand === 0 ? splitHands.hand2 : splitHands.hand1;
    if (!otherHand.completed) {
        switchSplitHand();
        // Update game state to use the other hand's cards
        updateGameState({
            playerCards: otherHand.cards
        });
    }

    return false; // Not fully completed yet
}

// Finalize split hand results and determine overall outcome
function finalizeSplitHandResults() {
    const splitHands = activityState.splitHands;
    const hand1Result = splitHands.hand1.outcome;
    const hand2Result = splitHands.hand2.outcome;

    // Determine overall outcome based on both hands
    let overallOutcome;
    if (hand1Result === 'win' || hand2Result === 'win' ||
        hand1Result === 'house_bust' || hand2Result === 'house_bust') {
        overallOutcome = 'win'; // At least one hand won
    } else if (hand1Result === 'tie' && hand2Result === 'tie') {
        overallOutcome = 'tie'; // Both hands tied
    } else if ((hand1Result === 'tie' && hand2Result !== 'bust') ||
        (hand2Result === 'tie' && hand1Result !== 'bust')) {
        overallOutcome = 'tie'; // One tie, one non-bust
    } else {
        overallOutcome = 'lose'; // Both hands lost or busted
    }

    // Store split hands data for final display BEFORE clearing state
    const splitHandsData = {
        hand1Cards: splitHands.hand1.cards,
        hand2Cards: splitHands.hand2.cards,
        hand1Score: calculateScore(splitHands.hand1.cards),
        hand2Score: calculateScore(splitHands.hand2.cards)
    };

    // Set flag for compartmentalized display
    updateGameState({
        showCompartmentalizedResult: true,
        compartmentalizedHands: splitHandsData,
        playerCards: [...splitHands.hand1.cards, ...splitHands.hand2.cards] // Restore original cards for display
    });

    // Reset compartmentalize state
    activityState.compartmentalizeInProgress = false;
    activityState.splitHands = null;

    return {
        completed: true,
        overallOutcome: overallOutcome,
        hand1Result: hand1Result,
        hand2Result: hand2Result,
        splitHandsData: splitHandsData,
        message: `Compartmentalization complete! Hand 1: ${hand1Result}, Hand 2: ${hand2Result} → Overall: ${overallOutcome}`
    };
}

// Show feedback when zen activity is used
export function showZenActivityFeedback(activityName, stressReduction) {
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
    const oldStressLevel = gameState.stressLevel;
    const newStressLevel = Math.max(0, Math.min(100, gameState.stressLevel + change));
    updateGameState({ stressLevel: newStressLevel });
    updateDisplay();

    // Dispatch stress level change event for adaptive music
    if (oldStressLevel !== newStressLevel) {
        document.dispatchEvent(new CustomEvent('stressLevelChanged', {
            detail: { oldLevel: oldStressLevel, newLevel: newStressLevel }
        }));
    }

    // Check for game over condition
    if (newStressLevel >= 100) {
        return true; // Indicates game over
    }
    return false;
}

// Calculate initial stress from survey responses
export function calculateSurveyStress() {
    const surveyInputs = document.querySelectorAll('input[type="radio"]:checked');
    let surveyStress = 0;

    surveyInputs.forEach(input => {
        surveyStress += parseInt(input.value);
    });

    // Calculate base stress from survey (cap at 50%)
    let baseStress = Math.min(surveyStress, 50);

    // Add stress carryover from previous task in campaign mode
    let carryoverStress = 0;
    if (typeof window !== 'undefined' && window.isCampaignMode && window.isCampaignMode()) {
        // Access campaign state directly since it's already imported
        // Calculate carryover as 30% of previous stress level
        carryoverStress = Math.floor(campaignState.previousStressLevel * 0.3);

        console.log(`Stress carryover: ${campaignState.previousStressLevel} → ${carryoverStress} (30%)`);
    }

    // Combine survey stress with carryover, but cap total at 60%
    const totalStress = Math.min(baseStress + carryoverStress, 60);

    // Calculate zen points based on survey only (not affected by carryover)
    const baseZenPoints = 150;
    const zenPoints = Math.max(50, baseZenPoints - surveyStress);

    console.log(`Stress calculation: Survey=${baseStress}, Carryover=${carryoverStress}, Total=${totalStress}`);

    return {
        stressLevel: totalStress,
        zenPoints: zenPoints,
        surveyStress: baseStress,
        carryoverStress: carryoverStress
    };
}