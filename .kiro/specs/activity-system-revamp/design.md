# Activity System Revamp Design

## Overview

This design revamps the zen activity system to eliminate the "spamming" problem by introducing a one-activity-per-hand limitation and adding premium purchasable activities. The centerpiece is the innovative "Compartmentalize" ability that allows players to recover from bust situations by splitting their hand, representing advanced stress management through psychological compartmentalization.

## Architecture

### Activity State Management

The system introduces a new activity state tracking mechanism that operates alongside the existing hand state:

```javascript
// New activity state tracking
export let activityState = {
    usedThisHand: false,           // Tracks if activity used in current hand
    availableActivities: {         // Tracks unlocked premium activities
        breath: true,              // Default activities (always available)
        stretch: true,
        meditation: true,
        mindfulBreathing: false,   // Premium activity
        compartmentalize: false    // Special premium activity
    },
    compartmentalizeInProgress: false,  // Tracks if compartmentalize is active
    splitHands: null              // Stores split hand data when compartmentalizing
};
```

### Integration Points

1. **Hand State Integration**: Activity cooldown resets when `resetHandState()` is called
2. **Zen Points Manager**: Premium activities integrate with existing transaction system
3. **Shop System**: New premium activity purchase options added to existing shop interface
4. **Card System**: Compartmentalize integrates with existing card dealing and scoring logic

## Components and Interfaces

### Enhanced Stress System

```javascript
// Enhanced activity definitions
export const zenActivities = {
    // Existing activities (unchanged)
    breath: {
        cost: 10,
        reduction: 10,
        name: 'Deep Breath',
        emoji: '🌬️',
        type: 'default'
    },
    stretch: {
        cost: 25,
        reduction: 20,
        name: 'Quick Stretch',
        emoji: '🤸',
        type: 'default'
    },
    meditation: {
        cost: 50,
        reduction: 35,
        name: 'Mini Meditation',
        emoji: '🧘',
        type: 'default'
    },
    // New premium activities
    mindfulBreathing: {
        cost: 75,
        reduction: 50,
        name: 'Mindful Breathing',
        emoji: '🌸',
        type: 'premium',
        purchaseCost: 150,
        description: 'Advanced breathing technique that significantly reduces stress'
    },
    compartmentalize: {
        cost: 100,
        reduction: 0,  // Special - doesn't reduce stress, prevents bust
        name: 'Compartmentalize',
        emoji: '🧠',
        type: 'reactive',
        purchaseCost: 200,
        description: 'Split overwhelming situations into manageable parts'
    }
};

// New activity validation function
export function canUseActivity(activity) {
    return !activityState.usedThisHand && 
           activityState.availableActivities[activity] &&
           ZenPointsManager.getCurrentBalance() >= zenActivities[activity].cost;
}

// Enhanced activity usage function
export function useZenActivity(activity, isCompartmentalize = false) {
    if (!canUseActivity(activity) && !isCompartmentalize) {
        return { success: false, reason: 'cooldown' };
    }
    
    // Existing logic + new cooldown tracking
    activityState.usedThisHand = true;
    
    // Special handling for compartmentalize
    if (activity === 'compartmentalize') {
        return handleCompartmentalize();
    }
    
    // Regular activity logic...
}
```

### Compartmentalize System

```javascript
// Compartmentalize implementation
export function handleCompartmentalize() {
    const playerCards = gameState.playerCards;
    
    // Validate bust condition
    if (calculateScore(playerCards) <= 21) {
        return { success: false, reason: 'not_busted' };
    }
    
    // Split the hand into two manageable hands
    const splitResult = splitBustedHand(playerCards);
    
    // Update game state for split hand play
    activityState.compartmentalizeInProgress = true;
    activityState.splitHands = splitResult;
    
    // Reduce stress from successful compartmentalization
    updateStressLevel(-25); // Moderate stress reduction for the technique
    
    return { 
        success: true, 
        splitHands: splitResult,
        message: 'You compartmentalize the overwhelming situation into manageable parts!'
    };
}

function splitBustedHand(cards) {
    // Algorithm to split cards into two hands that are both <= 21
    // Priority: Try to create two valid hands, fallback to best possible split
    
    const hand1 = [];
    const hand2 = [];
    let hand1Score = 0;
    let hand2Score = 0;
    
    // Sort cards by value for optimal distribution
    const sortedCards = [...cards].sort((a, b) => getCardValue(a) - getCardValue(b));
    
    // Distribute cards to keep both hands under 21 if possible
    for (const card of sortedCards) {
        const cardValue = getCardValue(card);
        
        if (hand1Score + cardValue <= 21 && hand1Score <= hand2Score) {
            hand1.push(card);
            hand1Score += cardValue;
        } else if (hand2Score + cardValue <= 21) {
            hand2.push(card);
            hand2Score += cardValue;
        } else {
            // If both would bust, add to the hand with lower score
            if (hand1Score <= hand2Score) {
                hand1.push(card);
                hand1Score += cardValue;
            } else {
                hand2.push(card);
                hand2Score += cardValue;
            }
        }
    }
    
    return {
        hand1: { cards: hand1, score: hand1Score, active: true },
        hand2: { cards: hand2, score: hand2Score, active: false },
        currentHand: 0
    };
}
```

### Enhanced Shop System

```javascript
// Premium activity shop items
export const premiumActivities = {
    mindfulBreathing: {
        name: 'Mindful Breathing',
        cost: 150,
        description: 'Unlock advanced breathing techniques for 50% stress reduction',
        emoji: '🌸',
        category: 'stress-relief'
    },
    compartmentalize: {
        name: 'Compartmentalize',
        cost: 200,
        description: 'Learn to split overwhelming situations into manageable parts',
        emoji: '🧠',
        category: 'reactive'
    }
};

// Purchase premium activity function
export function purchasePremiumActivity(activityId, currentZenPoints) {
    const activity = premiumActivities[activityId];
    if (!activity || currentZenPoints < activity.cost) {
        return { success: false, message: 'Insufficient zen points' };
    }
    
    // Process purchase
    const success = ZenPointsManager.spendPoints(
        activity.cost, 
        ZEN_TRANSACTION_TYPES.SHOP_PURCHASE,
        true,
        { item: activityId, type: 'premium_activity' }
    );
    
    if (success) {
        // Unlock activity permanently
        updateActivityState({
            availableActivities: {
                ...activityState.availableActivities,
                [activityId]: true
            }
        });
        
        // Save to campaign state for persistence
        updateCampaignState({
            unlockedActivities: {
                ...campaignState.unlockedActivities,
                [activityId]: true
            }
        });
        
        return { 
            success: true, 
            message: `${activity.name} unlocked! You can now use this advanced technique.`,
            newBalance: ZenPointsManager.getCurrentBalance()
        };
    }
    
    return { success: false, message: 'Purchase failed' };
}
```

## Data Models

### Activity State Model

```javascript
const activityState = {
    usedThisHand: boolean,                    // Activity cooldown flag
    availableActivities: {                    // Activity unlock status
        [activityId]: boolean
    },
    compartmentalizeInProgress: boolean,      // Split hand mode flag
    splitHands: {                            // Split hand data
        hand1: { cards: Card[], score: number, active: boolean },
        hand2: { cards: Card[], score: number, active: boolean },
        currentHand: number                   // 0 or 1
    } | null
};
```

### Enhanced Campaign State

```javascript
// Addition to existing campaignState
const campaignStateAdditions = {
    unlockedActivities: {                    // Persistent activity unlocks
        mindfulBreathing: boolean,
        compartmentalize: boolean
    },
    activityStats: {                         // Usage statistics
        totalActivitiesUsed: number,
        compartmentalizeUses: number,
        premiumActivityUses: number
    }
};
```

## Error Handling

### Activity Cooldown Handling

- **Cooldown Active**: Display clear message "Activities are on cooldown until next hand"
- **Insufficient Funds**: Show current balance and required cost
- **Activity Locked**: Prompt user to visit shop to unlock premium activities

### Compartmentalize Error Cases

- **Not Busted**: "Compartmentalize can only be used when you've busted"
- **Already Used**: "You've already used an activity this hand"
- **Split Failed**: Graceful fallback to regular bust handling

### State Recovery

- **Invalid Split State**: Reset to normal gameplay mode
- **Corrupted Activity State**: Reset to default available activities
- **Save/Load Errors**: Maintain backward compatibility with existing saves

## Testing Strategy

### Unit Tests

1. **Activity Cooldown Logic**: Test one-per-hand limitation
2. **Compartmentalize Algorithm**: Test card splitting logic with various hand compositions
3. **Premium Activity Unlocking**: Test purchase and persistence
4. **State Management**: Test activity state reset and persistence

### Integration Tests

1. **Full Hand Cycle**: Test activity usage → hand completion → cooldown reset
2. **Compartmentalize Flow**: Test bust → compartmentalize → split hand play → completion
3. **Shop Integration**: Test premium activity purchase → unlock → usage
4. **Save/Load**: Test activity state persistence across sessions

### Edge Cases

1. **Multiple Aces in Split**: Test Ace value handling in split hands
2. **Joker Cards in Split**: Test joker behavior during compartmentalization
3. **Campaign Mode Integration**: Test activity system with task progression
4. **Concurrent Activity Attempts**: Test rapid clicking prevention

## UI/UX Considerations

### Activity Panel Enhancements

- **Cooldown Indicator**: Visual feedback when activities are disabled
- **Premium Activity Badges**: Special styling for unlocked premium activities
- **Usage Counter**: Show "1/1 used this hand" when cooldown is active

### Compartmentalize UI

- **Split Hand Display**: Show both hands clearly with active hand highlighted
- **Hand Switching**: Intuitive controls to switch between split hands
- **Progress Indicator**: Show which hand is currently being played

### Shop Integration

- **Activity Category**: Separate section for premium activities
- **Educational Content**: Detailed descriptions of stress management techniques
- **Preview Mode**: Show what the activity does before purchase

This design maintains backward compatibility while introducing strategic depth and innovative gameplay mechanics that align with the game's stress management theme.