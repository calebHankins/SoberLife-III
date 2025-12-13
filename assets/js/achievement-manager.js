// SoberLife III - Achievement Manager
// Core logic for tracking, validating, and managing achievements

import { achievementDefinitions, getAchievementDefinition, getMilestoneAchievements } from './achievement-definitions.js';

// Achievement state object
export let achievementState = {
    unlockedAchievements: [],      // Array of unlocked achievement IDs
    statistics: {
        campaignCompleted: false,
        freePlayTasksTotal: 0,      // Total Free Play tasks completed
        freePlayMaxRun: 0,          // Max tasks in one Free Play run
        freePlayMaxRounds: 0,       // Max rounds in one Free Play run
        zenPointsPeak: 0,           // Maximum zen points at one time
        currentFreePlayRun: 0       // Current run task count
    },
    unlockTimestamps: {}           // Map of achievementId -> timestamp
};

/**
 * Initialize achievement system
 * Loads saved state from localStorage
 */
export function initializeAchievements() {
    try {
        loadAchievementState();
        validateAchievementState();
        console.log('Achievement system initialized');
        console.log('Unlocked achievements:', achievementState.unlockedAchievements.length);
        console.log('Statistics:', achievementState.statistics);
    } catch (error) {
        console.error('Error initializing achievements:', error);
        resetAchievementState();
    }
}

/**
 * Check if an achievement should be unlocked
 * @param {string} achievementId - The achievement ID to check
 * @returns {boolean} True if achievement was unlocked, false otherwise
 */
export function checkAchievement(achievementId) {
    try {
        // Check if already unlocked
        if (achievementState.unlockedAchievements.includes(achievementId)) {
            return false;
        }

        const achievement = getAchievementDefinition(achievementId);
        if (!achievement) {
            console.warn(`Achievement not found: ${achievementId}`);
            return false;
        }

        // Check if condition is met
        if (achievement.checkCondition(achievementState.statistics)) {
            return unlockAchievement(achievementId);
        }

        return false;
    } catch (error) {
        console.error(`Error checking achievement ${achievementId}:`, error);
        return false;
    }
}

/**
 * Unlock an achievement
 * @param {string} achievementId - The achievement ID to unlock
 * @returns {boolean} True if unlocked successfully, false if already unlocked
 */
export function unlockAchievement(achievementId) {
    try {
        // Check if already unlocked
        if (achievementState.unlockedAchievements.includes(achievementId)) {
            return false;
        }

        const achievement = getAchievementDefinition(achievementId);
        if (!achievement) {
            console.warn(`Cannot unlock unknown achievement: ${achievementId}`);
            return false;
        }

        // Unlock achievement
        achievementState.unlockedAchievements.push(achievementId);
        achievementState.unlockTimestamps[achievementId] = Date.now();

        saveAchievementState();

        console.log(`🏆 Achievement unlocked: ${achievement.name}`);

        // Trigger notification (will be handled by UI module)
        if (typeof window !== 'undefined' && window.showAchievementNotification) {
            window.showAchievementNotification(achievement);
        }

        return true;
    } catch (error) {
        console.error(`Error unlocking achievement ${achievementId}:`, error);
        return false;
    }
}

/**
 * Check for milestone achievements
 * @param {string} type - 'free_play' or 'wealth'
 * @param {number} value - Current value to check against milestones
 */
export function checkMilestones(type, value) {
    try {
        const milestones = getMilestoneAchievements(type);

        for (const achievement of milestones) {
            if (value >= achievement.milestone) {
                checkAchievement(achievement.id);
            }
        }
    } catch (error) {
        console.error(`Error checking milestones for ${type}:`, error);
    }
}

/**
 * Update a statistic value
 * @param {string} statName - Name of the statistic
 * @param {*} value - New value for the statistic
 */
export function updateStatistic(statName, value) {
    try {
        if (!(statName in achievementState.statistics)) {
            console.warn(`Unknown statistic: ${statName}`);
            return;
        }

        achievementState.statistics[statName] = value;
        saveAchievementState();

        console.log(`Statistic updated: ${statName} = ${value}`);
    } catch (error) {
        console.error(`Error updating statistic ${statName}:`, error);
    }
}

/**
 * Get current statistics
 * @returns {Object} Current statistics object
 */
export function getStatistics() {
    return { ...achievementState.statistics };
}

/**
 * Get all achievements with their unlock status
 * @returns {Array} Array of achievement objects with status
 */
export function getAllAchievements() {
    try {
        return Object.values(achievementDefinitions).map(achievement => ({
            ...achievement,
            isUnlocked: achievementState.unlockedAchievements.includes(achievement.id),
            unlockedAt: achievementState.unlockTimestamps[achievement.id] || null
        }));
    } catch (error) {
        console.error('Error getting all achievements:', error);
        return [];
    }
}

/**
 * Get a specific achievement with unlock status
 * @param {string} achievementId - The achievement ID
 * @returns {Object|null} Achievement object with status or null
 */
export function getAchievement(achievementId) {
    try {
        const achievement = getAchievementDefinition(achievementId);
        if (!achievement) {
            return null;
        }

        return {
            ...achievement,
            isUnlocked: achievementState.unlockedAchievements.includes(achievementId),
            unlockedAt: achievementState.unlockTimestamps[achievementId] || null
        };
    } catch (error) {
        console.error(`Error getting achievement ${achievementId}:`, error);
        return null;
    }
}

/**
 * Save achievement state to localStorage
 */
export function saveAchievementState() {
    try {
        localStorage.setItem('soberlife-achievements', JSON.stringify(achievementState));
    } catch (error) {
        console.error('Failed to save achievement state:', error);
    }
}

/**
 * Load achievement state from localStorage
 * @returns {boolean} True if loaded successfully, false otherwise
 */
export function loadAchievementState() {
    try {
        const saved = localStorage.getItem('soberlife-achievements');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.assign(achievementState, loaded);
            return true;
        }
    } catch (error) {
        console.error('Failed to load achievement state:', error);
        resetAchievementState();
    }
    return false;
}

/**
 * Validate achievement state integrity
 */
export function validateAchievementState() {
    try {
        // Ensure required properties exist
        if (!achievementState.unlockedAchievements) {
            achievementState.unlockedAchievements = [];
        }

        if (!achievementState.statistics) {
            achievementState.statistics = {
                campaignCompleted: false,
                freePlayTasksTotal: 0,
                freePlayMaxRun: 0,
                freePlayMaxRounds: 0,
                zenPointsPeak: 0,
                currentFreePlayRun: 0
            };
        }

        if (!achievementState.unlockTimestamps) {
            achievementState.unlockTimestamps = {};
        }

        // Validate data types
        if (!Array.isArray(achievementState.unlockedAchievements)) {
            achievementState.unlockedAchievements = [];
        }

        // Ensure statistics are correct types
        if (typeof achievementState.statistics.campaignCompleted !== 'boolean') {
            achievementState.statistics.campaignCompleted = false;
        }

        const numericStats = ['freePlayTasksTotal', 'freePlayMaxRun', 'freePlayMaxRounds', 'zenPointsPeak', 'currentFreePlayRun'];
        numericStats.forEach(stat => {
            if (typeof achievementState.statistics[stat] !== 'number' || achievementState.statistics[stat] < 0) {
                achievementState.statistics[stat] = 0;
            }
        });

        // Remove invalid achievement IDs
        achievementState.unlockedAchievements = achievementState.unlockedAchievements.filter(id => {
            return getAchievementDefinition(id) !== null;
        });

        // Save validated state
        saveAchievementState();

    } catch (error) {
        console.error('Error validating achievement state:', error);
        resetAchievementState();
    }
}

/**
 * Reset achievement state to defaults
 */
export function resetAchievementState() {
    achievementState.unlockedAchievements = [];
    achievementState.statistics = {
        campaignCompleted: false,
        freePlayTasksTotal: 0,
        freePlayMaxRun: 0,
        freePlayMaxRounds: 0,
        zenPointsPeak: 0,
        currentFreePlayRun: 0
    };
    achievementState.unlockTimestamps = {};
    saveAchievementState();
    console.log('Achievement state reset to defaults');
}

/**
 * Clear all achievement data (for testing or reset)
 */
export function clearAchievementData() {
    try {
        localStorage.removeItem('soberlife-achievements');
        resetAchievementState();
        console.log('Achievement data cleared');
    } catch (error) {
        console.error('Error clearing achievement data:', error);
    }
}

/**
 * Get achievement progress summary
 * @returns {Object} Progress summary
 */
export function getAchievementProgress() {
    try {
        const total = Object.keys(achievementDefinitions).length;
        const unlocked = achievementState.unlockedAchievements.length;
        const percentage = Math.round((unlocked / total) * 100);

        return {
            total,
            unlocked,
            locked: total - unlocked,
            percentage
        };
    } catch (error) {
        console.error('Error getting achievement progress:', error);
        return { total: 0, unlocked: 0, locked: 0, percentage: 0 };
    }
}


/**
 * Check zen points for wealth milestone achievements
 * Called by zen-points-manager when balance changes
 * @param {number} newBalance - New zen points balance
 */
export function checkZenPointsAchievements(newBalance) {
    try {
        if (newBalance > achievementState.statistics.zenPointsPeak) {
            updateStatistic('zenPointsPeak', newBalance);
            checkMilestones('wealth', newBalance);
        }
    } catch (error) {
        console.error('Error checking zen points achievements:', error);
    }
}

// Make function available globally for zen-points-manager
if (typeof window !== 'undefined') {
    window.checkZenPointsAchievements = checkZenPointsAchievements;
}
