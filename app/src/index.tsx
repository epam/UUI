import * as React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import {
    ApiCallOptions, ContextProvider, CommonContexts, UuiContexts,
} from '@epam/uui-core';
import { Snackbar, Modals } from '@epam/uui-components';
import { skinContext as promoSkinContext } from '@epam/promo';
import { AmplitudeListener } from './analyticsEvents';
import { svc } from './services';
import App from './App';
import { getApi, TApi } from './data';
import '@epam/internal/styles.css';
import '@epam/assets/theme/theme_vanilla_thunder.scss';
import './index.module.scss';
// this is a test!
const history = createBrowserHistory();
// __COMMIT_HASH__ & __PACKAGE_VERSION__ will be replaced to a real string by Webpack
(window as any).BUILD_INFO = { hash: __COMMIT_HASH__ };

export class UuiEnhancedApp extends React.Component {
    onInitCompleted = (context: CommonContexts<TApi, UuiContexts>, ampCode: string) => {
        Object.assign(svc, context);
        const listener = new AmplitudeListener(ampCode);
        context.uuiAnalytics.addListener(listener);
    };

    render() {
        const isProduction = /uui.epam.com/.test(window.location.hostname);
        const ampCode = isProduction ? '94e0dbdbd106e5b208a33e72b58a1345' : 'b2260a6d42a038e9f9e3863f67042cc1';

        return (
            <ContextProvider<TApi, UuiContexts>
                apiDefinition={ (processRequest) =>
                    getApi((url: string, method: string, data?: any, options?: ApiCallOptions) =>
                        processRequest(url, method, data, { fetchOptions: { credentials: undefined }, ...options })) }
                onInitCompleted={ (context) => this.onInitCompleted(context, ampCode) }
                history={ history }
                gaCode="UA-132675234-1"
                skinContext={ promoSkinContext }
            >
                <App />
                <Snackbar />
                <Modals />
            </ContextProvider>
        );
    }
}

render(
    <React.StrictMode>
        <Router history={ history }>
            <UuiEnhancedApp />
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);
