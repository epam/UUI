// @ts-check
/**
 * Note: this file is reused in our jest setup located here: uui-build/jest/setupJsDom.js
 * This is why it's pure *.js module and not a typescript.
 */
/**
 * Adds UUI-specific mocks to the jsdom
 * @param {any} [global] - global jsdom object.
 */
export function setupJsDom(global) {
    global.ResizeObserver = class ResizeObserver {
        observe() {}
        disconnect() {}
    };

    global.navigator.clipboard = {
        writeText: () => {},
    };

    Object.assign(global.Element.prototype, {
        scrollTo: () => {},
    });

    const consoleErrorPrev = global.console.error;
    global.console.error = (/** @type {[any]} */ ...args) => {
        const [first] = args;
        const ignorePatterns = ['Warning: validateDOMNesting(...):'];
        if (typeof first === 'string') {
            const shouldIgnore = ignorePatterns.some((p) => first.indexOf(p) !== -1);
            if (shouldIgnore) {
                return;
            }
        }
        consoleErrorPrev.apply(global, args);
    };
}
