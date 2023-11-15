import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { TextMods, Text, allTextColors, TextProps } from '@epam/uui';
import {
    sizeDoc, textSettingsDoc, DefaultContext, // ResizableContext, FormContext, fontDoc,
} from '../../docs';

const textDoc = new DocBuilder<TextProps & TextMods>({ name: 'Text', component: Text })
    .implements([
        sizeDoc, textSettingsDoc, // fontDoc,
    ])
    .prop('children', {
        examples: [
            { value: 'Hello World', isDefault: true }, {
                value: 'At EPAM, we believe that technology defines business success, and we relentlessly pursue the best solution for every client to solve where others fail.',
                name: 'long text',
            },
        ],
        type: 'string',
    })
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i })) } { ...editable } />, examples: allTextColors })
    .withContexts(DefaultContext);// , ResizableContext, FormContext

export default textDoc;
