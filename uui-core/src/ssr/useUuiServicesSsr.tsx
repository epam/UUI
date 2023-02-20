import React, { useMemo } from 'react';
import { NextRouterAdapter } from '../services';
import type { IUseUuiServicesProps } from '../hooks';
import { useUuiServices } from '../hooks';

export interface IContextProviderSsrProps<TApi, TAppContext> extends IUseUuiServicesProps<TApi, TAppContext> {
    router: any;
}

/**
 * This hook creates UUI context compatible with Next.js
 *
 * @example
 * const { services } = useUuiServicesSsr({ ... });
 * <UuiContext.Provider value={ services }> ... </UuiContext.Provider>
 * // And then, use it in code like this:
 * const services = useUuiContext<TApi, AppContextType>();
 *
 * @param props
 */
export function useUuiServicesSsr<TApi, TAppContext>(props: IContextProviderSsrProps<TApi, TAppContext>) {
    const { router, ...restProps } = props;
    const nextRouterWithAdapter = useMemo(() => new NextRouterAdapter(router), [router]);
    const { services } = useUuiServices<TApi, TAppContext>({
        ...restProps,
        router: nextRouterWithAdapter,
    });
    return { services };
}
