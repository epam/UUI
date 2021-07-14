import React from 'react';
import Example from "./Example";
import { render } from "react-dom";
import { skinContext as promoSkinContext } from "@epam/promo";
import { ContextProvider } from "@epam/uui";
import "@epam/uui-components/styles.css";
import "@epam/promo/styles.css";
import { svc } from "./services";

const rootElement = document.getElementById("root");

render(
    <ContextProvider
        onInitCompleted={(context) => Object.assign(svc, context)}
        skinContext={promoSkinContext}
    >
        <Example />
    </ContextProvider>,
    rootElement
);