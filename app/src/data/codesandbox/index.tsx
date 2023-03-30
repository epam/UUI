import React from 'react';
import { render } from "react-dom";
import { createBrowserHistory } from "history";
import { ErrorHandler, FlexRow, skinContext as promoSkinContext } from "@epam/promo";
import { ApiCallOptions, ContextProvider, UuiContexts } from "@epam/uui-core";
import { Modals, Snackbar } from "@epam/uui-components";
import "@epam/uui-components/styles.css";
import "@epam/promo/styles.css";
import "@epam/loveship/styles.css";
import Example from "./Example";
import { svc, getApi } from './api';

type TApi = ReturnType<typeof getApi>;

const rootElement = document.getElementById("root");
const origin = process.env.REACT_APP_PUBLIC_URL;

const history = createBrowserHistory();

render(
    <ContextProvider<TApi, UuiContexts>
        apiDefinition={ (processRequest) =>
            getApi((url: string, method: string, data?: any, options?: ApiCallOptions) =>
                processRequest(url, method, data, { fetchOptions: { credentials: undefined }, ...options  }),
                origin,
            )
        }
        onInitCompleted={ (context) => Object.assign(svc, context) }
        skinContext={ promoSkinContext }
        history={ history }
    >
        <ErrorHandler>
            <FlexRow vPadding='48' padding='24' borderBottom alignItems='top' spacing='12'>
                <Example />
            </FlexRow>
            <Snackbar />
            <Modals />
        </ErrorHandler>
    </ContextProvider>,
    rootElement,
);