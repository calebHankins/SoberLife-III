async function openFreePlayOverview(page) {
    await page.getByRole('button', { name: /Start Free Play/i }).click();
    await page.locator('#freePlayOverview').waitFor({ state: 'visible' });
}

async function startFreePlayFromOverview(page) {
    const startBtn = page.locator('#freePlayStartBtn');
    await startBtn.waitFor({ state: 'visible' });
    await startBtn.click();
    await page.locator('#gameArea').waitFor({ state: 'visible' });
}

async function enterFreePlaySession(page) {
    await openFreePlayOverview(page);
    await startFreePlayFromOverview(page);
}

module.exports = {
    openFreePlayOverview,
    startFreePlayFromOverview,
    enterFreePlaySession
};
