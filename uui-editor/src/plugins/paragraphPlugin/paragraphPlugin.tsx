import * as React from 'react';
import { ELEMENT_DEFAULT, PlateElement, PlatePlugin } from '@udecode/plate-common';
import { createParagraphPlugin } from '@udecode/plate-paragraph';
import { PARAGRAPH_TYPE } from './constants';

import type { JSX } from 'react';

export const paragraphPlugin = (): PlatePlugin => {
    return createParagraphPlugin({
        type: PARAGRAPH_TYPE,
        overrideByKey: {
            [ELEMENT_DEFAULT]: {
                component: (props): JSX.Element => (
                    <PlateElement as="p" { ...props } />
                ),
                type: PARAGRAPH_TYPE,
            },
        },
    });
};
