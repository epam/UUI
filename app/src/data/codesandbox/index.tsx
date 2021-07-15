import React from 'react';
import { render } from "react-dom";
import { skinContext as promoSkinContext } from "@epam/promo";
import { ContextProvider } from "@epam/uui";
import "@epam/uui-components/styles.css";
import "@epam/promo/styles.css";
import Example from "./Example";
import { svc, getApi } from './services';

const tApi = getApi(null);
type TApi = typeof tApi;

const rootElement = document.getElementById("root");

render(
    <ContextProvider<TApi, {}>
        apiDefinition={getApi}
        onInitCompleted={(context) => Object.assign(svc, context)}
        skinContext={promoSkinContext}
    >
        <Example />
    </ContextProvider>,
    rootElement
);