import { IRouterContext } from '@epam/uui-core';
import { useEffect, useState } from 'react';

type ClientRouterEventType = 'routeChangeComplete' | 'routeChangeError' | 'routeChangeStart';
interface ClientRouterType extends IRouterContext {
    events: {
        on: (e: ClientRouterEventType, handler: (...events: any[]) => void) => void;
        off: (e: ClientRouterEventType, handler: (...events: any[]) => void) => void;
    };
}
export function useIsChangingRoute(nextRouter: any) {
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
            unsubscribeArr.forEach((fn) => fn());
        };
    }, [nextRouter]);
    return { isChangingRoute };
}
