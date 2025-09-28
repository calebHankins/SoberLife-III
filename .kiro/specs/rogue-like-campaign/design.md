# Design Document

## Overview

The rogue-like campaign system transforms SoberLife III from a single DMV scenario into a progressive campaign where players advance through multiple stress management challenges. After completing each task, players can spend remaining zen points to upgrade their blackjack deck by replacing cards with Aces, creating meaningful progression and increased capability for future challenges.

## Architecture

### Campaign Structure
The campaign system introduces a new layer above the existing game mechanics:

```
Campaign Level
├── Task Selection Screen
├── Individual Tasks (DMV, Job Interview, etc.)
├── Post-Task Shop System
└── Progress Persistence
```

### State Management Extensions
The existing `gameState` object will be extended to support campaign-wide persistence:

```javascript
export let campaignState = {
    currentTask: 0,
    completedTasks: [],
    totalZenEarned: 0,
    deckComposition: {
        aces: 4,        // Starting aces
        totalCards: 52  // Total deck size
    },
    shopUpgrades: {
        acesAdded: 0,
        totalSpent: 0
    }
};
```

### Task System Architecture
Each task will be a self-contained module with consistent interfaces:

```javascript
export const taskDefinitions = {
    dmv: {
        id: 'dmv',
        name: 'DMV License Renewal',
        description: 'Navigate the bureaucratic maze of license renewal',
        steps: [...], // Existing DMV steps
        difficulty: 1,
        unlockRequirement: null
    },
    jobInterview: {
        id: 'jobInterview', 
        name: 'Job Interview',
        description: 'Ace your interview while managing pre-interview nerves',
        steps: [...], // New interview steps
        difficulty: 2,
        unlockRequirement: 'dmv'
    }
};
```

## Components and Interfaces

### Campaign Navigation Component
A new screen that displays available tasks and progress:

```html
<div class="campaign-overview" id="campaignOverview">
    <h2>Stress Management Campaign</h2>
    <div class="campaign-progress">
        <div class="deck-status">Current Deck: X Aces / 52 Cards</div>
        <div class="total-progress">Tasks Completed: X/Y</div>
    </div>
    <div class="task-list">
        <!-- Task cards with completion status -->
    </div>
</div>
```

### Shop Interface Component
Post-task upgrade system:

```html
<div class="upgrade-shop" id="upgradeShop">
    <h2>Mindfulness Upgrades</h2>
    <div class="zen-balance">Zen Points: X</div>
    <div class="upgrade-options">
        <div class="upgrade-card">
            <h3>Add Ace to Deck</h3>
            <p>Replace a random card with an Ace</p>
            <div class="cost">Cost: 50 Zen Points</div>
            <button class="upgrade-btn">Purchase</button>
        </div>
    </div>
    <div class="shop-actions">
        <button onclick="continueCampaign()">Continue Campaign</button>
    </div>
</div>
```

### Task Module Interface
Standardized interface for all tasks:

```javascript
export class TaskModule {
    constructor(taskDefinition) {
        this.id = taskDefinition.id;
        this.name = taskDefinition.name;
        this.steps = taskDefinition.steps;
        this.contextualActions = taskDefinition.contextualActions;
        this.flavorText = taskDefinition.flavorText;
    }
    
    initialize() { /* Setup task-specific UI */ }
    getStepDescription(stepIndex) { /* Return step text */ }
    getContextualActions(stepIndex) { /* Return step actions */ }
    cleanup() { /* Reset task state */ }
}
```

## Data Models

### Campaign Progress Model
```javascript
const campaignProgress = {
    tasks: [
        {
            id: 'dmv',
            completed: true,
            bestScore: {
                stressLevel: 25,
                zenRemaining: 75,
                completionTime: '2024-01-15T10:30:00Z'
            }
        },
        {
            id: 'jobInterview',
            completed: false,
            unlocked: true
        }
    ],
    deckUpgrades: {
        acesAdded: 2,
        totalInvestment: 100
    }
};
```

### Deck Composition Model
```javascript
const deckComposition = {
    suits: ['hearts', 'diamonds', 'clubs', 'spades'],
    ranks: {
        'A': 8,  // 4 original + 4 purchased
        '2': 4,
        '3': 4,
        // ... other ranks
        'K': 4
    },
    totalCards: 52,
    aceCount: 8
};
```

### Task Definition Model
```javascript
const taskDefinition = {
    id: 'jobInterview',
    name: 'Job Interview Challenge',
    description: 'Navigate interview questions while managing anxiety',
    difficulty: 2,
    unlockRequirement: 'dmv',
    steps: [
        'Arrive at the office and check in',
        'Wait in the lobby and review your resume',
        'Meet the interviewer and make first impressions',
        'Answer behavioral questions confidently',
        'Ask thoughtful questions about the role'
    ],
    contextualActions: {
        0: {
            hit: {
                text: 'Review Notes',
                description: 'Quickly review your prepared talking points',
                flavorText: 'You take a moment to refresh your memory'
            },
            stand: {
                text: 'Stay Confident',
                description: 'Trust your preparation and stay calm',
                flavorText: 'You maintain your composure and confidence'
            }
        }
        // ... more steps
    },
    initialFlavorText: {
        0: {
            title: 'Arriving at the Interview',
            text: 'You walk into the modern office building...',
            stressTriggers: ['performance anxiety', 'first impressions'],
            tips: 'Remember, they already liked your resume enough to interview you.'
        }
        // ... more steps
    }
};
```

## Error Handling

### Campaign State Recovery
- Implement localStorage backup for campaign progress
- Graceful degradation if save data is corrupted
- Reset options for stuck campaign states

### Task Loading Failures
- Fallback to basic blackjack mode if task modules fail
- Error boundaries around task-specific code
- User-friendly error messages with recovery options

### Shop Transaction Validation
- Validate zen point balance before purchases
- Prevent duplicate purchases in same session
- Rollback mechanisms for failed upgrades

## Testing Strategy

### Unit Tests
- Campaign state management functions
- Deck composition calculations
- Task progression logic
- Shop upgrade mechanics

### Integration Tests
- Complete task flow from start to shop
- Campaign progression across multiple tasks
- Save/load campaign state
- Deck upgrades affecting gameplay

### User Experience Tests
- Task difficulty progression feels appropriate
- Shop upgrades provide meaningful benefit
- Navigation between screens is intuitive
- Progress persistence works across sessions

## Implementation Phases

### Phase 1: Campaign Infrastructure
1. Create campaign state management
2. Implement task selection screen
3. Add navigation between campaign and tasks
4. Basic progress persistence

### Phase 2: Shop System
1. Post-task shop interface
2. Ace upgrade mechanics
3. Deck composition tracking
4. Zen point spending validation

### Phase 3: Second Task Implementation
1. Design job interview scenario
2. Create interview-specific contextual actions
3. Implement interview flavor text
4. Balance difficulty progression

### Phase 4: Polish and Enhancement
1. Visual improvements for campaign screen
2. Achievement system for milestones
3. Advanced upgrade options
4. Campaign completion rewards

## Technical Considerations

### File Organization
```
assets/js/
├── campaign-manager.js     # Campaign state and navigation
├── task-definitions.js     # All task configurations
├── shop-system.js         # Upgrade purchasing logic
├── deck-manager.js        # Enhanced deck composition
└── storage-manager.js     # Save/load campaign progress
```

### Backward Compatibility
- Existing single-task mode remains functional
- Gradual migration path for current players
- Preserve existing game mechanics and balance

### Performance Optimization
- Lazy loading of task definitions
- Efficient deck shuffling with custom compositions
- Minimal DOM manipulation during transitions

### Accessibility Enhancements
- Screen reader support for campaign progress
- Keyboard navigation for shop interface
- Clear visual indicators for task completion status