import React, { ComponentType, ReactElement, ReactNode } from "react";
import { mount } from "enzyme";
import { act as reactAct } from "react-dom/test-utils";
import renderer, { act as rendererAct } from "react-test-renderer";
import { ContextProvider } from "../services";
import { UuiContexts } from "../types";

export const delay = (ms: number = 1): Promise<void> => new Promise(resolve => {
    setTimeout(resolve, ms);
});

export const testSvc = {} as UuiContexts;

export const mountWithContextAsync = async (children: ReactNode, enableLegacyContext = false) => {
    const wrapper = mount(
        <ContextProvider
            onInitCompleted={ svc => {
                Object.assign(testSvc, svc);
            } }
            enableLegacyContext={ enableLegacyContext }
        >
            { children }
        </ContextProvider>,
    );

    await reactAct(delay);
    wrapper.update();

    return wrapper;
};

export const mountWrappedComponentAsync = async <TComponent extends ComponentType<TProps>, TProps>(Component: TComponent, props: TProps, enableLegacyContext = false) => {
    const renderComponent = (properties: TProps) => mount(
        React.createElement(
            (p: any) => (
                <ContextProvider
                    onInitCompleted={ svc => {
                        Object.assign(testSvc, svc);
                    } }
                    enableLegacyContext={ enableLegacyContext }
                >
                    <Component { ...p }/>
                </ContextProvider>
            ),
            properties,
        ),
    );
    const wrapper = renderComponent(props);

    await reactAct(delay);
    wrapper.update();

    return wrapper;
};

export const renderWithContextAsync = async (component: ReactElement, enableLegacyContext = false) => {
    const result = renderer.create(
        <ContextProvider
            onInitCompleted={ svc => {
                Object.assign(testSvc, svc);
            } }
            enableLegacyContext={ enableLegacyContext }
        >
            { component }
        </ContextProvider>,
    );

    await rendererAct(delay);
    return result.toJSON();
};