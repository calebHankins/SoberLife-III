// Extend the global Window interface to include our testing flag
declare global {
    interface Window {
        gameFunctionsReady?: boolean;
    }
}

export {};
