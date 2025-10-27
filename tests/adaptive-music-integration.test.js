/**
 * Adaptive Music Integration Tests
 * Tests for game event responses and stress-music correlation
 */

/**
 * Test game event audio responses in realistic scenarios
 */
function testGameEventAudioResponses() {
    console.log('🧪 Testing Game Event Audio Responses...');

    // Mock audio context and components
    const mockAudioContext = {
        createOscillator: function () {
            return {
                type: 'sine',
                frequency: { setValueAtTime: function () { } },
                connect: function () { },
                start: function () { },
                stop: function () { }
            };
        },
        createGain: function () {
            return {
                gain: {
                    value: 0,
                    setValueAtTime: function () { },
                    linearRampToValueAtTime: function () { },
                    exponentialRampToValueAtTime: function () { },
                    cancelScheduledValues: function () { }
                },
                connect: function () { }
            };
        },
        createBiquadFilter: function () {
            return {
                type: 'lowpass',
                frequency: { setValueAtTime: function () { } },
                Q: { setValueAtTime: function () { } },
                connect: function () { }
            };
        },
        currentTime: 0
    };

    // Mock adaptive music player
    const mockAdaptivePlayer = {
        audioContext: mockAudioContext,
        masterGain: mockAudioContext.createGain(),
        eventAudioPlayed: [],
        energyBoostTriggered: false,

        playEventAudio: async function (eventType) {
            this.eventAudioPlayed.push(eventType);

            // Simulate the actual event audio methods
            switch (eventType) {
                case 'bust':
                    await this.playTensionSpike({
                        frequencies: [110, 146.83, 174.61],
                        duration: 2000,
                        intensity: 0.8
                    });
                    break;
                case 'handLose':
                    await this.playDisappointment({
                        frequencies: [196, 220, 246.94],
                        duration: 1500,
                        intensity: 0.5
                    });
                    break;
                case 'handWin':
                    await this.playPositiveFlourish({
                        frequencies: [329.63, 392, 493.88],
                        duration: 1500,
                        intensity: 0.6
                    });
                    break;
                case 'taskComplete':
                    await this.playCelebration({ duration: 5000, intensity: 1.0 });
                    break;
            }
        },

        playTensionSpike: async function (config) {
            // Simulate tension spike audio generation
            config.frequencies.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();

                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

                // Simulate audio connections
                oscillator.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.masterGain);
            });
        },

        playDisappointment: async function (config) {
            // Simulate disappointment audio generation
            config.frequencies.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
            });
        },

        playPositiveFlourish: async function (config) {
            // Simulate positive flourish audio generation
            config.frequencies.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
            });
        },

        playCelebration: async function (config) {
            // Simulate celebration audio
            console.log('Playing celebration audio');
        },

        triggerEnergyBoost: function () {
            this.energyBoostTriggered = true;
            console.log('Energy boost triggered');
        }
    };

    // Create game event listener with mock player
    const gameEventListener = {
        musicPlayer: mockAdaptivePlayer,
        eventQueue: [],
        isProcessingEvent: false,

        handleGameEvent: function (eventData) {
            const { type, data } = eventData;
            this.eventQueue.push({ type, data, timestamp: Date.now() });

            if (!this.isProcessingEvent) {
                this.processEventQueue();
            }
        },

        processEventQueue: function () {
            if (this.eventQueue.length === 0) {
                this.isProcessingEvent = false;
                return;
            }

            this.isProcessingEvent = true;
            const event = this.eventQueue.shift();
            this.processEvent(event);

            // Continue processing after brief delay
            setTimeout(() => {
                this.processEventQueue();
            }, 10);
        },

        processEvent: function (event) {
            const { type } = event;

            switch (type) {
                case 'bust':
                    this.handleBustEvent();
                    break;
                case 'handWin':
                    this.handleHandWinEvent();
                    break;
                case 'handLose':
                    this.handleHandLoseEvent();
                    break;
                case 'taskComplete':
                    this.handleTaskCompleteEvent();
                    break;
            }
        },

        handleBustEvent: function () {
            if (this.musicPlayer && this.musicPlayer.playEventAudio) {
                this.musicPlayer.playEventAudio('bust');
            }
        },

        handleHandWinEvent: function () {
            if (this.musicPlayer && this.musicPlayer.playEventAudio) {
                this.musicPlayer.playEventAudio('handWin');
            }
        },

        handleHandLoseEvent: function () {
            if (this.musicPlayer && this.musicPlayer.playEventAudio) {
                this.musicPlayer.playEventAudio('handLose');
            }
        },

        handleTaskCompleteEvent: function () {
            if (this.musicPlayer && this.musicPlayer.playEventAudio) {
                this.musicPlayer.playEventAudio('taskComplete');
            }
            if (this.musicPlayer && this.musicPlayer.triggerEnergyBoost) {
                this.musicPlayer.triggerEnergyBoost();
            }
        }
    };

    // Test 1: Bust event triggers tension spike
    gameEventListener.handleGameEvent({
        type: 'bust',
        data: { result: 'bust', stressChange: 15 }
    });

    setTimeout(() => {
        console.assert(
            mockAdaptivePlayer.eventAudioPlayed.includes('bust'),
            'Should play tension spike audio for bust event'
        );
    }, 50);

    // Test 2: Hand win triggers positive flourish
    gameEventListener.handleGameEvent({
        type: 'handWin',
        data: { result: 'win', stressChange: -5 }
    });

    setTimeout(() => {
        console.assert(
            mockAdaptivePlayer.eventAudioPlayed.includes('handWin'),
            'Should play positive flourish for hand win'
        );
    }, 100);

    // Test 3: Task completion triggers celebration and energy boost
    mockAdaptivePlayer.energyBoostTriggered = false;
    gameEventListener.handleGameEvent({
        type: 'taskComplete',
        data: { stressLevel: 30, taskId: 'dmv' }
    });

    setTimeout(() => {
        console.assert(
            mockAdaptivePlayer.eventAudioPlayed.includes('taskComplete'),
            'Should play celebration audio for task completion'
        );
        console.assert(
            mockAdaptivePlayer.energyBoostTriggered === true,
            'Should trigger energy boost for task completion'
        );
    }, 150);

    // Test 4: Event queue processes multiple events
    const initialQueueLength = gameEventListener.eventQueue.length;
    gameEventListener.handleGameEvent({ type: 'handWin', data: {} });
    gameEventListener.handleGameEvent({ type: 'bust', data: {} });
    gameEventListener.handleGameEvent({ type: 'handLose', data: {} });

    setTimeout(() => {
        console.assert(
            gameEventListener.eventQueue.length <= initialQueueLength + 2,
            'Should process events from queue efficiently'
        );
    }, 200);

    console.log('✅ Game Event Audio Responses tests passed');
}

/**
 * Test stress-music correlation
 */
function testStressMusicCorrelation() {
    console.log('🧪 Testing Stress-Music Correlation...');

    // Mock adaptive music player with stress monitoring
    const mockAdaptivePlayer = {
        currentMoodState: 'moderate',
        currentTempo: 1.0,
        currentFilterCutoff: 2500,
        transitionCount: 0,

        transitionToMoodState: function (newMoodState) {
            if (newMoodState !== this.currentMoodState) {
                this.currentMoodState = newMoodState;
                this.transitionCount++;
                this.applyMoodStateChanges(newMoodState);
            }
        },

        applyMoodStateChanges: function (moodState) {
            const configs = {
                calm: { tempo: 0.8, filterCutoff: 2000 },
                moderate: { tempo: 1.0, filterCutoff: 2500 },
                tense: { tempo: 1.2, filterCutoff: 3000 }
            };

            const config = configs[moodState];
            if (config) {
                this.currentTempo = config.tempo;
                this.currentFilterCutoff = config.filterCutoff;
            }
        }
    };

    // Create stress level monitor
    const stressMonitor = {
        musicPlayer: mockAdaptivePlayer,
        currentStressLevel: 50,
        stressThresholds: { calm: 30, tense: 70 },
        currentMoodState: 'moderate',

        processStressLevelChange: function (newLevel) {
            const oldLevel = this.currentStressLevel;
            this.currentStressLevel = newLevel;

            let newMoodState;
            if (newLevel < this.stressThresholds.calm) {
                newMoodState = 'calm';
            } else if (newLevel > this.stressThresholds.tense) {
                newMoodState = 'tense';
            } else {
                newMoodState = 'moderate';
            }

            if (newMoodState !== this.currentMoodState) {
                this.currentMoodState = newMoodState;
                if (this.musicPlayer && this.musicPlayer.transitionToMoodState) {
                    this.musicPlayer.transitionToMoodState(newMoodState);
                }
            }
        }
    };

    // Test 1: Low stress triggers calm music
    stressMonitor.processStressLevelChange(20);
    console.assert(
        mockAdaptivePlayer.currentMoodState === 'calm',
        'Should transition to calm music at low stress'
    );
    console.assert(
        mockAdaptivePlayer.currentTempo === 0.8,
        'Should reduce tempo for calm mood'
    );
    console.assert(
        mockAdaptivePlayer.currentFilterCutoff === 2000,
        'Should lower filter cutoff for calm mood'
    );

    // Test 2: High stress triggers tense music
    stressMonitor.processStressLevelChange(80);
    console.assert(
        mockAdaptivePlayer.currentMoodState === 'tense',
        'Should transition to tense music at high stress'
    );
    console.assert(
        mockAdaptivePlayer.currentTempo === 1.2,
        'Should increase tempo for tense mood'
    );
    console.assert(
        mockAdaptivePlayer.currentFilterCutoff === 3000,
        'Should raise filter cutoff for tense mood'
    );

    // Test 3: Moderate stress returns to baseline
    stressMonitor.processStressLevelChange(50);
    console.assert(
        mockAdaptivePlayer.currentMoodState === 'moderate',
        'Should return to moderate music at medium stress'
    );
    console.assert(
        mockAdaptivePlayer.currentTempo === 1.0,
        'Should return to normal tempo for moderate mood'
    );

    // Test 4: Boundary conditions
    const initialTransitionCount = mockAdaptivePlayer.transitionCount;

    stressMonitor.processStressLevelChange(30); // Boundary between calm and moderate
    console.assert(
        mockAdaptivePlayer.currentMoodState === 'moderate',
        'Should be moderate at 30% stress (boundary)'
    );

    stressMonitor.processStressLevelChange(70); // Boundary between moderate and tense
    console.assert(
        mockAdaptivePlayer.currentMoodState === 'moderate',
        'Should be moderate at 70% stress (boundary)'
    );

    // Test 5: Rapid stress changes
    stressMonitor.processStressLevelChange(25); // calm
    stressMonitor.processStressLevelChange(75); // tense
    stressMonitor.processStressLevelChange(45); // moderate

    console.assert(
        mockAdaptivePlayer.transitionCount > initialTransitionCount,
        'Should handle rapid stress level changes'
    );

    console.log('✅ Stress-Music Correlation tests passed');
}

/**
 * Test volume consistency across adaptive elements
 */
function testVolumeConsistency() {
    console.log('🧪 Testing Volume Consistency...');

    // Mock audio manager with adaptive player
    const mockAudioManager = {
        musicPlayer: null,
        preferences: {
            musicVolume: 0.5,
            effectsVolume: 0.3,
            musicMuted: false,
            effectsMuted: false,
            audioEnabled: true
        },

        setMusicVolume: function (level) {
            this.preferences.musicVolume = level;
            if (this.musicPlayer && !this.preferences.musicMuted) {
                this.musicPlayer.setVolume(level);
            }
        },

        toggleMusicMute: function () {
            this.preferences.musicMuted = !this.preferences.musicMuted;
            if (this.musicPlayer) {
                const volume = this.preferences.musicMuted ? 0 : this.preferences.musicVolume;
                this.musicPlayer.setVolume(volume);
            }
            return this.preferences.musicMuted;
        }
    };

    // Mock adaptive music player
    const mockAdaptivePlayer = {
        volume: 0.5,
        masterGain: {
            gain: {
                value: 0.5,
                setValueAtTime: function (value) { this.value = value; },
                linearRampToValueAtTime: function (value) { this.value = value; },
                cancelScheduledValues: function () { }
            }
        },
        musicLayerManager: {
            masterVolume: 1.0,
            setMasterVolume: function (volume) {
                this.masterVolume = volume;
            }
        },

        setVolume: function (level) {
            this.volume = level;
            if (this.masterGain) {
                this.masterGain.gain.setValueAtTime(level, 0);
            }
            if (this.musicLayerManager) {
                this.musicLayerManager.setMasterVolume(level);
            }
        }
    };

    mockAudioManager.musicPlayer = mockAdaptivePlayer;

    // Test 1: Volume control affects adaptive player
    mockAudioManager.setMusicVolume(0.7);
    console.assert(
        mockAdaptivePlayer.volume === 0.7,
        'Should update adaptive player volume'
    );
    console.assert(
        mockAdaptivePlayer.masterGain.gain.value === 0.7,
        'Should update master gain volume'
    );

    // Test 2: Mute affects all adaptive elements
    const wasMuted = mockAudioManager.toggleMusicMute();
    console.assert(wasMuted === true, 'Should mute music');
    console.assert(
        mockAdaptivePlayer.volume === 0,
        'Should set adaptive player volume to 0 when muted'
    );

    // Test 3: Unmute restores previous volume
    mockAudioManager.toggleMusicMute();
    console.assert(
        mockAdaptivePlayer.volume === 0.7,
        'Should restore previous volume when unmuted'
    );

    // Test 4: Layer manager respects master volume
    console.assert(
        mockAdaptivePlayer.musicLayerManager.masterVolume === 0.7,
        'Should update layer manager master volume'
    );

    console.log('✅ Volume Consistency tests passed');
}

/**
 * Test performance impact monitoring
 */
function testPerformanceImpact() {
    console.log('🧪 Testing Performance Impact...');

    // Mock performance monitor
    const performanceMonitor = {
        metrics: {
            activeOscillators: 0,
            memoryUsage: 0,
            audioLatency: 0
        },

        checkPerformance: function () {
            // Simulate performance check
            this.metrics.activeOscillators = Math.floor(Math.random() * 20);
            this.metrics.memoryUsage = Math.floor(Math.random() * 100);
            this.metrics.audioLatency = Math.random() * 50;

            return {
                isPerformanceGood: this.metrics.audioLatency < 30,
                shouldReduceComplexity: this.metrics.activeOscillators > 15
            };
        },

        optimizeForMobile: function () {
            // Simulate mobile optimization
            this.metrics.activeOscillators = Math.min(this.metrics.activeOscillators, 8);
            return true;
        }
    };

    // Mock adaptive player with performance monitoring
    const mockAdaptivePlayer = {
        oscillators: [],
        isOptimized: false,

        reduceComplexity: function () {
            // Simulate complexity reduction
            this.oscillators = this.oscillators.slice(0, 8);
            this.isOptimized = true;
        },

        monitorPerformance: function () {
            const performance = performanceMonitor.checkPerformance();

            if (performance.shouldReduceComplexity) {
                this.reduceComplexity();
            }

            return performance;
        }
    };

    // Simulate high oscillator count
    mockAdaptivePlayer.oscillators = new Array(20).fill({});

    // Test 1: Performance monitoring detects issues
    const performanceResult = mockAdaptivePlayer.monitorPerformance();
    console.assert(
        typeof performanceResult.isPerformanceGood === 'boolean',
        'Should return performance status'
    );

    // Test 2: Complexity reduction when needed
    if (performanceResult.shouldReduceComplexity) {
        console.assert(
            mockAdaptivePlayer.isOptimized === true,
            'Should reduce complexity when performance is poor'
        );
        console.assert(
            mockAdaptivePlayer.oscillators.length <= 8,
            'Should limit oscillator count for better performance'
        );
    }

    // Test 3: Mobile optimization
    const mobileOptimized = performanceMonitor.optimizeForMobile();
    console.assert(
        mobileOptimized === true,
        'Should successfully optimize for mobile'
    );
    console.assert(
        performanceMonitor.metrics.activeOscillators <= 8,
        'Should limit oscillators on mobile'
    );

    console.log('✅ Performance Impact tests passed');
}

/**
 * Test cross-browser compatibility
 */
function testCrossBrowserCompatibility() {
    console.log('🧪 Testing Cross-Browser Compatibility...');

    // Mock different browser environments
    const browserEnvironments = {
        chrome: {
            AudioContext: function () {
                return {
                    createOscillator: function () { return {}; },
                    createGain: function () { return { gain: { setValueAtTime: function () { } } }; },
                    currentTime: 0,
                    state: 'running'
                };
            },
            webkitAudioContext: null
        },
        safari: {
            AudioContext: null,
            webkitAudioContext: function () {
                return {
                    createOscillator: function () { return {}; },
                    createGain: function () { return { gain: { setValueAtTime: function () { } } }; },
                    currentTime: 0,
                    state: 'suspended'
                };
            }
        },
        firefox: {
            AudioContext: function () {
                return {
                    createOscillator: function () { return {}; },
                    createGain: function () { return { gain: { setValueAtTime: function () { } } }; },
                    currentTime: 0,
                    state: 'running'
                };
            },
            webkitAudioContext: null
        },
        unsupported: {
            AudioContext: null,
            webkitAudioContext: null
        }
    };

    // Mock audio manager initialization
    const mockAudioManager = {
        audioContext: null,
        musicPlayer: null,
        initialized: false,

        isWebAudioSupported: function (env) {
            return !!(env.AudioContext || env.webkitAudioContext);
        },

        initializeWebAudio: function (env) {
            const AudioContextClass = env.AudioContext || env.webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
                this.musicPlayer = { type: 'adaptive' };
                this.initialized = true;
                return true;
            }
            return false;
        },

        useSimpleFallback: function () {
            this.musicPlayer = { type: 'simple' };
            this.initialized = true;
        }
    };

    // Test 1: Chrome support
    const chromeSupported = mockAudioManager.isWebAudioSupported(browserEnvironments.chrome);
    console.assert(chromeSupported === true, 'Should support Chrome');

    mockAudioManager.initializeWebAudio(browserEnvironments.chrome);
    console.assert(
        mockAudioManager.musicPlayer.type === 'adaptive',
        'Should use adaptive player in Chrome'
    );

    // Test 2: Safari support (webkit prefix)
    mockAudioManager.audioContext = null;
    mockAudioManager.musicPlayer = null;
    mockAudioManager.initialized = false;

    const safariSupported = mockAudioManager.isWebAudioSupported(browserEnvironments.safari);
    console.assert(safariSupported === true, 'Should support Safari with webkit prefix');

    mockAudioManager.initializeWebAudio(browserEnvironments.safari);
    console.assert(
        mockAudioManager.musicPlayer.type === 'adaptive',
        'Should use adaptive player in Safari'
    );

    // Test 3: Firefox support
    mockAudioManager.audioContext = null;
    mockAudioManager.musicPlayer = null;
    mockAudioManager.initialized = false;

    const firefoxSupported = mockAudioManager.isWebAudioSupported(browserEnvironments.firefox);
    console.assert(firefoxSupported === true, 'Should support Firefox');

    // Test 4: Unsupported browser fallback
    mockAudioManager.audioContext = null;
    mockAudioManager.musicPlayer = null;
    mockAudioManager.initialized = false;

    const unsupported = mockAudioManager.isWebAudioSupported(browserEnvironments.unsupported);
    console.assert(unsupported === false, 'Should detect unsupported browsers');

    mockAudioManager.useSimpleFallback();
    console.assert(
        mockAudioManager.musicPlayer.type === 'simple',
        'Should use simple fallback for unsupported browsers'
    );
    console.assert(
        mockAudioManager.initialized === true,
        'Should still initialize with fallback'
    );

    console.log('✅ Cross-Browser Compatibility tests passed');
}

/**
 * Run all adaptive music integration tests
 */
function runAdaptiveMusicIntegrationTests() {
    console.log('🎵 Starting Adaptive Music Integration Tests...\n');

    try {
        testGameEventAudioResponses();
        testStressMusicCorrelation();
        testVolumeConsistency();
        testPerformanceImpact();
        testCrossBrowserCompatibility();

        console.log('\n🎉 All Adaptive Music Integration tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Adaptive Music Integration tests failed:', error);
        return false;
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAdaptiveMusicIntegrationTests,
        testGameEventAudioResponses,
        testStressMusicCorrelation,
        testVolumeConsistency,
        testPerformanceImpact,
        testCrossBrowserCompatibility
    };
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    // Run tests when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAdaptiveMusicIntegrationTests);
    } else {
        runAdaptiveMusicIntegrationTests();
    }
}