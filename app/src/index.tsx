import * as React from 'react';
import { render } from 'react-dom';
import { RouterProvider, UNSAFE_DataRouterContext as DataRouterContext } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import {
    ApiCallOptions,
    UuiContexts,
    Router6AdaptedRouter,
    useUuiServices,
    DragGhost,
    UuiContext, GAListener, IProcessRequest,
} from '@epam/uui-core';
import { Snackbar, Modals } from '@epam/uui-components';
import { skinContext } from '@epam/promo';
import { AmplitudeListener } from './analyticsEvents';
import { svc } from './services';
import App from './App';
import { getApi, TApi } from './data';
import '@epam/internal/styles.css';
import '@epam/assets/theme/theme_vanilla_thunder.scss';
import './index.module.scss';
import { useEffect } from 'react';

// __COMMIT_HASH__ will be replaced to a real string by Webpack
(window as any).BUILD_INFO = { hash: __COMMIT_HASH__ };

const GA_CODE = 'UA-132675234-1';
const isProduction = /uui.epam.com/.test(window.location.hostname);
const AMP_CODE = isProduction ? '94e0dbdbd106e5b208a33e72b58a1345' : 'b2260a6d42a038e9f9e3863f67042cc1';

function apiDefinition(processRequest: IProcessRequest) {
    return getApi(
        (url: string, method: string, data?: any, options?: ApiCallOptions) => {
            return processRequest(url, method, data, { fetchOptions: { credentials: undefined }, ...options });
        },
    );
}

function UuiEnhancedApp() {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const reactRouter6Context = React.useContext(DataRouterContext);
    const router = React.useMemo(() => new Router6AdaptedRouter(reactRouter6Context.router), [reactRouter6Context.router]);
    //
    const { services } = useUuiServices<TApi, UuiContexts>({
        apiDefinition,
        router,
        skinContext,
    });

    useEffect(() => {
        services.uuiAnalytics.addListener(new GAListener(GA_CODE));
        services.uuiAnalytics.addListener(new AmplitudeListener(AMP_CODE));
        Object.assign(svc, services);
        setIsLoaded(true);
    }, [services]);

    if (isLoaded) {
        return (
            <UuiContext.Provider value={ services }>
                <App />
                <Snackbar />
                <Modals />
                <DragGhost />
            </UuiContext.Provider>
        );
    }
    return null;
}

function initApp() {
    const router = createBrowserRouter([
        { path: '*', element: <UuiEnhancedApp /> },
    ]);

    render(
        <React.StrictMode>
            <RouterProvider router={ router } />
        </React.StrictMode>,
        document.getElementById('root'),
    );
}

initApp();
