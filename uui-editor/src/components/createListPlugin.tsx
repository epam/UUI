import React from "react";

import {
    ELEMENT_OL,
    ELEMENT_UL,
    ELEMENT_LI,
} from "@udecode/plate";

export const ELEMENT_UL_CUSTOM = 'unordered-list';
export const ELEMENT_OL_CUSTOM = 'ordered-list';
export const ELEMENT_LI_CUSTOM = 'list-item';
export const ELEMENT_LI_TEXT_CUSTOM = 'list-item-child';

export const UUIListPlugin = (props: any) => {
    const { attributes, children, element } = props;

    switch (element.type) {
        case ELEMENT_OL_CUSTOM:
            return <ol { ...attributes }>{ children }</ol>;
        case ELEMENT_UL_CUSTOM:
            return <ul { ...attributes }>{ children }</ul>;
        case ELEMENT_LI_CUSTOM:
            return <li className={ element.type } { ...attributes }>{ children }</li>;
        case ELEMENT_LI_TEXT_CUSTOM:
            return <div { ...attributes }>{ children }</div>;
        default:
            return <div { ...attributes }>{ children }</div>;
    }
};

/**
 * Enables support for bulleted, numbered and to-do lists.
 */
export const listPluginOptions = {
    overrideByKey: {
        [ELEMENT_OL]: {
            type: ELEMENT_OL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'OL' }] },
            component: UUIListPlugin,
        },
        [ELEMENT_UL]: {
            type: ELEMENT_UL_CUSTOM,
            isElement: true,
            deserializeHtml: { rules: [{ validNodeName: 'UL' }] },
            component: UUIListPlugin,
        },
        [ELEMENT_LI]: {
            type: ELEMENT_LI_CUSTOM,
            isElement: true,
            component: UUIListPlugin,
        },
    },
    plugins: [
        {
            key: ELEMENT_LI_TEXT_CUSTOM,
            type: ELEMENT_LI_TEXT_CUSTOM,
            isElement: true,
            component: UUIListPlugin,
        },
    ],
}
