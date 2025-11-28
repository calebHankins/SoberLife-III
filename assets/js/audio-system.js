/**
 * Audio System for SoberLife III
 * Provides ambient lofi background music and soft sound effects
 * Uses Web Audio API for programmatic sound generation
 */

// Adaptive music configuration
const adaptiveMusicConfig = {
    stressLevels: {
        calm: {
            range: [0, 30],
            tempo: 0.5, // Very slow and peaceful
            harmonicComplexity: 'simple',
            filterCutoff: 1200, // Very warm and muffled
            reverbAmount: 0.5, // Very spacious and dreamy
            melodyFrequency: 0.1, // Very few melody notes
            rhythmIntensity: 0.3, // Very gentle rhythm
            volume: 1.3, // Increased from 1.0 for better audibility
            chordProgression: [
                [130.81, 164.81, 196], // C3 (C, E, G) - very low and peaceful
                [146.83, 174.61, 220], // D3 (D, F, A) - gentle
                [164.81, 196, 246.94], // E3 (E, G, B) - resolved
                [146.83, 184.99, 220]  // D3 (D, F#, A) - warm major
            ]
        },
        moderate: {
            range: [30, 70],
            tempo: 1.0,
            harmonicComplexity: 'moderate',
            filterCutoff: 2500,
            reverbAmount: 0.25,
            melodyFrequency: 0.5, // Normal melody frequency
            rhythmIntensity: 1.0,
            volume: 1.6, // Increased from 1.5 for better audibility
            chordProgression: [
                [220, 261.63, 329.63], // Am (A, C, E)
                [196, 246.94, 293.66], // G (G, B, D)
                [261.63, 329.63, 392],  // C (C, E, G)
                [174.61, 220, 261.63]   // F (F, A, C)
            ]
        },
        tense: {
            range: [70, 100],
            tempo: 2.2, // Very fast and urgent
            harmonicComplexity: 'complex',
            filterCutoff: 5000, // Very bright and harsh
            reverbAmount: 0.05, // Very dry and immediate
            melodyFrequency: 0.9, // Almost constant melody notes
            rhythmIntensity: 2.0, // Very intense rhythm
            volume: 1.85, // Increased from 1.75 for better audibility
            chordProgression: [
                [277.18, 329.63, 415.30], // C# (C#, E, G#) - high and dissonant
                [311.13, 369.99, 466.16], // D# (D#, F#, A#) - very tense
                [329.63, 415.30, 493.88], // E (E, G#, B) - unstable high
                [293.66, 369.99, 440]     // D (D, F#, A) - anxious high
            ]
        }
    },
    gameEvents: {
        bust: {
            type: 'tension_spike',
            duration: 2000,
            intensity: 0.8,
            frequencies: [110, 146.83, 174.61], // Low tension chord
            fadeIn: 100,
            fadeOut: 800
        },
        handLose: {
            type: 'disappointment',
            duration: 1500,
            intensity: 0.5,
            frequencies: [196, 220, 246.94], // Minor disappointment
            fadeIn: 150,
            fadeOut: 600
        },
        handWin: {
            type: 'positive_flourish',
            duration: 1500,
            intensity: 0.6,
            frequencies: [329.63, 392, 493.88], // Uplifting chord
            fadeIn: 100,
            fadeOut: 500
        },
        taskComplete: {
            type: 'celebration',
            duration: 5000,
            intensity: 1.0,
            energyBoostDuration: 8000 // Extended energy boost
        }
    },
    transitions: {
        crossfadeDuration: 2000,
        eventLayerFadeIn: 500,
        eventLayerFadeOut: 1000,
        stressTransitionDebounce: 500 // Faster response to stress changes
    },
    extendedLoop: {
        sections: [
            { name: 'intro', duration: 45, chordCount: 4, melodyDensity: 'sparse' },
            { name: 'verse1', duration: 60, chordCount: 8, melodyDensity: 'moderate' },
            { name: 'chorus1', duration: 45, chordCount: 6, melodyDensity: 'rich' },
            { name: 'verse2', duration: 60, chordCount: 8, melodyDensity: 'moderate' },
            { name: 'bridge', duration: 30, chordCount: 4, melodyDensity: 'sparse' },
            { name: 'chorus2', duration: 45, chordCount: 6, melodyDensity: 'rich' },
            { name: 'outro', duration: 15, chordCount: 2, melodyDensity: 'minimal' }
        ],
        totalDuration: 300, // 5 minutes
        transitionDuration: 5
    }
};

// Audio configuration constants
const audioConfig = {
    music: {
        baseFrequency: 220,      // A3 note as foundation
        harmonics: [1, 1.5, 2, 3], // Harmonic ratios for layering
        defaultVolume: 0.95,     // Increased from 0.15 for better audibility
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
            cardDeal: { frequency: 1000, duration: 30, type: 'noise' },
            taskComplete: {
                type: 'celebration',
                duration: 2000,
                chordProgression: [
                    [261.63, 329.63, 392.00, 523.25], // C Major 7th (C-E-G-B)
                    [293.66, 369.99, 440.00, 587.33], // D Major 7th (D-F#-A-C#)
                    [329.63, 415.30, 493.88, 659.25]  // E Major 7th (E-G#-B-D#)
                ],
                timing: [0, 0.4, 0.8], // Chord timing in seconds
                fadeIn: 100,
                fadeOut: 500,
                arpeggiationDelay: 0.05 // Delay between notes in chord (seconds)
            }
        },
        defaultVolume: 0.95      // Increased from 0.3 for better audibility
    },
    storage: {
        musicVolumeKey: 'soberlife_music_volume',
        effectsVolumeKey: 'soberlife_effects_volume',
        audioEnabledKey: 'soberlife_audio_enabled'
    }
};

/**
 * Main Audio Manager Class
 * Coordinates all audio functionality and manages system state
 */
class AudioManager {
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }
        AudioManager.instance = this;

        console.log('AudioManager: Instantiating new AudioManager instance');

        this.audioContext = null;
        this.musicPlayer = null;
        this.soundEffects = null;
        this.audioControls = null;
        this.initialized = false;
        this.userInteracted = false;
        this.preferences = {
            musicVolume: audioConfig.music.defaultVolume,
            effectsVolume: audioConfig.effects.defaultVolume,
            audioEnabled: true,
            musicMuted: false,
            effectsMuted: false
        };
    }

    /**
     * Initialize the audio system
     * Detects browser capabilities and sets up appropriate audio context
     */
    async init() {
        console.log('AudioManager: Initializing audio system...');

        try {
            // Load saved preferences first
            this.loadPreferences();

            // Check for Web Audio API support
            if (this.isWebAudioSupported()) {
                await this.initializeWebAudio();
            } else if (this.isHTML5AudioSupported()) {
                this.initializeHTML5Audio();
            } else {
                console.warn('AudioManager: No audio support detected, disabling audio');
                this.preferences.audioEnabled = false;
                return;
            }

            this.initialized = true;
            console.log('AudioManager: Audio system initialized successfully');

        } catch (error) {
            console.error('AudioManager: Failed to initialize audio system:', error);
            this.useSimpleFallback();
        }
    }

    /**
     * Check if Web Audio API is supported
     */
    isWebAudioSupported() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }

    /**
     * Check if HTML5 Audio is supported
     */
    isHTML5AudioSupported() {
        const audio = document.createElement('audio');
        return !!(audio.canPlayType && audio.canPlayType('audio/mpeg').replace(/no/, ''));
    }

    /**
     * Initialize Web Audio API context and components
     */
    async initializeWebAudio() {
        console.log('AudioManager: Initializing Web Audio API...');

        // Performance monitoring
        const startTime = performance.now();

        // Create audio context
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextClass();

        // Mobile optimization: reduce complexity on mobile devices
        if (this.isMobileDevice()) {
            console.log('AudioManager: Mobile device detected, applying optimizations' + (this.musicPlayer && this.musicPlayer.instanceId ? ` (MusicPlayer[${this.musicPlayer.instanceId}])` : ''));
            this.applyMobileOptimizations();
        }

        // Handle autoplay policy - context starts in suspended state
        if (this.audioContext.state === 'suspended') {
            console.log('AudioManager: Audio context suspended, waiting for user interaction' + (this.musicPlayer && this.musicPlayer.instanceId ? ` (MusicPlayer[${this.musicPlayer.instanceId}])` : ''));
            this.setupUserInteractionHandler();
        }

        // Initialize components with error handling
        try {
            this.musicPlayer = new AdaptiveMusicPlayer(this.audioContext, this);
            console.log('AudioManager: AdaptiveMusicPlayer initialized successfully' + (this.musicPlayer && this.musicPlayer.instanceId ? ` (MusicPlayer[${this.musicPlayer.instanceId}])` : ''));
        } catch (error) {
            console.warn('AudioManager: Failed to initialize AdaptiveMusicPlayer, falling back to MusicPlayer:', error);
            this.musicPlayer = new MusicPlayer(this.audioContext, this);
        }

        this.soundEffects = new SoundEffects(this.audioContext, this);
        this.audioControls = new AudioControls(this);

        // Apply saved preferences
        this.applyPreferences();

        // Log performance metrics
        const initTime = performance.now() - startTime;
        console.log(`AudioManager: Initialization completed in ${initTime.toFixed(2)}ms`);

        // Monitor memory usage if available
        if (performance.memory) {
            console.log(`AudioManager: Memory usage - Used: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        }
    }

    /**
     * Initialize HTML5 Audio fallback
     */
    initializeHTML5Audio() {
        console.log('AudioManager: Initializing HTML5 Audio fallback...');
        // Simple fallback implementation
        this.musicPlayer = new SimpleMusicPlayer(null);
        this.soundEffects = new SimpleSoundEffects(this);
        this.audioControls = new AudioControls(this);
        this.applyPreferences();
    }

    /**
     * Setup handler for user interaction to resume audio context
     */
    setupUserInteractionHandler() {
        const resumeAudio = async () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                try {
                    await this.audioContext.resume();
                    console.log('AudioManager: Audio context resumed after user interaction');
                    this.userInteracted = true;

                    // Start background music if enabled
                    if (this.preferences.audioEnabled && !this.preferences.musicMuted) {
                        this.musicPlayer.play();
                    }
                } catch (error) {
                    console.error('AudioManager: Failed to resume audio context:', error);
                }
            }

            // Remove listeners after first interaction
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
        };

        // Listen for user interactions
        document.addEventListener('click', resumeAudio);
        document.addEventListener('keydown', resumeAudio);
        document.addEventListener('touchstart', resumeAudio);
    }

    /**
     * Fallback for when audio features are unavailable
     */
    useSimpleFallback() {
        console.log('AudioManager: Using simple fallback mode');
        this.preferences.audioEnabled = false;
        this.initialized = true;

        // Create fallback components
        this.musicPlayer = new SimpleMusicPlayer(null);
        this.soundEffects = new SimpleSoundEffects(this);
        this.audioControls = new AudioControls(this);
    }

    /**
     * Apply saved preferences to audio components
     */
    applyPreferences() {
        if (this.musicPlayer) {
            this.musicPlayer.setVolume(this.preferences.musicMuted ? 0 : this.preferences.musicVolume);
        }
        if (this.soundEffects) {
            this.soundEffects.setVolume(this.preferences.effectsMuted ? 0 : this.preferences.effectsVolume);
        }
    }

    /**
     * Set master volume for all audio
     */
    setMasterVolume(level) {
        level = Math.max(0, Math.min(1, level));
        if (this.musicPlayer) this.musicPlayer.setVolume(level * this.preferences.musicVolume);
        if (this.soundEffects) this.soundEffects.setVolume(level * this.preferences.effectsVolume);
    }

    /**
     * Enable all audio
     */
    enableAudio() {
        this.preferences.audioEnabled = true;
        this.savePreferences();

        if (this.musicPlayer && this.userInteracted) {
            this.musicPlayer.play();
        }
    }

    /**
     * Disable all audio
     */
    disableAudio() {
        this.preferences.audioEnabled = false;
        this.savePreferences();

        if (this.musicPlayer) {
            this.musicPlayer.pause();
        }
    }

    /**
     * Save user preferences to localStorage
     */
    savePreferences() {
        try {
            localStorage.setItem(audioConfig.storage.musicVolumeKey, this.preferences.musicVolume.toString());
            localStorage.setItem(audioConfig.storage.effectsVolumeKey, this.preferences.effectsVolume.toString());
            localStorage.setItem(audioConfig.storage.audioEnabledKey, this.preferences.audioEnabled.toString());
            localStorage.setItem('soberlife_music_muted', this.preferences.musicMuted.toString());
            localStorage.setItem('soberlife_effects_muted', this.preferences.effectsMuted.toString());
        } catch (error) {
            console.warn('AudioManager: Failed to save preferences:', error);
        }
    }

    /**
     * Load user preferences from localStorage
     */
    loadPreferences() {
        try {
            const musicVolume = localStorage.getItem(audioConfig.storage.musicVolumeKey);
            const effectsVolume = localStorage.getItem(audioConfig.storage.effectsVolumeKey);
            const audioEnabled = localStorage.getItem(audioConfig.storage.audioEnabledKey);
            const musicMuted = localStorage.getItem('soberlife_music_muted');
            const effectsMuted = localStorage.getItem('soberlife_effects_muted');

            if (musicVolume !== null) {
                this.preferences.musicVolume = parseFloat(musicVolume);
            }
            if (effectsVolume !== null) {
                this.preferences.effectsVolume = parseFloat(effectsVolume);
            }
            if (audioEnabled !== null) {
                this.preferences.audioEnabled = audioEnabled === 'true';
            }
            if (musicMuted !== null) {
                this.preferences.musicMuted = musicMuted === 'true';
            }
            if (effectsMuted !== null) {
                this.preferences.effectsMuted = effectsMuted === 'true';
            }

            console.log('AudioManager: Loaded preferences:', this.preferences);
        } catch (error) {
            console.warn('AudioManager: Failed to load preferences:', error);
        }
    }

    /**
     * Set music volume
     */
    setMusicVolume(level) {
        level = Math.max(0, Math.min(1, level));
        this.preferences.musicVolume = level;

        if (this.musicPlayer && !this.preferences.musicMuted) {
            this.musicPlayer.setVolume(level);
        }

        this.savePreferences();
        console.log(`AudioManager: Music volume set to ${level}`);
    }

    /**
     * Set effects volume
     */
    setEffectsVolume(level) {
        level = Math.max(0, Math.min(1, level));
        this.preferences.effectsVolume = level;

        if (this.soundEffects && !this.preferences.effectsMuted) {
            this.soundEffects.setVolume(level);
        }

        this.savePreferences();
        console.log(`AudioManager: Effects volume set to ${level}`);
    }

    /**
     * Toggle music mute
     */
    toggleMusicMute() {
        this.preferences.musicMuted = !this.preferences.musicMuted;

        if (this.musicPlayer) {
            const volume = this.preferences.musicMuted ? 0 : this.preferences.musicVolume;
            this.musicPlayer.setVolume(volume);
        }

        this.savePreferences();
        console.log(`AudioManager: Music ${this.preferences.musicMuted ? 'muted' : 'unmuted'}`);
        return this.preferences.musicMuted;
    }

    /**
     * Toggle effects mute
     */
    toggleEffectsMute() {
        this.preferences.effectsMuted = !this.preferences.effectsMuted;

        if (this.soundEffects) {
            const volume = this.preferences.effectsMuted ? 0 : this.preferences.effectsVolume;
            this.soundEffects.setVolume(volume);
        }

        this.savePreferences();
        console.log(`AudioManager: Effects ${this.preferences.effectsMuted ? 'muted' : 'unmuted'}`);
        return this.preferences.effectsMuted;
    }

    /**
     * Toggle both music and effects mute state together
     */
    toggleAllMute() {
        const bothMuted = this.preferences.musicMuted && this.preferences.effectsMuted;

        // If both muted, unmute both; otherwise mute both
        this.preferences.musicMuted = !bothMuted;
        this.preferences.effectsMuted = !bothMuted;

        const musicVolume = this.preferences.musicMuted ? 0 : this.preferences.musicVolume;
        const effectsVolume = this.preferences.effectsMuted ? 0 : this.preferences.effectsVolume;

        if (this.musicPlayer) this.musicPlayer.setVolume(musicVolume);
        if (this.soundEffects) this.soundEffects.setVolume(effectsVolume);

        this.savePreferences();
        console.log(`AudioManager: All audio ${this.preferences.musicMuted && this.preferences.effectsMuted ? 'muted' : 'unmuted'}`);
        return this.preferences.musicMuted && this.preferences.effectsMuted;
    }

    /**
     * Get current preferences
     */
    getPreferences() {
        return { ...this.preferences };
    }

    /**
     * Start background music if conditions are met
     */
    startMusic() {
        if (this.preferences.audioEnabled && !this.preferences.musicMuted && this.userInteracted && this.musicPlayer) {
            // Stop existing music if already playing to ensure clean state
            // This prevents overlapping audio when switching between game modes
            if (this.musicPlayer.isPlaying) {
                console.log('AudioManager: Restarting music (was already playing)');
                this.musicPlayer.pause();
            }
            // Start music with clean state
            this.musicPlayer.play();
        }
    }

    /**
     * Stop background music
     */
    stopMusic() {
        if (this.musicPlayer) {
            this.musicPlayer.pause();
        }
    }

    /**
     * Detect if running on mobile device
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.innerWidth <= 768 && window.innerHeight <= 1024);
    }

    /**
     * Apply mobile-specific optimizations
     */
    applyMobileOptimizations() {
        // Slightly reduce default volumes for better battery life, but keep audible
        this.preferences.musicVolume = Math.min(this.preferences.musicVolume, 0.55);
        this.preferences.effectsVolume = Math.min(this.preferences.effectsVolume, 0.65);

        console.log('AudioManager: Applied mobile optimizations');
    }

    /**
     * Monitor performance and adjust settings if needed
     */
    monitorPerformance() {
        if (!performance.now) return;

        const checkPerformance = () => {
            const startTime = performance.now();

            // Simple performance test
            setTimeout(() => {
                const responseTime = performance.now() - startTime;

                if (responseTime > 50) { // If response time is slow
                    console.warn('AudioManager: Performance degradation detected, reducing audio complexity');
                    this.reduceAudioComplexity();
                }
            }, 0);
        };

        // Check performance periodically
        setInterval(checkPerformance, 30000); // Every 30 seconds
    }

    /**
     * Reduce audio complexity for better performance
     */
    reduceAudioComplexity() {
        if (this.musicPlayer && this.musicPlayer.oscillators) {
            console.log('AudioManager: Reducing audio complexity for better performance');
        }
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        const metrics = {
            initialized: this.initialized,
            audioContextState: this.audioContext ? this.audioContext.state : 'none',
            userInteracted: this.userInteracted,
            isMobile: this.isMobileDevice()
        };

        if (performance.memory) {
            metrics.memoryUsage = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }

        return metrics;
    }
}

/**
 * Stress Level Monitor Class
 * Monitors stress level changes and triggers appropriate musical responses
 */
class StressLevelMonitor {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.currentStressLevel = 0;
        this.stressThresholds = {
            calm: 30,    // Below 30% = calm music
            tense: 70    // Above 70% = tense music
        };
        this.debounceTimer = null;
        this.currentMoodState = 'moderate'; // calm, moderate, tense
    }

    /**
     * Update stress level with debouncing to prevent rapid transitions
     */
    updateStressLevel(newLevel) {
        // Clear existing debounce timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Debounce stress level changes to prevent audio thrashing
        this.debounceTimer = setTimeout(() => {
            this.processStressLevelChange(newLevel);
        }, adaptiveMusicConfig.transitions.stressTransitionDebounce);
    }

    /**
     * Process stress level change and trigger music transitions
     */
    processStressLevelChange(newLevel) {
        const oldLevel = this.currentStressLevel;
        this.currentStressLevel = newLevel;

        // Determine new mood state based on thresholds
        let newMoodState;
        if (newLevel < this.stressThresholds.calm) {
            newMoodState = 'calm';
        } else if (newLevel > this.stressThresholds.tense) {
            newMoodState = 'tense';
        } else {
            newMoodState = 'moderate';
        }

        // Trigger transition if mood state changed
        if (newMoodState !== this.currentMoodState) {
            console.log(`MusicPlayer[${this.musicPlayer && this.musicPlayer.instanceId ? this.musicPlayer.instanceId : 'no-id'}]: StressLevelMonitor: Transitioning from ${this.currentMoodState} to ${newMoodState} (stress: ${oldLevel}% → ${newLevel}%)`);
            this.currentMoodState = newMoodState;

            if (this.musicPlayer && this.musicPlayer.transitionToMoodState) {
                this.musicPlayer.transitionToMoodState(newMoodState);
            }
        }
    }

    /**
     * Get current mood state
     */
    getCurrentMoodState() {
        return this.currentMoodState;
    }

    /**
     * Get stress level configuration for current mood
     */
    getCurrentStressConfig() {
        return adaptiveMusicConfig.stressLevels[this.currentMoodState];
    }
}

/**
 * Game Event Listener Class
 * Listens for game events and triggers appropriate audio responses
 */
class GameEventListener {
    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
        this.eventQueue = [];
        this.isProcessingEvent = false;
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for game events
     */
    setupEventListeners() {
        // Listen for custom game events
        document.addEventListener('gameEvent', (event) => {
            this.handleGameEvent(event.detail);
        });

        // Listen for stress level changes
        document.addEventListener('stressLevelChanged', (event) => {
            if (this.musicPlayer && this.musicPlayer.stressLevelMonitor) {
                this.musicPlayer.stressLevelMonitor.updateStressLevel(event.detail.newLevel);
            }
        });
    }

    /**
     * Handle game events with queuing to prevent conflicts
     */
    handleGameEvent(eventData) {
        const { type, data } = eventData;

        // Add event to queue
        this.eventQueue.push({ type, data, timestamp: Date.now() });

        // Process queue if not already processing
        if (!this.isProcessingEvent) {
            this.processEventQueue();
        }
    }

    /**
     * Process queued events
     */
    async processEventQueue() {
        if (this.eventQueue.length === 0) {
            this.isProcessingEvent = false;
            return;
        }

        this.isProcessingEvent = true;
        const event = this.eventQueue.shift();

        try {
            await this.processEvent(event);
        } catch (error) {
            console.error(`MusicPlayer[${this.musicPlayer && this.musicPlayer.instanceId ? this.musicPlayer.instanceId : 'no-id'}]: GameEventListener: Error processing event:`, error);
        }

        // Process next event after a brief delay
        setTimeout(() => {
            this.processEventQueue();
        }, 100);
    }

    /**
     * Process individual game event
     */
    async processEvent(event) {
        const { type, data } = event;

        console.log(`MusicPlayer[${this.musicPlayer && this.musicPlayer.instanceId ? this.musicPlayer.instanceId : 'no-id'}]: GameEventListener: Processing ${type} event`);

        switch (type) {
            case 'bust':
                await this.handleBustEvent(data);
                break;
            case 'handWin':
                await this.handleHandWinEvent(data);
                break;
            case 'handLose':
                await this.handleHandLoseEvent(data);
                break;
            case 'taskComplete':
                await this.handleTaskCompleteEvent(data);
                break;
            default:
                console.warn(`MusicPlayer[${this.musicPlayer && this.musicPlayer.instanceId ? this.musicPlayer.instanceId : 'no-id'}]: GameEventListener: Unknown event type: ${type}`);
        }
    }

    /**
     * Handle bust event
     */
    async handleBustEvent(data) {
        if (this.musicPlayer && this.musicPlayer.playEventAudio) {
            await this.musicPlayer.playEventAudio('bust');
        }
    }

    /**
     * Handle hand win event
     */
    async handleHandWinEvent(data) {
        if (this.musicPlayer && this.musicPlayer.playEventAudio) {
            await this.musicPlayer.playEventAudio('handWin');
        }
    }

    /**
     * Handle hand lose event
     */
    async handleHandLoseEvent(data) {
        if (this.musicPlayer && this.musicPlayer.playEventAudio) {
            await this.musicPlayer.playEventAudio('handLose');
        }
    }

    /**
     * Handle task completion event
     */
    async handleTaskCompleteEvent(data) {
        if (this.musicPlayer && this.musicPlayer.playEventAudio) {
            await this.musicPlayer.playEventAudio('taskComplete');

            // Trigger energy boost
            if (this.musicPlayer.triggerEnergyBoost) {
                this.musicPlayer.triggerEnergyBoost();
            }
        }
    }
}

/**
 * Music Layer Manager Class
 * Manages multiple audio layers for adaptive music
 */
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
        this.masterGain = null;

        this.setupAudioGraph();
    }

    /**
     * Setup audio graph for layer management
     */
    setupAudioGraph() {
        if (!this.audioContext) return;

        // Create master gain for all layers
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);

        // Create gain nodes for each layer
        Object.keys(this.layers).forEach(layerName => {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.connect(this.masterGain);
            this.layerGains[layerName] = gainNode;
        });
    }

    /**
     * Connect layer manager to destination
     */
    connect(destination) {
        if (this.masterGain) {
            this.masterGain.connect(destination);
        }
    }

    /**
     * Set layer volume with smooth transition
     */
    setLayerVolume(layerName, volume, duration = 1.0) {
        const gainNode = this.layerGains[layerName];
        if (!gainNode) return;

        const currentTime = this.audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, currentTime + duration);
    }

    /**
     * Crossfade between layers
     */
    crossfadeLayers(fromLayer, toLayer, duration = 2.0) {
        if (fromLayer && this.layerGains[fromLayer]) {
            this.setLayerVolume(fromLayer, 0, duration);
        }
        if (toLayer && this.layerGains[toLayer]) {
            this.setLayerVolume(toLayer, 1.0, duration);
        }
    }

    /**
     * Get gain node for layer
     */
    getLayerGain(layerName) {
        return this.layerGains[layerName];
    }

    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        if (this.masterGain) {
            const currentTime = this.audioContext.currentTime;
            this.masterGain.gain.cancelScheduledValues(currentTime);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);
            this.masterGain.gain.linearRampToValueAtTime(volume, currentTime + 0.1);
        }
    }
}

/**
 * Extended Music Loop Class
 * Creates longer, more varied background music loops
 */
class ExtendedMusicLoop {
    constructor(audioContext, ownerId) {
        this.audioContext = audioContext;
        this.sections = adaptiveMusicConfig.extendedLoop.sections;
        this.currentSection = 0;
        this.sectionStartTime = 0;
        this.loopStartTime = 0;
        this.isActive = false;
        this.ownerId = ownerId;
    }

    /**
     * Start the extended loop
     */
    start() {
        if (!this.audioContext) return;

        this.isActive = true;
        this.loopStartTime = this.audioContext.currentTime;
        this.sectionStartTime = this.loopStartTime;
        this.currentSection = 0;

        console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: ExtendedMusicLoop: Starting extended loop`);
        this.scheduleNextSection();
    }

    /**
     * Stop the extended loop
     */
    stop() {
        this.isActive = false;
        console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: ExtendedMusicLoop: Stopping extended loop`);
    }

    /**
     * Schedule the next section in the loop
     */
    scheduleNextSection() {
        if (!this.isActive) return;

        const section = this.sections[this.currentSection];
        const nextSectionTime = this.sectionStartTime + section.duration;

        // Schedule section transition
        setTimeout(() => {
            if (this.isActive) {
                this.transitionToNextSection();
            }
        }, section.duration * 1000);
    }

    /**
     * Transition to the next section
     */
    transitionToNextSection() {
        if (!this.isActive) return;

        this.currentSection = (this.currentSection + 1) % this.sections.length;
        this.sectionStartTime = this.audioContext.currentTime;

        const section = this.sections[this.currentSection];
        console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: ExtendedMusicLoop: Transitioning to section ${this.currentSection}: ${section.name}`);

        // Schedule next section
        this.scheduleNextSection();

        // If we've completed a full loop, add a brief pause for seamless restart
        if (this.currentSection === 0) {
            console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: ExtendedMusicLoop: Completed full loop, restarting`);
        }
    }

    /**
     * Get current section info
     */
    getCurrentSection() {
        return this.sections[this.currentSection];
    }

    /**
     * Get progress through current section (0-1)
     */
    getSectionProgress() {
        if (!this.isActive) return 0;

        const section = this.sections[this.currentSection];
        const elapsed = this.audioContext.currentTime - this.sectionStartTime;
        return Math.min(elapsed / section.duration, 1.0);
    }

    /**
     * Get overall loop progress (0-1)
     */
    getLoopProgress() {
        if (!this.isActive) return 0;

        const totalElapsed = this.audioContext.currentTime - this.loopStartTime;
        const loopDuration = adaptiveMusicConfig.extendedLoop.totalDuration;
        return (totalElapsed % loopDuration) / loopDuration;
    }
}

/**
 * Music Player Class
 * Generates ambient lofi background music using Web Audio API oscillators
 */
class MusicPlayer {
    constructor(audioContext, audioManager) {
        this.audioContext = audioContext;
        this.audioManager = audioManager;
        // Generate unique instance ID for debugging
        this.instanceId = `MP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.oscillators = [];
        this.gainNodes = [];
        this.filters = [];
        this.masterGain = null;
        this.reverbGain = null;
        this.delayNode = null;
        this.lfoOscillators = [];
        this.lfoGains = [];
        this.isPlaying = false;
        this.volume = audioConfig.music.defaultVolume;

        // Musical progression state
        this.currentChord = 0;
        this.chordProgression = [
            [220, 261.63, 329.63], // Am (A, C, E)
            [196, 246.94, 293.66], // G (G, B, D)
            [261.63, 329.63, 392],  // C (C, E, G)
            [174.61, 220, 261.63]   // F (F, A, C)
        ];
        this.melodyNotes = [440, 523.25, 587.33, 659.25, 783.99]; // A, C, D, E, G
        this.rhythmPattern = [1, 0, 0.5, 0, 0.7, 0, 0.3, 0]; // 8-beat pattern
        this.currentBeat = 0;

        // Timing
        this.chordChangeInterval = null;
        this.melodyInterval = null;
        this.rhythmInterval = null;

        this.setupAudioGraph();

        console.log(`MusicPlayer[${this.instanceId}]: Created new instance`);
    }

    /**
     * Setup the audio graph for rich ambient music generation
     */
    setupAudioGraph() {
        if (!this.audioContext) return;

        // Create master gain node
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);

        // Create reverb effect using convolution
        this.reverbGain = this.audioContext.createGain();
        this.reverbGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);

        // Create delay effect for depth
        this.delayNode = this.audioContext.createDelay(0.5);
        this.delayNode.delayTime.setValueAtTime(0.2, this.audioContext.currentTime);
        const delayGain = this.audioContext.createGain();
        delayGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);

        // Create low-pass filter for warmth
        const warmthFilter = this.audioContext.createBiquadFilter();
        warmthFilter.type = 'lowpass';
        warmthFilter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        warmthFilter.Q.setValueAtTime(0.5, this.audioContext.currentTime);

        // Connect effects chain
        this.delayNode.connect(delayGain);
        delayGain.connect(this.delayNode); // Feedback
        delayGain.connect(this.reverbGain);

        this.reverbGain.connect(warmthFilter);
        warmthFilter.connect(this.masterGain);
        this.masterGain.connect(this.audioContext.destination);

        // Create multiple LFOs for organic movement
        this.createLFOs();

        // Create the initial chord
        this.createChordOscillators();

        // Setup musical progression
        this.setupMusicalProgression();
    }

    /**
     * Create multiple LFOs for organic movement
     */
    createLFOs() {
        console.log(`MusicPlayer[${this.instanceId}]: Creating LFOs`);
        // Main LFO for gentle pitch modulation
        const mainLFO = this.audioContext.createOscillator();
        const mainLFOGain = this.audioContext.createGain();
        mainLFO.frequency.setValueAtTime(0.1, this.audioContext.currentTime);
        mainLFO.type = 'sine';
        mainLFOGain.gain.setValueAtTime(2, this.audioContext.currentTime);
        mainLFO.connect(mainLFOGain);
        mainLFO.start();

        // Secondary LFO for amplitude modulation
        const ampLFO = this.audioContext.createOscillator();
        const ampLFOGain = this.audioContext.createGain();
        ampLFO.frequency.setValueAtTime(0.05, this.audioContext.currentTime);
        ampLFO.type = 'triangle';
        ampLFOGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        ampLFO.connect(ampLFOGain);
        ampLFO.start();

        // Filter LFO for timbral movement
        const filterLFO = this.audioContext.createOscillator();
        const filterLFOGain = this.audioContext.createGain();
        filterLFO.frequency.setValueAtTime(0.03, this.audioContext.currentTime);
        filterLFO.type = 'sawtooth';
        filterLFOGain.gain.setValueAtTime(200, this.audioContext.currentTime);
        filterLFO.connect(filterLFOGain);
        filterLFO.start();

        this.lfoOscillators = [mainLFO, ampLFO, filterLFO];
        this.lfoGains = [mainLFOGain, ampLFOGain, filterLFOGain];
    }

    /**
     * Create chord oscillators for harmonic foundation
     */
    createChordOscillators() {
        console.log(`MusicPlayer[${this.instanceId}]: Creating chord oscillators for chord index ${this.currentChord}`);
        const currentChordNotes = this.chordProgression[this.currentChord];

        currentChordNotes.forEach((frequency, index) => {
            // Create oscillator with different waveforms for texture
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            // Use only pleasant waveforms for better sound quality
            const waveforms = ['sine', 'triangle', 'sine']; // Removed harsh sawtooth
            oscillator.type = waveforms[index % waveforms.length];
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Create gentle filter sweep with less resonance
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(frequency * 3, this.audioContext.currentTime); // Less harsh
            filter.Q.setValueAtTime(0.5, this.audioContext.currentTime); // Much gentler resonance

            // Set volume with better balance and less randomization
            const baseVolume = 0.06 / (index + 1); // Slightly quieter overall
            const randomVariation = (Math.random() - 0.5) * 0.01; // Less random variation
            gainNode.gain.setValueAtTime(baseVolume + randomVariation, this.audioContext.currentTime);

            // Connect LFO modulation
            this.lfoGains[0].connect(oscillator.frequency); // Pitch modulation
            this.lfoGains[1].connect(gainNode.gain); // Amplitude modulation
            this.lfoGains[2].connect(filter.frequency); // Filter modulation

            // Connect audio chain
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.reverbGain);
            gainNode.connect(this.delayNode);

            // Store references
            this.oscillators.push(oscillator);
            this.gainNodes.push(gainNode);
            this.filters.push(filter);

            // Start with slight timing offset for organic feel
            const startTime = this.audioContext.currentTime + (index * 0.01);
            oscillator.start(startTime);
        });
    }

    /**
     * Setup musical progression and melody
     */
    setupMusicalProgression() {
        console.log(`MusicPlayer[${this.instanceId}]: Setting up musical progression`);
        // Change chords every 8 seconds
        this.chordChangeInterval = setInterval(() => {
            if (this.isPlaying) {
                this.changeChord();
            }
        }, 8000);

        // Add occasional melody notes every 2-4 seconds
        this.melodyInterval = setInterval(() => {
            if (this.isPlaying && Math.random() > 0.3) {
                this.playMelodyNote();
            }
        }, 2000 + Math.random() * 2000);

        // Subtle rhythm pattern every 500ms
        this.rhythmInterval = setInterval(() => {
            if (this.isPlaying) {
                this.updateRhythm();
            }
        }, 500);
    }

    /**
     * Change to next chord in progression
     */
    changeChord() {
        console.log(`MusicPlayer[${this.instanceId}]: Changing chord from index ${this.currentChord}`);
        // Fade out current oscillators
        this.oscillators.forEach((osc, index) => {
            const gain = this.gainNodes[index];
            if (gain) {
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            }
        });

        // Stop old oscillators after fade
        setTimeout(() => {
            this.oscillators.forEach(osc => {
                try { osc.stop(); } catch (e) { }
            });
            this.oscillators = [];
            this.gainNodes = [];
            this.filters = [];

            // Move to next chord
            this.currentChord = (this.currentChord + 1) % this.chordProgression.length;

            // Create new chord
            this.createChordOscillators();
        }, 500);
    }

    /**
     * Play a random melody note
     */
    playMelodyNote() {
        console.log(`MusicPlayer[${this.instanceId}]: Attempting to play melody note`);
        const frequency = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.type = 'sine'; // Use sine for cleaner melody
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        filter.type = 'lowpass'; // Use lowpass for warmer sound
        filter.frequency.setValueAtTime(frequency * 1.5, this.audioContext.currentTime); // Less harsh
        filter.Q.setValueAtTime(0.8, this.audioContext.currentTime); // Gentler resonance

        // Very gentle envelope for pleasant melody
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.15); // Softer and slower attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2.0); // Longer decay

        // Connect with effects
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.delayNode);
        gainNode.connect(this.reverbGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 2);
    }

    /**
     * Update rhythm pattern for subtle movement
     */
    updateRhythm() {
        console.log(`MusicPlayer[${this.instanceId}]: Updating rhythm for beat ${this.currentBeat}`);
        const intensity = this.rhythmPattern[this.currentBeat];
        this.currentBeat = (this.currentBeat + 1) % this.rhythmPattern.length;

        // Modulate master volume slightly based on rhythm
        if (this.masterGain && intensity > 0) {
            const currentGain = this.masterGain.gain.value;
            const targetGain = this.volume * (0.9 + intensity * 0.1);
            this.masterGain.gain.linearRampToValueAtTime(targetGain, this.audioContext.currentTime + 0.1);
        }
    }

    /**
     * Start playing rich background music with fade in
     */
    play() {
        if (!this.audioContext || this.isPlaying) return;

        // Check if music is muted
        if (this.audioManager && this.audioManager.preferences && this.audioManager.preferences.musicMuted) {
            console.log(`MusicPlayer[${this.instanceId}]: Music is muted, not starting playback`);
            return;
        }

        console.log(`MusicPlayer[${this.instanceId}]: Starting rich ambient music`);
        this.isPlaying = true;

        // Fade in the music
        const currentTime = this.audioContext.currentTime;
        const fadeInDuration = audioConfig.music.fadeInDuration / 1000;

        this.masterGain.gain.cancelScheduledValues(currentTime);
        this.masterGain.gain.setValueAtTime(0, currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, currentTime + fadeInDuration);
    }

    /**
     * Pause background music with fade out
     */
    pause() {
        if (!this.audioContext || !this.isPlaying) return;

        console.log(`MusicPlayer[${this.instanceId}]: Pausing ambient music`);
        this.isPlaying = false;

        // Clear intervals
        if (this.chordChangeInterval) {
            clearInterval(this.chordChangeInterval);
            this.chordChangeInterval = null;
        }
        if (this.melodyInterval) {
            clearInterval(this.melodyInterval);
            this.melodyInterval = null;
        }
        if (this.rhythmInterval) {
            clearInterval(this.rhythmInterval);
            this.rhythmInterval = null;
        }

        // Fade out the music
        const currentTime = this.audioContext.currentTime;
        const fadeOutDuration = audioConfig.music.fadeOutDuration / 1000;

        this.masterGain.gain.cancelScheduledValues(currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, currentTime + fadeOutDuration);

        // Stop all oscillators after fade
        setTimeout(() => {
            this.oscillators.forEach(osc => {
                try { osc.stop(); } catch (e) { }
            });
            this.lfoOscillators.forEach(lfo => {
                try { lfo.stop(); } catch (e) { }
            });
        }, fadeOutDuration * 1000);
    }

    /**
     * Set music volume
     */
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));

        if (this.masterGain && this.isPlaying) {
            const currentTime = this.audioContext.currentTime;
            this.masterGain.gain.cancelScheduledValues(currentTime);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);
            this.masterGain.gain.linearRampToValueAtTime(this.volume, currentTime + 0.1);
        }
    }

    /**
     * Get current playing state
     */
    getIsPlaying() {
        return this.isPlaying;
    }
}

/**
 * Adaptive Music Player Class
 * Extends MusicPlayer with adaptive capabilities
 */
class AdaptiveMusicPlayer extends MusicPlayer {
    constructor(audioContext, audioManager) {
        super(audioContext, audioManager);

        try {
            // Initialize adaptive components with error handling
            this.stressLevelMonitor = new StressLevelMonitor(this);
            this.gameEventListener = new GameEventListener(this);
            this.musicLayerManager = new MusicLayerManager(audioContext);
            this.extendedLoop = new ExtendedMusicLoop(audioContext, this.instanceId);

            // Adaptive state
            this.currentMoodState = 'moderate';
            this.energyBoostActive = false;
            this.energyBoostEndTime = 0;
            this.adaptiveEnabled = true;

            // Connect layer manager to audio graph
            if (this.masterGain && this.musicLayerManager) {
                this.musicLayerManager.connect(this.masterGain);
            }

            console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Initialized successfully with adaptive features`);
        } catch (error) {
            console.error(`AdaptiveMusicPlayer[${this.instanceId}]: Error during initialization:`, error);
            this.adaptiveEnabled = false;
            // Continue with basic functionality
        }
    }

    /**
     * Override play method to include adaptive features
     */
    play() {
        if (!this.adaptiveEnabled) {
            super.play();
            return;
        }

        try {
            super.play();

            if (this.extendedLoop) {
                this.extendedLoop.start();
            }

            // Check current stress level and set appropriate music immediately
            this.checkCurrentStressLevel();

            console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Starting adaptive music with extended loop`);
        } catch (error) {
            console.error(`AdaptiveMusicPlayer[${this.instanceId}]: Error starting adaptive music:`, error);
            // Fallback to basic play
            super.play();
        }
    }

    /**
     * Check current stress level and set appropriate music
     */
    checkCurrentStressLevel() {
        try {
            // Get current stress level from game state
            const currentStressLevel = window.gameState ? window.gameState.stressLevel : 0;

            if (this.stressLevelMonitor) {
                console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Checking current stress level: ${currentStressLevel}%`);
                this.stressLevelMonitor.processStressLevelChange(currentStressLevel);
            }
        } catch (error) {
            console.error(`AdaptiveMusicPlayer[${this.instanceId}]: Error checking current stress level:`, error);
        }
    }

    /**
     * Override pause method to include adaptive features
     */
    pause() {
        try {
            super.pause();

            if (this.extendedLoop && this.adaptiveEnabled) {
                this.extendedLoop.stop();
            }

            console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Pausing adaptive music`);
        } catch (error) {
            console.error(`AdaptiveMusicPlayer[${this.instanceId}]: Error pausing adaptive music:`, error);
            // Fallback to basic pause
            super.pause();
        }
    }

    /**
     * Transition to a new mood state based on stress level
     */
    transitionToMoodState(newMoodState) {
        if (newMoodState === this.currentMoodState) return;

        const oldMoodState = this.currentMoodState;
        this.currentMoodState = newMoodState;

        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Transitioning from ${oldMoodState} to ${newMoodState}`);

        // Apply mood-specific audio changes
        this.applyMoodStateChanges(newMoodState);
    }

    /**
     * Apply audio changes for mood state
     */
    applyMoodStateChanges(moodState) {
        const config = adaptiveMusicConfig.stressLevels[moodState];
        if (!config) return;

        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Applying ${moodState} mood changes - tempo: ${config.tempo}, volume: ${config.volume}`);

        // Immediately change chord progression for dramatic effect
        this.chordProgression = config.chordProgression;

        // Force immediate chord change to new progression
        this.changeChord();

        // Adjust tempo by modifying interval timings
        this.adjustTempo(config.tempo);

        // Adjust filter settings
        this.adjustFilters(config.filterCutoff);

        // Adjust melody frequency
        this.adjustMelodyFrequency(config.melodyFrequency);

        // Adjust rhythm intensity
        this.adjustRhythmIntensity(config.rhythmIntensity);

        // Adjust overall volume for mood
        this.adjustVolumeForMood(config.volume);
    }

    /**
     * Adjust tempo by modifying interval timings
     */
    adjustTempo(tempoMultiplier) {
        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Changing tempo to ${tempoMultiplier}x`);

        // Clear existing intervals
        if (this.chordChangeInterval) {
            clearInterval(this.chordChangeInterval);
        }
        if (this.melodyInterval) {
            clearInterval(this.melodyInterval);
        }
        if (this.rhythmInterval) {
            clearInterval(this.rhythmInterval);
        }

        // Restart intervals with new tempo - make changes more dramatic
        const baseChordInterval = 8000;
        const baseMelodyInterval = 2000; // Faster base for more noticeable changes
        const baseRhythmInterval = 400; // Faster base rhythm

        this.chordChangeInterval = setInterval(() => {
            if (this.isPlaying) {
                this.changeChord();
            }
        }, baseChordInterval / tempoMultiplier);

        this.melodyInterval = setInterval(() => {
            if (this.isPlaying && Math.random() > (0.5 - this.currentMelodyFrequency)) {
                this.playMelodyNote();
            }
        }, baseMelodyInterval / tempoMultiplier);

        this.rhythmInterval = setInterval(() => {
            if (this.isPlaying) {
                this.updateRhythm();
            }
        }, baseRhythmInterval / tempoMultiplier);
    }

    /**
     * Adjust filter settings for mood
     */
    adjustFilters(cutoffFrequency) {
        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Adjusting filters to ${cutoffFrequency}Hz`);

        this.filters.forEach(filter => {
            if (filter && filter.frequency) {
                const currentTime = this.audioContext.currentTime;
                filter.frequency.cancelScheduledValues(currentTime);
                filter.frequency.setValueAtTime(filter.frequency.value, currentTime);
                // Faster transition for more immediate effect
                filter.frequency.linearRampToValueAtTime(cutoffFrequency, currentTime + 0.5);
            }
        });
    }

    /**
     * Adjust melody frequency based on mood
     */
    adjustMelodyFrequency(frequency) {
        // This affects the probability of melody notes playing
        // Implementation will be used in the melody interval
        this.currentMelodyFrequency = frequency;
    }

    /**
     * Adjust rhythm intensity
     */
    adjustRhythmIntensity(intensity) {
        this.currentRhythmIntensity = intensity;
    }

    /**
     * Adjust volume for mood state
     */
    adjustVolumeForMood(volumeMultiplier) {
        if (!this.masterGain) return;

        // If muted, ensure volume stays at 0
        if (this.audioManager && this.audioManager.preferences && this.audioManager.preferences.musicMuted) {
            this.masterGain.gain.cancelScheduledValues(this.audioContext.currentTime);
            this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            return;
        }

        const targetVolume = this.volume * volumeMultiplier;
        const currentTime = this.audioContext.currentTime;

        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Adjusting volume from ${this.masterGain.gain.value} to ${targetVolume}`);

        this.masterGain.gain.cancelScheduledValues(currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);
        this.masterGain.gain.linearRampToValueAtTime(targetVolume, currentTime + 1.0);
    }

    /**
     * Play event-specific audio
     */
    async playEventAudio(eventType) {
        const eventConfig = adaptiveMusicConfig.gameEvents[eventType];
        if (!eventConfig) return;

        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Playing ${eventType} event audio`);

        switch (eventConfig.type) {
            case 'tension_spike':
                await this.playTensionSpike(eventConfig);
                break;
            case 'disappointment':
                await this.playDisappointment(eventConfig);
                break;
            case 'positive_flourish':
                await this.playPositiveFlourish(eventConfig);
                break;
            case 'celebration':
                await this.playCelebration(eventConfig);
                break;
        }
    }

    /**
     * Play tension spike for bust events
     */
    async playTensionSpike(config) {
        if (!this.audioContext) return;

        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Playing dramatic tension spike for bust`);

        const currentTime = this.audioContext.currentTime;
        const duration = config.duration / 1000;

        // Gently reduce background music volume for subtle effect
        const originalVolume = this.masterGain.gain.value;
        this.masterGain.gain.linearRampToValueAtTime(originalVolume * 0.7, currentTime + 0.2); // Less dramatic ducking

        config.frequencies.forEach((frequency, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(frequency, currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(frequency * 2, currentTime);
            filter.Q.setValueAtTime(5, currentTime); // More resonant

            // Subtle but noticeable tension envelope
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(config.intensity * 0.08, currentTime + config.fadeIn / 1000); // Much more subtle
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain); // Connect through master gain for better balance

            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration);
        });

        // Restore background music volume after tension spike
        setTimeout(() => {
            if (this.masterGain) {
                this.masterGain.gain.linearRampToValueAtTime(originalVolume, this.audioContext.currentTime + 0.5);
            }
        }, duration * 1000);
    }

    /**
     * Play disappointment audio for hand losses
     */
    async playDisappointment(config) {
        if (!this.audioContext) return;

        const currentTime = this.audioContext.currentTime;
        const duration = config.duration / 1000;

        config.frequencies.forEach((frequency, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, currentTime);

            // Gentle disappointment envelope
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(config.intensity * 0.1, currentTime + config.fadeIn / 1000);
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration);
        });
    }

    /**
     * Play positive flourish for wins
     */
    async playPositiveFlourish(config) {
        if (!this.audioContext) return;

        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Playing uplifting flourish for win`);

        const currentTime = this.audioContext.currentTime;
        const duration = config.duration / 1000;

        // Gently boost background music volume for celebration
        const originalVolume = this.masterGain.gain.value;
        this.masterGain.gain.linearRampToValueAtTime(originalVolume * 1.1, currentTime + 0.2); // Less dramatic boost

        config.frequencies.forEach((frequency, index) => {
            const delay = index * 0.08; // Faster arpeggio effect

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = 'sine'; // Cleaner sound for positive events
            oscillator.frequency.setValueAtTime(frequency, currentTime + delay);

            // Gentle uplifting envelope
            gainNode.gain.setValueAtTime(0, currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(config.intensity * 0.12, currentTime + delay + config.fadeIn / 1000); // More subtle
            gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + delay + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain); // Connect through master gain for better balance

            oscillator.start(currentTime + delay);
            oscillator.stop(currentTime + delay + duration);
        });

        // Restore background music volume after flourish
        setTimeout(() => {
            if (this.masterGain) {
                this.masterGain.gain.linearRampToValueAtTime(originalVolume, this.audioContext.currentTime + 0.3);
            }
        }, duration * 1000);
    }

    /**
     * Play celebration audio for task completion
     */
    async playCelebration(config) {
        // Use existing taskComplete sound effect but trigger energy boost
        if (window.audioManager && window.audioManager.soundEffects) {
            window.audioManager.soundEffects.play('taskComplete');
        }
    }

    /**
     * Trigger energy boost after positive events
     */
    triggerEnergyBoost() {
        const config = adaptiveMusicConfig.gameEvents.taskComplete;
        this.energyBoostActive = true;
        this.energyBoostEndTime = this.audioContext.currentTime + (config.energyBoostDuration / 1000);

        console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Triggering energy boost`);

        // Temporarily increase tempo and intensity
        this.adjustTempo(1.3);
        this.adjustRhythmIntensity(1.5);

        // Schedule return to normal after energy boost
        setTimeout(() => {
            this.energyBoostActive = false;
            console.log(`AdaptiveMusicPlayer[${this.instanceId}]: Energy boost ended, returning to normal`);

            // Return to current mood state settings
            this.applyMoodStateChanges(this.currentMoodState);
        }, config.energyBoostDuration);
    }

    /**
     * Manually update stress level for immediate music adaptation
     */
    updateStressLevel(newLevel) {
        if (this.stressLevelMonitor) {
            this.stressLevelMonitor.updateStressLevel(newLevel);
        }
    }

    /**
     * Override updateRhythm to include adaptive intensity
     */
    updateRhythm() {
        const intensity = this.rhythmPattern[this.currentBeat];
        this.currentBeat = (this.currentBeat + 1) % this.rhythmPattern.length;

        // Apply current rhythm intensity multiplier
        const rhythmMultiplier = this.currentRhythmIntensity || 1.0;
        const adjustedIntensity = intensity * rhythmMultiplier;

        // Modulate master volume slightly based on rhythm
        if (this.masterGain && adjustedIntensity > 0) {
            const currentGain = this.masterGain.gain.value;
            const targetGain = this.volume * (0.9 + adjustedIntensity * 0.1);
            this.masterGain.gain.linearRampToValueAtTime(targetGain, this.audioContext.currentTime + 0.1);
        }
    }

    /**
     * Override playMelodyNote to include adaptive frequency
     */
    playMelodyNote() {
        // Check melody frequency for current mood
        const melodyFrequency = this.currentMelodyFrequency || 0.5;
        if (Math.random() > melodyFrequency) {
            return; // Skip this melody note based on current mood
        }

        // Call parent method
        super.playMelodyNote();
    }
}

/**
 * Simple Music Player Fallback
 * For browsers without Web Audio API support
 */
class SimpleMusicPlayer {
    constructor(ownerId) {
        this.isPlaying = false;
        this.volume = audioConfig.music.defaultVolume;
        this.ownerId = ownerId;
        console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: SimpleMusicPlayer: Using fallback music player`);
    }

    play() {
        console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: SimpleMusicPlayer: Music playback (fallback mode)`);
        this.isPlaying = true;
    }

    pause() {
        console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: SimpleMusicPlayer: Music paused (fallback mode)`);
        this.isPlaying = false;
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        console.log(`MusicPlayer[${this.ownerId || 'no-id'}]: SimpleMusicPlayer: Volume set to ${this.volume} (fallback mode)`);
    }

    getIsPlaying() {
        return this.isPlaying;
    }
}

/**
 * Sound Effects Class
 * Generates programmatic sound effects using Web Audio API
 */
class SoundEffects {
    constructor(audioContext, audioManager) {
        this.audioContext = audioContext;
        this.audioManager = audioManager;
        this.masterGain = null;
        this.volume = audioConfig.effects.defaultVolume;

        this.setupAudioGraph();
    }

    /**
     * Setup the audio graph for sound effects
     */
    setupAudioGraph() {
        if (!this.audioContext) return;

        // Create master gain node for effects
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        this.masterGain.connect(this.audioContext.destination);
    }

    /**
     * Play a specific sound effect
     */
    play(soundName) {
        if (!this.audioContext || !this.masterGain) return;

        // Check if audio is enabled
        if (this.audioManager && !this.audioManager.preferences.audioEnabled) {
            return; // Don't play sound effects when audio is disabled
        }

        // Check if effects are muted or volume is 0
        if (this.audioManager && (this.audioManager.preferences.effectsMuted || this.volume <= 0)) {
            return;
        }

        const soundConfig = audioConfig.effects.sounds[soundName];
        if (!soundConfig) {
            console.warn(`MusicPlayer[${this.audioManager && this.audioManager.musicPlayer && this.audioManager.musicPlayer.instanceId ? this.audioManager.musicPlayer.instanceId : 'no-id'}]: SoundEffects: Unknown sound "${soundName}"`);
            return;
        }

        console.log(`MusicPlayer[${this.audioManager && this.audioManager.musicPlayer && this.audioManager.musicPlayer.instanceId ? this.audioManager.musicPlayer.instanceId : 'no-id'}]: SoundEffects: Playing ${soundName}`);

        switch (soundConfig.type) {
            case 'noise':
                this.playNoiseSound(soundConfig);
                break;
            case 'sine':
                this.playSineSound(soundConfig);
                break;
            case 'chord':
                this.playChordSound(soundConfig);
                break;
            case 'celebration':
                this.playCelebrationSound(soundConfig);
                break;
            default:
                console.warn(`MusicPlayer[${this.audioManager && this.audioManager.musicPlayer && this.audioManager.musicPlayer.instanceId ? this.audioManager.musicPlayer.instanceId : 'no-id'}]: SoundEffects: Unknown sound type "${soundConfig.type}"`);
        }
    }

    /**
     * Play a noise-based sound effect (for card clicks, deals)
     */
    playNoiseSound(config) {
        const currentTime = this.audioContext.currentTime;
        const duration = config.duration / 1000; // Convert to seconds

        // Create noise buffer
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        // Generate filtered noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.1; // Quiet noise
        }

        // Create buffer source
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        // Create filter for shaping the noise
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(config.frequency, currentTime);
        filter.Q.setValueAtTime(5, currentTime);

        // Create envelope
        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, currentTime);
        envelope.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

        // Connect audio graph
        source.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.masterGain);

        // Play the sound
        source.start(currentTime);
        source.stop(currentTime + duration);
    }

    /**
     * Play a sine wave sound effect (for buttons, simple tones)
     */
    playSineSound(config) {
        const currentTime = this.audioContext.currentTime;
        const duration = config.duration / 1000; // Convert to seconds

        // Create oscillator
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(config.frequency, currentTime);

        // Create envelope
        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, currentTime);
        envelope.gain.linearRampToValueAtTime(0.2, currentTime + 0.02);
        envelope.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

        // Connect audio graph
        oscillator.connect(envelope);
        envelope.connect(this.masterGain);

        // Play the sound
        oscillator.start(currentTime);
        oscillator.stop(currentTime + duration);
    }

    /**
     * Play a chord sound effect (for wins, zen completion)
     */
    playChordSound(config) {
        const currentTime = this.audioContext.currentTime;
        const duration = config.duration / 1000; // Convert to seconds

        config.frequencies.forEach((frequency, index) => {
            // Slight delay between notes for arpeggio effect
            const noteDelay = index * 0.05;

            // Create oscillator for each note
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, currentTime + noteDelay);

            // Create envelope for each note
            const envelope = this.audioContext.createGain();
            envelope.gain.setValueAtTime(0, currentTime + noteDelay);
            envelope.gain.linearRampToValueAtTime(0.15, currentTime + noteDelay + 0.02);
            envelope.gain.exponentialRampToValueAtTime(0.001, currentTime + noteDelay + duration);

            // Connect audio graph
            oscillator.connect(envelope);
            envelope.connect(this.masterGain);

            // Play the note
            oscillator.start(currentTime + noteDelay);
            oscillator.stop(currentTime + noteDelay + duration);
        });
    }

    /**
     * Play a celebration sound effect (for task completion)
     * Generates a chord progression with gentle arpeggiation
     */
    playCelebrationSound(config) {
        const currentTime = this.audioContext.currentTime;
        const totalDuration = config.duration / 1000; // Convert to seconds
        const fadeInDuration = config.fadeIn / 1000;
        const fadeOutDuration = config.fadeOut / 1000;
        const arpeggiationDelay = config.arpeggiationDelay;

        // Create low-pass filter for warmth
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, currentTime);
        filter.Q.setValueAtTime(0.5, currentTime);

        // Create reverb gain for depth
        const reverbGain = this.audioContext.createGain();
        reverbGain.gain.setValueAtTime(0.2, currentTime);

        // Connect filter and reverb to master gain
        filter.connect(reverbGain);
        reverbGain.connect(this.masterGain);

        // Play each chord in the progression
        config.chordProgression.forEach((chord, chordIndex) => {
            const chordStartTime = currentTime + config.timing[chordIndex];

            // Play each note in the chord with arpeggiation
            chord.forEach((frequency, noteIndex) => {
                const noteStartTime = chordStartTime + (noteIndex * arpeggiationDelay);
                const noteDuration = totalDuration - config.timing[chordIndex];

                // Create oscillator for each note
                const oscillator = this.audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, noteStartTime);

                // Create envelope for each note
                const envelope = this.audioContext.createGain();
                envelope.gain.setValueAtTime(0, noteStartTime);

                // Gentle fade in
                envelope.gain.linearRampToValueAtTime(0.12, noteStartTime + fadeInDuration);

                // Sustain
                const sustainEndTime = noteStartTime + noteDuration - fadeOutDuration;
                if (sustainEndTime > noteStartTime + fadeInDuration) {
                    envelope.gain.setValueAtTime(0.12, sustainEndTime);
                }

                // Gentle fade out
                envelope.gain.exponentialRampToValueAtTime(0.001, noteStartTime + noteDuration);

                // Connect audio graph
                oscillator.connect(envelope);
                envelope.connect(filter);

                // Play the note
                oscillator.start(noteStartTime);
                oscillator.stop(noteStartTime + noteDuration);
            });
        });
    }

    /**
     * Set effects volume
     */
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));

        if (this.masterGain) {
            const currentTime = this.audioContext.currentTime;
            this.masterGain.gain.cancelScheduledValues(currentTime);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);
            this.masterGain.gain.linearRampToValueAtTime(this.volume, currentTime + 0.1);
        }
    }
}

/**
 * Simple Sound Effects Fallback
 * For browsers without Web Audio API support
 */
class SimpleSoundEffects {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.volume = audioConfig.effects.defaultVolume;
        console.log(`MusicPlayer[${this.audioManager && this.audioManager.musicPlayer && this.audioManager.musicPlayer.instanceId ? this.audioManager.musicPlayer.instanceId : 'no-id'}]: SimpleSoundEffects: Using fallback sound effects`);
    }

    play(soundName) {
        // Check if audio is enabled
        if (this.audioManager && !this.audioManager.preferences.audioEnabled) {
            return; // Don't play sound effects when audio is disabled
        }
        console.log(`MusicPlayer[${this.audioManager && this.audioManager.musicPlayer && this.audioManager.musicPlayer.instanceId ? this.audioManager.musicPlayer.instanceId : 'no-id'}]: SimpleSoundEffects: Playing ${soundName} (fallback mode)`);
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        console.log(`MusicPlayer[${this.audioManager && this.audioManager.musicPlayer && this.audioManager.musicPlayer.instanceId ? this.audioManager.musicPlayer.instanceId : 'no-id'}]: SimpleSoundEffects: Volume set to ${this.volume} (fallback mode)`);
    }
}

/**
 * Audio Controls Class
 * Creates and manages UI controls for audio settings
 */
class AudioControls {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.controlsContainer = null;
        this.musicVolumeSlider = null;
        this.effectsVolumeSlider = null;
        this.musicMuteButton = null;
        this.effectsMuteButton = null;

        this.createControls();
    }

    /**
     * Create audio control UI elements
     */
    createControls() {
        // Find or create audio controls container
        this.controlsContainer = document.getElementById('audio-controls');
        if (!this.controlsContainer) {
            this.controlsContainer = document.createElement('div');
            this.controlsContainer.id = 'audio-controls';
            this.controlsContainer.className = 'audio-controls';

            // Add to the game container or body
            const gameContainer = document.querySelector('.game-container') || document.body;
            gameContainer.appendChild(this.controlsContainer);
        }

        // Create FAB and controls panel
        this.controlsContainer.innerHTML = `
            <button id="audio-fab" class="audio-fab" title="Click to mute/unmute; Shift-click to open settings">
                🎵
            </button>
      
      <div id="audio-controls-panel" class="audio-controls-panel">
        <h3>Audio Settings</h3>
        
        <div class="audio-control-group">
          <label for="music-volume">Background Music</label>
          <div class="volume-control">
            <input type="range" id="music-volume" min="0" max="100" value="15" class="volume-slider">
            <button id="music-mute" class="mute-button" title="Mute/Unmute Music">🔊</button>
          </div>
        </div>
        
        <div class="audio-control-group">
          <label for="effects-volume">Sound Effects</label>
          <div class="volume-control">
            <input type="range" id="effects-volume" min="0" max="100" value="30" class="volume-slider">
            <button id="effects-mute" class="mute-button" title="Mute/Unmute Effects">🔊</button>
          </div>
        </div>
        
        <div class="audio-control-group">
          <button id="audio-toggle" class="audio-toggle-button">Enable Audio</button>
        </div>
      </div>
    `;

        // Get references to controls
        this.musicVolumeSlider = document.getElementById('music-volume');
        this.effectsVolumeSlider = document.getElementById('effects-volume');
        this.musicMuteButton = document.getElementById('music-mute');
        this.effectsMuteButton = document.getElementById('effects-mute');
        this.audioToggleButton = document.getElementById('audio-toggle');
        this.fabButton = document.getElementById('audio-fab');
        this.controlsPanel = document.getElementById('audio-controls-panel');

        // Setup event listeners
        this.setupEventListeners();

        // Update UI to match current preferences
        this.updateUI();


    }

    /**
     * Setup event listeners for audio controls
     */
    setupEventListeners() {
        // Music volume slider
        this.musicVolumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value) / 100;
            this.audioManager.setMusicVolume(volume);
        });

        // Effects volume slider
        this.effectsVolumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value) / 100;
            this.audioManager.setEffectsVolume(volume);
        });

        // Music mute button
        this.musicMuteButton.addEventListener('click', () => {
            const isMuted = this.audioManager.toggleMusicMute();
            this.updateMuteButton(this.musicMuteButton, isMuted);
        });

        // Effects mute button
        this.effectsMuteButton.addEventListener('click', () => {
            const isMuted = this.audioManager.toggleEffectsMute();
            this.updateMuteButton(this.effectsMuteButton, isMuted);
        });

        // Audio toggle button
        this.audioToggleButton.addEventListener('click', () => {
            const preferences = this.audioManager.getPreferences();
            if (preferences.audioEnabled) {
                this.audioManager.disableAudio();
            } else {
                this.audioManager.enableAudio();
            }
            this.updateUI();
        });

        // FAB button click
        // Single click toggles mute/unmute for both music and effects.
        this.fabButton.addEventListener('click', (e) => {
            // Toggle both music and effects mute
            const isMuted = this.audioManager.toggleAllMute();
            // Refresh UI for mute buttons and FAB icon
            this.updateMuteButton(this.musicMuteButton, this.audioManager.preferences.musicMuted);
            this.updateMuteButton(this.effectsMuteButton, this.audioManager.preferences.effectsMuted);
            this.updateFabIcon();
            return isMuted;
        });

        // Show panel on hover (mouseenter)
        this.fabButton.addEventListener('mouseenter', () => {
            this.showControlsPanel();
        });

        // Keep panel open when hovering over it
        this.controlsPanel.addEventListener('mouseenter', () => {
            this.showControlsPanel();
        });

        // Hide panel when leaving FAB (unless entering panel)
        this.fabButton.addEventListener('mouseleave', (e) => {
            // Small delay to allow moving to the panel
            setTimeout(() => {
                if (!this.controlsPanel.matches(':hover')) {
                    this.hideControlsPanel();
                }
            }, 100);
        });

        // Hide panel when leaving panel
        this.controlsPanel.addEventListener('mouseleave', () => {
            this.hideControlsPanel();
        });

        // Close panel when clicking outside (fallback)
        document.addEventListener('click', (e) => {
            if (!this.controlsContainer.contains(e.target)) {
                this.hideControlsPanel();
            }
        });
    }

    /**
     * Update UI to match current audio preferences
     */
    updateUI() {
        const preferences = this.audioManager.getPreferences();

        // Update volume sliders
        this.musicVolumeSlider.value = Math.round(preferences.musicVolume * 100);
        this.effectsVolumeSlider.value = Math.round(preferences.effectsVolume * 100);

        // Update mute buttons
        this.updateMuteButton(this.musicMuteButton, preferences.musicMuted);
        this.updateMuteButton(this.effectsMuteButton, preferences.effectsMuted);

        // Update audio toggle button
        this.audioToggleButton.textContent = preferences.audioEnabled ? 'Disable Audio' : 'Enable Audio';
        this.audioToggleButton.className = preferences.audioEnabled ? 'audio-toggle-button enabled' : 'audio-toggle-button disabled';

        // Enable/disable controls based on audio state
        const controlsDisabled = !preferences.audioEnabled;
        this.musicVolumeSlider.disabled = controlsDisabled;
        this.effectsVolumeSlider.disabled = controlsDisabled;
        this.musicMuteButton.disabled = controlsDisabled;
        this.effectsMuteButton.disabled = controlsDisabled;

        // Update FAB icon
        this.updateFabIcon();
    }

    /**
     * Update mute button appearance
     */
    updateMuteButton(button, isMuted) {
        button.textContent = isMuted ? '🔇' : '🔊';
        button.className = isMuted ? 'mute-button muted' : 'mute-button';
        button.title = isMuted ? 'Unmute' : 'Mute';
    }

    /**
     * Show audio controls
     */
    show() {
        if (this.controlsContainer) {
            this.controlsContainer.style.display = 'block';
        }
    }

    /**
     * Hide audio controls
     */
    hide() {
        if (this.controlsContainer) {
            this.controlsContainer.style.display = 'none';
        }
    }

    /**
     * Toggle controls panel visibility
     */
    toggleControlsPanel() {
        if (this.controlsPanel) {
            const isVisible = this.controlsPanel.classList.contains('visible');
            if (isVisible) {
                this.hideControlsPanel();
            } else {
                this.showControlsPanel();
            }
        }
    }

    /**
     * Show controls panel
     */
    showControlsPanel() {
        if (this.controlsPanel) {
            this.controlsPanel.classList.add('visible');
            this.fabButton.style.transform = 'rotate(45deg)';
        }
    }

    /**
     * Hide controls panel
     */
    hideControlsPanel() {
        if (this.controlsPanel) {
            this.controlsPanel.classList.remove('visible');
            this.fabButton.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Update FAB icon based on audio state
     */
    updateFabIcon() {
        if (this.fabButton) {
            const preferences = this.audioManager.getPreferences();
            if (!preferences.audioEnabled) {
                this.fabButton.textContent = '🔇';
                this.fabButton.style.background = '#e74c3c';
            } else if (preferences.musicMuted && preferences.effectsMuted) {
                this.fabButton.textContent = '🔇';
                this.fabButton.style.background = '#f39c12';
            } else {
                this.fabButton.textContent = '🎵';
                this.fabButton.style.background = '#8e44ad';
            }
        }
    }
}

// Export for use in other modules
export {
    AudioManager,
    audioConfig,
    adaptiveMusicConfig,
    MusicPlayer,
    AdaptiveMusicPlayer,
    StressLevelMonitor,
    GameEventListener,
    MusicLayerManager,
    ExtendedMusicLoop,
    SimpleMusicPlayer,
    SoundEffects,
    SimpleSoundEffects,
    AudioControls
};