import './index.scss';
//
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { ErrorHandler } from '@epam/promo';
import { Modals, Snackbar } from '@epam/uui-components';
import { ContextProvider } from '@epam/uui-core';

const history = createBrowserHistory();

const root = createRoot(window.document.getElementById('root') as Element);

const UuiEnhancedApp = () => (
    <ContextProvider onInitCompleted={() => {}} history={history}>
        <ErrorHandler>
            <App />
            <Snackbar />
            <Modals />
        </ErrorHandler>
    </ContextProvider>
);

root.render(
    <StrictMode>
        <Router history={history}>
            <UuiEnhancedApp />
        </Router>
    </StrictMode>
);
