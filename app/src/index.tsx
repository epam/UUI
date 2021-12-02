import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { GAListener, HistoryAdaptedRouter, StubAdaptedRouter, useUUIServices, UuiContext } from '@epam/uui';
import { Snackbar, Modals } from '@epam/uui-components';
import '@epam/internal/styles.css';
import { ErrorHandler , skinContext as promoSkinContext } from '@epam/promo';
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

const IS_PRODUCTION = /uui.epam.com/.test(location.hostname);
const AMP_CODE = IS_PRODUCTION ? '94e0dbdbd106e5b208a33e72b58a1345' : 'b2260a6d42a038e9f9e3863f67042cc1';
const GA_CODE = 'UA-132675234-1';

export const UuiEnhancedApp = () =>  {

    const router = !!history
        ? new HistoryAdaptedRouter(history)
        : new StubAdaptedRouter();

    const { services } = useUUIServices({
        apiDefinition: getApi,
        skinContext: promoSkinContext,
        router,
    });

    Object.assign(svc, services);

    useEffect(() => {
        const ampClient = new AmplitudeListener(AMP_CODE);
        const gaClient = new GAListener(GA_CODE);
        services.uuiAnalytics.addListener(ampClient);
        services.uuiAnalytics.addListener(gaClient);
    }, []);

    return (
        <UuiContext.Provider
            value={ services }
        >
            <ErrorHandler>
                <App />
                <Snackbar />
                <Modals />
            </ErrorHandler>
        </UuiContext.Provider>
    );

};

ReactDOM.render(<Router history={ history } >
    <UuiEnhancedApp />
</Router>, document.getElementById('root'));
