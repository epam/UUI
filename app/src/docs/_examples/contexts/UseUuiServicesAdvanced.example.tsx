// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { UuiContext, HistoryAdaptedRouter, useUuiServices, DragGhost, GAListener, IProcessRequest } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import { createBrowserHistory } from 'history';
import { svc } from '../../../services';
import { Router } from 'react-router';

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

/**
 * API definition example
 */
type TApi = ReturnType<typeof apiDefinition>;
function apiDefinition(processRequest: IProcessRequest) {
    return {
        loadDataExample() {
            return processRequest('url goes here', 'GET');
        },
        loadAppContextData() {
            return processRequest('url goes here', 'GET');
        },
        // ... other api are defined here
    };
}

/**
 * APP context example
 */
type TAppContext = Awaited<ReturnType<typeof loadAppContext>>;
async function loadAppContext(api: TApi) {
    return await api.loadAppContextData();
}

function UuiEnhancedApp() {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { services } = useUuiServices<TApi, TAppContext>({
        apiDefinition,
        router,
    });

    React.useEffect(() => {
        Object.assign(svc, services);
        // listeners are added here
        services.uuiAnalytics.addListener(new GAListener(/** your Google Analytics id goes here */));
        // app context is loaded here
        loadAppContext().then((appCtx) => {
            services.uuiApp = appCtx;
            setIsLoaded(true);
        });
    }, [services]);

    if (isLoaded) {
        return (
            (
                <UuiContext value={ services }>
                    <ErrorHandler>
                        <Router history={ history }>
                            Your App component
                        </Router>
                    </ErrorHandler>
                    <Snackbar />
                    <Modals />
                    <DragGhost />
                </UuiContext>
            )
        );
    }
    return null;
}

const root = createRoot(document.getElementById('root'));
root.render(<UuiEnhancedApp />);
