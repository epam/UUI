import React, { ReactElement } from 'react';
import { render, renderHook } from '../extensions/testingLibraryReactExt';
import renderer from 'react-test-renderer';
import { ContextProvider, UuiContexts } from '@epam/uui-core';
import { delayWrapInAct } from './timerUtils';

export type CustomWrapperType = ({ children }: { children?: React.ReactNode }) => JSX.Element;

export const getDefaultUUiContextWrapper = () => {
    const testUuiCtx = {} as UuiContexts;
    const wrapper: CustomWrapperType = function UuiContextDefaultWrapper({ children }) {
        return (
            <ContextProvider onInitCompleted={ (svc) => { Object.assign(testUuiCtx, svc); } }>
                { children }
            </ContextProvider>
        );
    };
    return {
        wrapper,
        testUuiCtx,
    };
};

/**
 * Wraps the hook with context and renders it to jsdom
 *
 * @param hook
 * @param initialProps
 * @param customWrapper
 */
export async function renderHookToJsdomWithContextAsync<TProps, TResult>(hook: (props: TProps) => TResult, initialProps?: TProps, customWrapper?: CustomWrapperType) {
    const wrapper = customWrapper || getDefaultUUiContextWrapper().wrapper;
    const result = renderHook<TResult, TProps>(hook, { wrapper, initialProps });
    await delayWrapInAct();
    return {
        ...result,
    };
}

/**
 * Wraps the component with context and renders it as JSON using react-test-renderer.
 *
 * Returns virtual DOM structure.
 * Can be used to render React components to pure JavaScript objects.
 * It has no dependency on DOM.
 *
 * @param reactElement
 * @param customWrapper
 */
export const renderSnapshotWithContextAsync = async (reactElement: ReactElement, customWrapper?: CustomWrapperType) => {
    const wrapper = customWrapper || getDefaultUUiContextWrapper().wrapper;
    const result = renderer.create(React.createElement(wrapper, { children: reactElement }));
    await delayWrapInAct();
    return result.toJSON();
};

/**
 * Wraps the component with context and renders it to the jsdom.
 *
 * @param reactElement
 * @param customWrapper
 */
export const renderToJsdomWithContextAsync = async (reactElement: ReactElement, customWrapper?: CustomWrapperType) => {
    const wrapper = customWrapper || getDefaultUUiContextWrapper().wrapper;
    const result = render(reactElement, { wrapper });
    await delayWrapInAct();
    return {
        ...result,
    };
};
