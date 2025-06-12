import '@epam/uui-components/styles.css';
import '@epam/uui/styles.css';
import '@epam/assets/theme/theme_loveship.scss';
import './index.module.scss';

//
import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { createBrowserHistory } from "history";
import { Route, Router } from "react-router-dom";
import { DragGhost, HistoryAdaptedRouter, useUuiServices, UuiContext } from "@epam/uui-core";
import { ErrorHandler } from "@epam/uui";
import { Menu } from "./common/Menu";
import { Modals, Snackbar } from "@epam/uui-components";
import { svc } from "./services";

import { MainPage } from "./pages/MainPage";

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

function UuiEnhancedApp() {
    const { services } = useUuiServices({ router });
    Object.assign(svc, services);
    return (
        (<UuiContext value={ services }>
            <ErrorHandler>
                <Router history={history}>
                    <Route component={Menu} />
                    <Route path="/" component={MainPage} />
                </Router>
                <Snackbar />
                <Modals />
                <DragGhost />
            </ErrorHandler>
        </UuiContext>)
    );
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
