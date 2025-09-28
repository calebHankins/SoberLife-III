// SoberLife III - Task Definitions
// Modular task configurations for campaign mode

// Task Module class for standardized task interfaces
export class TaskModule {
    constructor(taskDefinition) {
        this.id = taskDefinition.id;
        this.name = taskDefinition.name;
        this.description = taskDefinition.description;
        this.steps = taskDefinition.steps;
        this.contextualActions = taskDefinition.contextualActions;
        this.progressiveFlavorText = taskDefinition.progressiveFlavorText;
        this.initialFlavorText = taskDefinition.initialFlavorText;
        this.outcomeMessages = taskDefinition.outcomeMessages;
        this.difficulty = taskDefinition.difficulty;
        this.unlockRequirement = taskDefinition.unlockRequirement;
    }
    
    initialize() {
        // Setup task-specific UI and state
        console.log(`Initializing task: ${this.name}`);
    }
    
    getStepDescription(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.steps.length) {
            return this.steps[stepIndex];
        }
        return "Unknown step";
    }
    
    getContextualActions(stepIndex) {
        return this.contextualActions[stepIndex] || {
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
    
    getInitialFlavorText(stepIndex) {
        return this.initialFlavorText[stepIndex] || {
            title: "Task Step",
            text: "You're working through this challenge.",
            stressTriggers: ["general stress"],
            tips: "Stay calm and use your stress management techniques."
        };
    }
    
    cleanup() {
        // Reset task-specific state
        console.log(`Cleaning up task: ${this.name}`);
    }
}

// DMV Task Definition (existing content)
export const dmvTaskDefinition = {
    id: 'dmv',
    name: 'DMV License Renewal & Real ID',
    description: 'Navigate the bureaucratic maze of license renewal and Real ID application',
    difficulty: 1,
    unlockRequirement: null,
    steps: [
        "Check in at the front desk",
        "Wait in line for your number to be called", 
        "Present documents to clerk",
        "Take photo for Real ID",
        "Pay renewal fee and receive temporary license"
    ],
    contextualActions: {
        0: {
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
        1: {
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
        2: {
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
        3: {
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
        4: {
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
    },
    initialFlavorText: {
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
    },
    successMessages: [
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
    ]
};

// Job Interview Task Definition (new scenario)
export const jobInterviewTaskDefinition = {
    id: 'jobInterview',
    name: 'Job Interview Challenge',
    description: 'Navigate interview questions while managing pre-interview nerves and performance anxiety',
    difficulty: 2,
    unlockRequirement: 'dmv',
    steps: [
        "Arrive at the office and check in with reception",
        "Wait in the lobby and review your preparation",
        "Meet the interviewer and make first impressions",
        "Answer behavioral questions confidently",
        "Ask thoughtful questions about the role and company"
    ],
    contextualActions: {
        0: {
            hit: {
                text: "Review Notes",
                description: "Quickly review your prepared talking points and company research",
                flavorText: "You take a moment to refresh your memory on key details"
            },
            stand: {
                text: "Stay Confident",
                description: "Trust your preparation and maintain composure",
                flavorText: "You maintain your confidence and professional demeanor"
            }
        },
        1: {
            hit: {
                text: "Practice Answers",
                description: "Mentally rehearse responses to common interview questions",
                flavorText: "You quietly practice your elevator pitch and key examples"
            },
            stand: {
                text: "Stay Relaxed",
                description: "Focus on breathing and staying calm",
                flavorText: "You center yourself and practice mindful breathing"
            }
        },
        2: {
            hit: {
                text: "Engage Actively",
                description: "Ask clarifying questions and show genuine interest",
                flavorText: "You demonstrate curiosity and engagement with thoughtful questions"
            },
            stand: {
                text: "Listen Carefully",
                description: "Focus on understanding what the interviewer is really asking",
                flavorText: "You give your full attention and listen for underlying needs"
            }
        },
        3: {
            hit: {
                text: "Elaborate Further",
                description: "Provide additional context and specific examples",
                flavorText: "You expand on your answer with concrete details and outcomes"
            },
            stand: {
                text: "Keep It Concise",
                description: "Deliver a clear, focused response",
                flavorText: "You provide a well-structured answer that hits the key points"
            }
        },
        4: {
            hit: {
                text: "Ask Follow-up",
                description: "Dig deeper into the role and company culture",
                flavorText: "You show genuine interest by asking insightful follow-up questions"
            },
            stand: {
                text: "Wrap Up Professionally",
                description: "Thank them and express continued interest",
                flavorText: "You conclude the interview on a positive, professional note"
            }
        }
    },
    initialFlavorText: {
        0: {
            title: "Arriving at the Interview",
            text: "You walk into the modern office building, your resume folder in hand and your best professional outfit carefully chosen. The lobby is sleek and impressive, with company awards displayed prominently on the walls. You approach the reception desk, trying to project confidence while your heart beats a little faster. This is it - the opportunity you've been preparing for. The receptionist looks up with a welcoming smile as you announce your arrival.",
            stressTriggers: ["performance anxiety", "first impressions", "professional pressure"],
            tips: "Remember, they already liked your resume enough to interview you. You belong here."
        },
        1: {
            title: "The Waiting Game",
            text: "You're seated in a comfortable chair in the lobby, but comfort is relative when you're about to be evaluated. Around you, the office buzzes with activity - employees walking by with purpose, phones ringing, the subtle hum of productivity. You glance at your watch; you're right on time. Your folder of notes sits on your lap, and you resist the urge to flip through it one more time. The interviewer should be out any minute now.",
            stressTriggers: ["anticipation anxiety", "time pressure", "professional environment"],
            tips: "Use this time to center yourself. A few deep breaths can help calm your nerves."
        },
        2: {
            title: "First Impressions Matter",
            text: "A professional-looking person approaches with an extended hand and a warm smile. 'You must be here for the interview,' they say. This is it - the crucial first few seconds that can set the tone for everything that follows. Your handshake, your eye contact, your initial greeting - it all matters. As you walk toward the interview room, you remind yourself that this is a conversation, not an interrogation.",
            stressTriggers: ["first impressions", "social evaluation", "performance pressure"],
            tips: "Be yourself, but be your best professional self. Authenticity combined with preparation is powerful."
        },
        3: {
            title: "The Question Gauntlet",
            text: "You're seated across from the interviewer, and the real conversation begins. 'Tell me about yourself,' they start, and you're grateful you practiced this one. But you know the behavioral questions are coming - those 'Tell me about a time when...' scenarios that require you to think on your feet while showcasing your problem-solving skills. Your examples are ready, but translating them smoothly under pressure is the real challenge.",
            stressTriggers: ["performance evaluation", "memory pressure", "articulation anxiety"],
            tips: "Use the STAR method: Situation, Task, Action, Result. Take a moment to think before answering."
        },
        4: {
            title: "Your Turn to Interview Them",
            text: "The interviewer leans back slightly and asks, 'Do you have any questions for me?' This is your moment to flip the script and show that you're not just looking for any job - you're evaluating whether this is the right fit for you too. Your prepared questions sit ready in your mind, but you also want to ask about things that came up during the conversation. This is where you demonstrate your genuine interest and strategic thinking.",
            stressTriggers: ["role reversal", "strategic thinking", "closing pressure"],
            tips: "Great questions show you're thinking like someone who already works there. Ask about challenges, growth, and culture."
        }
    },
    progressiveFlavorText: {
        0: { // Arrive at office
            hit: [
                "You take a moment to refresh your memory on key details",
                "You quickly scan your notes one more time for confidence",
                "You mentally review the company's recent achievements",
                "You remind yourself of your key talking points",
                "You take a deep breath and organize your thoughts"
            ],
            stand: [
                "You maintain your confidence and professional demeanor",
                "You project calm assurance as you wait",
                "You trust in your preparation and stay composed"
            ]
        },
        1: { // Wait in lobby
            hit: [
                "You quietly practice your elevator pitch and key examples",
                "You mentally rehearse your STAR method responses",
                "You review the job description one more time",
                "You think through potential follow-up questions",
                "You visualize the interview going well"
            ],
            stand: [
                "You center yourself and practice mindful breathing",
                "You focus on staying calm and present",
                "You maintain a relaxed but alert posture"
            ]
        },
        2: { // Meet interviewer
            hit: [
                "You demonstrate curiosity and engagement with thoughtful questions",
                "You ask for clarification to show you're listening actively",
                "You inquire about the team dynamics and culture",
                "You show interest in the company's future direction",
                "You ask about the biggest challenges in this role"
            ],
            stand: [
                "You give your full attention and listen for underlying needs",
                "You focus on understanding the interviewer's perspective",
                "You maintain eye contact and show genuine interest"
            ]
        },
        3: { // Answer questions
            hit: [
                "You expand on your answer with concrete details and outcomes",
                "You provide additional context that strengthens your response",
                "You share a related example that demonstrates your skills",
                "You elaborate on the impact of your previous work",
                "You connect your experience to their specific needs"
            ],
            stand: [
                "You provide a well-structured answer that hits the key points",
                "You deliver a concise response using the STAR method",
                "You keep your answer focused and relevant"
            ]
        },
        4: { // Ask questions
            hit: [
                "You show genuine interest by asking insightful follow-up questions",
                "You dig deeper into the company culture and values",
                "You inquire about growth opportunities and career development",
                "You ask about the team's biggest current challenges",
                "You explore what success looks like in this role"
            ],
            stand: [
                "You conclude the interview on a positive, professional note",
                "You express sincere appreciation for their time",
                "You reaffirm your interest in the opportunity"
            ]
        }
    },
    successMessages: [
        {
            main: "Interview Ace! 🎯",
            sub: "You nailed that interview! Your preparation and composure really paid off.",
            stats: "Professional confidence: HIGH • Interview skills: MASTERED • Career prospects: EXCELLENT!"
        },
        {
            main: "Confidence Champion! 💼",
            sub: "You handled every question with poise and showed genuine interest in the role. Impressive performance!",
            stats: "You turned interview anxiety into interview excellence!"
        },
        {
            main: "Professional Zen Master! 🧘‍♂️",
            sub: "Your calm, thoughtful approach made a lasting impression. You've mastered the art of the interview!",
            stats: "Your stress management skills translated perfectly to professional success!"
        },
        {
            main: "Career Catalyst! 🚀",
            sub: "Outstanding interview performance! You demonstrated both competence and character.",
            stats: "You've successfully showcased your potential and professionalism!"
        }
    ]
};

// Task registry for easy access

// Voter Registration Update Task Definition (quirky, humorous)
export const voterRegistrationTaskDefinition = {
    id: 'voterRegistration',
    name: 'Voter Registration Update',
    description: 'Survive the county clerk’s office and update your voter registration while encountering some truly quirky weirdos.',
    difficulty: 3,
    unlockRequirement: 'jobInterview',
    steps: [
        "Enter the county clerk’s office",
        "Fill out the confusing registration form",
        "Interact with the eccentric clerk",
        "Correct a bizarre paperwork error",
        "Submit and get your new voter card"
    ],
    contextualActions: {
        0: {
            hit: {
                text: "Ask for Directions",
                description: "Try to get help from the mysterious guy in the wizard hat",
                flavorText: "You approach the local 'expert' who offers advice in riddles."
            },
            stand: {
                text: "Brave the Chaos",
                description: "March in confidently, ignoring the chaos",
                flavorText: "You stride past the guy juggling rubber stamps and the lady with 17 cats."
            }
        },
        1: {
            hit: {
                text: "Clarify Instructions",
                description: "Ask the clerk what 'Section 42B' means",
                flavorText: "The clerk responds with a monologue about the history of pens."
            },
            stand: {
                text: "Guess and Fill",
                description: "Just fill out the form using your best guess",
                flavorText: "You invent a new abbreviation for 'favorite snack'."
            }
        },
        2: {
            hit: {
                text: "Make Small Talk",
                description: "Chat with the eccentric clerk about their stamp collection",
                flavorText: "You learn more about rare stamps than you ever wanted."
            },
            stand: {
                text: "Stay Focused",
                description: "Politely decline conversation and focus on your paperwork",
                flavorText: "You avoid being recruited for the local stamp club."
            }
        },
        3: {
            hit: {
                text: "Double-Check Everything",
                description: "Review your paperwork for errors (like listing your pet as a witness)",
                flavorText: "You discover you accidentally signed as 'Lord of Snacks'."
            },
            stand: {
                text: "Trust the Process",
                description: "Assume the clerk will catch any mistakes",
                flavorText: "You hope the system is robust against snack-related fraud."
            }
        },
        4: {
            hit: {
                text: "Celebrate",
                description: "Do a little victory dance as you get your new voter card",
                flavorText: "The clerk joins in with a kazoo solo."
            },
            stand: {
                text: "Exit Quietly",
                description: "Leave before anything else can go wrong",
                flavorText: "You escape just as a parade of costumed mascots enters."
            }
        }
    },
    initialFlavorText: {
        0: {
            title: "Welcome to the County Clerk’s Office",
            text: "You step into a room that smells faintly of old paper and mystery. The waiting area is filled with characters: a wizard hat guy, a lady with a dozen cats, and a clerk who seems to be running a stamp museum from behind the counter.",
            stressTriggers: ["confusion", "quirky people", "bureaucracy"],
            tips: "Remember, everyone here is just trying to get through the day. Embrace the weirdness and keep your zen."
        },
        1: {
            title: "Form Follies",
            text: "The registration form is a maze of boxes, arrows, and cryptic instructions. Section 42B asks for your 'favorite snack' and 'spirit animal.' You’re not sure if this is a joke or a test.",
            stressTriggers: ["confusing paperwork", "uncertainty"],
            tips: "Take your time. If in doubt, ask for help—or just make something up."
        },
        2: {
            title: "Clerk Quirks",
            text: "The clerk greets you with a story about their rare stamp collection and a challenge to name all 50 state birds. You just want to update your address, but you’re learning a lot about stamps.",
            stressTriggers: ["eccentric people", "unexpected conversations"],
            tips: "Stay polite, but don’t get sucked into a stamp trivia contest."
        },
        3: {
            title: "Paperwork Pandemonium",
            text: "You notice a bizarre error: your pet’s name is listed as a witness, and your birthdate is written in crayon. The clerk assures you this happens all the time.",
            stressTriggers: ["mistakes", "embarrassment"],
            tips: "Double-check everything. The system may be weird, but you can still be thorough."
        },
        4: {
            title: "Victory Lap",
            text: "You hand in your paperwork and receive a shiny new voter card. The clerk plays a celebratory kazoo solo, and the wizard hat guy gives you a thumbs up.",
            stressTriggers: ["completion anxiety", "unexpected celebrations"],
            tips: "Celebrate your success! You survived the quirks and got registered."
        }
    },
    progressiveFlavorText: {
        0: {
            hit: [
                "You approach the local 'expert' who offers advice in riddles.",
                "You get directions that involve three lefts and a riddle about snacks.",
                "You receive a map drawn on a napkin."
            ],
            stand: [
                "You stride past the guy juggling rubber stamps and the lady with 17 cats.",
                "You ignore the chaos and focus on your mission.",
                "You channel your inner zen and walk in with purpose."
            ]
        },
        1: {
            hit: [
                "The clerk responds with a monologue about the history of pens.",
                "You get a 10-minute explanation about Section 42B’s origins.",
                "You learn more about snack preferences than you ever wanted."
            ],
            stand: [
                "You invent a new abbreviation for 'favorite snack'.",
                "You fill in the form with your best guess and a doodle.",
                "You decide your spirit animal is 'Zen Squirrel'."
            ]
        },
        2: {
            hit: [
                "You learn more about rare stamps than you ever wanted.",
                "You get invited to the annual stamp trivia night.",
                "You discover the clerk’s favorite bird is the blue-footed booby."
            ],
            stand: [
                "You avoid being recruited for the local stamp club.",
                "You focus on your paperwork and tune out the stamp talk.",
                "You politely nod and keep writing."
            ]
        },
        3: {
            hit: [
                "You discover you accidentally signed as 'Lord of Snacks'.",
                "You catch a typo that would have made you a registered unicorn.",
                "You fix the crayon birthdate with a pen."
            ],
            stand: [
                "You hope the system is robust against snack-related fraud.",
                "You trust the clerk to catch any mistakes.",
                "You accept that weird things happen here."
            ]
        },
        4: {
            hit: [
                "The clerk joins in with a kazoo solo.",
                "You get a sticker that says 'I Survived the Clerk’s Office'.",
                "The wizard hat guy gives you a high five."
            ],
            stand: [
                "You escape just as a parade of costumed mascots enters.",
                "You leave quietly, grateful for your new voter card.",
                "You slip out before the next trivia contest starts."
            ]
        }
    },
    successMessages: [
        {
            main: "Voter Victory! 🗳️",
            sub: "You survived the quirks, the chaos, and the kazoo solo. Democracy thanks you!",
            stats: "Stress level: MODERATE • Zen points: EARNED • Weird encounters: PLENTY!"
        },
        {
            main: "Clerk’s Office Conqueror! 🏆",
            sub: "You navigated the maze of paperwork and personalities with style.",
            stats: "You’re officially registered and officially a legend."
        },
        {
            main: "Zen Squirrel Achievement Unlocked! 🐿️",
            sub: "You kept your cool even when things got weird. That’s true stress mastery!",
            stats: "Your stress management skills are now certified by the county clerk."
        },
        {
            main: "Mission Accomplished! ✅",
            sub: "Voter card in hand, sanity (mostly) intact. You’re ready for the next adventure!",
            stats: "You’ve completed one of life’s most unexpectedly quirky quests!"
        }
    ]
};

export const taskDefinitions = {
    dmv: dmvTaskDefinition,
    jobInterview: jobInterviewTaskDefinition,
    voterRegistration: voterRegistrationTaskDefinition
};

// Get task definition by ID
export function getTaskDefinition(taskId) {
    return taskDefinitions[taskId] || null;
}

// Get all available tasks
export function getAllTaskDefinitions() {
    return Object.values(taskDefinitions);
}

// Check if task is unlocked based on completed tasks
export function isTaskUnlocked(taskId, completedTasks) {
    const task = getTaskDefinition(taskId);
    if (!task) return false;
    
    // First task is always unlocked
    if (!task.unlockRequirement) return true;
    
    // Check if requirement is met
    return completedTasks.includes(task.unlockRequirement);
}

// Get next available task
export function getNextAvailableTask(completedTasks) {
    const allTasks = getAllTaskDefinitions();
    
    for (const task of allTasks) {
        if (!completedTasks.includes(task.id) && isTaskUnlocked(task.id, completedTasks)) {
            return task;
        }
    }
    
    return null; // All tasks completed
}