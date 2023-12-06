/**
 * Underlying test runner
 * @type {{mock: (function(string, function(): *=): void), isMockFunction: (function(function(): *): boolean), requireActual: (function(string): *)}|undefined}
 */
export const testRunner = getTestRunner();

/**
 *
 * @returns {{
 *     mock: (moduleName: string, factory?: () => unknown) => void
 *     isMockFunction: (fn: () => unknown) => boolean
 *     requireActual: (moduleName: string) => any
 * } | undefined}
 */
function getTestRunner() {
    // @ts-ignore
    if (typeof jest !== 'undefined') {
        return jest;
    } else { // @ts-ignore
        if (typeof vi !== 'undefined') {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            return vi;
        }
    }
    // Neither "jest" nor "vi" was found in global scope.
    // Only Jest and Vitest are currently supported.
}
