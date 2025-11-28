// Shared Playwright test utilities

/**
 * Ensure the single-page app is ready to be interacted with in tests.
 * This waits for the inline module that maps exported functions to `window` to complete.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} [opts]
 * @param {boolean} [opts.reload=true] - Whether to reload the page before waiting
 * @param {number} [opts.timeout=5000] - Timeout in ms to wait for success
 */
async function ensureGameReady(page, { reload = true, timeout = 5000 } = {}) {
    if (reload) {
        await page.reload();
    }

    // Wait for the inline module to signal readiness via `window.gameFunctionsReady`.
    await page.waitForFunction(() => window.gameFunctionsReady === true, null, { timeout });
}

module.exports = {
    ensureGameReady,
};
