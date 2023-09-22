import * as React from 'react';
import { render } from 'react-dom';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import {
    Router6AdaptedRouter,
    useUuiServices,
    DragGhost,
    UuiContext,
    GAListener,
    IProcessRequest,
} from '@epam/uui-core';
import { Snackbar, Modals, PortalRoot } from '@epam/uui-components';
import { skinContext } from '@epam/promo';
import { AmplitudeListener } from './analyticsEvents';
import { svc } from './services';
import App from './App';
import { getApi, TApi } from './data';
import { useTheme } from './helpers/useTheme';
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

const GA_CODE = 'UA-132675234-1';
const isProduction = /uui.epam.com/.test(window.location.hostname);
const AMP_CODE = isProduction ? '94e0dbdbd106e5b208a33e72b58a1345' : 'b2260a6d42a038e9f9e3863f67042cc1';

function apiDefinition(processRequest: IProcessRequest) {
    return getApi({ processRequest, fetchOptions: { credentials: undefined } });
}

function UuiEnhancedApp() {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const appTheme = React.useRef('uui-theme-promo');
    const { toggleTheme } = useTheme(appTheme);

    const { services } = useUuiServices<TApi, { appTheme: React.MutableRefObject<string>, toggleTheme: (theme: string) => void }>(
        {
            apiDefinition,
            router,
            appContext: {
                appTheme, toggleTheme,
            },
            skinContext,
        });

    React.useEffect(() => {
        Object.assign(svc, services);
        services.uuiAnalytics.addListener(new GAListener(GA_CODE));
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
    render(
        <React.StrictMode>
            <UuiEnhancedApp />
        </React.StrictMode>,
        document.getElementById('root'),
    );
}

initApp();
