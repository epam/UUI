import React, { ReactElement, ReactNode } from 'react';
import { render, renderHook } from '../extensions/testingLibraryReactExt';
import renderer from 'react-test-renderer';
import { ContextProvider, UuiContexts } from '@epam/uui-core';
import { delayWrapInAct } from './timerUtils';

export const testSvc = {} as UuiContexts;

export async function renderHookToJsdomWithContextAsync<TProps, TResult>(hook: (props: TProps) => TResult, initialProps?: TProps) {
    const wrapper = ({ children }: { children?: React.ReactNode }) => wrapElementWithUuiContext(children);
    const result = renderHook<TResult, TProps>(hook, { wrapper, initialProps });
    await delayWrapInAct();
    return result;
}

/**
 * Returns virtual DOM structure.
 * Can be used to render React components to pure JavaScript objects.
 * It has no dependency on DOM.
 *
 * @param reactElement
 */
export const renderSnapshotWithContextAsync = async (reactElement: ReactElement) => {
    const result = renderer.create(wrapElementWithUuiContext(reactElement));
    await delayWrapInAct();
    return result.toJSON();
};

/**
 * Renders component to JSDom.
 * @param reactElement
 */
export const renderToJsdomWithContextAsync = async (reactElement: ReactElement) => {
    const result = render(wrapElementWithUuiContext(reactElement));
    await delayWrapInAct();
    return {
        ...result,
        rerender: (reactElementInner: ReactElement) => result.rerender(wrapElementWithUuiContext(reactElementInner)),
    };
};

function wrapElementWithUuiContext(component: ReactNode) {
    return (
        <ContextProvider onInitCompleted={ (svc) => { Object.assign(testSvc, svc); } }>
            { component }
        </ContextProvider>
    );
}
