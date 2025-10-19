# Design Document

## Overview

The audio system for SoberLife III will provide ambient lofi background music and subtle sound effects to enhance the therapeutic gaming experience. The system will be implemented as a modular JavaScript component that integrates seamlessly with the existing multi-file architecture while maintaining cross-browser compatibility and minimal performance impact.

## Architecture

### Audio System Module Structure
```
assets/js/audio-system.js
├── AudioManager (main class)
├── MusicPlayer (background music handling)
├── SoundEffects (gameplay sound effects)
└── AudioControls (user interface controls)
```

### Integration Points
- **Main Game Controller**: Initialize audio system on game startup
- **UI Manager**: Trigger sound effects for user interactions
- **Stress System**: Play confirmation sounds for zen activities
- **Card System**: Audio feedback for card interactions
- **Campaign Manager**: Maintain audio state across navigation

## Components and Interfaces

### AudioManager Class
```javascript
class AudioManager {
  constructor()
  init()                    // Initialize audio system
  setMasterVolume(level)    // Control overall volume
  enableAudio()             // Enable all audio
  disableAudio()            // Disable all audio
  savePreferences()         // Persist user settings
  loadPreferences()         // Load saved settings
}
```

### MusicPlayer Class
```javascript
class MusicPlayer {
  constructor(audioContext)
  loadTrack(url)           // Load background music file
  play()                   // Start/resume playback
  pause()                  // Pause playback
  setVolume(level)         // Adjust music volume
  loop()                   // Enable continuous looping
}
```

### SoundEffects Class
```javascript
class SoundEffects {
  constructor(audioContext)
  loadSounds(soundMap)     // Load all sound effect files
  play(soundName)          // Play specific sound effect
  setVolume(level)         // Adjust effects volume
  preloadSounds()          // Preload for instant playback
}
```

### AudioControls Class
```javascript
class AudioControls {
  constructor(audioManager)
  createVolumeSlider()     // Create music volume control
  createEffectsSlider()    // Create effects volume control
  createMuteButton()       // Create mute/unmute toggle
  updateUI()               // Sync controls with audio state
}
```

## Data Models

### Audio Configuration
```javascript
const audioConfig = {
  music: {
    baseFrequency: 220,      // A3 note as foundation
    harmonics: [1, 1.5, 2, 3], // Harmonic ratios for layering
    defaultVolume: 0.15,     // Subtle background level
    fadeInDuration: 3000,    // Gentle fade in
    fadeOutDuration: 2000,   // Gentle fade out
    modulationRate: 0.1      // Slow LFO for organic feel
  },
  effects: {
    sounds: {
      cardClick: { frequency: 800, duration: 50, type: 'noise' },
      buttonClick: { frequency: 440, duration: 100, type: 'sine' },
      zenComplete: { frequencies: [523, 659, 784], duration: 500, type: 'chord' },
      handWin: { frequencies: [261, 329, 392], duration: 300, type: 'chord' },
      handLose: { frequency: 220, duration: 200, type: 'sine' },
      cardDeal: { frequency: 1000, duration: 30, type: 'noise' }
    },
    defaultVolume: 0.3
  },
  storage: {
    musicVolumeKey: 'soberlife_music_volume',
    effectsVolumeKey: 'soberlife_effects_volume',
    audioEnabledKey: 'soberlife_audio_enabled'
  }
};
```

### User Preferences Model
```javascript
const audioPreferences = {
  musicVolume: 0.3,        // 0.0 to 1.0
  effectsVolume: 0.4,      // 0.0 to 1.0
  audioEnabled: true,      // boolean
  musicMuted: false,       // boolean
  effectsMuted: false      // boolean
};
```

## Audio File Strategy

### Programmatic Audio Generation
Instead of external MP3 files, the system will use Web Audio API to generate all sounds programmatically:

### Background Music
- **Method**: Web Audio API synthesis using OscillatorNode and GainNode
- **Style**: Simple ambient tones, gentle sine waves with slow modulation
- **Pattern**: Layered oscillators creating peaceful, lofi-style harmonies
- **Benefits**: Zero file size, no licensing issues, infinite variation
- **Fallback**: Simple tone generation for browsers without full Web Audio support

### Sound Effects
- **Method**: Programmatically generated using Web Audio API
- **Card Click**: Brief filtered noise burst (50ms)
- **Button Click**: Soft sine wave tone (100ms)
- **Zen Complete**: Gentle ascending tone sequence (500ms)
- **Hand Win**: Pleasant major chord (300ms)
- **Hand Lose**: Soft minor tone (200ms)
- **Card Deal**: Quick filtered noise (30ms)

### Implementation Benefits
- **Zero file size**: No external audio files to load
- **No licensing concerns**: All audio generated in real-time
- **Infinite variation**: Slight randomization prevents repetition
- **Instant loading**: No network requests or file loading delays
- **Cross-browser compatibility**: Graceful fallbacks for limited audio support

## Error Handling

### Audio Context Failures
```javascript
// Graceful degradation strategy
try {
  audioManager.initializeAudioContext();
} catch (error) {
  console.warn('Web Audio API not available:', error);
  // Fallback to simple HTML5 audio or disable audio
  audioManager.useSimpleFallback();
}
```

### Browser Compatibility Issues
```javascript
// Feature detection and fallbacks
if (window.AudioContext || window.webkitAudioContext) {
  // Use Web Audio API for advanced features
} else if (document.createElement('audio').canPlayType) {
  // Fallback to HTML5 Audio
} else {
  // Disable audio features gracefully
}
```

### Autoplay Policy Handling
```javascript
// Respect browser autoplay restrictions
const playAudio = async () => {
  try {
    await audioElement.play();
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      // Show user prompt to enable audio
      showAudioEnablePrompt();
    }
  }
};
```

## Testing Strategy

### Unit Tests
- Audio file loading and error handling
- Volume control functionality
- Preference persistence
- Cross-browser compatibility checks

### Integration Tests
- Audio system initialization with game startup
- Sound effect triggering from UI interactions
- Music continuity during navigation
- Performance impact measurement

### Manual Testing
- Audio quality assessment across devices
- User experience flow testing
- Accessibility testing for audio controls
- Battery impact testing on mobile devices

## Performance Considerations

### Lazy Initialization Strategy
```javascript
// Initialize audio context only when needed
const initAudio = async () => {
  if (userInteracted && !audioManager.initialized) {
    audioManager.createAudioContext();
    audioManager.setupOscillators();
  }
};
```

### Memory Management
```javascript
// Efficient audio buffer management
class AudioBuffer {
  constructor() {
    this.buffers = new Map();
    this.maxBuffers = 10;
  }
  
  cleanup() {
    // Release unused audio buffers
  }
}
```

### Mobile Optimization
- Compressed audio formats for bandwidth efficiency
- Reduced simultaneous audio streams
- Battery usage monitoring
- Adaptive quality based on device capabilities

## User Interface Integration

### Audio Controls Placement
- Volume sliders in game settings panel
- Mute button in header for quick access
- Visual feedback for audio state
- Accessibility labels for screen readers

### Visual Design
- Controls styled to match existing UI aesthetic
- Subtle visual indicators for audio state
- Smooth animations for volume changes
- Consistent with Comic Sans MS theme

## Implementation Phases

### Phase 1: Core Audio System
- AudioManager class implementation
- Basic music playback functionality
- Volume controls and persistence
- Browser compatibility layer

### Phase 2: Sound Effects Integration
- SoundEffects class implementation
- Integration with existing UI interactions
- Effect volume controls
- Performance optimization

### Phase 3: Polish and Testing
- Cross-browser testing and fixes
- Mobile device optimization
- User experience refinements
- Performance monitoring and optimization