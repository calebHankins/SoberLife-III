// SoberLife III - Shop System
// Upgrade purchasing logic and deck modifications

import { campaignState, updateCampaignState } from './game-state.js';
import { hideElement, showElement } from './ui-manager.js';

// Shop configuration
export const shopConfig = {
    aceUpgrade: {
        baseCost: 50,
        costIncrease: 25, // Cost increases with each purchase
        maxAces: 20 // Maximum aces allowed in deck
    }
};

// Calculate current ace upgrade cost
export function getAceUpgradeCost() {
    const { acesAdded } = campaignState.shopUpgrades;
    return shopConfig.aceUpgrade.baseCost + (acesAdded * shopConfig.aceUpgrade.costIncrease);
}

// Check if ace upgrade is available
export function canPurchaseAceUpgrade(zenPoints) {
    const cost = getAceUpgradeCost();
    const currentAces = campaignState.deckComposition.aces;
    
    return (
        zenPoints >= cost &&
        currentAces < shopConfig.aceUpgrade.maxAces &&
        (campaignState.deckComposition.totalCards - currentAces) > 0 // Must have non-ace cards to replace
    );
}

// Purchase ace upgrade
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

// Update shop UI with current state
export function updateShopUI(zenPoints) {
    try {
        // Update zen points display
        const shopZenPointsElement = document.getElementById('shopZenPoints');
        if (shopZenPointsElement) {
            shopZenPointsElement.textContent = zenPoints;
        }
        
        // Update ace upgrade information
        const cost = getAceUpgradeCost();
        const currentAces = campaignState.deckComposition.aces;
        const canPurchase = canPurchaseAceUpgrade(zenPoints);
        
        // Update cost display
        const costElement = document.getElementById('aceUpgradeCost');
        if (costElement) {
            costElement.textContent = cost;
        }
        
        // Update current aces display
        const acesElement = document.getElementById('currentAces');
        if (acesElement) {
            acesElement.textContent = currentAces;
        }
        
        // Update purchase button
        const purchaseButton = document.getElementById('aceUpgradeBtn');
        if (purchaseButton) {
            purchaseButton.disabled = !canPurchase;
            
            if (!canPurchase) {
                if (zenPoints < cost) {
                    purchaseButton.textContent = 'Insufficient Zen';
                } else if (currentAces >= shopConfig.aceUpgrade.maxAces) {
                    purchaseButton.textContent = 'Max Aces Reached';
                } else {
                    purchaseButton.textContent = 'Cannot Purchase';
                }
            } else {
                purchaseButton.textContent = 'Purchase Ace';
            }
        }
        
        // Update upgrade card styling based on availability
        const upgradeCard = document.getElementById('aceUpgradeCard');
        if (upgradeCard) {
            if (canPurchase) {
                upgradeCard.classList.remove('unavailable');
            } else {
                upgradeCard.classList.add('unavailable');
            }
        }
        
    } catch (error) {
        console.error('Error updating shop UI:', error);
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
    return {
        totalAcesAdded: campaignState.shopUpgrades.acesAdded,
        totalZenSpent: campaignState.shopUpgrades.totalSpent,
        currentAces: campaignState.deckComposition.aces,
        deckPowerLevel: Math.round((campaignState.deckComposition.aces / 52) * 100) // Percentage of aces in deck
    };
}

// Reset shop upgrades (for campaign reset)
export function resetShopUpgrades() {
    updateCampaignState({
        deckComposition: {
            aces: 4,
            totalCards: 52
        },
        shopUpgrades: {
            acesAdded: 0,
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
                    totalCards: 52
                }
            });
        }
        
        // Ensure valid shop upgrades
        if (!shopUpgrades || typeof shopUpgrades.acesAdded !== 'number' || typeof shopUpgrades.totalSpent !== 'number') {
            console.warn('Invalid shop upgrades, resetting to defaults');
            updateCampaignState({
                shopUpgrades: {
                    acesAdded: 0,
                    totalSpent: 0
                }
            });
        }
        
        // Validate ace count consistency
        const expectedAces = 4 + (shopUpgrades?.acesAdded || 0);
        if (deckComposition?.aces !== expectedAces) {
            console.warn('Ace count inconsistency detected, correcting');
            updateCampaignState({
                deckComposition: {
                    ...deckComposition,
                    aces: expectedAces
                }
            });
        }
        
        return true;
        
    } catch (error) {
        console.error('Error validating shop state:', error);
        return false;
    }
}