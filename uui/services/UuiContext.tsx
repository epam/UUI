import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { ApiCallOptions, CommonContexts } from "../types";
import { ContextProviderProps } from "./ContextProvider";
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

const UuiContext = createContext({} as CommonContexts<any, any>);

export const UuiContextProvider = <TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>) => {
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

    //this.uuiContexts.uuiDnD.
    const children = isLoaded ? props.children : '';

    return (
        <UuiContext.Provider value={ uuiContexts.current }>
            { children }
            <DragGhost/>
        </UuiContext.Provider>
    );
};

export const useUuiContexts = () => {
    const context = useContext(UuiContext);
    if (!Object.keys(context).length) {
        throw new Error("useUuiContext must be called within UuiContextProvider");
    }
    return useContext(UuiContext);
};

function getUuiContexts<TApi, TAppContext>(props: ContextProviderProps<TApi, TAppContext>) {
    let history = props.history;
    let uuiLayout = new LayoutContext();
    let uuiModals = new ModalContext(uuiLayout);

    let uuiNotifications = new NotificationContext(uuiLayout);

    // let uuiRouter = context.uuiRouter; /* TBD: Deprecate legacy router */
    let uuiRouter = null; /* TBD: Deprecate legacy router */
    if (uuiRouter == null) {
        if (history != null) {
            uuiRouter = new HistoryAdaptedRouter(history);
        } else {
            uuiRouter = new StubAdaptedRouter();
        }
    }

    let uuiAnalytics = new AnalyticsContext({
        gaCode: props.gaCode,
        ampCode: props.ampCode,
        router: uuiRouter,
    });
    let uuiLocks = new LockContext(uuiRouter);
    let uuiErrors = new ErrorContext(uuiAnalytics, uuiModals);
    let uuiApi = new ApiContext(uuiErrors, props.apiServerUrl, uuiAnalytics);


    let rawApi = props?.apiDefinition ? props.apiDefinition(uuiApi.processRequest.bind(uuiApi)) : {} as TApi;
    let withOptions = (options: ApiCallOptions) => props.apiDefinition(
        (url: string, method: string, data?: any) => uuiApi.processRequest(url, method, data, options),
    );
    let api = { ...rawApi, withOptions };

    let uuiUserSettings = new UserSettingsContext();
    let uuiDnD = new DndContext();

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