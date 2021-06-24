import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { ApiCallOptions, CommonContexts } from "../types";
import { ContextProviderProps, LegacyContextProvider } from "./LegacyContextProvider";
import { LayoutContext } from "./LayoutContext";
import { ModalContext } from "./ModalContext";
import { NotificationContext } from "./NotificationContext";
import { HistoryAdaptedRouter, StubAdaptedRouter } from "./routing";
import { AnalyticsContext } from "./AnalyticsContext";
import { LockContext } from "./LockContext";
import { ErrorContext } from "./ErrorContext";
import { ApiContext } from "./ApiContext";
import { UserSettingsContext } from "./UserSettingsContext";
import { DndContext, DragGhost } from "./dnd";
import { uuiSkin } from "./SkinContext";


export const UuiContext = createContext({} as CommonContexts<any, any>);

export const ContextProvider = <TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const uuiContexts = useRef<CommonContexts<TApi, TAppContext>>(getUuiContexts(props));

    useEffect(() => {
        const loadAppContext = props?.loadAppContext || (() => Promise.resolve({} as TAppContext));

        loadAppContext(uuiContexts.current.api).then(appCtx => {
            uuiContexts.current.uuiApp = appCtx;
            props.onInitCompleted(uuiContexts.current);
            setIsLoaded(true);
        });
    }, []);

    // Workaround to discard all errors on navigation. Need to find a better way. YakovZh
    (uuiContexts.current.uuiErrors as any).discardError();
    uuiContexts.current.uuiApi.reset();
    

    const children = isLoaded ? props.children : '';
    const enableLegacyContexts = props.enableLegacyContext ?? true;

    return (
        <UuiContext.Provider value={ uuiContexts.current }>
            { enableLegacyContexts
                ? (
                    <LegacyContextProvider { ...props } >
                        { children }
                        <DragGhost/>
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

export const useUuiContext = () => {
    const context = useContext(UuiContext);
    if (!Object.keys(context).length) {
        throw new Error("useUuiContext must be called within UuiContextProvider");
    }
    return context;
};

export function getUuiContexts<TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>) {
    const history = props.history;
    const uuiLayout = new LayoutContext();
    const uuiModals = new ModalContext(uuiLayout);

    const uuiNotifications = new NotificationContext(uuiLayout);

    const uuiRouter = !!history
        ? new HistoryAdaptedRouter(history)
        : new StubAdaptedRouter();

    const uuiAnalytics = new AnalyticsContext({
        gaCode: props.gaCode,
        ampCode: props.ampCode,
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