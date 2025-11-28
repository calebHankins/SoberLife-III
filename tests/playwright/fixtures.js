const base = require('@playwright/test');

/**
 * Extend Playwright's base test with a reusable fixture `ensureGameReady`.
 * `ensureGameReady` is callable and waits for `window.gameFunctionsReady` to be true.
 */
exports.test = base.test.extend({
    ensureGameReady: async ({ page }, use) => {
        // Provide a function returned to tests they can call with options
        await use(async ({ reload = true, timeout = 5000 } = {}) => {
            if (reload) {
                await page.reload();
            }
            await page.waitForFunction(() => window.gameFunctionsReady === true, null, { timeout });
        });
    },
});

exports.expect = base.expect;
exports.devices = base.devices; // re-export if needed
