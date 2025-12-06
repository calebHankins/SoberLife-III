// SoberLife III - Achievement Definitions
// All achievement configurations and metadata

/**
 * Achievement Categories:
 * - campaign: Campaign mode completion achievements
 * - free_play: Free Play mode milestone achievements
 * - wealth: Zen points accumulation achievements
 */

export const achievementDefinitions = {
    // Campaign Achievement
    campaign_master: {
        id: 'campaign_master',
        name: '🎓 Campaign Master',
        description: 'Complete all tasks in the Stress Management Campaign',
        category: 'campaign',
        emoji: '🎓',
        checkCondition: (stats) => stats.campaignCompleted === true,
        flavorText: 'You\'ve mastered every stress management scenario!'
    },

    // Free Play Milestone Achievements
    free_play_5: {
        id: 'free_play_5',
        name: '🎯 Getting Started',
        description: 'Complete 5 Free Play tasks',
        category: 'free_play',
        emoji: '🎯',
        milestone: 5,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 5,
        flavorText: 'Your Free Play journey begins!'
    },

    free_play_10: {
        id: 'free_play_10',
        name: '🌱 Finding Flow',
        description: 'Complete 10 Free Play tasks',
        category: 'free_play',
        emoji: '🌱',
        milestone: 10,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 10,
        flavorText: 'Your practice is taking root.'
    },

    free_play_25: {
        id: 'free_play_25',
        name: '⭐ Rising Star',
        description: 'Complete 25 Free Play tasks',
        category: 'free_play',
        emoji: '⭐',
        milestone: 25,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 25,
        flavorText: 'Your dedication is impressive!'
    },

    free_play_50: {
        id: 'free_play_50',
        name: '🌿 Seasoned Practitioner',
        description: 'Complete 50 Free Play tasks',
        category: 'free_play',
        emoji: '🌿',
        milestone: 50,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 50,
        flavorText: 'Your dedication runs deep.'
    },

    free_play_100: {
        id: 'free_play_100',
        name: '🧘 Free Play Sage',
        description: 'Complete 100 Free Play tasks',
        category: 'free_play',
        emoji: '🧘',
        milestone: 100,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 100,
        flavorText: 'Wisdom earned through patient practice.'
    },

    // Abundance Milestone Achievements
    wealth_1000: {
        id: 'wealth_1000',
        name: '🌱 Seeds of Calm',
        description: 'Accumulate 1,000 zen points at one time',
        category: 'wealth',
        emoji: '🌱',
        milestone: 1000,
        checkCondition: (stats) => stats.zenPointsPeak >= 1000,
        flavorText: 'Your practice is taking root.'
    },

    wealth_5000: {
        id: 'wealth_5000',
        name: '🌊 Abundant Flow',
        description: 'Accumulate 5,000 zen points at one time',
        category: 'wealth',
        emoji: '🌊',
        milestone: 5000,
        checkCondition: (stats) => stats.zenPointsPeak >= 5000,
        flavorText: 'Peace flows freely through you.'
    },

    wealth_10000: {
        id: 'wealth_10000',
        name: '🧘 Inner Wealth',
        description: 'Accumulate 10,000 zen points at one time',
        category: 'wealth',
        emoji: '🧘',
        milestone: 10000,
        checkCondition: (stats) => stats.zenPointsPeak >= 10000,
        flavorText: 'True richness comes from within.'
    },

    wealth_25000: {
        id: 'wealth_25000',
        name: '🏔️ Mountain Mind',
        description: 'Accumulate 25,000 zen points at one time',
        category: 'wealth',
        emoji: '🏔️',
        milestone: 25000,
        checkCondition: (stats) => stats.zenPointsPeak >= 25000,
        flavorText: 'Steady as stone, calm as clouds.'
    },

    wealth_50000: {
        id: 'wealth_50000',
        name: '☯️ Harmony Keeper',
        description: 'Accumulate 50,000 zen points at one time',
        category: 'wealth',
        emoji: '☯️',
        milestone: 50000,
        checkCondition: (stats) => stats.zenPointsPeak >= 50000,
        flavorText: 'Balance in all things.'
    }
};

/**
 * Get all achievements in a specific category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of achievement objects
 */
export function getAchievementsByCategory(category) {
    return Object.values(achievementDefinitions).filter(
        achievement => achievement.category === category
    );
}

/**
 * Get milestone achievements for a specific type
 * @param {string} type - 'free_play' or 'wealth'
 * @returns {Array} Array of milestone achievements sorted by milestone value
 */
export function getMilestoneAchievements(type) {
    const category = type === 'free_play' ? 'free_play' : 'wealth';
    return getAchievementsByCategory(category)
        .filter(achievement => achievement.milestone)
        .sort((a, b) => a.milestone - b.milestone);
}

/**
 * Get the next milestone achievement for a given type and current value
 * @param {string} type - 'free_play' or 'wealth'
 * @param {number} currentValue - Current stat value
 * @returns {Object|null} Next milestone achievement or null if all completed
 */
export function getNextMilestone(type, currentValue) {
    const milestones = getMilestoneAchievements(type);
    return milestones.find(achievement => currentValue < achievement.milestone) || null;
}

/**
 * Get all achievement IDs
 * @returns {Array} Array of achievement IDs
 */
export function getAllAchievementIds() {
    return Object.keys(achievementDefinitions);
}

/**
 * Get achievement definition by ID
 * @param {string} achievementId - The achievement ID
 * @returns {Object|null} Achievement definition or null if not found
 */
export function getAchievementDefinition(achievementId) {
    return achievementDefinitions[achievementId] || null;
}
