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
        name: '🔥 On Fire',
        description: 'Complete 10 Free Play tasks',
        category: 'free_play',
        emoji: '🔥',
        milestone: 10,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 10,
        flavorText: 'You\'re building momentum!'
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
        name: '💎 Veteran Player',
        description: 'Complete 50 Free Play tasks',
        category: 'free_play',
        emoji: '💎',
        milestone: 50,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 50,
        flavorText: 'You\'re a Free Play veteran!'
    },

    free_play_100: {
        id: 'free_play_100',
        name: '👑 Free Play Legend',
        description: 'Complete 100 Free Play tasks',
        category: 'free_play',
        emoji: '👑',
        milestone: 100,
        checkCondition: (stats) => stats.freePlayTasksTotal >= 100,
        flavorText: 'Legendary status achieved!'
    },

    // Wealth Milestone Achievements
    wealth_1000: {
        id: 'wealth_1000',
        name: '💰 First Fortune',
        description: 'Accumulate 1,000 zen points at one time',
        category: 'wealth',
        emoji: '💰',
        milestone: 1000,
        checkCondition: (stats) => stats.zenPointsPeak >= 1000,
        flavorText: 'Your first taste of wealth!'
    },

    wealth_5000: {
        id: 'wealth_5000',
        name: '💎 Prosperity',
        description: 'Accumulate 5,000 zen points at one time',
        category: 'wealth',
        emoji: '💎',
        milestone: 5000,
        checkCondition: (stats) => stats.zenPointsPeak >= 5000,
        flavorText: 'Prosperity flows through you!'
    },

    wealth_10000: {
        id: 'wealth_10000',
        name: '🏆 Zen Tycoon',
        description: 'Accumulate 10,000 zen points at one time',
        category: 'wealth',
        emoji: '🏆',
        milestone: 10000,
        checkCondition: (stats) => stats.zenPointsPeak >= 10000,
        flavorText: 'You\'re a zen point tycoon!'
    },

    wealth_25000: {
        id: 'wealth_25000',
        name: '🌟 Zen Magnate',
        description: 'Accumulate 25,000 zen points at one time',
        category: 'wealth',
        emoji: '🌟',
        milestone: 25000,
        checkCondition: (stats) => stats.zenPointsPeak >= 25000,
        flavorText: 'Your wealth knows no bounds!'
    },

    wealth_50000: {
        id: 'wealth_50000',
        name: '👑 Zen Emperor',
        description: 'Accumulate 50,000 zen points at one time',
        category: 'wealth',
        emoji: '👑',
        milestone: 50000,
        checkCondition: (stats) => stats.zenPointsPeak >= 50000,
        flavorText: 'You rule the zen point empire!'
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
