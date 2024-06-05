import * as React from 'react';
import { ELEMENT_DEFAULT, PlatePlugin } from '@udecode/plate-common';
import { createParagraphPlugin } from '@udecode/plate-paragraph';
import { PARAGRAPH_TYPE } from './constants';

export const paragraphPlugin = (): PlatePlugin => {
    return createParagraphPlugin({
        type: PARAGRAPH_TYPE,
        overrideByKey: {
            [ELEMENT_DEFAULT]: {
                component: (props): JSX.Element => {
                    const { attributes, children } = props;

                    return <p { ...attributes }>{ children }</p>;
                },
                type: PARAGRAPH_TYPE,
            },
        },
    });
};
