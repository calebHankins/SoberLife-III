# Design Document

## Overview

The adaptive background music system will enhance the existing audio system by creating dynamic musical responses to gameplay events and player stress levels. The system will build upon the current Web Audio API-based architecture to provide seamless musical transitions that reinforce the emotional context of the game.

## Architecture

### Core Components

The adaptive music system will extend the existing `MusicPlayer` class with new adaptive capabilities while maintaining backward compatibility with current audio controls and preferences.

```
AudioManager
├── AdaptiveMusicPlayer (extends MusicPlayer)
│   ├── StressLevelMonitor
│   ├── GameEventListener
│   ├── MusicLayerManager
│   └── TransitionController
├── SoundEffects (enhanced)
└── AudioControls (unchanged)
```

### Integration Points

- **Stress System Integration**: Monitor `gameState.stressLevel` changes via existing `updateStressLevel()` function
- **Game Event Integration**: Listen to existing game events (bust, win, lose, task completion)
- **Audio Controls**: Maintain compatibility with existing mute/volume controls
- **Performance**: Leverage existing mobile optimizations and performance monitoring

## Components and Interfaces

### 1. AdaptiveMusicPlayer Class

Extends the existing `MusicPlayer` class to add adaptive capabilities:

```javascript
class AdaptiveMusicPlayer extends MusicPlayer {
    constructor(audioContext) {
        super(audioContext);
        this.stressLevelMonitor = new StressLevelMonitor(this);
        this.gameEventListener = new GameEventListener(this);
        this.musicLayerManager = new MusicLayerManager(audioContext);
        this.transitionController = new TransitionController(audioContext);
        this.currentMoodState = 'calm'; // calm, tense, celebration
        this.extendedLoop = new ExtendedMusicLoop(audioContext);
    }
}
```

### 2. StressLevelMonitor

Monitors stress level changes and triggers appropriate musical responses:

```javascript
class StressLevelMonitor {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.currentStressLevel = 0;
        this.stressThresholds = {
            calm: 30,    // Below 30% = calm music
            tense: 70    // Above 70% = tense music
        };
        this.debounceTimer = null;
    }
    
    updateStressLevel(newLevel) {
        // Debounced stress level monitoring
        // Trigger music transitions based on thresholds
    }
}
```

### 3. GameEventListener

Listens for game events and triggers appropriate audio responses:

```javascript
class GameEventListener {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.eventQueue = [];
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Listen for bust, win, lose, task completion events
        // Queue events to prevent audio conflicts
    }
}
```

### 4. MusicLayerManager

Manages multiple audio layers for adaptive music:

```javascript
class MusicLayerManager {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.layers = {
            base: null,        // Base ambient layer
            tension: null,     // Tension layer for high stress
            celebration: null, // Celebration layer for wins
            ambient: null      // Additional ambient elements
        };
        this.layerGains = {};
    }
}
```

### 5. ExtendedMusicLoop

Creates longer, more varied background music loops:

```javascript
class ExtendedMusicLoop {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.sections = [
            'intro',     // 45 seconds
            'verse1',    // 60 seconds  
            'chorus1',   // 45 seconds
            'verse2',    // 60 seconds
            'bridge',    // 30 seconds
            'chorus2',   // 45 seconds
            'outro'      // 15 seconds
        ];
        this.totalDuration = 300; // 5 minutes
        this.currentSection = 0;
    }
}
```

## Data Models

### Music State Configuration

```javascript
const adaptiveMusicConfig = {
    stressLevels: {
        calm: {
            range: [0, 30],
            tempo: 0.8,
            harmonicComplexity: 'simple',
            filterCutoff: 2000,
            reverbAmount: 0.3
        },
        moderate: {
            range: [30, 70],
            tempo: 1.0,
            harmonicComplexity: 'moderate',
            filterCutoff: 2500,
            reverbAmount: 0.25
        },
        tense: {
            range: [70, 100],
            tempo: 1.2,
            harmonicComplexity: 'complex',
            filterCutoff: 3000,
            reverbAmount: 0.2
        }
    },
    gameEvents: {
        bust: {
            type: 'tension_spike',
            duration: 2000,
            intensity: 0.8
        },
        win: {
            type: 'positive_flourish',
            duration: 1500,
            intensity: 0.6
        },
        taskComplete: {
            type: 'celebration',
            duration: 5000,
            intensity: 1.0
        }
    },
    transitions: {
        crossfadeDuration: 2000,
        eventLayerFadeIn: 500,
        eventLayerFadeOut: 1000
    }
};
```

### Extended Loop Structure

```javascript
const extendedLoopStructure = {
    sections: [
        {
            name: 'intro',
            duration: 45,
            chordProgression: ['Am', 'F', 'C', 'G'],
            melodyDensity: 'sparse',
            rhythmPattern: 'gentle'
        },
        {
            name: 'verse1', 
            duration: 60,
            chordProgression: ['Am', 'F', 'C', 'G', 'Am', 'Dm', 'G', 'C'],
            melodyDensity: 'moderate',
            rhythmPattern: 'steady'
        },
        // ... additional sections
    ],
    transitionSegments: {
        duration: 5,
        type: 'harmonic_bridge'
    }
};
```

## Error Handling

### Graceful Degradation

1. **Web Audio API Unavailable**: Fall back to existing simple music player
2. **Performance Issues**: Automatically reduce adaptive complexity
3. **Audio Context Suspended**: Queue adaptive changes until context resumes
4. **Memory Constraints**: Limit concurrent audio layers on mobile devices

### Error Recovery

```javascript
class AdaptiveAudioErrorHandler {
    static handleError(error, context) {
        switch (error.type) {
            case 'AUDIO_CONTEXT_ERROR':
                return this.fallbackToSimpleMode();
            case 'PERFORMANCE_DEGRADATION':
                return this.reduceComplexity();
            case 'MEMORY_PRESSURE':
                return this.optimizeForMobile();
        }
    }
}
```

## Testing Strategy

### Unit Tests

1. **Stress Level Monitoring**: Test threshold detection and debouncing
2. **Event Queue Management**: Test event prioritization and conflict resolution
3. **Layer Management**: Test audio layer crossfading and volume control
4. **Extended Loop**: Test seamless section transitions

### Integration Tests

1. **Stress-Music Correlation**: Verify music changes match stress level changes
2. **Game Event Response**: Test audio responses to bust, win, lose events
3. **Performance Impact**: Monitor CPU and memory usage during adaptive playback
4. **Cross-browser Compatibility**: Test on different browsers and devices

### User Experience Tests

1. **Transition Smoothness**: Verify no jarring audio cuts during gameplay
2. **Volume Consistency**: Ensure adaptive elements respect user volume settings
3. **Mute Functionality**: Test that mute affects all adaptive audio elements
4. **Extended Play Sessions**: Test loop quality over 30+ minute sessions

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load adaptive layers only when needed
2. **Audio Buffer Reuse**: Reuse oscillators and buffers where possible
3. **Mobile Optimization**: Reduce layer count and complexity on mobile
4. **Memory Management**: Clean up unused audio nodes promptly

### Monitoring

```javascript
class AdaptiveAudioPerformanceMonitor {
    static metrics = {
        activeOscillators: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        audioLatency: 0
    };
    
    static checkPerformance() {
        // Monitor and adjust complexity based on performance
    }
}
```

## Implementation Phases

### Phase 1: Core Adaptive Framework
- Extend MusicPlayer class with adaptive capabilities
- Implement stress level monitoring
- Create basic layer management system

### Phase 2: Game Event Integration  
- Add game event listeners
- Implement event-based audio responses
- Create event queue management

### Phase 3: Extended Music Loop
- Design and implement 5-minute loop structure
- Add seamless transition segments
- Test loop quality and variation

### Phase 4: Polish and Optimization
- Performance optimization for mobile
- Enhanced error handling
- User experience refinements

## Backward Compatibility

The adaptive music system will maintain full backward compatibility with:
- Existing audio controls and preferences
- Current mute/unmute functionality
- Volume control systems
- Mobile optimizations
- Simple fallback mode for unsupported browsers