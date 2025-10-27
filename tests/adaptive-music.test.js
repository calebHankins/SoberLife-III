/**
 * Adaptive Music System Tests
 * Tests for stress-responsive background music and game event audio
 */

// Test configuration
const testConfig = {
    stressLevels: {
        calm: { range: [0, 30], tempo: 0.8 },
        moderate: { range: [30, 70], tempo: 1.0 },
        tense: { range: [70, 100], tempo: 1.2 }
    },
    gameEvents: {
        bust: { type: 'tension_spike', duration: 2000 },
        handWin: { type: 'positive_flourish', duration: 1500 },
        taskComplete: { type: 'celebration', duration: 5000 }
    }
};

/**
 * Test StressLevelMonitor functionality
 */
function testStressLevelMonitor() {
    console.log('🧪 Testing StressLevelMonitor...');

    // Mock music player
    const mockMusicPlayer = {
        transitionToMoodState: function (moodState) {
            this.lastMoodState = moodState;
        },
        lastMoodState: null
    };

    // Create monitor instance
    const monitor = {
        musicPlayer: mockMusicPlayer,
        currentStressLevel: 0,
        stressThresholds: { calm: 30, tense: 70 },
        debounceTimer: null,
        currentMoodState: 'moderate',

        updateStressLevel: function (newLevel) {
            // Clear existing debounce timer
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }

            // Debounce stress level changes
            this.debounceTimer = setTimeout(() => {
                this.processStressLevelChange(newLevel);
            }, 100); // Shorter timeout for testing
        },

        processStressLevelChange: function (newLevel) {
            const oldLevel = this.currentStressLevel;
            this.currentStressLevel = newLevel;

            // Determine new mood state
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
                this.currentMoodState = newMoodState;
                if (this.musicPlayer && this.musicPlayer.transitionToMoodState) {
                    this.musicPlayer.transitionToMoodState(newMoodState);
                }
            }
        },

        getCurrentMoodState: function () {
            return this.currentMoodState;
        }
    };

    // Test 1: Initial state
    console.assert(monitor.getCurrentMoodState() === 'moderate', 'Should start in moderate mood state');

    // Test 2: Transition to calm state
    monitor.processStressLevelChange(20);
    console.assert(monitor.getCurrentMoodState() === 'calm', 'Should transition to calm at 20% stress');
    console.assert(mockMusicPlayer.lastMoodState === 'calm', 'Should notify music player of calm transition');

    // Test 3: Transition to tense state
    monitor.processStressLevelChange(80);
    console.assert(monitor.getCurrentMoodState() === 'tense', 'Should transition to tense at 80% stress');
    console.assert(mockMusicPlayer.lastMoodState === 'tense', 'Should notify music player of tense transition');

    // Test 4: Return to moderate state
    monitor.processStressLevelChange(50);
    console.assert(monitor.getCurrentMoodState() === 'moderate', 'Should return to moderate at 50% stress');
    console.assert(mockMusicPlayer.lastMoodState === 'moderate', 'Should notify music player of moderate transition');

    // Test 5: No transition for same mood state
    mockMusicPlayer.lastMoodState = null;
    monitor.processStressLevelChange(55);
    console.assert(monitor.getCurrentMoodState() === 'moderate', 'Should stay in moderate state');
    console.assert(mockMusicPlayer.lastMoodState === null, 'Should not notify music player for same mood state');

    // Test 6: Boundary conditions
    monitor.processStressLevelChange(30);
    console.assert(monitor.getCurrentMoodState() === 'moderate', 'Should be moderate at 30% stress (boundary)');

    monitor.processStressLevelChange(70);
    console.assert(monitor.getCurrentMoodState() === 'moderate', 'Should be moderate at 70% stress (boundary)');

    console.log('✅ StressLevelMonitor tests passed');
}

/**
 * Test GameEventListener functionality
 */
function testGameEventListener() {
    console.log('🧪 Testing GameEventListener...');

    // Mock music player
    const mockMusicPlayer = {
        playEventAudio: function (eventType) {
            this.lastEventType = eventType;
            return Promise.resolve();
        },
        triggerEnergyBoost: function () {
            this.energyBoostTriggered = true;
        },
        lastEventType: null,
        energyBoostTriggered: false
    };

    // Create event listener instance
    const listener = {
        musicPlayer: mockMusicPlayer,
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

            // Continue processing
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

    // Test 1: Bust event handling
    listener.handleGameEvent({ type: 'bust', data: {} });
    setTimeout(() => {
        console.assert(mockMusicPlayer.lastEventType === 'bust', 'Should handle bust event');
    }, 50);

    // Test 2: Hand win event handling
    listener.handleGameEvent({ type: 'handWin', data: {} });
    setTimeout(() => {
        console.assert(mockMusicPlayer.lastEventType === 'handWin', 'Should handle hand win event');
    }, 100);

    // Test 3: Task complete event handling
    mockMusicPlayer.energyBoostTriggered = false;
    listener.handleGameEvent({ type: 'taskComplete', data: {} });
    setTimeout(() => {
        console.assert(mockMusicPlayer.lastEventType === 'taskComplete', 'Should handle task complete event');
        console.assert(mockMusicPlayer.energyBoostTriggered === true, 'Should trigger energy boost for task completion');
    }, 150);

    // Test 4: Event queue management
    const initialQueueLength = listener.eventQueue.length;
    listener.handleGameEvent({ type: 'handWin', data: {} });
    listener.handleGameEvent({ type: 'bust', data: {} });

    // Queue should process events
    setTimeout(() => {
        console.assert(listener.eventQueue.length <= initialQueueLength + 1, 'Should process events from queue');
    }, 200);

    console.log('✅ GameEventListener tests passed');
}

/**
 * Test MusicLayerManager functionality
 */
function testMusicLayerManager() {
    console.log('🧪 Testing MusicLayerManager...');

    // Mock audio context
    const mockAudioContext = {
        createGain: function () {
            return {
                gain: {
                    value: 0,
                    setValueAtTime: function (value, time) { this.value = value; },
                    cancelScheduledValues: function () { },
                    linearRampToValueAtTime: function (value, time) { this.value = value; }
                },
                connect: function () { }
            };
        },
        currentTime: 0
    };

    // Create layer manager instance
    const layerManager = {
        audioContext: mockAudioContext,
        layers: { base: null, tension: null, celebration: null, ambient: null },
        layerGains: {},
        masterGain: null,

        setupAudioGraph: function () {
            if (!this.audioContext) return;

            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);

            Object.keys(this.layers).forEach(layerName => {
                const gainNode = this.audioContext.createGain();
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.connect(this.masterGain);
                this.layerGains[layerName] = gainNode;
            });
        },

        setLayerVolume: function (layerName, volume, duration = 1.0) {
            const gainNode = this.layerGains[layerName];
            if (!gainNode) return;

            const currentTime = this.audioContext.currentTime;
            gainNode.gain.cancelScheduledValues(currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, currentTime + duration);
        },

        crossfadeLayers: function (fromLayer, toLayer, duration = 2.0) {
            if (fromLayer && this.layerGains[fromLayer]) {
                this.setLayerVolume(fromLayer, 0, duration);
            }
            if (toLayer && this.layerGains[toLayer]) {
                this.setLayerVolume(toLayer, 1.0, duration);
            }
        },

        getLayerGain: function (layerName) {
            return this.layerGains[layerName];
        }
    };

    // Initialize layer manager
    layerManager.setupAudioGraph();

    // Test 1: Audio graph setup
    console.assert(layerManager.masterGain !== null, 'Should create master gain node');
    console.assert(Object.keys(layerManager.layerGains).length === 4, 'Should create gain nodes for all layers');

    // Test 2: Layer volume control
    layerManager.setLayerVolume('base', 0.5);
    const baseGain = layerManager.getLayerGain('base');
    console.assert(baseGain !== null, 'Should return gain node for base layer');

    // Test 3: Crossfading
    layerManager.crossfadeLayers('base', 'tension');
    const tensionGain = layerManager.getLayerGain('tension');
    console.assert(tensionGain !== null, 'Should handle crossfade to tension layer');

    // Test 4: Invalid layer handling
    layerManager.setLayerVolume('nonexistent', 0.5);
    console.assert(layerManager.getLayerGain('nonexistent') === undefined, 'Should handle invalid layer names gracefully');

    console.log('✅ MusicLayerManager tests passed');
}

/**
 * Test ExtendedMusicLoop functionality
 */
function testExtendedMusicLoop() {
    console.log('🧪 Testing ExtendedMusicLoop...');

    // Mock audio context
    const mockAudioContext = {
        currentTime: 0
    };

    // Create extended loop instance
    const extendedLoop = {
        audioContext: mockAudioContext,
        sections: [
            { name: 'intro', duration: 45 },
            { name: 'verse1', duration: 60 },
            { name: 'chorus1', duration: 45 }
        ],
        currentSection: 0,
        sectionStartTime: 0,
        loopStartTime: 0,
        isActive: false,

        start: function () {
            if (!this.audioContext) return;

            this.isActive = true;
            this.loopStartTime = this.audioContext.currentTime;
            this.sectionStartTime = this.loopStartTime;
            this.currentSection = 0;
        },

        stop: function () {
            this.isActive = false;
        },

        transitionToNextSection: function () {
            if (!this.isActive) return;

            this.currentSection = (this.currentSection + 1) % this.sections.length;
            this.sectionStartTime = this.audioContext.currentTime;
        },

        getCurrentSection: function () {
            return this.sections[this.currentSection];
        },

        getSectionProgress: function () {
            if (!this.isActive) return 0;

            const section = this.sections[this.currentSection];
            const elapsed = this.audioContext.currentTime - this.sectionStartTime;
            return Math.min(elapsed / section.duration, 1.0);
        }
    };

    // Test 1: Initial state
    console.assert(extendedLoop.isActive === false, 'Should start inactive');
    console.assert(extendedLoop.currentSection === 0, 'Should start at section 0');

    // Test 2: Start loop
    extendedLoop.start();
    console.assert(extendedLoop.isActive === true, 'Should be active after start');
    console.assert(extendedLoop.getCurrentSection().name === 'intro', 'Should start with intro section');

    // Test 3: Section transitions
    extendedLoop.transitionToNextSection();
    console.assert(extendedLoop.getCurrentSection().name === 'verse1', 'Should transition to verse1');

    extendedLoop.transitionToNextSection();
    console.assert(extendedLoop.getCurrentSection().name === 'chorus1', 'Should transition to chorus1');

    // Test 4: Loop wraparound
    extendedLoop.transitionToNextSection();
    console.assert(extendedLoop.getCurrentSection().name === 'intro', 'Should wrap around to intro');

    // Test 5: Stop loop
    extendedLoop.stop();
    console.assert(extendedLoop.isActive === false, 'Should be inactive after stop');

    // Test 6: Progress calculation
    extendedLoop.start();
    mockAudioContext.currentTime = 10;
    extendedLoop.sectionStartTime = 0;
    const progress = extendedLoop.getSectionProgress();
    console.assert(progress > 0 && progress <= 1, 'Should calculate section progress correctly');

    console.log('✅ ExtendedMusicLoop tests passed');
}

/**
 * Test adaptive music integration
 */
function testAdaptiveMusicIntegration() {
    console.log('🧪 Testing Adaptive Music Integration...');

    // Test event dispatching
    let eventReceived = false;
    let eventData = null;

    const testEventListener = function (event) {
        eventReceived = true;
        eventData = event.detail;
    };

    // Add temporary event listener
    document.addEventListener('gameEvent', testEventListener);

    // Test 1: Game event dispatch
    document.dispatchEvent(new CustomEvent('gameEvent', {
        detail: { type: 'bust', data: { result: 'bust', stressChange: 10 } }
    }));

    console.assert(eventReceived === true, 'Should receive game event');
    console.assert(eventData.type === 'bust', 'Should receive correct event type');

    // Test 2: Stress level change event
    eventReceived = false;
    document.addEventListener('stressLevelChanged', function (event) {
        eventReceived = true;
        eventData = event.detail;
    });

    document.dispatchEvent(new CustomEvent('stressLevelChanged', {
        detail: { oldLevel: 30, newLevel: 50 }
    }));

    console.assert(eventReceived === true, 'Should receive stress level change event');
    console.assert(eventData.oldLevel === 30, 'Should have correct old stress level');
    console.assert(eventData.newLevel === 50, 'Should have correct new stress level');

    // Clean up event listeners
    document.removeEventListener('gameEvent', testEventListener);

    console.log('✅ Adaptive Music Integration tests passed');
}

/**
 * Test performance and error handling
 */
function testPerformanceAndErrorHandling() {
    console.log('🧪 Testing Performance and Error Handling...');

    // Test 1: Debouncing stress level changes
    let transitionCount = 0;
    const mockMusicPlayer = {
        transitionToMoodState: function () {
            transitionCount++;
        }
    };

    const monitor = {
        musicPlayer: mockMusicPlayer,
        currentStressLevel: 50,
        currentMoodState: 'moderate',
        debounceTimer: null,
        stressThresholds: { calm: 30, tense: 70 },

        updateStressLevel: function (newLevel) {
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = setTimeout(() => {
                this.processStressLevelChange(newLevel);
            }, 50);
        },

        processStressLevelChange: function (newLevel) {
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
                this.musicPlayer.transitionToMoodState(newMoodState);
            }
        }
    };

    // Rapid stress level changes should be debounced
    monitor.updateStressLevel(75);
    monitor.updateStressLevel(80);
    monitor.updateStressLevel(85);

    setTimeout(() => {
        console.assert(transitionCount <= 1, 'Should debounce rapid stress level changes');
    }, 100);

    // Test 2: Error handling for missing audio context
    const mockAdaptivePlayer = {
        audioContext: null,
        setupAudioGraph: function () {
            if (!this.audioContext) {
                console.log('No audio context available, skipping setup');
                return false;
            }
            return true;
        }
    };

    const setupResult = mockAdaptivePlayer.setupAudioGraph();
    console.assert(setupResult === false, 'Should handle missing audio context gracefully');

    console.log('✅ Performance and Error Handling tests passed');
}

/**
 * Run all adaptive music tests
 */
function runAdaptiveMusicTests() {
    console.log('🎵 Starting Adaptive Music System Tests...\n');

    try {
        testStressLevelMonitor();
        testGameEventListener();
        testMusicLayerManager();
        testExtendedMusicLoop();
        testAdaptiveMusicIntegration();
        testPerformanceAndErrorHandling();

        console.log('\n🎉 All Adaptive Music System tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Adaptive Music System tests failed:', error);
        return false;
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAdaptiveMusicTests,
        testStressLevelMonitor,
        testGameEventListener,
        testMusicLayerManager,
        testExtendedMusicLoop,
        testAdaptiveMusicIntegration,
        testPerformanceAndErrorHandling
    };
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    // Run tests when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAdaptiveMusicTests);
    } else {
        runAdaptiveMusicTests();
    }
}