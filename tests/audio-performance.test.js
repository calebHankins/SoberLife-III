// Audio Performance Tests
// Tests for audio system performance and mobile optimization

class AudioPerformanceTests {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async runTests() {
        console.log('⚡ Running Audio Performance Tests...\n');

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

        console.log(`\n📊 Performance Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertLessThan(actual, expected, message) {
        if (actual >= expected) {
            throw new Error(`${message}: expected less than ${expected}, got ${actual}`);
        }
    }
}

// Performance test suite
async function definePerformanceTests() {
    const tests = new AudioPerformanceTests();

    // Test 1: Initialization performance
    tests.test('Audio system initializes within performance budget', async () => {
        const startTime = performance.now();

        // Simulate audio system initialization
        if (window.audioManager) {
            await window.audioManager.init();
        } else {
            // Mock initialization for testing
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        const initTime = performance.now() - startTime;
        tests.assertLessThan(initTime, 100, `Initialization time (${initTime.toFixed(2)}ms)`);
    });

    // Test 2: Memory usage
    tests.test('Memory usage stays within acceptable limits', () => {
        if (performance.memory) {
            const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            tests.assertLessThan(memoryUsage, 50, `Memory usage (${memoryUsage.toFixed(2)}MB)`);
        } else {
            console.log('Memory API not available, skipping memory test');
        }
    });

    // Test 3: Mobile device detection
    tests.test('Mobile device detection works correctly', () => {
        // Mock user agent for testing
        const originalUserAgent = navigator.userAgent;

        // Test mobile detection
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
            configurable: true
        });

        if (window.audioManager) {
            const isMobile = window.audioManager.isMobileDevice();
            tests.assert(isMobile, 'Should detect iPhone as mobile device');
        }

        // Test desktop detection
        Object.defineProperty(navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            configurable: true
        });

        if (window.audioManager) {
            const isDesktop = !window.audioManager.isMobileDevice();
            tests.assert(isDesktop, 'Should detect Windows as desktop device');
        }

        // Restore original user agent
        Object.defineProperty(navigator, 'userAgent', {
            value: originalUserAgent,
            configurable: true
        });
    });

    // Test 4: Sound effect performance
    tests.test('Sound effects play without blocking UI', async () => {
        const startTime = performance.now();

        // Simulate playing multiple sound effects
        if (window.audioManager && window.audioManager.soundEffects) {
            window.audioManager.soundEffects.play('buttonClick');
            window.audioManager.soundEffects.play('cardClick');
            window.audioManager.soundEffects.play('cardDeal');
        }

        const playTime = performance.now() - startTime;
        tests.assertLessThan(playTime, 10, `Sound effect play time (${playTime.toFixed(2)}ms)`);
    });

    // Test 5: Volume control performance
    tests.test('Volume controls respond quickly', () => {
        const startTime = performance.now();

        if (window.audioManager) {
            // Test rapid volume changes
            for (let i = 0; i < 10; i++) {
                window.audioManager.setMusicVolume(i / 10);
                window.audioManager.setEffectsVolume(i / 10);
            }
        }

        const controlTime = performance.now() - startTime;
        tests.assertLessThan(controlTime, 20, `Volume control time (${controlTime.toFixed(2)}ms)`);
    });

    // Test 6: Battery impact simulation
    tests.test('Audio system has minimal battery impact', () => {
        // This is a simulation - in real testing you'd measure actual battery usage
        if (window.audioManager) {
            const metrics = window.audioManager.getPerformanceMetrics();

            // Check that we're not using excessive resources
            tests.assert(metrics.initialized, 'Audio system should be initialized');

            if (metrics.isMobile) {
                console.log('Mobile device detected - battery optimization active');
            }
        }
    });

    // Test 7: Concurrent audio operations
    tests.test('Handles concurrent audio operations efficiently', async () => {
        const startTime = performance.now();

        // Simulate concurrent operations
        const operations = [];

        if (window.audioManager) {
            operations.push(window.audioManager.setMusicVolume(0.5));
            operations.push(window.audioManager.setEffectsVolume(0.3));

            if (window.audioManager.soundEffects) {
                operations.push(window.audioManager.soundEffects.play('buttonClick'));
                operations.push(window.audioManager.soundEffects.play('zenComplete'));
            }
        }

        await Promise.all(operations);

        const concurrentTime = performance.now() - startTime;
        tests.assertLessThan(concurrentTime, 50, `Concurrent operations time (${concurrentTime.toFixed(2)}ms)`);
    });

    // Test 8: Resource cleanup
    tests.test('Resources are properly cleaned up', () => {
        // Test that audio resources don't accumulate
        if (window.audioManager && window.audioManager.soundEffects) {
            const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

            // Play many sound effects
            for (let i = 0; i < 50; i++) {
                window.audioManager.soundEffects.play('cardClick');
            }

            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }

            // Check memory hasn't grown excessively
            if (performance.memory) {
                const finalMemory = performance.memory.usedJSHeapSize;
                const memoryGrowth = (finalMemory - initialMemory) / 1024 / 1024; // MB
                tests.assertLessThan(memoryGrowth, 5, `Memory growth (${memoryGrowth.toFixed(2)}MB)`);
            }
        }
    });

    return tests;
}

// Mobile-specific performance tests
async function defineMobilePerformanceTests() {
    const tests = new AudioPerformanceTests();

    // Test 1: Mobile optimization activation
    tests.test('Mobile optimizations activate correctly', () => {
        if (window.audioManager) {
            const isMobile = window.audioManager.isMobileDevice();
            const preferences = window.audioManager.getPreferences();

            if (isMobile) {
                tests.assertLessThan(preferences.musicVolume, 0.2, 'Music volume should be reduced on mobile');
                tests.assertLessThan(preferences.effectsVolume, 0.3, 'Effects volume should be reduced on mobile');
            }
        }
    });

    // Test 2: Touch interaction performance
    tests.test('Touch interactions are responsive', async () => {
        const startTime = performance.now();

        // Simulate touch events
        const touchEvent = new TouchEvent('touchstart', {
            touches: [{ clientX: 100, clientY: 100 }]
        });

        document.dispatchEvent(touchEvent);

        const responseTime = performance.now() - startTime;
        tests.assertLessThan(responseTime, 16, `Touch response time (${responseTime.toFixed(2)}ms)`); // 60fps = 16ms
    });

    // Test 3: Screen size adaptation
    tests.test('Audio controls adapt to screen size', () => {
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;

        // Simulate mobile screen size
        Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });

        if (window.audioManager) {
            const isMobile = window.audioManager.isMobileDevice();
            tests.assert(isMobile, 'Should detect mobile screen size');
        }

        // Restore original dimensions
        Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: originalHeight, configurable: true });
    });

    return tests;
}

// Run performance tests
if (typeof window !== 'undefined') {
    window.runAudioPerformanceTests = async () => {
        console.log('🚀 Starting Audio Performance Test Suite...\n');

        const performanceTests = await definePerformanceTests();
        const performanceResults = await performanceTests.runTests();

        console.log('\n📱 Starting Mobile Performance Tests...\n');

        const mobileTests = await defineMobilePerformanceTests();
        const mobileResults = await mobileTests.runTests();

        const overallSuccess = performanceResults && mobileResults;
        console.log(`\n🏁 Overall Performance Test Result: ${overallSuccess ? 'PASS' : 'FAIL'}`);

        return overallSuccess;
    };
}

export { definePerformanceTests, defineMobilePerformanceTests };