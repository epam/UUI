import '@testing-library/jest-dom';

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

const consoleErrorPrev = console.error;
console.error = (...args) => {
    const [first] = args;
    const ignorePatterns = ['Warning: validateDOMNesting(...):'];
    if (typeof first === 'string') {
        const shouldIgnore = ignorePatterns.some((p) => first.indexOf(p) !== -1);
        if (shouldIgnore) {
            return;
        }
    }
    consoleErrorPrev.apply(this, args);
};
