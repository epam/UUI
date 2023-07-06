import { ELEMENT_DEFAULT } from '@udecode/plate-core';
import { createParagraphPlugin } from '@udecode/plate-paragraph';
import * as React from 'react';

export const PARAGRAPH_TYPE = 'paragraph';
export const paragraphPlugin = () => {
    return createParagraphPlugin({
        type: PARAGRAPH_TYPE,
        overrideByKey: {
            [ELEMENT_DEFAULT]: {
                component: (props): JSX.Element => {
                    const { attributes, children } = props;

                    return <p { ...attributes }>{ children }</p>;
                },
                type: PARAGRAPH_TYPE,
            }
        },
    })
};