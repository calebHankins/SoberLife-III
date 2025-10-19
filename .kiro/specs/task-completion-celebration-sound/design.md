# Design Document

## Overview

The task completion celebration sound will be a programmatically generated lofi-style chord progression that plays when a player successfully completes a task. The sound will integrate seamlessly with the existing audio system and provide satisfying audio feedback that aligns with the game's zen-like aesthetic.

## Architecture

The celebration sound will be implemented as a new sound effect type within the existing `SoundEffects` class, leveraging the Web Audio API for programmatic generation. The sound will be triggered from the task completion logic in `main.js`.

### Integration Points

1. **Audio System**: Extend the existing `audioConfig.effects.sounds` configuration
2. **Sound Effects Class**: Add new method for generating celebration chord progressions
3. **Task Completion Flow**: Integrate sound trigger in the `nextStep()` function
4. **Volume Control**: Respect existing effects volume and mute settings

## Components and Interfaces

### Audio Configuration Extension

```javascript
// Addition to audioConfig.effects.sounds
taskComplete: {
    type: 'celebration',
    duration: 2000,
    chordProgression: [
        [261.63, 329.63, 392.00, 523.25], // C Major 7th
        [293.66, 369.99, 440.00, 587.33], // D Major 7th
        [329.63, 415.30, 493.88, 659.25]  // E Major 7th
    ],
    timing: [0, 0.4, 0.8], // Chord timing in seconds
    fadeIn: 100,
    fadeOut: 500
}
```

### Sound Effects Class Extension

```javascript
// New method in SoundEffects class
playCelebrationSound(config) {
    // Generate chord progression with gentle arpeggiation
    // Use multiple oscillators for rich harmonic content
    // Apply gentle filtering and reverb effects
    // Implement smooth fade in/out envelopes
}
```

### Task Completion Integration

The sound will be triggered in the `nextStep()` function when task completion is detected, before the success screen is shown:

```javascript
// In nextStep() function, after completion bonus is awarded
if (gameState.currentStep >= currentSteps.length) {
    // Play celebration sound
    if (audioManager && audioManager.soundEffects) {
        audioManager.soundEffects.play('taskComplete');
    }
    
    // Existing completion logic...
}
```

## Data Models

### Celebration Sound Configuration

```javascript
{
    type: 'celebration',
    duration: 2000,                    // Total duration in milliseconds
    chordProgression: [                // Array of chord frequencies
        [freq1, freq2, freq3, freq4],  // First chord
        [freq1, freq2, freq3, freq4],  // Second chord
        [freq1, freq2, freq3, freq4]   // Third chord
    ],
    timing: [0, 0.4, 0.8],            // When each chord plays (seconds)
    fadeIn: 100,                       // Fade in duration (ms)
    fadeOut: 500,                      // Fade out duration (ms)
    arpeggiationDelay: 0.05           // Delay between notes in chord (seconds)
}
```

## Error Handling

1. **Audio Context Unavailable**: Gracefully skip sound if Web Audio API is not available
2. **Audio Disabled**: Respect user's audio preferences and skip if effects are muted
3. **Oscillator Creation Failure**: Use try-catch blocks around oscillator creation
4. **Timing Issues**: Ensure sound doesn't interfere with other audio elements

### Fallback Behavior

- If Web Audio API fails, the celebration sound is simply skipped
- No error messages are shown to the user
- Task completion continues normally without audio feedback

## Testing Strategy

### Unit Testing
- Test celebration sound configuration parsing
- Test chord progression generation
- Test volume and mute setting respect
- Test error handling for audio failures

### Integration Testing
- Test sound plays at correct moment in task completion flow
- Test sound works in both single task and campaign modes
- Test sound doesn't interfere with other audio elements
- Test sound respects user audio preferences

### Manual Testing
- Verify sound quality and aesthetic fit with existing audio
- Test volume levels are appropriate
- Confirm timing feels rewarding and not jarring
- Validate cross-browser compatibility

## Implementation Details

### Chord Progression Design

The celebration sound will use a ascending major 7th chord progression that creates a sense of resolution and achievement:

1. **C Major 7th** (C-E-G-B): Stable, grounding chord
2. **D Major 7th** (D-F#-A-C#): Uplifting transition
3. **E Major 7th** (E-G#-B-D#): Bright, celebratory resolution

### Arpeggio Pattern

Each chord will be arpeggiated with a 50ms delay between notes, creating a gentle cascading effect that feels organic and soothing rather than mechanical.

### Audio Processing

- **Low-pass filter**: Applied at 3000Hz to maintain warmth
- **Reverb**: Subtle reverb using the existing reverb chain
- **Envelope**: Gentle attack (100ms) and longer release (500ms)
- **Volume**: Balanced to complement but not overpower background music

### Performance Considerations

- Oscillators are created on-demand and cleaned up after use
- Sound generation is lightweight and won't impact game performance
- Memory usage is minimal as no audio buffers are stored