import '@testing-library/jest-dom'

global.ResizeObserver = class ResizeObserver {
    observe() {}
    disconnect() {}
};

global.navigator.clipboard = {
    writeText: () => {}
};
