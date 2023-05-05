import * as React from 'react';
import { createParagraphPlugin, ELEMENT_DEFAULT } from "@udecode/plate";

export const PARAGRAPH_TYPE = 'paragraph';
export const paragraphPlugin = () => {
    return createParagraphPlugin({
        overrideByKey: {
            [ELEMENT_DEFAULT]: {
                component: (props): JSX.Element => {
                    const { attributes, children } = props;

                    return <p { ...attributes }>{ children }</p>;
                },
                type: PARAGRAPH_TYPE,
            }
        }
    })
};