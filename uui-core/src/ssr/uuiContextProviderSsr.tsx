import React, { ReactNode, useEffect, useState } from "react";
import { NextRouterAdapter, UuiContext } from "../services";
import type { IUseUuiServicesProps } from "../hooks";
import { useUuiServices } from "../hooks";
import { IRouterContext } from "../types";

type ClientRouterEventType = 'routeChangeComplete' | 'routeChangeError' | 'routeChangeStart';
interface ClientRouterType extends IRouterContext {
    events: {
        on: (e: ClientRouterEventType, handler: (...events: any[]) => void) => void;
        off: (e: ClientRouterEventType, handler: (...events: any[]) => void) => void;
    };
}

export interface IContextProviderSsrProps<TApi, TAppContext> extends IUseUuiServicesProps<TApi, TAppContext> {
    children: ({ isChangingRoute }: { isChangingRoute: boolean }) => ReactNode;
    router: any;
}

/**
 * This component creates UUI context compatible with Next.js app.
 * - sets "isNextJsApp" flag to true in the UUI context.
 * - wraps router with adapter for Next.js.
 * - provides isChangingRoute flag OOTB.
 *
 * @param props
 */
export function UuiContextProviderSsr<TApi, TAppContext>(props: IContextProviderSsrProps<TApi, TAppContext>) {
    const { router, ...restProps } = props;
    const { isChangingRoute } = useIsChangingRoute(router);
    const nextRouterWithAdapter = new NextRouterAdapter(router);
    const { services } = useUuiServices<TApi, TAppContext>({
        ...restProps,
        router: nextRouterWithAdapter,
    });
    /**
     * This flag is true when the app is rendered by next.js
     * In such case, it remains true even on client side
     * (i.e. no matter whether the render is in progress: on server or it's already on client)
     */
    services.isNextJsApp = true;

    return (
        <UuiContext.Provider value={ services }>
            { props.children({ isChangingRoute }) }
        </UuiContext.Provider>
    );
}

function useIsChangingRoute(nextRouter: IRouterContext) {
    const [isChangingRoute, setIsChangingRoute] = useState(false);
    useEffect(() => {
        const routerEventsListeners = {
            routeChangeComplete: () => setIsChangingRoute(false),
            routeChangeError: () => setIsChangingRoute(false),
            routeChangeStart: () => setIsChangingRoute(true),
        };
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
    }, [nextRouter]);
    return { isChangingRoute };
}
