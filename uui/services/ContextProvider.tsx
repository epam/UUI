import React, { createContext, useContext, useEffect, useState } from "react";
import { CommonContexts, IHasChildren } from "../types";
import { LegacyContextProvider } from "./LegacyContextProvider";
import { HistoryAdaptedRouter, IHistory4, StubAdaptedRouter } from "./routing";
import { DragGhost } from "./dnd";
import { ISkin } from "./SkinContext";
import { useUUIServices } from "../hooks";
import { GAListener } from "./analytics";

export interface IServicesProps<TApi> {
    apiServerUrl?: string;
    apiDefinition?: (processRequest: (request: string, requestMethod: string) => any) => TApi;
    skinContext?: ISkin;
}

export interface ContextProviderProps<TApi, TAppContext> extends IServicesProps<TApi>, IHasChildren {
    loadAppContext?: (api: TApi) => Promise<TAppContext>;
    onInitCompleted(svc: CommonContexts<TApi, TAppContext>): void;
    enableLegacyContext?: boolean;
    history?: IHistory4;
    gaCode?: string;
}

export const UuiContext = createContext({} as CommonContexts<any, any>);

export const ContextProvider = <TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { loadAppContext, onInitCompleted, enableLegacyContext, children: propsChildren, history, gaCode, ...restProps } = props;

    const router = !!history
        ? new HistoryAdaptedRouter(history)
        : new StubAdaptedRouter();

    const { services } = useUUIServices<TApi, TAppContext>({...restProps, router});

    useEffect(() => {
        const loadAppContextPromise = loadAppContext || (() => Promise.resolve({} as TAppContext));
        gaCode && services.uuiAnalytics.addListener(new GAListener(gaCode));
        loadAppContextPromise(services.api).then(appCtx => {
            services.uuiApp = appCtx;
            onInitCompleted(services);
            setIsLoaded(true);
        });
    }, []);

    const children = isLoaded ? propsChildren : "";
    const isEnableLegacyContexts = enableLegacyContext ?? true;

    return (
        <UuiContext.Provider value={ services }>
            { isEnableLegacyContexts
                ? (
                    <LegacyContextProvider { ...props } uuiContexts={ services }>
                        { children }
                    </LegacyContextProvider>
                )
                : (
                    <>
                        { children }
                        <DragGhost/>
                    </>
                )
            }
        </UuiContext.Provider>
    );
};

export function useUuiContext<TApi = any, TAppContext = any>(): CommonContexts<TApi, TAppContext> {
    const context = useContext(UuiContext);
    if (!Object.keys(context).length) {
        throw new Error("useUuiContext must be called within UuiContextProvider");
    }
    return context;
}