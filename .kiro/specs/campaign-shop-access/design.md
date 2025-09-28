# Design Document

## Overview

This feature enhances the campaign experience by adding direct shop access from the campaign overview screen and introducing an intelligent Joker card system. The design focuses on improving player agency in deck management while creating more engaging and strategic gameplay through wild cards that automatically optimize for the best possible score.

## Architecture

### Component Integration
- **Campaign Manager**: Extended to handle shop access from overview screen
- **Shop System**: Enhanced to support Joker cards instead of Aces
- **Card System**: New Joker card logic with intelligent value calculation
- **UI Manager**: New deck viewer modal and enhanced visual effects for Jokers
- **Game State**: Updated to track Jokers separately from Aces in deck composition

### Data Flow
1. Campaign Overview → Shop Access → Joker Purchase → Deck Update → Campaign Overview
2. Campaign Overview → Deck Viewer → Composition Display → Campaign Overview  
3. Gameplay → Joker Draw → Value Calculation → Visual Effects → Score Update

## Components and Interfaces

### Enhanced Campaign Overview UI
```html
<div class="campaign-actions">
    <button onclick="openCampaignShop()" class="primary-btn">🛒 Visit Shop</button>
    <button onclick="viewDeckComposition()" class="secondary-btn">🃏 View Deck</button>
    <button onclick="resetCampaign()" class="secondary-btn">Reset Campaign</button>
</div>
```

### Deck Composition Modal
```html
<div class="deck-viewer-modal hidden" id="deckViewerModal">
    <div class="deck-viewer-content">
        <h2>🃏 Your Deck Composition</h2>
        <div class="deck-stats">
            <div class="card-type">
                <span class="card-icon">🃏</span>
                <span class="card-count">Jokers: <span id="jokerCount">0</span></span>
            </div>
            <div class="card-type">
                <span class="card-icon">🂡</span>
                <span class="card-count">Aces: <span id="aceCount">4</span></span>
            </div>
            <div class="card-type">
                <span class="card-icon">🂠</span>
                <span class="card-count">Regular Cards: <span id="regularCount">48</span></span>
            </div>
        </div>
        <div class="upgrade-history">
            <h3>Upgrade History</h3>
            <p id="upgradeHistory">Base deck: 4 Aces + 48 Regular Cards</p>
        </div>
        <button onclick="closeDeckViewer()" class="primary-btn">Close</button>
    </div>
</div>
```

### Enhanced Shop System
```javascript
// Updated shop configuration for Jokers
export const shopConfig = {
    jokerUpgrade: {
        baseCost: 75,        // Higher cost than Aces due to superior functionality
        costIncrease: 50,    // Steeper cost increase
        maxJokers: 52         // Reasonable limit to maintain game balance
    }
};
```

### Joker Card Logic
```javascript
// Joker card class with intelligent value calculation
class JokerCard {
    constructor() {
        this.suit = '🌈';           // Rainbow suit indicator
        this.display = '🃏';        // Joker display character
        this.isJoker = true;
        this.calculatedValue = null; // Determined dynamically
    }
    
    calculateOptimalValue(currentHandTotal, otherCards) {
        // Calculate best value to reach 21 or get as close as possible
        const targetScore = 21;
        const neededValue = targetScore - currentHandTotal;
        
        // Clamp between 1 and 11 (Ace range)
        if (neededValue >= 1 && neededValue <= 11) {
            this.calculatedValue = neededValue;
            return neededValue;
        } else if (neededValue > 11) {
            this.calculatedValue = 11; // Maximum value
            return 11;
        } else {
            this.calculatedValue = 1;  // Minimum value to avoid bust
            return 1;
        }
    }
}
```

## Data Models

### Enhanced Deck Composition
```javascript
// Updated campaign state structure
campaignState = {
    // ... existing properties
    deckComposition: {
        aces: 4,           // Base Aces (unchanged)
        jokers: 0,         // Purchased Jokers
        totalCards: 52     // Total deck size
    },
    shopUpgrades: {
        jokersAdded: 0,    // Number of Jokers purchased
        acesAdded: 0,      // Legacy Ace purchases (for migration)
        totalSpent: 0      // Total zen points spent
    }
};
```

### Joker Visual Effects Configuration
```javascript
const jokerEffects = {
    cardStyle: {
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
        backgroundSize: '400% 400%',
        animation: 'rainbow-shift 3s ease infinite',
        border: '2px solid gold',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
    },
    
    valueCalculation: {
        animation: 'joker-calculate 1s ease-out',
        glowEffect: '0 0 15px rgba(255, 255, 255, 0.8)'
    },
    
    perfectScore: {
        celebration: 'joker-perfect 2s ease-out',
        particles: true,
        sound: 'circus-fanfare' // If sound is added later
    }
};
```

## Error Handling

### Joker Calculation Fallbacks
- If calculation fails, default to value of 1 to prevent bust
- Validate hand totals before and after Joker value assignment
- Handle edge cases where multiple Jokers need coordination

### Shop Integration Error Handling
- Graceful fallback if shop fails to open from campaign overview
- Validate zen points balance before allowing purchases
- Handle deck composition updates with rollback on failure

### UI State Management
- Ensure deck viewer modal closes properly on errors
- Handle missing DOM elements gracefully
- Provide user feedback for all error conditions

## Testing Strategy

### Unit Tests
- Joker value calculation logic with various hand scenarios
- Shop integration from campaign overview
- Deck composition display and updates
- Visual effect rendering and cleanup

### Integration Tests
- Complete flow: Campaign → Shop → Purchase → Deck Update → Gameplay
- Joker cards in actual blackjack gameplay scenarios
- Multiple Joker coordination in single hand
- Campaign state persistence with new Joker data

### Visual Testing
- Joker card visual effects across different devices
- Modal responsiveness for deck viewer
- Shop button placement and accessibility
- Animation performance and smoothness

### Edge Case Testing
- Maximum Jokers in deck scenario
- Insufficient zen points for purchases
- Multiple Jokers calculating optimal values simultaneously
- Campaign state migration from Ace-only to Joker system

## Performance Considerations

### Joker Value Calculation Optimization
- Cache calculated values during hand to avoid recalculation
- Optimize animation performance for visual effects
- Minimize DOM manipulation during effect rendering

### Modal Management
- Lazy load deck viewer content
- Efficient show/hide transitions
- Memory cleanup for visual effects

### State Management
- Batch deck composition updates
- Minimize localStorage writes during shop interactions
- Efficient campaign state validation and repair

## Accessibility Features

### Keyboard Navigation
- Tab navigation through shop and deck viewer
- Escape key to close modals
- Enter key activation for buttons

### Screen Reader Support
- Proper ARIA labels for Joker cards
- Descriptive text for visual effects
- Clear announcements for value calculations

### Visual Accessibility
- High contrast mode support for Joker effects
- Reduced motion options for animations
- Clear text descriptions of Joker functionality

## Migration Strategy

### Existing Campaign Compatibility
- Detect legacy Ace-only campaigns and migrate gracefully
- Convert existing "acesAdded" to baseline for new system
- Preserve campaign progress during upgrade

### Backward Compatibility
- Maintain existing Ace functionality alongside Jokers
- Support mixed decks with both Aces and Jokers
- Ensure existing save data remains valid