// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { UuiContext, HistoryAdaptedRouter, useUuiServices, DragGhost, IProcessRequest } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import { createBrowserHistory } from 'history';
import { svc } from '../../../services';
import { Router } from 'react-router';

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

function getAppRootNode() {
    const root = document.getElementById('root');
    root.attachShadow({ mode: 'open' });

    const host = document.createElement('div');
    host.className = 'uui-theme-promo';
    root.shadowRoot!.appendChild(host);

    return host;
}

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

function UuiEnhancedApp({ container }: { container: HTMLElement }) {
    const shadowRootHost = useMemo(() => {
        const rootNode = container.getRootNode();
        return rootNode instanceof ShadowRoot ? rootNode : null;
    }, [container]);

    const [isLoaded, setIsLoaded] = React.useState(false);
    const { services } = useUuiServices<TApi, TAppContext>({
        apiDefinition,
        router,
        shadowRootHost, // you can provide shadow root here, if not provided, FocusLock will use document.activeElement as the active element.
    });

    React.useEffect(() => {
        Object.assign(svc, services);
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

const container = getAppRootNode();
const root = createRoot(container);
root.render(<UuiEnhancedApp container={ container } />);
