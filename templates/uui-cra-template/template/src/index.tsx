import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ContextProvider } from '@epam/uui-core';
import { Snackbar, Modals } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import '@epam/uui-components/styles.css';
import '@epam/promo/styles.css';
import { App } from './App';
import { svc } from './services';


const history = createBrowserHistory();

const UuiEnhancedApp = () => (
    <ContextProvider
        onInitCompleted={ (context) => {
            Object.assign(svc, context);
        } }
        history={ history }
    >
        <ErrorHandler>
            <App />
            <Snackbar />
            <Modals />
        </ErrorHandler>
    </ContextProvider>
);

const RoutedApp = () => (
    <Router history={ history }>
        <UuiEnhancedApp />
    </Router>
);

ReactDOM.render(<RoutedApp />, document.getElementById('root'));