import { AnalyticsContext } from '../services/AnalyticsContext';
import { ApiContext, ApiContextProps } from '../services/ApiContext';
import { ErrorContext } from '../services/ErrorContext';
import { DndContext } from '../services/dnd/DndContext';
import { LayoutContext } from '../services/LayoutContext';
import { LockContext } from '../services/LockContext';
import { ModalContext } from '../services/ModalContext';
import { NotificationContext } from '../services/NotificationContext';
import { ApiCallOptions, CommonContexts, IProcessRequest, IRouterContext } from '../types';
import { UserSettingsContext } from '../services/UserSettingsContext';
import { useEffect, useState } from 'react';

export interface UuiServicesProps<TApi> extends ApiContextProps {
    /** Function to get the api definitions.
     * Usually, api definitions this is an object which contain object with all api requests of the app.
     * Then you can call this requests via 'uuiContext.api.myApi(myData)'
     * */
    apiDefinition?: (processRequest: IProcessRequest) => TApi;
}
export interface UseUuiServicesProps<TApi, TAppContext> extends UuiServicesProps<TApi> {
    /** AppContext value */
    appContext?: TAppContext;
    /** Instance of the router */
    router: IRouterContext;
    /** Shadow root host. If not provided, FocusLock will use document.activeElement as the active element. */
    shadowRootHost?: ShadowRoot;
}

function createServices<TApi, TAppContext>(props: UseUuiServicesProps<TApi, TAppContext>) {
    const {
        router, appContext, apiDefinition, apiReloginPath, apiServerUrl, apiPingPath, fetch, shadowRootHost,
    } = props;

    const uuiLayout = new LayoutContext();
    const uuiModals = new ModalContext(uuiLayout);
    const uuiNotifications = new NotificationContext(uuiLayout);
    const uuiAnalytics = new AnalyticsContext({ router });
    const uuiLocks = new LockContext(router);
    const uuiErrors = new ErrorContext(uuiAnalytics, uuiModals);
    const uuiApi = new ApiContext({ apiPingPath, apiReloginPath, apiServerUrl, fetch }, uuiAnalytics);

    const rawApi = apiDefinition ? apiDefinition(uuiApi.processRequest.bind(uuiApi)) : ({} as TApi);
    const withOptions = (options: ApiCallOptions) => apiDefinition((url, method, data, defaultOptions) =>
        uuiApi.processRequest(url, method, data, { ...defaultOptions, ...options }));
    const api = { ...rawApi, withOptions };

    const uuiUserSettings = new UserSettingsContext();
    const uuiDnD = new DndContext();
    const services: CommonContexts<TApi, TAppContext> = {
        uuiAnalytics,
        uuiErrors,
        uuiApi,
        api,
        uuiLayout,
        uuiNotifications,
        uuiModals,
        uuiUserSettings,
        uuiDnD,
        uuiRouter: router,
        uuiLocks,
        uuiApp: appContext || ({} as TAppContext),
        shadowRootHost,
    };
    return {
        services,
        destroyServices: () => {
            uuiAnalytics.destroyContext();
            uuiErrors.destroyContext();
            uuiApi.destroyContext();
            uuiLayout.destroyContext();
            uuiNotifications.destroyContext();
            uuiModals.destroyContext();
            uuiDnD.destroyContext();
            uuiLocks.destroyContext();
        },
        init: () => {
            uuiAnalytics.init();
            uuiErrors.init();
            uuiApi.init();
            uuiLayout.init();
            uuiNotifications.init();
            uuiModals.init();
            uuiDnD.init();
            uuiLocks.init();
        },
    };
}
export const useUuiServices = <TApi, TAppContext>(props: UseUuiServicesProps<TApi, TAppContext>) => {
    const [result] = useState(() => createServices<TApi, TAppContext>(props));

    // Workaround to discard all errors on navigation. Need to find a better way. YakovZh
    result.services.uuiErrors.discardError();
    result.services.uuiApi.reset();

    useEffect(() => {
        result.init();

        (window as any).UUI_VERSION = __PACKAGE_VERSION__; // it replaced with current uui version during build time

        return () => {
            result.destroyServices();
        };
    }, []);

    return { services: result.services };
};
