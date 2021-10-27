import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ApiCallOptions, CommonContexts, IHasChildren } from "../types";
import { LegacyContextProvider } from "./LegacyContextProvider";
import { LayoutContext } from "./LayoutContext";
import { ModalContext } from "./ModalContext";
import { NotificationContext } from "./NotificationContext";
import { HistoryAdaptedRouter, IHistory4, StubAdaptedRouter } from "./routing";
import { AnalyticsContext } from "./AnalyticsContext";
import { LockContext } from "./LockContext";
import { ErrorContext } from "./ErrorContext";
import { ApiContext } from "./ApiContext";
import { UserSettingsContext } from "./UserSettingsContext";
import { DndContext, DragGhost } from "./dnd";
import { ISkin, uuiSkin } from "./SkinContext";

export interface ContextProviderProps<TApi, TAppContext> extends IHasChildren {
    apiServerUrl?: string;
    gaCode?: string;
    loadAppContext?: (api: TApi) => Promise<TAppContext>;
    apiDefinition?: (processRequest: (request: string, requestMethod: string) => any) => TApi;
    onInitCompleted(svc: CommonContexts<TApi, TAppContext>): void;
    history?: IHistory4;
    skinContext?: ISkin;
    enableLegacyContext?: boolean;
}

export const UuiContext = createContext({} as CommonContexts<any, any>);

export const ContextProvider = <TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const uuiContexts = useMemo<CommonContexts<TApi, TAppContext>>(() => getUuiContexts(props), []);

    useEffect(() => {
        const loadAppContext = props?.loadAppContext || (() => Promise.resolve({} as TAppContext));

        loadAppContext(uuiContexts.api).then(appCtx => {
            uuiContexts.uuiApp = appCtx;
            props.onInitCompleted(uuiContexts);
            setIsLoaded(true);
        });
    }, []);

    // Workaround to discard all errors on navigation. Need to find a better way. YakovZh
    (uuiContexts.uuiErrors as any).discardError();
    uuiContexts.uuiApi.reset();


    const children = isLoaded ? props.children : "";
    const enableLegacyContexts = props.enableLegacyContext ?? true;

    return (
        <UuiContext.Provider value={ uuiContexts }>
            { enableLegacyContexts
                ? (
                    <LegacyContextProvider { ...props } uuiContexts={ uuiContexts }>
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

export function getUuiContexts<TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>, router?: any) {
    const history = props.history;
    const uuiLayout = new LayoutContext();
    const uuiModals = new ModalContext(uuiLayout);

    const uuiNotifications = new NotificationContext(uuiLayout);

    const uuiRouter = !!router
        ? router
        : !!history
        ? new HistoryAdaptedRouter(history)
        : new StubAdaptedRouter();

    const uuiAnalytics = new AnalyticsContext({
        gaCode: props.gaCode,
        router: uuiRouter,
    });
    const uuiLocks = new LockContext(uuiRouter);
    const uuiErrors = new ErrorContext(uuiAnalytics, uuiModals);
    const uuiApi = new ApiContext(uuiErrors, props.apiServerUrl, uuiAnalytics);


    const rawApi = props?.apiDefinition ? props.apiDefinition(uuiApi.processRequest.bind(uuiApi)) : {} as TApi;
    const withOptions = (options: ApiCallOptions) => props.apiDefinition(
        (url: string, method: string, data?: any) => uuiApi.processRequest(url, method, data, options),
    );
    const api = { ...rawApi, withOptions };

    const uuiUserSettings = new UserSettingsContext();
    const uuiDnD = new DndContext();

    uuiSkin.setSkin(props.skinContext);

    return {
        history,
        uuiAnalytics,
        uuiErrors,
        uuiApi,
        api,
        uuiLayout,
        uuiNotifications,
        uuiModals,
        uuiUserSettings,
        uuiDnD,
        uuiRouter,
        uuiLocks,
        uuiApp: {} as TAppContext,
        uuiSkin: uuiSkin,
    };
}