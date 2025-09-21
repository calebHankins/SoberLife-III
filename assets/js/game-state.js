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
    surveyCompleted: false,
    initialFlavorTextShown: false
};

// Track hit count per hand for progressive flavor text
export let handState = {
    hitCount: 0,
    currentHand: 0,
    lastAction: ''
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

// DMV-themed outcome messages replacing blackjack terminology
export const dmvOutcomeMessages = {
    win: [
        "✅ You handled that step perfectly! Your preparation and patience paid off.",
        "🎯 Excellent work! You navigated the bureaucracy like a pro.",
        "💪 Great job staying calm under pressure. The DMV staff appreciated your approach.",
        "🌟 Outstanding! You turned a potentially stressful situation into a success.",
        "👏 Well done! Your mindful approach made all the difference."
    ],
    lose: [
        "📋 The process got a bit overwhelming this time. Take a breath and regroup.",
        "⏰ The timing wasn't quite right. Sometimes these things take patience.",
        "🔄 That step didn't go as planned. Let's try a different approach.",
        "💭 No worries - even experienced DMV visitors have challenging moments.",
        "🎯 Close, but not quite there. You're learning valuable lessons about persistence."
    ],
    tie: [
        "⚖️ You held your ground well. Sometimes persistence is the key.",
        "🤝 A balanced approach - you're learning to work with the system.",
        "⏳ Patience is paying off. You're getting the hang of this process.",
        "🎭 You matched the pace perfectly. That's good situational awareness.",
        "🧘 Steady progress - you're maintaining your composure beautifully."
    ],
    bust: [
        "😰 The stress got to you this time. Remember to use your zen techniques!",
        "🌪️ You got caught up in the moment. Deep breathing can help reset your focus.",
        "⚡ The pressure built up too quickly. Next time, try pacing yourself.",
        "🎢 The bureaucratic rollercoaster got intense! Time for some mindfulness.",
        "🔥 Things heated up fast. Remember, you have tools to manage this stress."
    ],
    house_bust: [
        "🎉 The system worked in your favor! Sometimes patience is rewarded.",
        "✨ Perfect timing! Your calm approach let things fall into place.",
        "🍀 The bureaucratic stars aligned for you this time!",
        "🎊 Excellent! The DMV process actually went smoothly for once.",
        "🌈 What a pleasant surprise! Your zen approach created positive energy."
    ]
};

// Progressive flavor text for multiple hits per hand
export const progressiveFlavorText = {
    0: { // Check in at the front desk
        hit: [
            "You decide to gather more information before proceeding",
            "You ask a follow-up question to make sure you understand",
            "You double-check one more detail to be absolutely certain",
            "You politely request clarification on the next steps",
            "You take a moment to organize your thoughts and documents"
        ],
        stand: [
            "You choose to observe and wait for the right moment",
            "You practice patience while the clerk finishes with others",
            "You use this time to center yourself and stay calm"
        ]
    },
    1: { // Wait in line
        hit: [
            "You actively monitor your position in the queue",
            "You check the display board again for any updates",
            "You glance around to see how the line is moving",
            "You notice other people's strategies and learn from them",
            "You use this time to practice your breathing exercises"
        ],
        stand: [
            "You maintain your composure and wait peacefully",
            "You find a comfortable stance and practice mindfulness",
            "You accept the wait time and use it for mental preparation"
        ]
    },
    2: { // Present documents
        hit: [
            "You carefully verify everything is in order",
            "You organize your papers one more time",
            "You make sure you haven't missed any required documents",
            "You double-check that all forms are properly filled out",
            "You arrange everything in the exact order requested"
        ],
        stand: [
            "You trust your preparation and proceed confidently",
            "You present your documents with quiet assurance",
            "You maintain calm confidence in your thoroughness"
        ]
    },
    3: { // Take photo
        hit: [
            "You want to make sure your photo looks good",
            "You adjust your posture slightly for a better shot",
            "You take a moment to compose yourself for the camera",
            "You ask about the lighting to ensure the best result",
            "You practice your most natural, relaxed expression"
        ],
        stand: [
            "You're satisfied with the result and ready to continue",
            "You accept the photo with grace and move forward",
            "You trust that the photo captures you well enough"
        ]
    },
    4: { // Pay fee and receive license
        hit: [
            "You carefully review everything before leaving",
            "You double-check all the information on your temporary license",
            "You make sure you understand the next steps in the process",
            "You verify that all details are correct and complete",
            "You ask about when your permanent license will arrive"
        ],
        stand: [
            "You're ready to wrap up and head home",
            "You complete the process with satisfaction",
            "You finish with a sense of accomplishment"
        ]
    }
};

// Initial flavor text for each DMV step
export const initialFlavorText = {
    0: {
        title: "Entering the DMV",
        text: "You walk through the heavy glass doors into the familiar fluorescent-lit world of the Department of Motor Vehicles. The air conditioning hums overhead as you take in the scene: numbered tickets, waiting areas filled with plastic chairs, and that distinctive government building atmosphere. Your heart rate picks up slightly as you approach the front desk, knowing this is just the beginning of your Real ID renewal journey.",
        stressTriggers: ["bureaucracy", "waiting", "paperwork"],
        tips: "Take a deep breath and remember - you've prepared for this. Everyone here is just trying to help you get what you need."
    },
    1: {
        title: "The Waiting Game",
        text: "You've got your number: B47. The digital display shows they're currently serving B23. The math isn't encouraging. Around you, other people shift in their seats, check their phones, and occasionally glance at the display with varying degrees of patience. Some look zen-like in their acceptance, others tap their feet anxiously. The clock on the wall seems to be moving in slow motion.",
        stressTriggers: ["waiting", "uncertainty", "time pressure"],
        tips: "This is perfect time to practice mindfulness. Use this waiting period as an opportunity to center yourself."
    },
    2: {
        title: "Document Showdown",
        text: "Your number is finally called! You approach the clerk's window with your carefully organized folder of documents. The clerk looks up with the practiced efficiency of someone who's seen thousands of Real ID applications. They gesture to the document slot and wait expectantly. This is the moment of truth - do you have everything they need? Your preparation is about to be put to the test.",
        stressTriggers: ["scrutiny", "preparation anxiety", "authority figures"],
        tips: "Trust your preparation. You've double-checked everything. Stay calm and present your documents confidently."
    },
    3: {
        title: "Picture Perfect Pressure",
        text: "The clerk reviews your documents with practiced eyes, occasionally making notes or stamps. Everything seems to be in order - relief! Now comes the photo station. The camera setup looks intimidating, and you know this picture will be on your ID for years to come. The photographer adjusts the height and asks you to step forward. The bright lights make you squint slightly. 'Look here and try to relax,' they say, which somehow makes relaxing feel impossible.",
        stressTriggers: ["performance anxiety", "appearance concerns", "bright lights"],
        tips: "Remember, everyone looks a bit awkward in DMV photos. Just be yourself and breathe naturally."
    },
    4: {
        title: "The Final Stretch",
        text: "Photo taken, documents approved - you're in the home stretch! The clerk hands you a receipt and explains the next steps. Your temporary license is printing, and your Real ID will arrive by mail in 7-10 business days. There's a sense of accomplishment building as you realize you've successfully navigated the entire process. The end is in sight, but there are still a few final details to confirm before you can walk out those doors as a DMV victor.",
        stressTriggers: ["final details", "completion anxiety", "information overload"],
        tips: "You've made it this far! Take a moment to appreciate your persistence and patience throughout this process."
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
    gameState.initialFlavorTextShown = false;
    resetHandState();
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

// Hand state management functions
export function resetHandState() {
    handState.hitCount = 0;
    handState.currentHand = Date.now(); // Use timestamp as unique hand ID
    handState.lastAction = '';
}

export function incrementHitCount() {
    handState.hitCount++;
    handState.lastAction = 'hit';
}

export function setLastAction(action) {
    handState.lastAction = action;
}

// Progressive flavor text system
export function getProgressiveFlavorText(action, step, hitCount) {
    try {
        // Validate inputs
        if (typeof step !== 'number' || step < 0 || step >= steps.length) {
            console.warn(`Invalid step index: ${step}, using fallback`);
            return getFallbackProgressiveFlavorText(action, hitCount);
        }
        
        if (!progressiveFlavorText[step] || !progressiveFlavorText[step][action]) {
            console.warn(`No progressive flavor text found for step ${step}, action ${action}`);
            return getFallbackProgressiveFlavorText(action, hitCount);
        }
        
        const flavorArray = progressiveFlavorText[step][action];
        if (!Array.isArray(flavorArray) || flavorArray.length === 0) {
            console.warn(`Invalid flavor text array for step ${step}, action ${action}`);
            return getFallbackProgressiveFlavorText(action, hitCount);
        }
        
        // Use hit count to select appropriate flavor text, cycling if needed
        const index = Math.min(hitCount, flavorArray.length - 1);
        return flavorArray[index];
        
    } catch (error) {
        console.error('Error getting progressive flavor text:', error);
        return getFallbackProgressiveFlavorText(action, hitCount);
    }
}

// DMV outcome message system
export function getDMVOutcomeMessage(outcome) {
    try {
        if (!dmvOutcomeMessages[outcome] || !Array.isArray(dmvOutcomeMessages[outcome])) {
            console.warn(`No DMV outcome messages found for: ${outcome}`);
            return getFallbackDMVOutcomeMessage(outcome);
        }
        
        const messages = dmvOutcomeMessages[outcome];
        if (messages.length === 0) {
            return getFallbackDMVOutcomeMessage(outcome);
        }
        
        // Return random message for variety
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
        
    } catch (error) {
        console.error('Error getting DMV outcome message:', error);
        return getFallbackDMVOutcomeMessage(outcome);
    }
}

// Fallback functions for progressive flavor text and DMV outcomes
function getFallbackProgressiveFlavorText(action, hitCount) {
    const fallbackMessages = {
        hit: [
            "You decide to take another approach",
            "You try a different strategy this time",
            "You persist with your current approach",
            "You continue working through the process",
            "You stay focused on your goal"
        ],
        stand: [
            "You choose to proceed as planned",
            "You stick with your current approach",
            "You maintain your steady course"
        ]
    };
    
    const messages = fallbackMessages[action] || fallbackMessages.hit;
    const index = Math.min(hitCount, messages.length - 1);
    return messages[index];
}

function getFallbackDMVOutcomeMessage(outcome) {
    const fallbackMessages = {
        win: "✅ You handled that step well! Your approach was effective.",
        lose: "📋 That step was challenging. Take a moment to regroup and try again.",
        tie: "⚖️ You're making steady progress. Keep up the good work!",
        bust: "😰 The stress built up quickly. Remember to use your zen techniques!",
        house_bust: "🎉 Things worked out in your favor this time!"
    };
    
    return fallbackMessages[outcome] || "You're learning valuable lessons about managing stress in challenging situations.";
}

// Educational stress management insights for outcomes
export const stressManagementInsights = {
    win: [
        "Success often comes from staying calm and prepared. Your mindful approach paid off!",
        "When we manage our stress well, we make better decisions. Great job staying centered!",
        "Your patience and preparation created a positive outcome. This is stress management in action!",
        "Notice how staying calm helped you navigate this challenge successfully.",
        "Your zen approach turned a potentially stressful situation into a win!"
    ],
    lose: [
        "Every challenge is a learning opportunity. What stress management technique could help next time?",
        "Setbacks are normal - the key is how we respond. Take a deep breath and try again.",
        "This is a chance to practice resilience. Remember, you have tools to handle stress.",
        "Even experienced people face difficulties. The important thing is to keep learning and growing.",
        "Consider this practice for real-world situations. Each attempt builds your stress management skills."
    ],
    tie: [
        "Persistence and patience are key stress management skills. You're developing both!",
        "Sometimes the best approach is steady, consistent effort. You're doing great!",
        "Balance is important in stress management. You're finding your rhythm.",
        "Maintaining composure under pressure is a valuable life skill. Keep practicing!",
        "Your steady approach shows emotional regulation - a core stress management technique."
    ],
    bust: [
        "When stress builds up quickly, it's time to use your coping tools. Try some deep breathing!",
        "This is exactly why we practice stress management - to handle moments like these.",
        "High stress can cloud our judgment. Remember to pause, breathe, and reset.",
        "Your zen activities are there for moments like this. Don't forget to use them!",
        "Stress overload happens to everyone. The key is recognizing it and taking action."
    ],
    house_bust: [
        "Sometimes patience and calm energy create positive outcomes we didn't expect!",
        "Your zen approach influenced the entire situation. That's the power of mindfulness!",
        "When we stay centered, we often find that things work out better than expected.",
        "This shows how managing our own stress can positively affect our environment.",
        "Your calm presence helped create a favorable outcome. That's advanced stress management!"
    ]
};

// Get educational insight for outcome
export function getStressManagementInsight(outcome) {
    try {
        if (!stressManagementInsights[outcome] || !Array.isArray(stressManagementInsights[outcome])) {
            return getFallbackStressManagementInsight(outcome);
        }
        
        const insights = stressManagementInsights[outcome];
        if (insights.length === 0) {
            return getFallbackStressManagementInsight(outcome);
        }
        
        // Return random insight for variety
        const randomIndex = Math.floor(Math.random() * insights.length);
        return insights[randomIndex];
        
    } catch (error) {
        console.error('Error getting stress management insight:', error);
        return getFallbackStressManagementInsight(outcome);
    }
}

function getFallbackStressManagementInsight(outcome) {
    const fallbackInsights = {
        win: "Great job managing the pressure! Your calm approach made all the difference.",
        lose: "Every challenge teaches us something. What stress management technique will you try next?",
        tie: "Steady progress is still progress. You're building valuable stress management skills.",
        bust: "When stress peaks, remember to breathe and use your zen techniques.",
        house_bust: "Sometimes staying calm creates unexpected positive outcomes!"
    };
    
    return fallbackInsights[outcome] || "Each experience helps you develop better stress management skills.";
}

// Initial flavor text system
export function getInitialFlavorText(stepIndex) {
    try {
        if (typeof stepIndex !== 'number' || stepIndex < 0 || stepIndex >= steps.length) {
            console.warn(`Invalid step index: ${stepIndex}, using fallback`);
            return getFallbackInitialFlavorText(stepIndex);
        }
        
        if (!initialFlavorText[stepIndex] || typeof initialFlavorText[stepIndex] !== 'object') {
            console.warn(`No initial flavor text found for step ${stepIndex}, using fallback`);
            return getFallbackInitialFlavorText(stepIndex);
        }
        
        return initialFlavorText[stepIndex];
        
    } catch (error) {
        console.error('Error getting initial flavor text:', error);
        return getFallbackInitialFlavorText(stepIndex);
    }
}

// Fallback initial flavor text for error handling
function getFallbackInitialFlavorText(stepIndex) {
    const fallbackTexts = {
        0: {
            title: "Starting Your DMV Visit",
            text: "You're starting your DMV visit. Take a deep breath and remember your preparation.",
            stressTriggers: ["bureaucracy"],
            tips: "Stay calm and remember that you're prepared for this."
        },
        1: {
            title: "Waiting Your Turn",
            text: "Time to wait for your number to be called. This is a good opportunity to practice patience.",
            stressTriggers: ["waiting"],
            tips: "Use this time to practice mindfulness and stay centered."
        },
        2: {
            title: "Document Submission",
            text: "It's time to present your documents. Trust in your preparation.",
            stressTriggers: ["scrutiny"],
            tips: "You've prepared well. Present your documents with confidence."
        },
        3: {
            title: "Photo Time",
            text: "Photo time! Just be yourself and stay relaxed.",
            stressTriggers: ["performance anxiety"],
            tips: "Take a deep breath and be natural. Everyone looks fine in their DMV photo."
        },
        4: {
            title: "Final Steps",
            text: "You're almost done! Just a few more steps to complete your visit.",
            stressTriggers: ["completion anxiety"],
            tips: "You're in the final stretch. Stay focused and finish strong."
        }
    };
    
    if (stepIndex >= 0 && stepIndex < Object.keys(fallbackTexts).length) {
        return fallbackTexts[stepIndex];
    }
    
    return {
        title: "DMV Visit",
        text: "You're making progress through your DMV visit.",
        stressTriggers: ["general stress"],
        tips: "Stay calm and remember your stress management techniques."
    };
}