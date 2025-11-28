// Test-specific global additions for Playwright test files
declare global {
    interface Window {
        gameFunctionsReady?: boolean;
    }
}

export {};
