import '@epam/uui-components/styles.css';
import '@epam/uui/styles.css';
import '@epam/promo/styles.css';
import './index.module.scss';
//
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { DragGhost, HistoryAdaptedRouter, useUuiServices, UuiContext } from "@epam/uui-core";
import { apiDefinition, TApi } from "./data/apiDefinition";
import { loadAppContext, TAppContext } from "./data/appContext";
import { ErrorHandler } from "@epam/promo";
import { Modals, Snackbar } from "@epam/uui-components";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import { svc } from "./services";

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

function UuiEnhancedApp() {
    const [isLoaded, setIsLoaded] = useState(false);
    const { services } = useUuiServices<TApi, TAppContext>({ apiDefinition, router });

    useEffect(() => {
        loadAppContext(services.api).then((appCtx) => {
            services.uuiApp = appCtx;
            Object.assign(svc, services);
            setIsLoaded(true);
        });
    }, [services]);

    if (isLoaded) {
        return (
            <UuiContext.Provider value={ services }>
                <ErrorHandler>
                    <Router history={history}>
                        <App />
                    </Router>
                    <footer></footer>
                    <Snackbar />
                    <Modals />
                    <DragGhost />
                </ErrorHandler>
            </UuiContext.Provider>
        );
    }
    return null;
}


function initApp() {
    const root = createRoot(window.document.getElementById('root') as Element);
    root.render(
        <StrictMode>
            <UuiEnhancedApp />
        </StrictMode>
    );
}

initApp();
