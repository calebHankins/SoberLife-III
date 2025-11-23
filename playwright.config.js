// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    testDir: './tests/playwright',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : '25%',
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

    use: {
        baseURL: 'http://localhost:8000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'mobile',
            use: {
                ...devices['iPhone 12'],
                // Use chromium for mobile tests instead of webkit for better CI compatibility
                browserName: 'chromium',
            },
        },

        {
            name: 'tablet',
            use: {
                ...devices['iPad Pro'],
                // Use chromium for tablet tests instead of webkit for better CI compatibility
                browserName: 'chromium',
            },
        },
    ],

    webServer: {
        command: 'npx serve . -p 8000',
        port: 8000,
        reuseExistingServer: !process.env.CI,
    },
});
