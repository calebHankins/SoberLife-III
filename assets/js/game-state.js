// SoberLife III - Game State Management
// Central state management and data structures

// Game state object
export let gameState = {
    currentStep: 0,
    zenPoints: 100,
    stressLevel: 0,
    gameInProgress: false,
    deck: [],
    playerCards: [],
    houseCards: [],
    surveyCompleted: false
};

// DMV task steps
export const steps = [
    "Check in at the front desk",
    "Wait in line for your number to be called",
    "Present documents to clerk",
    "Take photo for Real ID",
    "Pay renewal fee and receive temporary license"
];

// Contextual action mappings for each DMV step
export const contextualActions = {
    0: { // Check in at the front desk
        hit: {
            text: "Ask Questions",
            description: "Ask the clerk about required documents and procedures",
            flavorText: "You decide to gather more information before proceeding"
        },
        stand: {
            text: "Wait Patiently",
            description: "Stand quietly and wait for instructions",
            flavorText: "You choose to observe and wait for the right moment"
        }
    },
    1: { // Wait in line for your number to be called
        hit: {
            text: "Check Status",
            description: "Look at the display board or ask about wait times",
            flavorText: "You actively monitor your position in the queue"
        },
        stand: {
            text: "Stay Calm",
            description: "Remain patient and practice mindfulness while waiting",
            flavorText: "You maintain your composure and wait peacefully"
        }
    },
    2: { // Present documents to clerk
        hit: {
            text: "Double Check",
            description: "Review your documents one more time before submitting",
            flavorText: "You carefully verify everything is in order"
        },
        stand: {
            text: "Submit Now",
            description: "Hand over your documents with confidence",
            flavorText: "You trust your preparation and proceed confidently"
        }
    },
    3: { // Take photo for Real ID
        hit: {
            text: "Ask for Retake",
            description: "Request to retake the photo if you're not satisfied",
            flavorText: "You want to make sure your photo looks good"
        },
        stand: {
            text: "Accept Photo",
            description: "Accept the photo as is and move forward",
            flavorText: "You're satisfied with the result and ready to continue"
        }
    },
    4: { // Pay renewal fee and receive temporary license
        hit: {
            text: "Verify Details",
            description: "Double-check all information on your temporary license",
            flavorText: "You carefully review everything before leaving"
        },
        stand: {
            text: "Complete Visit",
            description: "Accept everything and finish your DMV visit",
            flavorText: "You're ready to wrap up and head home"
        }
    }
};

// Success messages for game completion
export const successMessages = [
    {
        main: "You did it! You actually survived the DMV!",
        sub: "Your zen mastery has reached legendary status. You've conquered the ultimate bureaucratic challenge!",
        stats: "Final stress level: LOW • Zen points remaining: HIGH • DMV steps completed: ALL 5!"
    },
    {
        main: "DMV CHAMPION! 🏆",
        sub: "You navigated the labyrinth of government bureaucracy with grace and wisdom. Truly impressive!",
        stats: "You maintained your cool through every step and emerged victorious!"
    },
    {
        main: "Zen Master Achievement Unlocked! 🧘‍♀️",
        sub: "You've proven that even the most stressful situations can be handled with mindfulness and strategy.",
        stats: "Your stress management skills are now at expert level!"
    },
    {
        main: "Mission Accomplished! ✅",
        sub: "Real ID obtained, license renewed, sanity intact. You're ready for anything life throws at you!",
        stats: "You've successfully completed one of life's most challenging quests!"
    }
];

// State update functions
export function updateGameState(updates) {
    Object.assign(gameState, updates);
}

export function resetGameState() {
    gameState.currentStep = 0;
    gameState.zenPoints = 100;
    gameState.stressLevel = 0;
    gameState.gameInProgress = false;
    gameState.deck = [];
    gameState.playerCards = [];
    gameState.houseCards = [];
    gameState.surveyCompleted = false;
}

export function generateSuccessMessage() {
    const randomIndex = Math.floor(Math.random() * successMessages.length);
    return successMessages[randomIndex];
}

// Contextual action management functions with error handling
export function getCurrentContextualActions() {
    try {
        const currentStepActions = contextualActions[gameState.currentStep];
        if (!currentStepActions || typeof currentStepActions !== 'object') {
            console.warn(`No contextual actions found for step ${gameState.currentStep}, using fallback`);
            return getFallbackActions();
        }
        return currentStepActions;
    } catch (error) {
        console.error('Error getting contextual actions:', error);
        return getFallbackActions();
    }
}

export function getContextualActionText(action) {
    try {
        const actions = getCurrentContextualActions();
        if (actions && actions[action] && actions[action].text) {
            return actions[action].text;
        }
        console.warn(`No text found for action ${action}, using fallback`);
        return getFallbackActionText(action);
    } catch (error) {
        console.error('Error getting contextual action text:', error);
        return getFallbackActionText(action);
    }
}

export function getContextualActionDescription(action) {
    try {
        const actions = getCurrentContextualActions();
        if (actions && actions[action] && actions[action].description) {
            return actions[action].description;
        }
        return getFallbackActionDescription(action);
    } catch (error) {
        console.error('Error getting contextual action description:', error);
        return getFallbackActionDescription(action);
    }
}

export function getContextualFlavorText(action) {
    try {
        const actions = getCurrentContextualActions();
        if (actions && actions[action] && actions[action].flavorText) {
            return actions[action].flavorText;
        }
        return getFallbackFlavorText(action);
    } catch (error) {
        console.error('Error getting contextual flavor text:', error);
        return getFallbackFlavorText(action);
    }
}

// Fallback functions
function getFallbackActions() {
    return {
        hit: {
            text: "Hit",
            description: "Take another card",
            flavorText: "You decide to take more risk"
        },
        stand: {
            text: "Stand",
            description: "Keep your current total",
            flavorText: "You choose to play it safe"
        }
    };
}

function getFallbackActionText(action) {
    return action === 'hit' ? 'Hit' : 'Stand';
}

function getFallbackActionDescription(action) {
    return action === 'hit' ? 'Take another card' : 'Keep your current total';
}

function getFallbackFlavorText(action) {
    return action === 'hit' ? 'You decide to take more risk' : 'You choose to play it safe';
}