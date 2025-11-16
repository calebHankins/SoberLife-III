# Design Document

## Overview

The Achievements System adds a milestone tracking and recognition layer to SoberLife III, enhancing player engagement and providing long-term goals across all game modes. The system tracks player accomplishments, displays progress in the Mind Palace's "Your Growth Journey" section, and celebrates unlocks with themed pop-up notifications. This feature integrates seamlessly with existing game state management, leveraging localStorage for persistence and the established UI patterns for visual feedback.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Achievements System                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │ Achievement      │      │ Achievement      │           │
│  │ Manager          │◄────►│ Definitions      │           │
│  │                  │      │                  │           │
│  │ - Track Progress │      │ - Campaign       │           │
│  │ - Check Unlocks  │      │ - Free Play      │           │
│  │ - Persist Data   │      │ - Wealth         │           │
│  └────────┬─────────┘      └──────────────────┘           │
│           │                                                 │
│           ▼                                                 │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │ Achievement      │      │ Achievement      │           │
│  │ UI Manager       │      │ Notification     │           │
│  │                  │      │ System           │           │
│  │ - Display List   │      │ - Pop-ups        │           │
│  │ - Update Status  │      │ - Animations     │           │
│  └──────────────────┘      └──────────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Game State   │    │ Campaign     │    │ localStorage │
│ Integration  │    │ Manager      │    │ Persistence  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Data Flow

1. **Achievement Tracking**: Game events trigger achievement checks
2. **Validation**: Achievement Manager validates unlock conditions
3. **Persistence**: Unlocked achievements saved to localStorage
4. **Notification**: Pop-up displayed for new unlocks
5. **UI Update**: Mind Palace displays updated achievement status

## Components and Interfaces

### 1. Achievement Manager Module (`assets/js/achievement-manager.js`)

**Purpose**: Core logic for tracking, validating, and managing achievements

**Key Functions**:

```javascript
// Initialize achievement system
export function initializeAchievements()

// Check if achievement should be unlocked
export function checkAchievement(achievementId)

// Unlock an achievement
export function unlockAchievement(achievementId)

// Get all achievements with status
export function getAllAchievements()

// Get achievement by ID
export function getAchievement(achievementId)

// Check for milestone achievements
export function checkMilestones(type, value)

// Update statistics
export function updateStatistic(statName, value)

// Get current statistics
export function getStatistics()
```

**State Management**:

```javascript
export let achievementState = {
    unlockedAchievements: [],      // Array of unlocked achievement IDs
    statistics: {
        campaignCompleted: false,
        freePlayTasksTotal: 0,      // Total Free Play tasks completed
        freePlayMaxRun: 0,          // Max tasks in one Free Play run
        zenPointsPeak: 0,           // Maximum zen points at one time
        currentFreePlayRun: 0       // Current run task count
    },
    unlockTimestamps: {}           // Map of achievementId -> timestamp
};
```

### 2. Achievement Definitions (`assets/js/achievement-definitions.js`)

**Purpose**: Define all achievements with metadata

**Structure**:

```javascript
export const achievementDefinitions = {
    // Campaign Achievement
    campaign_master: {
        id: 'campaign_master',
        name: '🎓 Campaign Master',
        description: 'Complete all tasks in the Stress Management Campaign',
        category: 'campaign',
        emoji: '🎓',
        checkCondition: (stats) => stats.campaignCompleted,
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

// Helper functions
export function getAchievementsByCategory(category)
export function getMilestoneAchievements(type)
export function getNextMilestone(type, currentValue)
```

### 3. Achievement UI Manager (`assets/js/achievement-ui.js`)

**Purpose**: Handle UI rendering and updates for achievements

**Key Functions**:

```javascript
// Render achievements in Mind Palace
export function renderAchievementsInMindPalace()

// Show achievement unlock notification
export function showAchievementNotification(achievement)

// Update achievement display
export function updateAchievementDisplay(achievementId)

// Render achievement card
function createAchievementCard(achievement, isUnlocked, timestamp)

// Show statistics in Mind Palace
export function renderStatistics(stats)
```

**UI Components**:

```html
<!-- Achievement Card Structure -->
<div class="achievement-card [locked|unlocked]">
    <div class="achievement-icon">[emoji]</div>
    <div class="achievement-info">
        <h4 class="achievement-name">[name]</h4>
        <p class="achievement-description">[description]</p>
        <p class="achievement-flavor">[flavorText]</p>
        <span class="achievement-timestamp">[unlocked date]</span>
    </div>
    <div class="achievement-status">
        <span class="status-badge">[✓ Unlocked | 🔒 Locked]</span>
    </div>
</div>

<!-- Statistics Display -->
<div class="achievement-statistics">
    <div class="stat-item">
        <span class="stat-label">Max Free Play Run:</span>
        <span class="stat-value">[value] tasks</span>
    </div>
    <div class="stat-item">
        <span class="stat-label">Peak Zen Points:</span>
        <span class="stat-value">[value] points</span>
    </div>
    <div class="stat-item">
        <span class="stat-label">Total Free Play Tasks:</span>
        <span class="stat-value">[value] tasks</span>
    </div>
</div>
```

### 4. Achievement Notification System

**Purpose**: Display celebratory pop-ups for unlocked achievements

**Notification Structure**:

```html
<div class="achievement-notification">
    <div class="achievement-notification-content">
        <div class="achievement-notification-header">
            <span class="achievement-notification-icon">[emoji]</span>
            <h3>Achievement Unlocked!</h3>
        </div>
        <div class="achievement-notification-body">
            <h4>[achievement name]</h4>
            <p>[achievement description]</p>
            <p class="achievement-notification-flavor">[flavor text]</p>
        </div>
        <button class="achievement-notification-close">×</button>
    </div>
</div>
```

**Animation Behavior**:
- Slide in from top-right with bounce effect
- Display for 5 seconds
- Auto-dismiss or manual close
- Particle effects for celebration
- Sound effect (optional, respects audio settings)

## Data Models

### Achievement Object

```javascript
{
    id: string,              // Unique identifier
    name: string,            // Display name with emoji
    description: string,     // What the achievement is for
    category: string,        // 'campaign', 'free_play', 'wealth'
    emoji: string,           // Visual icon
    milestone: number,       // For milestone achievements
    checkCondition: function,// Validation function
    flavorText: string,      // Celebratory message
    isUnlocked: boolean,     // Current unlock status
    unlockedAt: timestamp    // When it was unlocked
}
```

### Achievement State (localStorage)

```javascript
{
    unlockedAchievements: [
        'campaign_master',
        'free_play_5',
        'wealth_1000'
    ],
    statistics: {
        campaignCompleted: true,
        freePlayTasksTotal: 15,
        freePlayMaxRun: 7,
        zenPointsPeak: 2500,
        currentFreePlayRun: 3
    },
    unlockTimestamps: {
        'campaign_master': 1700000000000,
        'free_play_5': 1700001000000,
        'wealth_1000': 1700002000000
    }
}
```

## Integration Points

### 1. Campaign Completion Integration

**Location**: `assets/js/campaign-manager.js` - `completeCurrentTask()`

```javascript
// After task completion
if (campaignState.completedTasks.length >= totalTasks) {
    // Mark campaign as completed
    updateStatistic('campaignCompleted', true);
    checkAchievement('campaign_master');
}
```

### 2. Free Play Task Completion Integration

**Location**: `assets/js/main.js` - Free Play task completion flow

```javascript
// After Free Play task completion
updateStatistic('freePlayTasksTotal', achievementState.statistics.freePlayTasksTotal + 1);
updateStatistic('currentFreePlayRun', achievementState.statistics.currentFreePlayRun + 1);

// Check for milestone achievements
checkMilestones('free_play', achievementState.statistics.freePlayTasksTotal);

// Update max run if current run is higher
if (achievementState.statistics.currentFreePlayRun > achievementState.statistics.freePlayMaxRun) {
    updateStatistic('freePlayMaxRun', achievementState.statistics.currentFreePlayRun);
}
```

### 3. Free Play Run End Integration

**Location**: `assets/js/main.js` - Free Play exit/game over

```javascript
// When Free Play run ends (exit or game over)
updateStatistic('currentFreePlayRun', 0); // Reset current run counter
```

### 4. Zen Points Balance Integration

**Location**: `assets/js/zen-points-manager.js` - `addPoints()`

```javascript
// After adding zen points
const currentBalance = getCurrentBalance();
if (currentBalance > achievementState.statistics.zenPointsPeak) {
    updateStatistic('zenPointsPeak', currentBalance);
    checkMilestones('wealth', currentBalance);
}
```

### 5. Mind Palace Display Integration

**Location**: `assets/js/shop-system.js` - `openShop()`

```javascript
// When Mind Palace opens
renderAchievementsInMindPalace();
renderStatistics(getStatistics());
```

## Error Handling

### Achievement State Validation

```javascript
function validateAchievementState() {
    // Ensure required properties exist
    if (!achievementState.unlockedAchievements) {
        achievementState.unlockedAchievements = [];
    }
    
    if (!achievementState.statistics) {
        achievementState.statistics = {
            campaignCompleted: false,
            freePlayTasksTotal: 0,
            freePlayMaxRun: 0,
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
    
    // Ensure statistics are numbers
    Object.keys(achievementState.statistics).forEach(key => {
        if (key !== 'campaignCompleted' && typeof achievementState.statistics[key] !== 'number') {
            achievementState.statistics[key] = 0;
        }
    });
}
```

### localStorage Corruption Recovery

```javascript
function loadAchievementState() {
    try {
        const saved = localStorage.getItem('soberlife-achievements');
        if (saved) {
            const loaded = JSON.parse(saved);
            Object.assign(achievementState, loaded);
            validateAchievementState();
            return true;
        }
    } catch (error) {
        console.error('Failed to load achievement state:', error);
        // Reset to defaults
        resetAchievementState();
    }
    return false;
}
```

### Duplicate Notification Prevention

```javascript
function unlockAchievement(achievementId) {
    // Check if already unlocked
    if (achievementState.unlockedAchievements.includes(achievementId)) {
        return false; // Already unlocked, don't show notification
    }
    
    // Unlock and show notification
    achievementState.unlockedAchievements.push(achievementId);
    achievementState.unlockTimestamps[achievementId] = Date.now();
    saveAchievementState();
    
    const achievement = getAchievement(achievementId);
    showAchievementNotification(achievement);
    
    return true;
}
```

## Testing Strategy

### Unit Tests

1. **Achievement Manager Tests**
   - Test achievement unlock logic
   - Test milestone checking
   - Test statistics updates
   - Test state persistence

2. **Achievement Definitions Tests**
   - Test condition validation
   - Test category filtering
   - Test milestone progression

3. **UI Manager Tests**
   - Test achievement card rendering
   - Test notification display
   - Test statistics display

### Integration Tests

1. **Campaign Completion Flow**
   - Complete all campaign tasks
   - Verify campaign_master achievement unlocks
   - Verify notification displays
   - Verify persistence across sessions

2. **Free Play Milestone Flow**
   - Complete 5, 10, 25, 50, 100 Free Play tasks
   - Verify each milestone achievement unlocks
   - Verify notifications display in sequence
   - Verify statistics update correctly

3. **Wealth Milestone Flow**
   - Accumulate 1000, 5000, 10000, 25000, 50000 zen points
   - Verify each wealth achievement unlocks
   - Verify peak tracking works correctly
   - Verify spending doesn't affect peak

4. **Max Run Tracking**
   - Complete multiple Free Play runs
   - Verify max run statistic updates
   - Verify shorter runs don't overwrite max
   - Verify run resets on exit

### End-to-End Tests (Playwright)

1. **Achievement Display Test**
   - Open Mind Palace
   - Verify achievements section exists
   - Verify locked achievements display correctly
   - Verify unlocked achievements show timestamps

2. **Campaign Achievement Test**
   - Complete all campaign tasks
   - Verify achievement notification appears
   - Open Mind Palace
   - Verify campaign_master shows as unlocked

3. **Free Play Milestone Test**
   - Complete 5 Free Play tasks
   - Verify achievement notification
   - Verify statistics update
   - Verify persistence after refresh

4. **Wealth Milestone Test**
   - Accumulate 1000 zen points
   - Verify achievement notification
   - Spend points
   - Verify peak remains unchanged

5. **Notification Behavior Test**
   - Unlock achievement
   - Verify notification appears
   - Verify auto-dismiss after 5 seconds
   - Verify manual close works
   - Verify no duplicate notifications

6. **Persistence Test**
   - Unlock achievements
   - Refresh browser
   - Verify achievements remain unlocked
   - Verify statistics persist

## CSS Styling

### Achievement Card Styles

```css
.achievement-card {
    display: flex;
    align-items: center;
    padding: 15px;
    margin: 10px 0;
    border-radius: 10px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border: 2px solid #ddd;
    transition: all 0.3s ease;
}

.achievement-card.unlocked {
    background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
    border-color: #f39c12;
    box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
}

.achievement-card.locked {
    opacity: 0.6;
    filter: grayscale(50%);
}

.achievement-icon {
    font-size: 48px;
    margin-right: 15px;
}

.achievement-info {
    flex: 1;
}

.achievement-name {
    margin: 0 0 5px 0;
    font-size: 18px;
    font-weight: bold;
}

.achievement-description {
    margin: 0 0 5px 0;
    font-size: 14px;
    color: #555;
}

.achievement-flavor {
    margin: 0;
    font-size: 12px;
    font-style: italic;
    color: #777;
}

.achievement-timestamp {
    font-size: 11px;
    color: #999;
}

.achievement-status {
    margin-left: 15px;
}

.status-badge {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
}

.status-badge.unlocked {
    background: #2ecc71;
    color: white;
}

.status-badge.locked {
    background: #95a5a6;
    color: white;
}
```

### Achievement Notification Styles

```css
.achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    animation: slideInRight 0.5s ease-out, bounceIn 0.3s ease-out 0.5s;
}

.achievement-notification-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    min-width: 300px;
    max-width: 400px;
    position: relative;
}

.achievement-notification-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.achievement-notification-icon {
    font-size: 36px;
    margin-right: 10px;
}

.achievement-notification-header h3 {
    margin: 0;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.achievement-notification-body h4 {
    margin: 0 0 5px 0;
    font-size: 20px;
}

.achievement-notification-body p {
    margin: 5px 0;
    font-size: 14px;
}

.achievement-notification-flavor {
    font-style: italic;
    opacity: 0.9;
}

.achievement-notification-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s ease;
}

.achievement-notification-close:hover {
    background: rgba(255, 255, 255, 0.3);
}

@keyframes slideInRight {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes bounceIn {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}
```

## Performance Considerations

1. **Lazy Loading**: Only render achievements when Mind Palace is opened
2. **Debouncing**: Debounce milestone checks to avoid excessive validation
3. **Efficient Storage**: Store only essential data in localStorage
4. **Notification Queue**: Queue multiple notifications to avoid overlap
5. **DOM Optimization**: Reuse notification elements instead of creating new ones

## Accessibility

1. **ARIA Labels**: Add appropriate ARIA labels to achievement cards
2. **Keyboard Navigation**: Ensure notification close button is keyboard accessible
3. **Screen Reader Support**: Announce achievement unlocks to screen readers
4. **Color Contrast**: Ensure sufficient contrast for locked/unlocked states
5. **Focus Management**: Manage focus when notifications appear

## Future Enhancements

1. **Secret Achievements**: Hidden achievements that surprise players
2. **Achievement Tiers**: Bronze, Silver, Gold tiers for milestones
3. **Social Sharing**: Share achievements on social media
4. **Achievement Rewards**: Unlock special features or cosmetics
5. **Progress Bars**: Show progress toward next milestone
6. **Achievement Categories**: Filter achievements by category
7. **Rarity System**: Mark rare achievements with special styling
8. **Achievement Sound Effects**: Optional audio feedback for unlocks
