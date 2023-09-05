const consoleError = console.error;
const SUPPRESSED_WARNINGS = ['Warning: useLayoutEffect does nothing on the server'];

export const suppressLayoutEffectWarnings = () => {
    if (typeof window !== 'undefined') {
        console.error = function filterWarnings(msg, ...args) {
            if (!SUPPRESSED_WARNINGS.some((entry) => msg.includes(entry))) {
                consoleError(msg, ...args);
            }
        };
    }
};
