// @ts-check
/**
 * Note: this file is reused in our jest setup located here: uui-build/jest/setupJsDom.js
 * This is why it's pure *.js module and not a typescript.
 */
import React from 'react';
import { testRunner } from '../internal/testRunnerUtils';

/**
 * Adds UUI-specific mocks to the jsdom
 * @param {any} global - global jsdom object.
 * @param {object} [options] - extra options.
 * @param {boolean} [options.mockCommon3rdPartyDeps] - enables some common deps mocks by default.
 */
export function setupJsDom(global, options = {}) {
    const { mockCommon3rdPartyDeps } = options;
    const globalMock = {
        ResizeObserver: class ResizeObserverMock {
            observe() {}
            disconnect() {}
        },
    };
    const navigatorMock = {
        clipboard: {
            writeText: () => {},
        },
    };
    const elementPrototypeMock = {
        scrollTo: () => {},
    };
    // const consoleMock = (() => {
    //     const consoleErrorPrev = global.console.error;
    //     const error = (/** @type {[any]} */ ...args) => {
    //         const [first] = args;
    //         const ignorePatterns = ['Warning: validateDOMNesting(...):'];
    //         if (typeof first === 'string') {
    //             const shouldIgnore = ignorePatterns.some((p) => first.indexOf(p) !== -1);
    //             if (shouldIgnore) {
    //                 return;
    //             }
    //         }
    //         consoleErrorPrev.apply(global, args);
    //     };
    //     return {
    //         error,
    //     };
    // })();

    Object.assign(global, globalMock);
    Object.assign(global.navigator, navigatorMock);
    Object.assign(global.Element.prototype, elementPrototypeMock);
    // Object.assign(global.console, consoleMock);

    if (mockCommon3rdPartyDeps) {
        enableMockForCommon3rdPartyDeps();
    }
}

function enableMockForCommon3rdPartyDeps() {
    if (!testRunner) {
        throw new Error('Only Jest & Vitest are currently supported. If another test runner is used, '
            + 'then please dont enable mockCommon3rdPartyDeps option and do all mocks using capabilities of your test runner.');
    }
    testRunner.mock('react-popper', () => ({
        ...testRunner.requireActual('react-popper'),
        /**
         * @param {object} props - Component's props
         * @param {function} props.children - Component's children prop
         * @returns {JSX.Element}
         */
        Popper: function PopperMock({ children }) {
            return children({
                ref: jest.fn(() => {}),
                update: jest.fn(),
                style: {},
                arrowProps: { ref: jest.fn },
                placement: 'bottom-start',
                isReferenceHidden: false,
            });
        },
    }));

    testRunner.mock('react-focus-lock', () => ({
        ...testRunner.requireActual('react-focus-lock'),
        __esModule: true,
        /**
         * @param {object} props - Component's props
         * @param {any} props.children - Component's children prop
         * @returns {JSX.Element}
         */
        // @ts-ignore
        default: React.forwardRef(({ children }, ref) => React.createElement(React.Fragment, {}, children)),
        /**
         * @param {object} props - Component's props
         * @param {any} props.children - Component's children prop
         * @returns {JSX.Element}
         */
        // @ts-ignore
        FreeFocusInside: React.forwardRef(({ children }, ref) => React.createElement(React.Fragment, {}, children)),
    }));
}
