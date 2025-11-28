import { Page } from '@playwright/test';

declare module '@playwright/test' {
    interface TestFixtures {
        /**
         * A fixture function to ensure the app has finished mapping exports to `window`.
         * Usage: await ensureGameReady({ reload: true, timeout: 5000 });
         */
        ensureGameReady: (opts?: { reload?: boolean; timeout?: number }) => Promise<void>;
    }
}

export {};
