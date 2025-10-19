/**
 * Audio System for SoberLife III
 * Provides ambient lofi background music and soft sound effects
 * Uses Web Audio API for programmatic sound generation
 */

// Audio configuration constants
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

/**
 * Main Audio Manager Class
 * Coordinates all audio functionality and manages system state
 */
class AudioManager {
    constructor() {
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
            console.log('AudioManager: Mobile device detected, applying optimizations');
            this.applyMobileOptimizations();
        }

        // Handle autoplay policy - context starts in suspended state
        if (this.audioContext.state === 'suspended') {
            console.log('AudioManager: Audio context suspended, waiting for user interaction');
            this.setupUserInteractionHandler();
        }

        // Initialize components
        this.musicPlayer = new MusicPlayer(this.audioContext);
        this.soundEffects = new SoundEffects(this.audioContext);
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
        this.musicPlayer = new SimpleMusicPlayer();
        this.soundEffects = new SimpleSoundEffects();
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
        this.musicPlayer = new SimpleMusicPlayer();
        this.soundEffects = new SimpleSoundEffects();
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
        // Reduce default volumes for better battery life
        this.preferences.musicVolume = Math.min(this.preferences.musicVolume, 0.1);
        this.preferences.effectsVolume = Math.min(this.preferences.effectsVolume, 0.2);

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
 * Music Player Class
 * Generates ambient lofi background music using Web Audio API oscillators
 */
class MusicPlayer {
    constructor(audioContext) {
        this.audioContext = audioContext;
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
        const currentChordNotes = this.chordProgression[this.currentChord];

        currentChordNotes.forEach((frequency, index) => {
            // Create oscillator with different waveforms for texture
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            // Vary waveforms for richness
            const waveforms = ['sine', 'triangle', 'sawtooth'];
            oscillator.type = waveforms[index % waveforms.length];
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Create gentle filter sweep
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(frequency * 4, this.audioContext.currentTime);
            filter.Q.setValueAtTime(1, this.audioContext.currentTime);

            // Set volume with slight randomization
            const baseVolume = 0.08 / (index + 1);
            const randomVariation = (Math.random() - 0.5) * 0.02;
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
        const frequency = this.melodyNotes[Math.floor(Math.random() * this.melodyNotes.length)];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
        filter.Q.setValueAtTime(2, this.audioContext.currentTime);

        // Gentle envelope
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5);

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

        console.log('MusicPlayer: Starting rich ambient music');
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

        console.log('MusicPlayer: Pausing ambient music');
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
 * Simple Music Player Fallback
 * For browsers without Web Audio API support
 */
class SimpleMusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.volume = audioConfig.music.defaultVolume;
        console.log('SimpleMusicPlayer: Using fallback music player');
    }

    play() {
        console.log('SimpleMusicPlayer: Music playback (fallback mode)');
        this.isPlaying = true;
    }

    pause() {
        console.log('SimpleMusicPlayer: Music paused (fallback mode)');
        this.isPlaying = false;
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        console.log(`SimpleMusicPlayer: Volume set to ${this.volume} (fallback mode)`);
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
    constructor(audioContext) {
        this.audioContext = audioContext;
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

        const soundConfig = audioConfig.effects.sounds[soundName];
        if (!soundConfig) {
            console.warn(`SoundEffects: Unknown sound "${soundName}"`);
            return;
        }

        console.log(`SoundEffects: Playing ${soundName}`);

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
            default:
                console.warn(`SoundEffects: Unknown sound type "${soundConfig.type}"`);
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
    constructor() {
        this.volume = audioConfig.effects.defaultVolume;
        console.log('SimpleSoundEffects: Using fallback sound effects');
    }

    play(soundName) {
        console.log(`SimpleSoundEffects: Playing ${soundName} (fallback mode)`);
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        console.log(`SimpleSoundEffects: Volume set to ${this.volume} (fallback mode)`);
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
      <button id="audio-fab" class="audio-fab" title="Audio Controls">
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
        this.fabButton.addEventListener('click', () => {
            this.toggleControlsPanel();
        });

        // Close panel when clicking outside
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
export { AudioManager, audioConfig, MusicPlayer, SimpleMusicPlayer, SoundEffects, SimpleSoundEffects, AudioControls };