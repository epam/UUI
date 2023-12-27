import * as React from 'react';
import { render } from 'react-dom';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import { init as initApm } from '@elastic/apm-rum';
import {
    Router6AdaptedRouter, useUuiServices, DragGhost,
    UuiContext, GAListener, IProcessRequest,
} from '@epam/uui-core';
import { Snackbar, Modals, PortalRoot } from '@epam/uui-components';
import { AmplitudeListener } from './analyticsEvents';
import { svc } from './services';
import App from './App';
import { getApi, TApi, TAppContext } from './data';
import '@epam/internal/styles.css';
import '@epam/assets/theme/theme_vanilla_thunder.scss';
import '@epam/assets/theme/theme_loveship_dark.scss';
import '@epam/assets/theme/theme_electric.scss';
import './index.module.scss';
import christmasCss from './christmas.module.scss';

const router6 = createBrowserRouter([
    { path: '*', element: <App /> },
]);
const router = new Router6AdaptedRouter(router6);

// __COMMIT_HASH__ will be replaced to a real string by Webpack
(window as any).BUILD_INFO = { hash: __COMMIT_HASH__ };

const GA_CODE = 'G-Q5ZD7N55ML';
const isProduction = /uui.epam.com/.test(window.location.hostname);
const AMP_CODE = isProduction ? '94e0dbdbd106e5b208a33e72b58a1345' : 'b2260a6d42a038e9f9e3863f67042cc1';

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
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { services } = useUuiServices<TApi, TAppContext>({ apiDefinition, router });

    const renderSnow = () => {
        const snow = [];

        for (let index = 0; index < 300; index++) {
            snow.push(<div key={ `snow-${index}` } className={ christmasCss.christmasSnow } />);
        }

        return <div className={ christmasCss.christmasBox }>{ snow }</div>;
    };
    
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
                { renderSnow() }
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
