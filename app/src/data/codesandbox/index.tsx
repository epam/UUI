import React from 'react';
import { render } from "react-dom";
import { skinContext as promoSkinContext } from "@epam/promo";
import { ContextProvider } from "@epam/uui";
import { svc, getApi } from '@epam/uui-docs';
import "@epam/uui-components/styles.css";
import "@epam/promo/styles.css";
import Example from "./Example";

const rootElement = document.getElementById("root");

render(
    <ContextProvider
        apiDefinition={getApi}
        onInitCompleted={(context) => Object.assign(svc, context)}
        skinContext={promoSkinContext}
    >
        <Example />
    </ContextProvider>,
    rootElement
);