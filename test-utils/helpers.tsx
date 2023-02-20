import React, { ComponentType, ReactElement, ReactNode } from 'react';
import { mount } from 'enzyme';
import { renderHook } from '@testing-library/react-hooks';
import { act as reactAct } from 'react-dom/test-utils';
import renderer, { act as rendererAct } from 'react-test-renderer';
import { ContextProvider, UuiContexts } from '@epam/uui-core';

export const delay = (ms: number = 1): Promise<void> =>
    new Promise(resolve => {
        setTimeout(resolve, ms);
    });

export const testSvc = {} as UuiContexts;

export async function mountHookWithContext<TProps, TResult>(hook: (props: TProps) => TResult, initialProps?: TProps) {
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
        <ContextProvider onInitCompleted={svc => Object.assign(testSvc, svc)}>{children}</ContextProvider>
    );

    const { waitForNextUpdate, rerender, ...rest } = renderHook<TProps, TResult>(hook, { wrapper, initialProps: initialProps });

    await waitForNextUpdate();

    return {
        rerender: (props: TProps) => rerender({ ...props, children: undefined }),
        waitForNextUpdate,
        ...rest,
    };
}

export const mountWithContextAsync = async (children: ReactNode, enableLegacyContext = false) => {
    const wrapper = mount(
        <ContextProvider
            onInitCompleted={svc => {
                Object.assign(testSvc, svc);
            }}
            enableLegacyContext={enableLegacyContext}
        >
            {children}
        </ContextProvider>
    );

    await reactAct(delay);
    wrapper.update();

    return wrapper;
};

export const mountWrappedComponentAsync = async <TComponent extends ComponentType<TProps>, TProps>(
    Component: TComponent,
    props: TProps,
    enableLegacyContext = false
) => {
    const renderComponent = (properties: TProps) =>
        mount(
            React.createElement(
                (p: any) => (
                    <ContextProvider
                        onInitCompleted={svc => {
                            Object.assign(testSvc, svc);
                        }}
                        enableLegacyContext={enableLegacyContext}
                    >
                        <Component {...p} />
                    </ContextProvider>
                ),
                properties
            )
        );
    const wrapper = renderComponent(props);

    await reactAct(delay);
    wrapper.update();

    return wrapper;
};

export const renderWithContextAsync = async (component: ReactElement, enableLegacyContext = false) => {
    const result = renderer.create(
        <ContextProvider
            onInitCompleted={svc => {
                Object.assign(testSvc, svc);
            }}
            enableLegacyContext={enableLegacyContext}
        >
            {component}
        </ContextProvider>
    );

    await rendererAct(delay);
    return result.toJSON();
};
//
// global = {
//     ...global,
//     delay,
//     testSvc,
//     mountWithContextAsync,
//     mountWrappedComponentAsync,
//     renderWithContextAsync,
// } as any;

// // @ts-ignore
// global.delay = delay;
// // @ts-ignore
// global.testSvc = testSvc;
// // @ts-ignore
// global.mountWithContextAsync = mountWithContextAsync;
// // @ts-ignore
// global.mountWrappedComponentAsync = mountWrappedComponentAsync;
// // @ts-ignore
// global.renderWithContextAsync = renderWithContextAsync;
