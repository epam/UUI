import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { ContextProvider } from '@epam/uui';
import { Snackbar, Modals } from '@epam/uui-components';
import '@epam/internal/styles.css';
import { ErrorHandler } from '@epam/loveship';
import { skinContext as promoSkinContext } from '@epam/promo';
import { AmplitudeListener } from "./analyticsEvents";
import { svc } from './services';
import './index.scss';
import App from './App';
import { getApi } from './data';
import qhistory from 'qhistory';

import { stringify, parse } from 'query-string';

const history = qhistory(
    createBrowserHistory(),
    stringify,
    parse,
);

export class UuiEnhancedApp extends React.Component {

    onInitCompleted = (context: any, ampCode: string) => {
        Object.assign(svc, context);
        const listener = new AmplitudeListener(ampCode);
        context.uuiAnalytics.addListener(listener);
    };

    render() {
        const isProduction = /uui.epam.com/.test(location.hostname);
        const ampCode = isProduction ? '94e0dbdbd106e5b208a33e72b58a1345' : 'b2260a6d42a038e9f9e3863f67042cc1';

        return (
            <ContextProvider
                apiDefinition={ getApi }
                onInitCompleted={ (context) => this.onInitCompleted(context, ampCode) }
                history={ history }
                gaCode='UA-132675234-1'
                skinContext={ promoSkinContext }
                enableLegacyContext={ false }
            >
                <ErrorHandler>
                    <App />
                    <Snackbar />
                    <Modals />
                </ErrorHandler>
            </ContextProvider>
        );
    }
}

ReactDOM.render(<Router history={ history } >
    <UuiEnhancedApp />
</Router>, document.getElementById('root'));
