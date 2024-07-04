import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { init as initApm } from '@elastic/apm-rum';
import {
    Router6AdaptedRouter, useUuiServices, DragGhost,
    UuiContext, IProcessRequest, GAListener,
} from '@epam/uui-core';
import { Modals, PortalRoot } from '@epam/uui-components';
import { Snackbar } from '@epam/uui';
import { AmplitudeListener } from './analyticsEvents';
import { svc } from './services';
import App from './App';
import { getApi, TApi, TAppContext } from './data';
import { getAppRootNode } from './helpers/appRootUtils';
import '@epam/internal/styles.css';
import '@epam/assets/theme/theme_vanilla_thunder.scss';
import '@epam/assets/theme/theme_loveship_dark.scss';
import '@epam/assets/theme/theme_electric.scss';
import './index.module.scss';

const router6 = createBrowserRouter([
    { path: '*', element: <App /> },
]);
const router = new Router6AdaptedRouter(router6);

// __COMMIT_HASH__ will be replaced to a real string by Webpack
(window as any).BUILD_INFO = { hash: __COMMIT_HASH__ };

const GA_CODE = 'G-Q5ZD7N55ML';
const isProduction = /uui.epam.com/.test(window.location.hostname);
const AMP_CODE = isProduction ? '6b2f3cccc1fddd0d5e2bbee910bfdd26' : 'd64810d2ef792ba8917976d63b3e89d';

function apiDefinition(processRequest: IProcessRequest) {
    return getApi({ processRequest, fetchOptions: { credentials: undefined } });
}

const apm = initApm({
    serviceName: 'uui-ui',
    serverUrl: isProduction ? 'https://apm.app.epam.com' : 'https://apm-sandbox.cloudapp.epam.com/',
    serviceVersion: __COMMIT_HASH__,
    environment: isProduction ? 'prod' : 'qa',
    breakdownMetrics: true,
    transactionSampleRate: 0.2,
});
apm.addLabels({ project: 'epm-uui', service_type: 'ui' });

function UuiEnhancedApp() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { services } = useUuiServices<TApi, TAppContext>({
        apiDefinition,
        router,
        apiReloginPath: 'api/auth/login',
        apiPingPath: 'api/auth/ping',
    });

    useEffect(() => {
        Object.assign(svc, services);
        isProduction && services.uuiAnalytics.addListener(new GAListener(GA_CODE));
        services.uuiAnalytics.addListener(new AmplitudeListener(AMP_CODE));
        setIsLoaded(true);
    }, [services]);

    if (isLoaded) {
        return (
            <UuiContext.Provider value={ services }>
                <RouterProvider router={ router6 } />
                <Snackbar />
                <Modals />
                <DragGhost />
                <PortalRoot />
            </UuiContext.Provider>
        );
    }
    return null;
}

function initApp() {
    const rootNode = getAppRootNode();
    const root = createRoot(rootNode);
    root.render(
        <React.StrictMode>
            <UuiEnhancedApp />
        </React.StrictMode>,
    );
}

initApp();
