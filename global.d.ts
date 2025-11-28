// Extend the global Window interface to include our testing flag
declare global {
    interface Window {
        gameFunctionsReady?: boolean;
    }
}

// Augment Playwright's TestFixtures to include our custom fixture `ensureGameReady`
// so that TypeScript/JS language service recognizes it in test args.
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
