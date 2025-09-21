# Design Document

## Overview

This design outlines the implementation of enhanced role-play messaging for SoberLife III, focusing on replacing blackjack terminology with DMV-themed content and implementing progressive flavor text for repeated actions. The solution maintains the existing game mechanics while significantly improving narrative immersion and educational value.

## Architecture

The messaging system will be restructured around three core components:

1. **Contextual Messaging Engine**: Manages DMV-themed outcome messages
2. **Progressive Flavor Text System**: Tracks and delivers varied flavor text for repeated actions
3. **Educational Feedback Framework**: Provides stress management insights with game outcomes

The existing modular architecture (game-state.js, ui-manager.js, main.js) will be enhanced rather than replaced, ensuring compatibility with current functionality.

## Components and Interfaces

### 1. Enhanced Game State Management

**File**: `assets/js/game-state.js`

**New Data Structures**:
```javascript
// Track hit count per hand for progressive flavor text
export let handState = {
    hitCount: 0,
    currentHand: 0
};

// DMV-themed outcome messages replacing blackjack terminology
export const dmvOutcomeMessages = {
    win: [
        "✅ You handled that step perfectly! Your preparation and patience paid off.",
        "🎯 Excellent work! You navigated the bureaucracy like a pro.",
        "💪 Great job staying calm under pressure. The DMV staff appreciated your approach."
    ],
    lose: [
        "📋 The process got a bit overwhelming this time. Take a breath and regroup.",
        "⏰ The timing wasn't quite right. Sometimes these things take patience.",
        "🔄 That step didn't go as planned. Let's try a different approach."
    ],
    tie: [
        "⚖️ You held your ground well. Sometimes persistence is the key.",
        "🤝 A balanced approach - you're learning to work with the system.",
        "⏳ Patience is paying off. You're getting the hang of this process."
    ],
    bust: [
        "😰 The stress got to you this time. Remember to use your zen techniques!",
        "🌪️ You got caught up in the moment. Deep breathing can help reset your focus.",
        "⚡ The pressure built up too quickly. Next time, try pacing yourself."
    ],
    house_bust: [
        "🎉 The system worked in your favor! Sometimes patience is rewarded.",
        "✨ Perfect timing! Your calm approach let things fall into place.",
        "🍀 The bureaucratic stars aligned for you this time!"
    ]
};

// Progressive flavor text for multiple hits per hand
export const progressiveFlavorText = {
    0: { // Check in at the front desk
        hit: [
            "You decide to gather more information before proceeding",
            "You ask a follow-up question to make sure you understand",
            "You double-check one more detail to be absolutely certain"
        ]
    },
    1: { // Wait in line
        hit: [
            "You actively monitor your position in the queue",
            "You check the display board again for any updates",
            "You glance around to see how the line is moving"
        ]
    },
    2: { // Present documents
        hit: [
            "You carefully verify everything is in order",
            "You organize your papers one more time",
            "You make sure you haven't missed any required documents"
        ]
    },
    3: { // Take photo
        hit: [
            "You want to make sure your photo looks good",
            "You adjust your posture slightly for a better shot",
            "You take a moment to compose yourself for the camera"
        ]
    },
    4: { // Pay fee and receive license
        hit: [
            "You carefully review everything before leaving",
            "You double-check all the information on your temporary license",
            "You make sure you understand the next steps in the process"
        ]
    }
};
```

**New Functions**:
- `getProgressiveFlavorText(action, step, hitCount)`: Returns appropriate flavor text based on action repetition
- `resetHandState()`: Resets hit counter for new hands
- `incrementHitCount()`: Tracks repeated actions
- `getDMVOutcomeMessage(outcome)`: Returns random DMV-themed message for game outcomes

### 2. Enhanced UI Manager

**File**: `assets/js/ui-manager.js`

**Modified Functions**:
- `showFlavorText(action)`: Enhanced to use progressive flavor text system
- `updateContextualButtons()`: Improved to ensure DMV-appropriate button labels
- `showEducationalFeedback(outcome)`: New function to display stress management insights

**New Functions**:
- `displayProgressiveFlavorText(action, step, hitCount)`: Manages progressive flavor text display
- `showStressManagementTip(outcome)`: Provides educational context for outcomes
- `updateOutcomeMessage(outcome)`: Displays DMV-themed outcome messages

### 3. Enhanced Main Game Controller

**File**: `assets/js/main.js`

**Modified Functions**:
- `hit()`: Updated to track hit count and use progressive messaging
- `stand()`: Enhanced with DMV-themed messaging
- `endRound(result)`: Completely overhauled to use DMV outcome messages and educational feedback
- `startNewRound()`: Enhanced to reset hand state for fresh flavor text

## Data Models

### HandState Object
```javascript
{
    hitCount: number,        // Number of hits in current hand
    currentHand: number,     // Unique identifier for current hand
    lastAction: string       // Last action taken ('hit' or 'stand')
}
```

### DMVOutcomeMessage Object
```javascript
{
    message: string,         // Primary outcome message
    educational: string,     // Stress management insight
    encouragement: string    // Motivational follow-up
}
```

### ProgressiveFlavorEntry Object
```javascript
{
    step: number,           // DMV step index
    action: string,         // 'hit' or 'stand'
    variations: string[]    // Array of progressive flavor texts
}
```

## Error Handling

### Fallback Messaging System
- **Missing Progressive Text**: Falls back to base contextual flavor text, then generic messages
- **Invalid Step Index**: Uses generic DMV-appropriate messages
- **Missing Outcome Messages**: Provides educational stress management content as fallback

### Graceful Degradation
- If progressive flavor text fails, system continues with base flavor text
- If DMV outcome messages fail, system provides generic but appropriate feedback
- All messaging failures log warnings but don't break game functionality

### Input Validation
- Validate step indices before accessing progressive flavor arrays
- Sanitize all user-facing text to prevent XSS
- Ensure hit count doesn't exceed reasonable limits

## Testing Strategy

### Unit Tests
1. **Progressive Flavor Text System**
   - Test flavor text progression for each DMV step
   - Verify fallback behavior when progressive text is unavailable
   - Test hit count tracking and reset functionality

2. **DMV Outcome Messaging**
   - Test all outcome types return appropriate DMV-themed messages
   - Verify educational content is included with outcomes
   - Test random message selection for variety

3. **Integration with Existing Systems**
   - Verify contextual actions still work correctly
   - Test button label updates with new messaging
   - Ensure stress/zen point calculations remain accurate

### Integration Tests
1. **Complete Game Flow**
   - Test full DMV scenario with new messaging
   - Verify progressive flavor text resets between hands
   - Test educational feedback appears at appropriate times

2. **Edge Cases**
   - Test behavior with rapid repeated hits
   - Verify messaging with maximum stress levels
   - Test fallback behavior when data is missing

### User Experience Tests
1. **Message Clarity**
   - Verify DMV terminology feels natural and immersive
   - Test that educational content enhances rather than interrupts gameplay
   - Ensure progressive flavor text feels varied and engaging

2. **Accessibility**
   - Test screen reader compatibility with new messaging
   - Verify keyboard navigation works with updated UI elements
   - Test color contrast and readability of new message displays

## Implementation Phases

### Phase 1: Core Messaging Infrastructure
- Implement DMV outcome message system
- Create progressive flavor text data structures
- Add hand state tracking

### Phase 2: UI Integration
- Update outcome display logic
- Implement progressive flavor text display
- Enhance button labeling system

### Phase 3: Educational Enhancement
- Add stress management tips to outcomes
- Implement educational feedback system
- Create motivational messaging framework

### Phase 4: Polish and Testing
- Comprehensive testing of all messaging systems
- User experience refinement
- Performance optimization and error handling