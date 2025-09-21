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