export async function openFreePlayOverview(page) {
    // Click Start Free Play and verify overview visible
    await page.getByRole('button', { name: /Start Free Play/i }).click();
    await page.getByRole('heading', { name: /Free Play Mode/i });
    await page.locator('#freePlayOverview').waitFor({ state: 'visible' });
}

export async function startFreePlayFromOverview(page) {
    const startBtn = page.locator('#freePlayStartBtn');
    await startBtn.waitFor({ state: 'visible' });
    await startBtn.click();
    await page.locator('#gameArea').waitFor({ state: 'visible' });
}

export async function enterFreePlaySession(page) {
    await openFreePlayOverview(page);
    await startFreePlayFromOverview(page);
}
