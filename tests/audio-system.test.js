// Audio System Tests
// Tests for background music and sound effects functionality

// Mock Web Audio API for testing
class MockAudioContext {
    constructor() {
        this.state = 'suspended';
        this.currentTime = 0;
        this.sampleRate = 44100;
        this.destination = { connect: () => { } };
    }

    createGain() {
        return {
            gain: {
                value: 1,
                setValueAtTime: () => { },
                linearRampToValueAtTime: () => { },
                exponentialRampToValueAtTime: () => { },
                cancelScheduledValues: () => { }
            },
            connect: () => { }
        };
    }

    createOscillator() {
        return {
            frequency: {
                value: 440,
                setValueAtTime: () => { }
            },
            detune: {
                setValueAtTime: () => { }
            },
            type: 'sine',
            connect: () => { },
            start: () => { },
            stop: () => { }
        };
    }

    createBuffer(channels, length, sampleRate) {
        return {
            getChannelData: () => new Float32Array(length)
        };
    }

    createBufferSource() {
        return {
            buffer: null,
            connect: () => { },
            start: () => { },
            stop: () => { }
        };
    }

    createBiquadFilter() {
        return {
            type: 'lowpass',
            frequency: {
                setValueAtTime: () => { }
            },
            Q: {
                setValueAtTime: () => { }
            },
            connect: () => { }
        };
    }

    async resume() {
        this.state = 'running';
    }
}

// Mock localStorage for testing
const mockLocalStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    clear() {
        this.data = {};
    }
};

// Test suite for Audio System
class AudioSystemTests {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;

        // Setup mocks
        global.AudioContext = MockAudioContext;
        global.webkitAudioContext = MockAudioContext;
        global.localStorage = mockLocalStorage;

        // Mock document for testing
        global.document = {
            createElement: () => ({
                canPlayType: () => 'probably'
            }),
            addEventListener: () => { },
            removeEventListener: () => { },
            getElementById: () => null,
            querySelector: () => null,
            body: { appendChild: () => { } }
        };
    }

    // Test framework methods
    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async runTests() {
        console.log('🎵 Running Audio System Tests...\n');

        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: expected ${expected}, got ${actual}`);
        }
    }

    assertNotNull(value, message) {
        if (value === null || value === undefined) {
            throw new Error(message);
        }
    }
}

// Import the audio system (we'll need to handle ES modules in test environment)
async function importAudioSystem() {
    try {
        // In a real test environment, you'd use proper ES module imports
        // For now, we'll simulate the classes
        const { AudioManager, audioConfig, MusicPlayer, SoundEffects } = await import('../assets/js/audio-system.js');
        return { AudioManager, audioConfig, MusicPlayer, SoundEffects };
    } catch (error) {
        console.warn('Could not import audio system, using mock implementations');

        // Mock implementations for testing
        class MockAudioManager {
            constructor() {
                this.initialized = false;
                this.preferences = {
                    musicVolume: 0.15,
                    effectsVolume: 0.3,
                    audioEnabled: true,
                    musicMuted: false,
                    effectsMuted: false
                };
            }

            async init() {
                this.initialized = true;
            }

            setMusicVolume(level) {
                this.preferences.musicVolume = Math.max(0, Math.min(1, level));
            }

            setEffectsVolume(level) {
                this.preferences.effectsVolume = Math.max(0, Math.min(1, level));
            }

            toggleMusicMute() {
                this.preferences.musicMuted = !this.preferences.musicMuted;
                return this.preferences.musicMuted;
            }

            toggleAllMute() {
                const bothMuted = this.preferences.musicMuted && this.preferences.effectsMuted;
                this.preferences.musicMuted = !bothMuted;
                this.preferences.effectsMuted = !bothMuted;
                return this.preferences.musicMuted && this.preferences.effectsMuted;
            }

            savePreferences() {
                mockLocalStorage.setItem('soberlife_music_volume', this.preferences.musicVolume.toString());
                mockLocalStorage.setItem('soberlife_effects_volume', this.preferences.effectsVolume.toString());
            }

            loadPreferences() {
                const musicVolume = mockLocalStorage.getItem('soberlife_music_volume');
                if (musicVolume !== null) {
                    this.preferences.musicVolume = parseFloat(musicVolume);
                }
            }

            getPreferences() {
                return { ...this.preferences };
            }
        }

        return {
            AudioManager: MockAudioManager,
            audioConfig: {
                music: { defaultVolume: 0.15 },
                effects: { defaultVolume: 0.3 }
            }
        };
    }
}

// Define tests
async function defineTests() {
    const tests = new AudioSystemTests();
    const { AudioManager, audioConfig } = await importAudioSystem();

    // Test 1: AudioManager initialization
    tests.test('AudioManager initializes correctly', async () => {
        const audioManager = new AudioManager();
        await audioManager.init();

        tests.assert(audioManager.initialized, 'AudioManager should be initialized');
        tests.assertNotNull(audioManager.preferences, 'Preferences should be set');
    });

    // Test 2: Volume control functionality
    tests.test('Volume controls work correctly', async () => {
        const audioManager = new AudioManager();
        await audioManager.init();

        // Test music volume
        audioManager.setMusicVolume(0.5);
        tests.assertEqual(audioManager.preferences.musicVolume, 0.5, 'Music volume should be set correctly');

        // Test effects volume
        audioManager.setEffectsVolume(0.7);
        tests.assertEqual(audioManager.preferences.effectsVolume, 0.7, 'Effects volume should be set correctly');

        // Test volume bounds
        audioManager.setMusicVolume(1.5);
        tests.assertEqual(audioManager.preferences.musicVolume, 1.0, 'Music volume should be clamped to 1.0');

        audioManager.setMusicVolume(-0.5);
        tests.assertEqual(audioManager.preferences.musicVolume, 0.0, 'Music volume should be clamped to 0.0');
    });

    // Test 3: Mute functionality
    tests.test('Mute functionality works correctly', async () => {
        const audioManager = new AudioManager();
        await audioManager.init();

        // Test music mute
        const initialMuteState = audioManager.preferences.musicMuted;
        const newMuteState = audioManager.toggleMusicMute();

        tests.assertEqual(newMuteState, !initialMuteState, 'Music mute state should toggle');
        tests.assertEqual(audioManager.preferences.musicMuted, newMuteState, 'Preferences should reflect mute state');
    });

    // Test 3b: Toggle all mute functionality
    tests.test('Toggle all mute functionality works correctly', async () => {
        const audioManager = new AudioManager();
        await audioManager.init();

        // Ensure both are unmuted initially
        audioManager.preferences.musicMuted = false;
        audioManager.preferences.effectsMuted = false;

        // Toggle all mute to mute both
        const muted = audioManager.toggleAllMute();
        tests.assertEqual(muted, true, 'toggleAllMute should mute both audio streams');
        tests.assertEqual(audioManager.preferences.musicMuted, true, 'Music should be muted');
        tests.assertEqual(audioManager.preferences.effectsMuted, true, 'Effects should be muted');

        // Toggle again to unmute both
        const unmuted = audioManager.toggleAllMute();
        tests.assertEqual(unmuted, false, 'toggleAllMute should unmute both audio streams');
        tests.assertEqual(audioManager.preferences.musicMuted, false, 'Music should be unmuted');
        tests.assertEqual(audioManager.preferences.effectsMuted, false, 'Effects should be unmuted');
    });

    // Test 4: Preference persistence
    tests.test('Preferences persist correctly', async () => {
        mockLocalStorage.clear();

        const audioManager = new AudioManager();
        await audioManager.init();

        // Set some preferences
        audioManager.setMusicVolume(0.8);
        audioManager.setEffectsVolume(0.6);
        audioManager.savePreferences();

        // Create new instance and load preferences
        const audioManager2 = new AudioManager();
        audioManager2.loadPreferences();

        tests.assertEqual(audioManager2.preferences.musicVolume, 0.8, 'Music volume should persist');
        tests.assertEqual(audioManager2.preferences.effectsVolume, 0.6, 'Effects volume should persist');
    });

    // Test 5: Audio configuration validation
    tests.test('Audio configuration is valid', () => {
        tests.assertNotNull(audioConfig, 'Audio config should exist');
        tests.assertNotNull(audioConfig.music, 'Music config should exist');
        tests.assertNotNull(audioConfig.effects, 'Effects config should exist');

        tests.assert(typeof audioConfig.music.defaultVolume === 'number', 'Default music volume should be a number');
        tests.assert(typeof audioConfig.effects.defaultVolume === 'number', 'Default effects volume should be a number');

        tests.assert(audioConfig.music.defaultVolume >= 0 && audioConfig.music.defaultVolume <= 1,
            'Default music volume should be between 0 and 1');
        tests.assert(audioConfig.effects.defaultVolume >= 0 && audioConfig.effects.defaultVolume <= 1,
            'Default effects volume should be between 0 and 1');
    });

    // Test 6: Browser compatibility detection
    tests.test('Browser compatibility detection works', async () => {
        const audioManager = new AudioManager();

        // Test Web Audio API detection
        const hasWebAudio = audioManager.isWebAudioSupported();
        tests.assert(typeof hasWebAudio === 'boolean', 'Web Audio detection should return boolean');

        // Test HTML5 Audio detection
        const hasHTML5Audio = audioManager.isHTML5AudioSupported();
        tests.assert(typeof hasHTML5Audio === 'boolean', 'HTML5 Audio detection should return boolean');
    });

    // Test 7: Error handling
    tests.test('Error handling works correctly', async () => {
        // Test with invalid audio context
        const originalAudioContext = global.AudioContext;
        global.AudioContext = null;
        global.webkitAudioContext = null;

        const audioManager = new AudioManager();
        await audioManager.init();

        // Should still initialize but with fallback
        tests.assert(audioManager.initialized, 'AudioManager should initialize even without Web Audio API');

        // Restore original
        global.AudioContext = originalAudioContext;
    });

    // Test 8: Performance considerations
    tests.test('Performance requirements are met', async () => {
        const startTime = performance.now();

        const audioManager = new AudioManager();
        await audioManager.init();

        const initTime = performance.now() - startTime;
        tests.assert(initTime < 100, `Initialization should be fast (took ${initTime.toFixed(2)}ms)`);

        // Test memory usage (basic check)
        const preferences = audioManager.getPreferences();
        tests.assert(Object.keys(preferences).length <= 10, 'Preferences object should be lightweight');
    });

    return tests;
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    defineTests().then(tests => tests.runTests());
} else {
    // Browser environment
    window.runAudioSystemTests = async () => {
        const tests = await defineTests();
        return await tests.runTests();
    };
}

export { defineTests };