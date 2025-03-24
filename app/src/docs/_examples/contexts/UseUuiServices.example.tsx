// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
import { createRoot } from 'react-dom/client';
import React from 'react';
import { UuiContext, HistoryAdaptedRouter, useUuiServices, DragGhost } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

function UuiEnhancedApp() {
    const { services } = useUuiServices({ router });

    return (
        <UuiContext.Provider value={ services }>
            <ErrorHandler>
                <Router history={ history }>
                    Your App component
                </Router>
            </ErrorHandler>
            <Snackbar />
            <Modals />
            <DragGhost />
        </UuiContext.Provider>
    );
}
const root = createRoot(document.getElementById('root'));
root.render(<UuiEnhancedApp />);
