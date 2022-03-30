import * as React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { ApiCallOptions, ContextProvider, CommonContexts, UuiContexts } from '@epam/uui';
import { Snackbar, Modals } from '@epam/uui-components';
import { ErrorHandler } from '@epam/promo';
import { skinContext as promoSkinContext } from '@epam/promo';
import { AmplitudeListener } from "./analyticsEvents";
import { svc } from './services';
import App from './App';
import { getApi, TApi } from './data';
import qhistory from 'qhistory';
import '@epam/internal/styles.css';
import './index.scss';
import { stringify, parse } from 'query-string';
import { MicroFrontendWidgetExample } from './docs/examples/microfrontends/MicroFrontends.example';

const history = qhistory(
    createBrowserHistory(),
    stringify,
    parse,
);

export class AppWrapper extends React.Component {

    onInitCompleted = (context: CommonContexts<TApi, UuiContexts>, ampCode: string) => {
        Object.assign(svc, context);
        const listener = new AmplitudeListener(ampCode);
        context.uuiAnalytics.addListener(listener);
    }

    render() {
        const isProduction = /uui.epam.com/.test(location.hostname);
        const ampCode = isProduction ? '94e0dbdbd106e5b208a33e72b58a1345' : 'b2260a6d42a038e9f9e3863f67042cc1';

        return (
            <React.StrictMode>
                <Router history={ history }>
                    <ContextProvider<TApi, UuiContexts>
                        apiDefinition={ (processRequest) =>
                            getApi((url: string, method: string, data?: any, options?: ApiCallOptions) =>
                                processRequest(url, method, data, { fetchOptions: { credentials: undefined }, ...options  }))
                        }
                        onInitCompleted={ (context) => this.onInitCompleted(context, ampCode) }
                        history={ history }
                        gaCode='UA-132675234-1'
                        skinContext={ promoSkinContext }
                        enableLegacyContext={ false }
                    >
                        { this.props.children }
                        <Snackbar />
                        <Modals />
                    </ContextProvider>
                </Router>
            </React.StrictMode>
        );
    }
}

// TBD: change this to System export, or another better approach
const _exports = window as any;

// As UUI App exports Micro-Frontend widgets, we don't start app directly here. Instead we export 'startUuiApp' function, and call it in index.html
// Otherwise, loading the code for widget would cause the app to re-mount.
_exports.startUuiApp = () => {
    render(<AppWrapper><App/></AppWrapper>, document.getElementById('root'));
}

_exports.uuiDemoWidget = {
    mount: (node: HTMLElement, props: any) => {
        render(<AppWrapper><MicroFrontendWidgetExample { ...props }/></AppWrapper>, node)
    }
}