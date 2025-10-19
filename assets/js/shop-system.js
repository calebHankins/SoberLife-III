// SoberLife III - Shop System
// Upgrade purchasing logic and deck modifications

import { campaignState, updateCampaignState, unlockPremiumActivity } from './game-state.js';
import { hideElement, showElement } from './ui-manager.js';
import { ZenPointsManager, ZEN_TRANSACTION_TYPES } from './zen-points-manager.js';

// Shop configuration
export const shopConfig = {
    jokerUpgrade: {
        baseCost: 75,        // Higher cost than Aces due to superior functionality
        costIncrease: 200,    // Steeper cost increase
        maxJokers: 52         // Reasonable limit to maintain game balance
    },
    // Legacy ace upgrade (for backward compatibility)
    aceUpgrade: {
        baseCost: 50,
        costIncrease: 25,
        maxAces: 20
    }
};

// Premium activity shop items
export const premiumActivities = {
    mindfulBreathing: {
        name: 'Mindful Breathing',
        cost: 1000,
        description: 'Unlock advanced breathing techniques for 50% stress reduction',
        emoji: '🌸',
        category: 'stress-relief',
        details: 'A powerful mindfulness technique that combines deep breathing with focused awareness for maximum stress relief.'
    },
    compartmentalize: {
        name: 'Compartmentalize',
        cost: 2000,
        description: 'Learn to split overwhelming situations into manageable parts',
        emoji: '🧠',
        category: 'reactive',
        details: 'Advanced psychological technique that allows you to recover from bust situations by breaking them down into smaller, manageable components.'
    }
};

// Calculate current joker upgrade cost
export function getJokerUpgradeCost() {
    const { jokersAdded } = campaignState.shopUpgrades;
    return shopConfig.jokerUpgrade.baseCost + (jokersAdded * shopConfig.jokerUpgrade.costIncrease);
}

// Legacy function for backward compatibility
export function getAceUpgradeCost() {
    const { acesAdded } = campaignState.shopUpgrades;
    return shopConfig.aceUpgrade.baseCost + (acesAdded * shopConfig.aceUpgrade.costIncrease);
}

// Check if joker upgrade is available
export function canPurchaseJokerUpgrade(zenPoints) {
    const cost = getJokerUpgradeCost();
    const currentJokers = campaignState.deckComposition.jokers;
    const currentAces = campaignState.deckComposition.aces;

    return (
        zenPoints >= cost &&
        currentJokers < shopConfig.jokerUpgrade.maxJokers &&
        (campaignState.deckComposition.totalCards - currentAces - currentJokers) > 0 // Must have non-special cards to replace
    );
}

// Legacy function for backward compatibility
export function canPurchaseAceUpgrade(zenPoints) {
    const cost = getAceUpgradeCost();
    const currentAces = campaignState.deckComposition.aces;

    return (
        zenPoints >= cost &&
        currentAces < shopConfig.aceUpgrade.maxAces &&
        (campaignState.deckComposition.totalCards - currentAces) > 0 // Must have non-ace cards to replace
    );
}

// Purchase joker upgrade
export function purchaseJokerUpgrade(currentZenPoints) {
    try {
        const cost = getJokerUpgradeCost();

        // Validate purchase
        if (!canPurchaseJokerUpgrade(currentZenPoints)) {
            console.warn('Cannot purchase joker upgrade - insufficient funds or max jokers reached');
            return {
                success: false,
                message: 'Cannot purchase upgrade',
                zenPointsRemaining: currentZenPoints
            };
        }

        // Process purchase using zen points manager
        const purchaseSuccess = ZenPointsManager.spendPoints(cost, ZEN_TRANSACTION_TYPES.SHOP_PURCHASE, true, {
            item: 'joker',
            cost: cost
        });

        if (!purchaseSuccess) {
            return {
                success: false,
                message: 'Failed to process zen point transaction',
                zenPointsRemaining: currentZenPoints
            };
        }

        const newJokerCount = campaignState.deckComposition.jokers + 1;
        const newZenPoints = ZenPointsManager.getCurrentBalance();

        // Update campaign state
        updateCampaignState({
            deckComposition: {
                ...campaignState.deckComposition,
                jokers: newJokerCount
            },
            shopUpgrades: {
                ...campaignState.shopUpgrades,
                jokersAdded: campaignState.shopUpgrades.jokersAdded + 1,
                totalSpent: campaignState.shopUpgrades.totalSpent + cost
            }
        });

        console.log(`Joker upgrade purchased! New joker count: ${newJokerCount}, Cost: ${cost}, Remaining zen: ${newZenPoints}`);
        console.log('Campaign state after purchase:', campaignState);

        return {
            success: true,
            message: `Joker added to your deck! (+1 Wild Joker for ${cost} zen points)`,
            zenPointsRemaining: newZenPoints,
            newJokerCount: newJokerCount,
            cost: cost
        };

    } catch (error) {
        console.error('Error purchasing joker upgrade:', error);
        return {
            success: false,
            message: 'Purchase failed due to an error',
            zenPointsRemaining: currentZenPoints
        };
    }
}

// Legacy function for backward compatibility
export function purchaseAceUpgrade(currentZenPoints) {
    try {
        const cost = getAceUpgradeCost();

        // Validate purchase
        if (!canPurchaseAceUpgrade(currentZenPoints)) {
            console.warn('Cannot purchase ace upgrade - insufficient funds or max aces reached');
            return {
                success: false,
                message: 'Cannot purchase upgrade',
                zenPointsRemaining: currentZenPoints
            };
        }

        // Process purchase
        const newZenPoints = currentZenPoints - cost;
        const newAceCount = campaignState.deckComposition.aces + 1;

        // Update campaign state
        updateCampaignState({
            deckComposition: {
                ...campaignState.deckComposition,
                aces: newAceCount
            },
            shopUpgrades: {
                ...campaignState.shopUpgrades,
                acesAdded: campaignState.shopUpgrades.acesAdded + 1,
                totalSpent: campaignState.shopUpgrades.totalSpent + cost
            }
        });

        console.log(`Ace upgrade purchased! New ace count: ${newAceCount}, Cost: ${cost}, Remaining zen: ${newZenPoints}`);

        return {
            success: true,
            message: `Ace added to your deck! (+1 Ace for ${cost} zen points)`,
            zenPointsRemaining: newZenPoints,
            newAceCount: newAceCount,
            cost: cost
        };

    } catch (error) {
        console.error('Error purchasing ace upgrade:', error);
        return {
            success: false,
            message: 'Purchase failed due to an error',
            zenPointsRemaining: currentZenPoints
        };
    }
}

// Check if premium activity can be purchased
export function canPurchasePremiumActivity(activityId, zenPoints) {
    const activity = premiumActivities[activityId];
    if (!activity) return false;

    // Check if already unlocked
    if (campaignState.unlockedActivities && campaignState.unlockedActivities[activityId]) {
        return false;
    }

    return zenPoints >= activity.cost;
}

// Purchase premium activity
export function purchasePremiumActivity(activityId, currentZenPoints) {
    try {
        const activity = premiumActivities[activityId];
        if (!activity) {
            return {
                success: false,
                message: 'Invalid activity',
                zenPointsRemaining: currentZenPoints
            };
        }

        // Validate purchase
        if (!canPurchasePremiumActivity(activityId, currentZenPoints)) {
            if (campaignState.unlockedActivities && campaignState.unlockedActivities[activityId]) {
                return {
                    success: false,
                    message: 'Activity already unlocked',
                    zenPointsRemaining: currentZenPoints
                };
            }
            return {
                success: false,
                message: 'Insufficient zen points',
                zenPointsRemaining: currentZenPoints
            };
        }

        // Process purchase using zen points manager
        const purchaseSuccess = ZenPointsManager.spendPoints(activity.cost, ZEN_TRANSACTION_TYPES.SHOP_PURCHASE, true, {
            item: activityId,
            type: 'premium_activity',
            cost: activity.cost
        });

        if (!purchaseSuccess) {
            return {
                success: false,
                message: 'Failed to process zen point transaction',
                zenPointsRemaining: currentZenPoints
            };
        }

        const newZenPoints = ZenPointsManager.getCurrentBalance();

        // Unlock activity permanently
        unlockPremiumActivity(activityId);

        // Save to campaign state for persistence
        updateCampaignState({
            unlockedActivities: {
                ...campaignState.unlockedActivities,
                [activityId]: true
            },
            shopUpgrades: {
                ...campaignState.shopUpgrades,
                totalSpent: campaignState.shopUpgrades.totalSpent + activity.cost
            }
        });

        console.log(`Premium activity ${activityId} purchased! Cost: ${activity.cost}, Remaining zen: ${newZenPoints}`);

        return {
            success: true,
            message: `${activity.name} unlocked! You can now use this advanced technique.`,
            zenPointsRemaining: newZenPoints,
            activityId: activityId,
            cost: activity.cost
        };

    } catch (error) {
        console.error('Error purchasing premium activity:', error);
        return {
            success: false,
            message: 'Purchase failed due to an error',
            zenPointsRemaining: currentZenPoints
        };
    }
}

// Update shop UI with current state
export function updateShopUI(zenPoints) {
    try {
        // Update zen points display
        const shopZenPointsElement = document.getElementById('shopZenPoints');
        if (shopZenPointsElement) {
            shopZenPointsElement.textContent = zenPoints;
        }

        // Update joker upgrade information
        const cost = getJokerUpgradeCost();
        const currentJokers = campaignState.deckComposition.jokers;
        const canPurchase = canPurchaseJokerUpgrade(zenPoints);

        // Update cost display (using joker elements)
        const costElement = document.getElementById('jokerUpgradeCost') || document.getElementById('aceUpgradeCost');
        if (costElement) {
            costElement.textContent = cost;
        }

        // Update current jokers display
        const jokersElement = document.getElementById('currentJokers') || document.getElementById('currentAces');
        if (jokersElement) {
            jokersElement.textContent = currentJokers;
        }

        // Update purchase button
        const purchaseButton = document.getElementById('jokerUpgradeBtn') || document.getElementById('aceUpgradeBtn');
        if (purchaseButton) {
            purchaseButton.disabled = !canPurchase;

            if (!canPurchase) {
                if (zenPoints < cost) {
                    purchaseButton.textContent = 'Insufficient Zen';
                } else if (currentJokers >= shopConfig.jokerUpgrade.maxJokers) {
                    purchaseButton.textContent = 'Max Jokers Reached';
                } else {
                    purchaseButton.textContent = 'Cannot Purchase';
                }
            } else {
                purchaseButton.textContent = 'Purchase Joker';
            }
        }

        // Update upgrade card styling based on availability
        const upgradeCard = document.getElementById('jokerUpgradeCard') || document.getElementById('aceUpgradeCard');
        if (upgradeCard) {
            if (canPurchase) {
                upgradeCard.classList.remove('unavailable');
            } else {
                upgradeCard.classList.add('unavailable');
            }
        }

        // Update premium activities
        updatePremiumActivityUI('mindfulBreathing', zenPoints);
        updatePremiumActivityUI('compartmentalize', zenPoints);

    } catch (error) {
        console.error('Error updating shop UI:', error);
    }
}

// Update premium activity UI elements
function updatePremiumActivityUI(activityId, zenPoints) {
    const activity = premiumActivities[activityId];
    if (!activity) return;

    const isUnlocked = campaignState.unlockedActivities && campaignState.unlockedActivities[activityId];
    const canPurchase = canPurchasePremiumActivity(activityId, zenPoints);

    // Update status display
    const statusElement = document.getElementById(`${activityId}Status`);
    if (statusElement) {
        statusElement.textContent = isUnlocked ? 'Unlocked' : 'Locked';
        statusElement.className = isUnlocked ? 'status-unlocked' : 'status-locked';
    }

    // Update purchase button
    const button = document.getElementById(`${activityId}Btn`);
    if (button) {
        if (isUnlocked) {
            button.textContent = 'Already Unlocked';
            button.disabled = true;
        } else if (canPurchase) {
            button.textContent = 'Unlock Activity';
            button.disabled = false;
        } else {
            button.textContent = 'Insufficient Zen';
            button.disabled = true;
        }
    }

    // Update card styling
    const card = document.getElementById(`${activityId}Card`);
    if (card) {
        if (isUnlocked) {
            card.classList.add('unlocked');
            card.classList.remove('unavailable');
        } else if (canPurchase) {
            card.classList.remove('unavailable', 'unlocked');
        } else {
            card.classList.add('unavailable');
            card.classList.remove('unlocked');
        }
    }
}

// Show shop with current zen points
export function openShop(zenPoints) {
    try {
        updateShopUI(zenPoints);
        showElement('upgradeShop');

        // Focus on shop for accessibility
        const shopElement = document.getElementById('upgradeShop');
        if (shopElement) {
            shopElement.focus();
        }

        console.log(`Shop opened with ${zenPoints} zen points`);

    } catch (error) {
        console.error('Error opening shop:', error);
    }
}

// Close shop
export function closeShop() {
    try {
        hideElement('upgradeShop');
        console.log('Shop closed');
    } catch (error) {
        console.error('Error closing shop:', error);
    }
}

// Wrapper function for purchasing premium activities (called from HTML)
export function purchasePremiumActivityWrapper(activityId) {
    const currentZenPoints = ZenPointsManager.getCurrentBalance();
    const result = purchasePremiumActivity(activityId, currentZenPoints);

    // Update UI
    updateShopUI(ZenPointsManager.getCurrentBalance());

    // Show feedback
    showPurchaseFeedback(result);

    return result;
}

// Show purchase feedback
export function showPurchaseFeedback(result) {
    try {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `purchase-feedback ${result.success ? 'success' : 'error'}`;
        feedback.textContent = result.message;

        // Add to shop content
        const shopContent = document.querySelector('.shop-content');
        if (shopContent) {
            shopContent.appendChild(feedback);

            // Remove after animation
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 3000);
        }

        // Also show as popup notification
        showPopupNotification(result.message, result.success ? 'success' : 'error');

    } catch (error) {
        console.error('Error showing purchase feedback:', error);
    }
}

// Show popup notification (similar to main game)
function showPopupNotification(message, type = 'default') {
    try {
        const popup = document.createElement('div');
        popup.className = `popup-notification ${type}`;
        popup.textContent = message;

        // Style the popup
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 2000;
            animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(popup);

        // Remove popup after animation
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 3000);

    } catch (error) {
        console.error('Error showing popup notification:', error);
    }
}

// Get shop statistics for display
export function getShopStatistics() {
    const { aces, jokers } = campaignState.deckComposition;
    const { acesAdded, jokersAdded, totalSpent } = campaignState.shopUpgrades;

    return {
        totalAcesAdded: acesAdded,
        totalJokersAdded: jokersAdded,
        totalZenSpent: totalSpent,
        currentAces: aces,
        currentJokers: jokers,
        deckPowerLevel: Math.round(((aces + jokers) / 52) * 100) // Percentage of special cards in deck
    };
}

// Reset shop upgrades (for campaign reset)
export function resetShopUpgrades() {
    updateCampaignState({
        deckComposition: {
            aces: 4,
            jokers: 0,
            totalCards: 52
        },
        shopUpgrades: {
            acesAdded: 0,
            jokersAdded: 0,
            totalSpent: 0
        }
    });
}

// Validate shop state for error recovery
export function validateShopState() {
    try {
        const { deckComposition, shopUpgrades } = campaignState;

        // Ensure valid deck composition
        if (!deckComposition || typeof deckComposition.aces !== 'number' || typeof deckComposition.totalCards !== 'number') {
            console.warn('Invalid deck composition, resetting to defaults');
            updateCampaignState({
                deckComposition: {
                    aces: 4,
                    jokers: 0,
                    totalCards: 52
                }
            });
        }

        // Ensure jokers property exists
        if (typeof deckComposition.jokers !== 'number') {
            console.warn('Missing jokers in deck composition, adding default');
            updateCampaignState({
                deckComposition: {
                    ...deckComposition,
                    jokers: 0
                }
            });
        }

        // Ensure valid shop upgrades
        if (!shopUpgrades || typeof shopUpgrades.totalSpent !== 'number') {
            console.warn('Invalid shop upgrades, resetting to defaults');
            updateCampaignState({
                shopUpgrades: {
                    acesAdded: 0,
                    jokersAdded: 0,
                    totalSpent: 0
                }
            });
        }

        // Ensure jokersAdded property exists
        if (typeof shopUpgrades.jokersAdded !== 'number') {
            console.warn('Missing jokersAdded in shop upgrades, adding default');
            updateCampaignState({
                shopUpgrades: {
                    ...shopUpgrades,
                    jokersAdded: 0
                }
            });
        }

        // Ensure acesAdded property exists (for backward compatibility)
        if (typeof shopUpgrades.acesAdded !== 'number') {
            console.warn('Missing acesAdded in shop upgrades, adding default');
            updateCampaignState({
                shopUpgrades: {
                    ...shopUpgrades,
                    acesAdded: 0
                }
            });
        }

        // Validate special card count consistency
        const expectedAces = 4 + (shopUpgrades?.acesAdded || 0);
        const expectedJokers = shopUpgrades?.jokersAdded || 0;

        if (deckComposition?.aces !== expectedAces) {
            console.warn('Ace count inconsistency detected, correcting');
            updateCampaignState({
                deckComposition: {
                    ...deckComposition,
                    aces: expectedAces
                }
            });
        }

        if (deckComposition?.jokers !== expectedJokers) {
            console.warn('Joker count inconsistency detected, correcting');
            updateCampaignState({
                deckComposition: {
                    ...deckComposition,
                    jokers: expectedJokers
                }
            });
        }

        return true;

    } catch (error) {
        console.error('Error validating shop state:', error);
        return false;
    }
}