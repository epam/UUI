import React, { ReactElement, ReactNode } from 'react';
import { render, renderHook, fireEvent, screen, within } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';
import { ContextProvider, UuiContexts } from '@epam/uui-core';

// re-export some useful stuff for convenience
export { act, fireEvent, screen, within };

export const delay = (ms: number = 1): Promise<void> => new Promise(resolve => {
    setTimeout(resolve, ms);
});

export async function delayWrapInAct() {
    await act(() => delay(1));
}

export const testSvc = {} as UuiContexts;

export async function renderHookToJsdomWithContextAsync<TProps, TResult>(hook: (props: TProps) => TResult, initialProps?: TProps) {
    const wrapper = ({ children }: { children?: React.ReactNode }) => wrapElementWithUuiContext(children);
    const result = renderHook<TResult, TProps>(hook, { wrapper, initialProps });
    await delayWrapInAct();
    return result;
}

export const renderSnapshotWithContextAsync = async (component: ReactElement) => {
    const result = renderer.create(wrapElementWithUuiContext(component));
    await delayWrapInAct();
    return result.toJSON();
};

export const renderToJsdomWithContextAsync = async (reactElement: ReactElement) => {
    let result = render(wrapElementWithUuiContext(reactElement));
    await delayWrapInAct();
    return {
        ...result,
        rerender: (reactElement: ReactElement) => result.rerender(wrapElementWithUuiContext(reactElement)),
    };
};

function wrapElementWithUuiContext(component: ReactNode) {
    return (
        <ContextProvider onInitCompleted={ svc => { Object.assign(testSvc, svc); } }>
            { component }
        </ContextProvider>
    );
}
