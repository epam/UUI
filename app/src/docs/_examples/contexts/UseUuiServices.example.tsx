// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
import { render } from 'react-dom';
import { UuiContext, HistoryAdaptedRouter, useUuiServices, DragGhost } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { skinContext, ErrorHandler } from '@epam/promo';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

function UuiEnhancedApp() {
    const { services } = useUuiServices({
        router,
        skinContext,
    });

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

render(<UuiEnhancedApp />, document.getElementById('root'));
