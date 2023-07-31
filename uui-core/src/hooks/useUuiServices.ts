import {
    AnalyticsContext,
    ApiContext,
    DndContext,
    ErrorContext,
    IUuiServicesProps,
    LayoutContext,
    LockContext,
    ModalContext,
    NotificationContext,
    uuiSkin,
} from '../services';
import { ApiCallOptions, CommonContexts, IRouterContext } from '../types';
import { UserSettingsContext } from '../services/UserSettingsContext';
import { useEffect, useMemo } from 'react';

export interface IUseUuiServicesProps<TApi, TAppContext> extends IUuiServicesProps<TApi> {
    appContext?: TAppContext;
    router: IRouterContext;
}

type TCreateServicesReturnValue<TApi, TAppContext> = {
    services: CommonContexts<TApi, TAppContext>,
    destroyServices: () => void
};

function createServices<TApi, TAppContext>(props: IUseUuiServicesProps<TApi, TAppContext>): TCreateServicesReturnValue<TApi, TAppContext> {
    const {
        router, appContext, apiDefinition,
    } = props;

    const uuiLayout = new LayoutContext();
    const uuiModals = new ModalContext(uuiLayout);
    const uuiNotifications = new NotificationContext(uuiLayout);
    const uuiAnalytics = new AnalyticsContext({ router });
    const uuiLocks = new LockContext(router);
    const uuiErrors = new ErrorContext(uuiAnalytics, uuiModals);
    const uuiApi = new ApiContext(props, uuiAnalytics);

    const rawApi = apiDefinition ? apiDefinition(uuiApi.processRequest.bind(uuiApi)) : ({} as TApi);
    const withOptions = (options: ApiCallOptions) => apiDefinition((url, method, data) => uuiApi.processRequest(url, method, data, options));
    const api = { ...rawApi, withOptions };

    const uuiUserSettings = new UserSettingsContext();
    const uuiDnD = new DndContext();
    const services = {
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
        uuiSkin,
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
    };
}

export const useUuiServices = <TApi, TAppContext>(props: IUseUuiServicesProps<TApi, TAppContext>) => {
    const {
        router, appContext, skinContext, apiDefinition,
    } = props;

    uuiSkin.setSkin(skinContext);
    const { services, destroyServices } = useMemo(() => createServices({ router, appContext, apiDefinition }), []);
    // Workaround to discard all errors on navigation. Need to find a better way. YakovZh
    services.uuiErrors.discardError();
    services.uuiApi.reset();

    useEffect(() => {
        (window as any).UUI_VERSION = __PACKAGE_VERSION__; // it replaced with current uui version during build time
        return () => {
            destroyServices();
        };
    }, []);

    return { services };
};
