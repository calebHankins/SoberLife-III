// SoberLife III - Zen Points Manager
// Central management system for zen points as persistent currency

import { gameState, updateGameState, campaignState, updateCampaignState } from './game-state.js';
import { isCampaignMode } from './campaign-manager.js';

// Zen point transaction types
export const ZEN_TRANSACTION_TYPES = {
    TASK_START: 'task_start',
    TASK_COMPLETION: 'task_completion',
    ROUND_WIN: 'round_win',
    ROUND_TIE: 'round_tie',
    HOUSE_BUST: 'house_bust',
    ZEN_ACTIVITY: 'zen_activity',
    SHOP_PURCHASE: 'shop_purchase',
    ADMIN_ADJUSTMENT: 'admin_adjustment'
};

// Configuration constants
const ZEN_CONFIG = {
    TASK_START_BASE: 100,
    COMPLETION_BASE: 1000,
    MAX_PERFORMANCE_MULTIPLIER: 2.0,
    MIN_PERFORMANCE_MULTIPLIER: 0.5,
    MAX_BALANCE: 999999,
    MIN_BALANCE: 0
};

// Transaction history (for debugging and recovery)
let transactionHistory = [];

/**
 * Central Zen Points Manager
 * Handles all zen point operations with persistence and validation
 */
export class ZenPointsManager {

    /**
     * Get current zen point balance
     * @returns {number} Current balance
     */
    static getCurrentBalance() {
        try {
            // Use persistent campaign balance for campaign mode AND Free Play mode
            // Free Play mode shares the same persistent balance as campaign
            if (isCampaignMode() || gameState.freePlayMode) {
                return campaignState.zenPointBalance || gameState.zenPoints || 0;
            } else {
                // In single task mode, use session balance
                return gameState.zenPoints || 0;
            }
        } catch (error) {
            console.error('Error getting zen point balance:', error);
            return 0;
        }
    }

    /**
     * Add zen points to balance
     * @param {number} amount - Points to add
     * @param {string} type - Transaction type
     * @param {boolean} showAnimation - Whether to show visual feedback
     * @param {Object} metadata - Additional transaction data
     * @returns {number} New balance
     */
    static addPoints(amount, type = ZEN_TRANSACTION_TYPES.ADMIN_ADJUSTMENT, showAnimation = true, metadata = {}) {
        try {
            // Validate input
            if (typeof amount !== 'number' || amount < 0) {
                console.warn('Invalid zen point amount:', amount);
                return this.getCurrentBalance();
            }

            const currentBalance = this.getCurrentBalance();
            const newBalance = Math.min(currentBalance + amount, ZEN_CONFIG.MAX_BALANCE);

            // Log transaction
            this.logTransaction(amount, type, metadata);

            // Update appropriate state
            this.setBalance(newBalance);

            // Show visual feedback if requested
            if (showAnimation && amount > 0) {
                this.showZenPointFeedback(amount, type, 'gain');
            }

            console.log(`Zen points added: +${amount} (${type}), New balance: ${newBalance}`);
            return newBalance;

        } catch (error) {
            console.error('Error adding zen points:', error);
            return this.getCurrentBalance();
        }
    }

    /**
     * Spend zen points from balance
     * @param {number} amount - Points to spend
     * @param {string} type - Transaction type
     * @param {boolean} showAnimation - Whether to show visual feedback
     * @param {Object} metadata - Additional transaction data
     * @returns {boolean} Success status
     */
    static spendPoints(amount, type = ZEN_TRANSACTION_TYPES.ADMIN_ADJUSTMENT, showAnimation = true, metadata = {}) {
        try {
            // Validate input
            if (typeof amount !== 'number' || amount < 0) {
                console.warn('Invalid zen point spend amount:', amount);
                return false;
            }

            const currentBalance = this.getCurrentBalance();

            // Check if sufficient balance
            if (currentBalance < amount) {
                console.warn(`Insufficient zen points: ${currentBalance} < ${amount}`);
                return false;
            }

            const newBalance = Math.max(currentBalance - amount, ZEN_CONFIG.MIN_BALANCE);

            // Log transaction
            this.logTransaction(-amount, type, metadata);

            // Update appropriate state
            this.setBalance(newBalance);

            // Show visual feedback if requested
            if (showAnimation && amount > 0) {
                this.showZenPointFeedback(amount, type, 'spend');
            }

            console.log(`Zen points spent: -${amount} (${type}), New balance: ${newBalance}`);
            return true;

        } catch (error) {
            console.error('Error spending zen points:', error);
            return false;
        }
    }

    /**
     * Set zen point balance directly
     * @param {number} amount - New balance amount
     */
    static setBalance(amount) {
        try {
            // Validate and clamp amount
            const validAmount = Math.max(ZEN_CONFIG.MIN_BALANCE, Math.min(amount, ZEN_CONFIG.MAX_BALANCE));

            // Use persistent campaign balance for campaign mode AND Free Play mode
            // Free Play mode shares the same persistent balance as campaign
            if (isCampaignMode() || gameState.freePlayMode) {
                // Update campaign state with persistent balance
                updateCampaignState({
                    zenPointBalance: validAmount,
                    lastBalanceUpdate: Date.now()
                });
                // Also update game state for immediate UI updates
                updateGameState({ zenPoints: validAmount });
            } else {
                // Update only game state for single task mode
                updateGameState({ zenPoints: validAmount });
            }

        } catch (error) {
            console.error('Error setting zen point balance:', error);
        }
    }

    /**
     * Calculate task start bonus
     * @param {string} taskId - Task identifier
     * @param {number} difficulty - Difficulty multiplier (default 1.0)
     * @returns {number} Bonus amount
     */
    static calculateTaskStartBonus(taskId = 'unknown', difficulty = 1.0) {
        try {
            const baseBonus = ZEN_CONFIG.TASK_START_BASE;
            const bonus = Math.floor(baseBonus * Math.max(0.1, difficulty));

            console.log(`Task start bonus calculated: ${bonus} (base: ${baseBonus}, difficulty: ${difficulty})`);
            return bonus;

        } catch (error) {
            console.error('Error calculating task start bonus:', error);
            return ZEN_CONFIG.TASK_START_BASE;
        }
    }

    /**
     * Calculate task completion bonus with performance multiplier
     * @param {number} finalStressLevel - Final stress level (0-100)
     * @returns {Object} Bonus breakdown
     */
    static calculateCompletionBonus(finalStressLevel = 50) {
        try {
            const baseBonus = ZEN_CONFIG.COMPLETION_BASE;

            // Performance multiplier: 2.0x at 0% stress, 0.5x at 100% stress
            const stressRatio = Math.max(0, Math.min(100, finalStressLevel)) / 100;
            const performanceMultiplier = Math.max(
                ZEN_CONFIG.MIN_PERFORMANCE_MULTIPLIER,
                Math.min(ZEN_CONFIG.MAX_PERFORMANCE_MULTIPLIER, 2.0 - stressRatio)
            );

            const performanceBonus = Math.floor(baseBonus * (performanceMultiplier - 1.0));
            const totalBonus = baseBonus + performanceBonus;

            const breakdown = {
                baseBonus,
                performanceBonus,
                performanceMultiplier: Math.round(performanceMultiplier * 100) / 100,
                totalBonus,
                stressLevel: finalStressLevel
            };

            console.log('Completion bonus calculated:', breakdown);
            return breakdown;

        } catch (error) {
            console.error('Error calculating completion bonus:', error);
            return {
                baseBonus: ZEN_CONFIG.COMPLETION_BASE,
                performanceBonus: 0,
                performanceMultiplier: 1.0,
                totalBonus: ZEN_CONFIG.COMPLETION_BASE,
                stressLevel: finalStressLevel
            };
        }
    }

    /**
     * Award task start bonus
     * @param {string} taskId - Task identifier
     * @param {number} difficulty - Difficulty multiplier
     * @returns {number} Bonus awarded
     */
    static awardTaskStartBonus(taskId = 'unknown', difficulty = 1.0) {
        try {
            const bonus = this.calculateTaskStartBonus(taskId, difficulty);

            this.addPoints(bonus, ZEN_TRANSACTION_TYPES.TASK_START, true, {
                taskId,
                difficulty
            });

            return bonus;

        } catch (error) {
            console.error('Error awarding task start bonus:', error);
            return 0;
        }
    }

    /**
     * Award task completion bonus
     * @param {number} finalStressLevel - Final stress level
     * @param {string} taskId - Task identifier
     * @returns {Object} Bonus breakdown
     */
    static awardCompletionBonus(finalStressLevel = 50, taskId = 'unknown') {
        try {
            const breakdown = this.calculateCompletionBonus(finalStressLevel);

            this.addPoints(breakdown.totalBonus, ZEN_TRANSACTION_TYPES.TASK_COMPLETION, true, {
                taskId,
                stressLevel: finalStressLevel,
                breakdown
            });

            return breakdown;

        } catch (error) {
            console.error('Error awarding completion bonus:', error);
            return this.calculateCompletionBonus(finalStressLevel);
        }
    }

    /**
     * Validate and repair zen point balance
     * @returns {boolean} Whether repair was needed
     */
    static validateBalance() {
        try {
            let repairNeeded = false;
            const currentBalance = this.getCurrentBalance();

            // Check for invalid values
            if (typeof currentBalance !== 'number' || isNaN(currentBalance)) {
                console.warn('Invalid zen point balance detected, repairing');
                this.setBalance(ZEN_CONFIG.TASK_START_BASE);
                repairNeeded = true;
            }
            // Check for negative balance
            else if (currentBalance < ZEN_CONFIG.MIN_BALANCE) {
                console.warn('Negative zen point balance detected, repairing');
                this.setBalance(ZEN_CONFIG.MIN_BALANCE);
                repairNeeded = true;
            }
            // Check for overflow
            else if (currentBalance > ZEN_CONFIG.MAX_BALANCE) {
                console.warn('Zen point balance overflow detected, capping');
                this.setBalance(ZEN_CONFIG.MAX_BALANCE);
                repairNeeded = true;
            }

            return repairNeeded;

        } catch (error) {
            console.error('Error validating zen point balance:', error);
            // Emergency repair
            this.setBalance(ZEN_CONFIG.TASK_START_BASE);
            return true;
        }
    }

    /**
     * Initialize zen points for campaign mode
     * Migrates legacy data if needed
     */
    static initializeCampaignBalance() {
        try {
            // Check if campaign already has zen point balance
            if (typeof campaignState.zenPointBalance === 'number') {
                // Validate existing balance
                this.validateBalance();
                return;
            }

            // Migration from legacy data
            let initialBalance = ZEN_CONFIG.TASK_START_BASE;

            // Try to derive balance from existing data
            if (typeof gameState.zenPoints === 'number' && gameState.zenPoints > 0) {
                initialBalance = gameState.zenPoints;
            } else if (typeof campaignState.totalZenEarned === 'number' && campaignState.totalZenEarned > 0) {
                // Estimate balance from total earned (conservative estimate)
                initialBalance = Math.floor(campaignState.totalZenEarned * 0.3);
            }

            // Set initial balance
            updateCampaignState({
                zenPointBalance: initialBalance,
                lastBalanceUpdate: Date.now()
            });

            console.log(`Campaign zen point balance initialized: ${initialBalance}`);

        } catch (error) {
            console.error('Error initializing campaign balance:', error);
            // Fallback to default
            updateCampaignState({
                zenPointBalance: ZEN_CONFIG.TASK_START_BASE,
                lastBalanceUpdate: Date.now()
            });
        }
    }

    /**
     * Log transaction for debugging and recovery
     * @param {number} amount - Transaction amount (positive for gain, negative for spend)
     * @param {string} type - Transaction type
     * @param {Object} metadata - Additional data
     */
    static logTransaction(amount, type, metadata = {}) {
        try {
            const transaction = {
                amount,
                type,
                timestamp: Date.now(),
                balance: this.getCurrentBalance(),
                metadata
            };

            transactionHistory.push(transaction);

            // Keep only last 100 transactions to prevent memory issues
            if (transactionHistory.length > 100) {
                transactionHistory = transactionHistory.slice(-100);
            }

        } catch (error) {
            console.error('Error logging zen point transaction:', error);
        }
    }

    /**
     * Get transaction history for debugging
     * @param {number} limit - Number of recent transactions to return
     * @returns {Array} Transaction history
     */
    static getTransactionHistory(limit = 10) {
        try {
            return transactionHistory.slice(-limit);
        } catch (error) {
            console.error('Error getting transaction history:', error);
            return [];
        }
    }

    /**
     * Show visual feedback for zen point changes
     * @param {number} amount - Amount changed
     * @param {string} type - Transaction type
     * @param {string} direction - 'gain' or 'spend'
     */
    static showZenPointFeedback(amount, type, direction) {
        try {
            // Import UI functions dynamically to avoid circular dependencies
            if (typeof window !== 'undefined' && window.showZenPointAnimation) {
                window.showZenPointAnimation(amount, type, direction);
            } else {
                // Fallback to simple popup
                this.showSimplePopup(amount, direction);
            }
        } catch (error) {
            console.error('Error showing zen point feedback:', error);
        }
    }

    /**
     * Simple popup fallback for zen point feedback
     * @param {number} amount - Amount changed
     * @param {string} direction - 'gain' or 'spend'
     */
    static showSimplePopup(amount, direction) {
        try {
            const popup = document.createElement('div');
            popup.className = `popup-notification zen-${direction}`;

            const emoji = direction === 'gain' ? '✨' : '💸';
            const sign = direction === 'gain' ? '+' : '-';
            popup.textContent = `${emoji} ${sign}${amount} Zen Points!`;

            popup.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${direction === 'gain' ? '#2ECC71' : '#E74C3C'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                font-weight: bold;
                z-index: 2000;
                animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            `;

            document.body.appendChild(popup);

            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 3000);

        } catch (error) {
            console.error('Error showing simple zen point popup:', error);
        }
    }

    /**
     * Get zen point statistics
     * @returns {Object} Statistics object
     */
    static getStatistics() {
        try {
            const currentBalance = this.getCurrentBalance();
            const recentTransactions = this.getTransactionHistory(50);

            const totalEarned = recentTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);

            const totalSpent = recentTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            return {
                currentBalance,
                totalEarned,
                totalSpent,
                transactionCount: recentTransactions.length,
                lastTransaction: recentTransactions[recentTransactions.length - 1] || null
            };

        } catch (error) {
            console.error('Error getting zen point statistics:', error);
            return {
                currentBalance: this.getCurrentBalance(),
                totalEarned: 0,
                totalSpent: 0,
                transactionCount: 0,
                lastTransaction: null
            };
        }
    }
}

// Export configuration for external use
export { ZEN_CONFIG };

// Initialize on module load
if (typeof window !== 'undefined') {
    // Make available globally for debugging
    window.ZenPointsManager = ZenPointsManager;
    window.zenPointsDebug = {
        getBalance: () => ZenPointsManager.getCurrentBalance(),
        addPoints: (amount) => ZenPointsManager.addPoints(amount, ZEN_TRANSACTION_TYPES.ADMIN_ADJUSTMENT),
        getHistory: () => ZenPointsManager.getTransactionHistory(),
        getStats: () => ZenPointsManager.getStatistics()
    };
}