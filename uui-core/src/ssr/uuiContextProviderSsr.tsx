import React, { ReactNode, useEffect, useState } from "react";
import { NextRouterAdapter, UuiContext } from "../services";
import type { IUseUuiServicesProps } from "../hooks";
import type { IAnalyticsListener } from "../types";
import { useUuiServices } from "../hooks";

type ClientRouterEventType = 'routeChangeComplete' | 'routeChangeError' | 'routeChangeStart';
type ClientRouterType = {
    events: {
        on: (e: ClientRouterEventType, handler: (...events: any[]) => void) => void;
        off: (e: ClientRouterEventType, handler: (...events: any[]) => void) => void;
    };
};
type ServerRouterType = {};

export interface IContextProviderSsrProps<TApi, TAppContext> {
    uuiServicesProps?: Omit<IUseUuiServicesProps<TApi, TAppContext>, 'router'>;
    onGetAnalyticsListeners?: () => IAnalyticsListener[];
    children: ({ isLoading }: { isLoading: boolean }) => ReactNode;
    nextRouter: ClientRouterType | ServerRouterType;
}

/**
 * This component creates uui context with UUI ssr-compatible services.
 * - sets "services.isSsr" flag to true. So that it's possible to change behavior of components in SSR mode.
 * - wraps uui router with adapter for next.js.
 * - provides possibility to subscribe to analytics events.
 *
 * @param props
 */
export function UuiContextProviderSsr<TApi, TAppContext>(props: IContextProviderSsrProps<TApi, TAppContext>) {
    const { nextRouter, onGetAnalyticsListeners, uuiServicesProps } = props;
    const [isLoading, setIsLoading] = useState(false);
    const routerEventsListeners = {
        routeChangeComplete: () => setIsLoading(false),
        routeChangeError: () => setIsLoading(false),
        routeChangeStart: () => setIsLoading(true),
    };
    const nextRouterWithAdapter = new NextRouterAdapter(nextRouter);
    const { services } = useUuiServices<TApi, TAppContext>({
        ...uuiServicesProps,
        router: nextRouterWithAdapter,
    });
    /**
     * This flag is true when the app is rendered by next.js
     * In such case, it remains true even on client side
     * (i.e. no matter whether the render is actually on server or it's already on client)
     */
    services.isSsr = true;

    useEffect(() => {
        onGetAnalyticsListeners?.().forEach(listener => {
            services.uuiAnalytics.addListener(listener);
        });
        const unsubscribeArr = Object.keys(routerEventsListeners).map((k) => {
            const e = k as ClientRouterEventType;
            const handler = routerEventsListeners[e];
            // it's safe to assume that it's client router, because "useEffect" is triggered only on client side.
            const nextRouterClient = nextRouter as ClientRouterType;
            nextRouterClient.events.on(e, handler);
            return () => {
                // unsubscribe
                nextRouterClient.events.off(e, handler);
            };
        });
        return () => {
            unsubscribeArr.forEach(fn => fn());
        };
    }, []);
    useEffect(() => {
        return () => {
            nextRouterWithAdapter.unSubscribe();
        };
    }, []);

    return (
        <UuiContext.Provider value={ services }>
            { props.children({ isLoading }) }
        </UuiContext.Provider>
    );
}
