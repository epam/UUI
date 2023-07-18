import React, {
    createContext, useContext, useEffect, useState,
} from 'react';
import { CommonContexts, IHasChildren } from '../types';
import { IProcessRequest } from './index';
import { HistoryAdaptedRouter, IHistory4, StubAdaptedRouter } from './routing';
import { DragGhost } from './dnd';
import { ISkin } from './SkinContext';
import { useUuiServices } from '../hooks';
import { GAListener } from './analytics';

export interface ApiContextProps {
    apiReloginPath?: string;
    apiPingPath?: string;
    apiServerUrl?: string;
}

export interface IUuiServicesProps<TApi> extends ApiContextProps {
    apiDefinition?: (processRequest: IProcessRequest) => TApi;
    skinContext?: ISkin;
}

export interface ContextProviderProps<TApi, TAppContext> extends IUuiServicesProps<TApi>, IHasChildren {
    loadAppContext?: (api: TApi) => Promise<TAppContext>;
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
