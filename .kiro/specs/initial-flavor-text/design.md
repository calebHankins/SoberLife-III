# Design Document

## Overview

The initial flavor text feature adds immersive, step-appropriate introductory text that appears before the user takes their first action in each task step. This feature enhances the roleplay experience by setting the scene and providing context for each DMV step, making players feel more connected to the scenario they're navigating.

The system will display contextual flavor text in a modal overlay when a new step begins, requiring user acknowledgment before gameplay controls become available. This ensures players read and absorb the scenario context before making decisions.

## Architecture

### Integration Points

The initial flavor text system integrates with the existing game architecture at several key points:

1. **Game State Management** (`game-state.js`): New data structures for step-specific initial flavor text
2. **UI Manager** (`ui-manager.js`): Modal display system for flavor text presentation
3. **Main Game Controller** (`main.js`): Trigger points for showing initial flavor text when steps begin

### Data Flow

```
Step Transition → Check for Initial Flavor Text → Display Modal → User Acknowledges → Enable Game Controls
```

## Components and Interfaces

### 1. Initial Flavor Text Data Structure

**Location**: `assets/js/game-state.js`

```javascript
// Initial flavor text for each DMV step
export const initialFlavorText = {
    0: {
        title: "Entering the DMV",
        text: "You walk through the heavy glass doors into the familiar fluorescent-lit world of the Department of Motor Vehicles. The air conditioning hums overhead as you take in the scene: numbered tickets, waiting areas filled with plastic chairs, and that distinctive government building atmosphere. Your heart rate picks up slightly as you approach the front desk, knowing this is just the beginning of your Real ID renewal journey.",
        stressTriggers: ["bureaucracy", "waiting", "paperwork"],
        tips: "Take a deep breath and remember - you've prepared for this. Everyone here is just trying to help you get what you need."
    },
    1: {
        title: "The Waiting Game",
        text: "You've got your number: B47. The digital display shows they're currently serving B23. The math isn't encouraging. Around you, other people shift in their seats, check their phones, and occasionally glance at the display with varying degrees of patience. Some look zen-like in their acceptance, others tap their feet anxiously. The clock on the wall seems to be moving in slow motion.",
        stressTriggers: ["waiting", "uncertainty", "time pressure"],
        tips: "This is perfect time to practice mindfulness. Use this waiting period as an opportunity to center yourself."
    },
    2: {
        title: "Document Showdown",
        text: "Your number is finally called! You approach the clerk's window with your carefully organized folder of documents. The clerk looks up with the practiced efficiency of someone who's seen thousands of Real ID applications. They gesture to the document slot and wait expectantly. This is the moment of truth - do you have everything they need? Your preparation is about to be put to the test.",
        stressTriggers: ["scrutiny", "preparation anxiety", "authority figures"],
        tips: "Trust your preparation. You've double-checked everything. Stay calm and present your documents confidently."
    },
    3: {
        title: "Picture Perfect Pressure",
        text: "The clerk reviews your documents with practiced eyes, occasionally making notes or stamps. Everything seems to be in order - relief! Now comes the photo station. The camera setup looks intimidating, and you know this picture will be on your ID for years to come. The photographer adjusts the height and asks you to step forward. The bright lights make you squint slightly. 'Look here and try to relax,' they say, which somehow makes relaxing feel impossible.",
        stressTriggers: ["performance anxiety", "appearance concerns", "bright lights"],
        tips: "Remember, everyone looks a bit awkward in DMV photos. Just be yourself and breathe naturally."
    },
    4: {
        title: "The Final Stretch",
        text: "Photo taken, documents approved - you're in the home stretch! The clerk hands you a receipt and explains the next steps. Your temporary license is printing, and your Real ID will arrive by mail in 7-10 business days. There's a sense of accomplishment building as you realize you've successfully navigated the entire process. The end is in sight, but there are still a few final details to confirm before you can walk out those doors as a DMV victor.",
        stressTriggers: ["final details", "completion anxiety", "information overload"],
        tips: "You've made it this far! Take a moment to appreciate your persistence and patience throughout this process."
    }
};
```

### 2. Modal Display System

**Location**: `assets/js/ui-manager.js`

New functions for displaying initial flavor text:

```javascript
// Show initial flavor text modal
export function showInitialFlavorText(stepIndex) {
    // Create modal overlay
    // Display step-specific flavor text
    // Disable game controls until acknowledged
    // Handle mobile responsiveness
}

// Hide initial flavor text modal
export function hideInitialFlavorText() {
    // Remove modal overlay
    // Enable game controls
    // Restore focus to game area
}
```

### 3. Step Transition Integration

**Location**: `assets/js/main.js`

Modified functions to trigger initial flavor text:

```javascript
// Enhanced startNewRound function
export function startNewRound() {
    // Check if this is a new step
    // Show initial flavor text if needed
    // Existing round setup logic
}

// Enhanced nextStep function  
export function nextStep() {
    // Advance step
    // Trigger initial flavor text for new step
    // Existing step logic
}
```

## Data Models

### Initial Flavor Text Object

```javascript
{
    title: string,           // Step title (e.g., "Entering the DMV")
    text: string,           // Main flavor text content
    stressTriggers: array,  // Common stress triggers for this step
    tips: string           // Optional stress management tip
}
```

### Modal State

```javascript
{
    isVisible: boolean,     // Whether modal is currently shown
    currentStep: number,    // Which step's flavor text is displayed
    hasBeenShown: boolean   // Whether user has seen this step's text
}
```

## Error Handling

### Graceful Degradation

1. **Missing Flavor Text**: If no flavor text exists for a step, display generic but appropriate message
2. **Modal Display Errors**: Fall back to inline text display if modal system fails
3. **Mobile Compatibility**: Ensure modal works across all viewport sizes

### Error Recovery

```javascript
// Fallback flavor text system
function getFallbackInitialFlavorText(stepIndex) {
    const fallbackTexts = {
        0: "You're starting your DMV visit. Take a deep breath and remember your preparation.",
        1: "Time to wait for your number to be called. This is a good opportunity to practice patience.",
        2: "It's time to present your documents. Trust in your preparation.",
        3: "Photo time! Just be yourself and stay relaxed.",
        4: "You're almost done! Just a few more steps to complete your visit."
    };
    
    return fallbackTexts[stepIndex] || "You're making progress through your DMV visit.";
}
```

## Testing Strategy

### Unit Tests

1. **Flavor Text Data Integrity**: Verify all steps have appropriate flavor text
2. **Modal Display Functions**: Test show/hide functionality
3. **Step Integration**: Ensure flavor text triggers at correct times
4. **Error Handling**: Test fallback behaviors

### Integration Tests

1. **Complete Step Flow**: Test flavor text → acknowledgment → gameplay flow
2. **Mobile Responsiveness**: Verify modal works on different screen sizes
3. **Accessibility**: Test keyboard navigation and screen reader compatibility

### User Experience Tests

1. **Immersion Impact**: Verify flavor text enhances rather than interrupts gameplay
2. **Skip Functionality**: Test optional skip behavior for repeat players
3. **Loading Performance**: Ensure flavor text doesn't delay game startup

## Implementation Phases

### Phase 1: Core Data Structure
- Add initial flavor text data to game-state.js
- Implement fallback system for missing text
- Add unit tests for data integrity

### Phase 2: Modal Display System
- Create modal overlay component
- Implement show/hide functionality
- Add mobile-responsive styling
- Test accessibility features

### Phase 3: Game Integration
- Modify step transition functions
- Add trigger logic for new steps
- Implement user acknowledgment flow
- Test complete user journey

### Phase 4: Enhancement & Polish
- Add optional skip functionality
- Implement fade-in/fade-out animations
- Add stress management tips integration
- Performance optimization

## Accessibility Considerations

1. **Keyboard Navigation**: Modal must be fully keyboard accessible
2. **Screen Reader Support**: Proper ARIA labels and announcements
3. **Focus Management**: Trap focus within modal, restore after dismissal
4. **High Contrast**: Ensure text is readable in high contrast mode
5. **Reduced Motion**: Respect user preferences for reduced animations

## Mobile Responsiveness

1. **Viewport Adaptation**: Modal scales appropriately on small screens
2. **Touch Interaction**: Large, touch-friendly continue button
3. **Text Readability**: Appropriate font sizes for mobile viewing
4. **Performance**: Minimal impact on mobile device performance