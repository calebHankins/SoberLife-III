# Implementation Plan

- [x] 1. Create core audio system module
  - Create `assets/js/audio-system.js` with AudioManager class
  - Implement Web Audio API context initialization with fallback detection
  - Add browser compatibility checks and graceful degradation
  - _Requirements: 3.1, 3.3, 3.4_

- [ ] 2. Implement background music generation
  - [x] 2.1 Create MusicPlayer class with oscillator-based ambient music
    - Implement layered sine wave oscillators for lofi ambient sound
    - Add slow LFO modulation for organic feel and variation
    - Create seamless looping with fade in/out transitions
    - _Requirements: 1.1, 1.4, 5.2_

  - [x] 2.2 Add music volume controls and persistence
    - Implement volume adjustment with smooth transitions
    - Add localStorage persistence for user music volume preferences
    - Create mute/unmute functionality with volume restoration
    - _Requirements: 2.1, 2.3, 2.4, 2.5_

- [ ] 3. Implement sound effects system
  - [x] 3.1 Create SoundEffects class with programmatic sound generation
    - Generate card click sounds using filtered noise bursts
    - Create button click sounds with sine wave tones
    - Implement zen activity completion chimes with chord progressions
    - Add win/lose sounds with appropriate major/minor tonalities
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 3.2 Add sound effects volume controls
    - Implement independent volume control for sound effects
    - Add localStorage persistence for effects volume preferences
    - Ensure sound effects balance with background music
    - _Requirements: 6.4, 6.5, 2.5_

- [ ] 4. Create audio control interface
  - [x] 4.1 Add audio controls to game UI
    - Create volume sliders for music and effects in settings area
    - Add mute/unmute buttons with visual state indicators
    - Style controls to match existing Comic Sans MS theme
    - _Requirements: 2.1, 2.2_

  - [x] 4.2 Implement audio control persistence and synchronization
    - Save all audio preferences to localStorage on changes
    - Load saved preferences on game initialization
    - Sync UI controls with current audio state across navigation
    - _Requirements: 2.5_

- [ ] 5. Integrate audio system with existing game components
  - [x] 5.1 Initialize audio system in main game controller
    - Add audio system initialization to `assets/js/main.js`
    - Handle user interaction requirements for autoplay policies
    - Ensure audio continues seamlessly across game mode switches
    - _Requirements: 1.1, 1.3, 3.5_

  - [x] 5.2 Add sound effect triggers to UI interactions
    - Integrate card click sounds in `assets/js/card-system.js`
    - Add button click sounds in `assets/js/ui-manager.js`
    - Implement zen activity completion sounds in `assets/js/stress-system.js`
    - Add win/lose sounds for hand outcomes in game logic
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 6. Handle browser compatibility and error cases
  - [x] 6.1 Implement fallback audio system
    - Create HTML5 Audio fallback for browsers without Web Audio API
    - Add simple tone generation for basic sound effects
    - Ensure graceful degradation when audio features are unavailable
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 6.2 Add autoplay policy handling
    - Detect and handle browser autoplay restrictions
    - Provide user prompts to enable audio when blocked
    - Ensure game functionality continues without audio if needed
    - _Requirements: 3.5_

- [ ] 7. Testing and optimization
  - [x] 7.1 Create unit tests for audio system components
    - Test audio context initialization and fallback behavior
    - Verify volume control functionality and persistence
    - Test sound generation and playback timing
    - _Requirements: All_

  - [x] 7.2 Performance testing and mobile optimization
    - Test audio performance impact on game responsiveness
    - Verify battery usage on mobile devices is acceptable
    - Optimize audio generation for lower-powered devices
    - _Requirements: 4.1, 4.2, 4.3_