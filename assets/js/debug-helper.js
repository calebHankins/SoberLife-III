// SoberLife III - Debug Helper
// Development tools for testing and debugging

import { updateGameState, campaignState, updateCampaignState } from './game-state.js';
import { ZenPointsManager, ZEN_TRANSACTION_TYPES } from './zen-points-manager.js';
import { updateDisplay } from './ui-manager.js';

// Debug helper object
export const DebugHelper = {
    // Add zen points
    addZenPoints(amount = 1000) {
        try {
            ZenPointsManager.addPoints(amount, ZEN_TRANSACTION_TYPES.DEBUG, true, {
                reason: 'Debug helper'
            });
            updateDisplay();
            console.log(`✅ Added ${amount} zen points. New balance: ${ZenPointsManager.getCurrentBalance()}`);
            return true;
        } catch (error) {
            console.error('Error adding zen points:', error);
            return false;
        }
    },

    // Auto-win current hand
    autoWin() {
        try {
            // Set player cards to 21
            updateGameState({
                playerCards: [
                    { suit: '♠', value: 'A', display: 'A♠' },
                    { suit: '♥', value: 'K', display: 'K♥' }
                ],
                houseCards: [
                    { suit: '♦', value: '10', display: '10♦' },
                    { suit: '♣', value: '9', display: '9♣' }
                ]
            });

            // Trigger stand to complete the hand
            if (window.stand) {
                window.stand();
            }

            console.log('✅ Auto-win triggered');
            return true;
        } catch (error) {
            console.error('Error auto-winning:', error);
            return false;
        }
    },

    // Add jokers to deck
    addJokers(count = 1) {
        try {
            const currentJokers = campaignState.deckComposition.jokers;
            const newJokerCount = currentJokers + count;

            updateCampaignState({
                deckComposition: {
                    ...campaignState.deckComposition,
                    jokers: newJokerCount
                },
                shopUpgrades: {
                    ...campaignState.shopUpgrades,
                    jokersAdded: campaignState.shopUpgrades.jokersAdded + count
                }
            });

            console.log(`✅ Added ${count} joker(s). New joker count: ${newJokerCount}`);
            console.log('Current deck composition:', campaignState.deckComposition);
            return true;
        } catch (error) {
            console.error('Error adding jokers:', error);
            return false;
        }
    },

    // Show current deck composition
    showDeckComposition() {
        console.log('Current Deck Composition:', campaignState.deckComposition);
        console.log('Shop Upgrades:', campaignState.shopUpgrades);
        return campaignState.deckComposition;
    },

    // Reset stress to 0
    resetStress() {
        try {
            updateGameState({ stressLevel: 0 });
            updateDisplay();
            console.log('✅ Stress reset to 0%');
            return true;
        } catch (error) {
            console.error('Error resetting stress:', error);
            return false;
        }
    },

    // Set stress to specific level
    setStress(level) {
        try {
            const clampedLevel = Math.max(0, Math.min(100, level));
            updateGameState({ stressLevel: clampedLevel });
            updateDisplay();
            console.log(`✅ Stress set to ${clampedLevel}%`);
            return true;
        } catch (error) {
            console.error('Error setting stress:', error);
            return false;
        }
    },

    // Show help
    help() {
        console.log(`
🛠️ SoberLife III Debug Helper

Available Commands:
  DebugHelper.addZenPoints(amount)     - Add zen points (default: 1000)
  DebugHelper.autoWin()                - Auto-win current hand
  DebugHelper.addJokers(count)         - Add jokers to deck (default: 1)
  DebugHelper.showDeckComposition()    - Show current deck composition
  DebugHelper.resetStress()            - Reset stress to 0%
  DebugHelper.setStress(level)         - Set stress to specific level (0-100)
  DebugHelper.help()                   - Show this help message

Examples:
  DebugHelper.addZenPoints(5000)       - Add 5000 zen points
  DebugHelper.addJokers(3)             - Add 3 jokers to deck
  DebugHelper.setStress(50)            - Set stress to 50%
        `);
    }
};

// Expose to window for console access
if (typeof window !== 'undefined') {
    window.DebugHelper = DebugHelper;
    console.log('🛠️ Debug Helper loaded. Type "DebugHelper.help()" for available commands.');
}
