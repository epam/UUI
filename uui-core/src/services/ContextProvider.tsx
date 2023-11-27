import React, {
    createContext, useContext, useEffect, useState,
} from 'react';
import { IHasChildren } from '../types/props';
import { CommonContexts } from '../types/contexts';
import { HistoryAdaptedRouter, IHistory4, StubAdaptedRouter } from './routing';
import { DragGhost } from './dnd/DragGhost';
import { GAListener } from './analytics';
import { UuiServicesProps, useUuiServices } from '../hooks/useUuiServices';

export interface ContextProviderProps<TApi, TAppContext> extends UuiServicesProps<TApi>, IHasChildren {
    /** Callback to load the AppContext data. AppContext is used to load global data, before application mount */
    loadAppContext?: (api: TApi) => Promise<TAppContext>;
    /** Called when all contexts were initiated */
    onInitCompleted(svc: CommonContexts<TApi, TAppContext>): void;
    history?: IHistory4;
    gaCode?: string;
}

export const UuiContext = createContext({} as CommonContexts<any, any>);

export function ContextProvider<TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>) {
    const [isLoaded, setIsLoaded] = useState(false);
    const {
        loadAppContext, onInitCompleted, children: propsChildren, history, gaCode, ...restProps
    } = props;

    const router = !!history ? new HistoryAdaptedRouter(history) : new StubAdaptedRouter();

    const { services } = useUuiServices<TApi, TAppContext>({ ...restProps, router });
    services.history = history;

    useEffect(() => {
        const loadAppContextPromise = loadAppContext || (() => Promise.resolve({} as TAppContext));
        gaCode && services.uuiAnalytics.addListener(new GAListener(gaCode));
        loadAppContextPromise(services.api).then((appCtx) => {
            services.uuiApp = appCtx;
            onInitCompleted(services);
            setIsLoaded(true);
        });
    }, []);

    const children = isLoaded ? propsChildren : '';

    return (
        <UuiContext.Provider value={ services }>
            {children}
            <DragGhost />
        </UuiContext.Provider>
    );
}

export function useUuiContext<TApi = any, TAppContext = any>(): CommonContexts<TApi, TAppContext> {
    const context = useContext(UuiContext);
    if (!Object.keys(context).length) {
        throw new Error('useUuiContext must be called within UuiContextProvider');
    }
    return context;
}
