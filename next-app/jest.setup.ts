import "@testing-library/jest-dom";
class ResizeObserver {
    observe() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

// @ts-ignore
global.ResizeObserver = ResizeObserver;
