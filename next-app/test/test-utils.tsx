import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from 'react';
import uuiAppData from '../demoData/uuiAppData.json';
import { UuiContext } from "@epam/uui";
import { useServices } from "../hooks/useServices";

type ProviderProps = {
    children: ReactElement<any, any> | null;
};

let mockEntries: any[] = [{
    isIntersecting: true,
    boundingClientRect: { x: 10, y: 20, width: 30, height: 40 },
}];
const observeFn = jest.fn();
const unobserveFn = jest.fn();
const disconnect = jest.fn();

class IntersectionObserverMock {
    constructor(fn: any) {
        fn(mockEntries, this);
    }

    observe() { observeFn(); }
    unobserve() { unobserveFn(); }
    disconnect() { disconnect(); }
}

if (typeof window !== 'undefined') {
    (window as any).IntersectionObserver = IntersectionObserverMock;
}

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: "",
            asPath: "",
            basePath: "",
            push: () => jest.fn(),
            events: {
                on: () => jest.fn(),
                off: () => jest.fn(),
            },
        };
    },
}));

const Providers = ({ children }: ProviderProps) => {
    const { services } = useServices({ appData: uuiAppData });
    return <UuiContext.Provider value={ services }>{ children }</UuiContext.Provider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { customRender as render };