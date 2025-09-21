# Design Document

## Overview

This design addresses critical UX feedback by implementing three key improvements: making current tasks highly visible and prominent, moving gameplay rules to an accessible but non-distracting help system, and adding contextual flavor text to hit/stand actions that relates to the current DMV scenario. The solution maintains the existing multi-file architecture while enhancing the user experience through strategic visual hierarchy and contextual storytelling.

## Architecture

### Component Integration
- **Enhanced Task Display**: Redesign the existing `task-info` section with prominent visual styling and attention-grabbing animations
- **Help System**: New modal/popup component for gameplay rules with toggle functionality
- **Contextual Actions**: Dynamic button text system that updates based on current task context
- **Visual Hierarchy**: CSS-driven design system that prioritizes task information over other elements

### File Structure Impact
```
assets/
├── css/
│   ├── main.css           # Enhanced with prominent task styles and help modal
│   ├── components.css     # Updated button styles and contextual action styling
│   └── responsive.css     # Mobile-optimized task visibility
└── js/
    ├── ui-manager.js      # Enhanced with help modal and contextual text functions
    ├── game-state.js      # Extended with contextual action data
    └── main.js            # Updated with help system event handlers
```

## Components and Interfaces

### 1. Enhanced Task Display Component

**Visual Design:**
- Large, bold typography with high contrast colors
- Animated entrance effects when tasks change
- Prominent positioning at top of game area
- Visual emphasis through borders, shadows, and background colors
- Step progress indicator (Step X of 5)

**Implementation:**
```css
.task-info-prominent {
    background: linear-gradient(135deg, #FF6B6B, #FF8E53);
    color: white;
    padding: 20px;
    border-radius: 15px;
    margin: 20px 0;
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    border: 3px solid #FF4757;
    animation: taskHighlight 0.8s ease-out;
}
```

### 2. Help System Component

**Modal Structure:**
- Overlay background with blur effect
- Centered modal with close button
- Organized sections for different rule types
- Accessible via "?" button in header area

**Content Organization:**
- Game objective and basic rules
- Blackjack scoring explanation
- Stress management mechanics
- Zen activities guide
- DMV scenario context

**Interface:**
```javascript
// Help system functions
export function showHelpModal()
export function hideHelpModal()
export function toggleHelp()
```

### 3. Contextual Action System

**Action Context Mapping:**
Each DMV step has specific contextual actions that map to hit/stand:

```javascript
const contextualActions = {
    0: { // Check in at front desk
        hit: { text: "Approach Counter", flavor: "Walk confidently to the front desk" },
        stand: { text: "Wait Patiently", flavor: "Take a moment to observe and prepare" }
    },
    1: { // Wait in line
        hit: { text: "Ask About Wait Time", flavor: "Inquire about the expected delay" },
        stand: { text: "Find a Seat", flavor: "Settle in for the wait" }
    },
    2: { // Present documents
        hit: { text: "Hand Over Papers", flavor: "Present your documents confidently" },
        stand: { text: "Double-Check Documents", flavor: "Review your paperwork one more time" }
    },
    3: { // Take photo
        hit: { text: "Smile for Camera", flavor: "Put on your best DMV photo smile" },
        stand: { text: "Adjust Appearance", flavor: "Fix your hair and straighten up" }
    },
    4: { // Pay fee
        hit: { text: "Process Payment", flavor: "Complete the transaction" },
        stand: { text: "Review Receipt", flavor: "Carefully check all details" }
    }
};
```

### 4. Visual Hierarchy System

**Priority Levels:**
1. **Critical**: Current task information (largest, most prominent)
2. **Important**: Game actions and stress meter
3. **Secondary**: Zen activities and game cards
4. **Tertiary**: Background information and help access

**Design Principles:**
- Size: Task info uses largest font sizes (24px+ headings)
- Color: High contrast colors for task area vs. muted tones for secondary elements
- Position: Task info positioned prominently at top of active game area
- Animation: Subtle animations draw attention to task changes

## Data Models

### Enhanced Game State
```javascript
// Extended gameState object
export let gameState = {
    // ... existing properties
    helpModalVisible: false,
    taskAnimationActive: false,
    currentContextualActions: null
};
```

### Contextual Action Data Structure
```javascript
const contextualAction = {
    text: string,        // Button display text
    flavor: string,      // Descriptive flavor text
    blackjackAction: string  // 'hit' or 'stand'
};
```

### Help Content Structure
```javascript
const helpContent = {
    sections: [
        {
            title: string,
            content: string,
            examples?: string[]
        }
    ]
};
```

## Error Handling

### Help System
- Graceful fallback if help content fails to load
- Keyboard accessibility (ESC to close modal)
- Click-outside-to-close functionality
- Prevent modal from opening multiple times

### Contextual Actions
- Fallback to generic "Hit"/"Stand" if contextual data unavailable
- Validation that contextual actions exist for current step
- Error logging for missing contextual action definitions

### Task Display
- Fallback text if step description unavailable
- Animation error handling to prevent stuck states
- Responsive design fallbacks for small screens

## Testing Strategy

### Visual Testing
- **Task Prominence**: Verify task information is most visually prominent element
- **Animation Timing**: Test task change animations don't interfere with gameplay
- **Responsive Design**: Ensure task visibility on mobile devices
- **Color Contrast**: Verify accessibility standards for task display

### Functional Testing
- **Help Modal**: Test open/close functionality across different interaction methods
- **Contextual Actions**: Verify correct action text displays for each DMV step
- **State Management**: Test help modal state persistence during gameplay
- **Keyboard Navigation**: Ensure help system is keyboard accessible

### Integration Testing
- **Game Flow**: Verify task visibility improvements don't break existing gameplay
- **Performance**: Test animation performance on lower-end devices
- **Cross-browser**: Verify modal and animation compatibility
- **Mobile Experience**: Test touch interactions with new UI elements

### User Experience Testing
- **Task Noticeability**: Validate that players immediately notice current task
- **Help Discoverability**: Ensure help button is findable but not intrusive
- **Action Context**: Verify contextual actions make sense within DMV scenario
- **Information Hierarchy**: Confirm visual hierarchy guides attention appropriately

## Implementation Phases

### Phase 1: Enhanced Task Display
- Update CSS for prominent task styling
- Add task change animations
- Implement visual hierarchy improvements
- Test task visibility across devices

### Phase 2: Help System
- Create help modal HTML structure
- Implement modal show/hide functionality
- Move gameplay rules to help content
- Add help button to header area

### Phase 3: Contextual Actions
- Define contextual action mappings for all DMV steps
- Update button text system in ui-manager.js
- Implement dynamic action text updates
- Add flavor text display system

### Phase 4: Polish and Testing
- Refine animations and transitions
- Optimize mobile experience
- Comprehensive testing across scenarios
- Performance optimization