import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { TextProps } from '@epam/uui-components';
import { TextMods, Text } from '@epam/loveship';
import {
    sizeDoc, fontDoc, textSettingsDoc, DefaultContext, ResizableContext, FormContext, ColorPicker,
} from '../../docs';
import { colors } from '../../docs/helpers/colorMap';

const textDoc = new DocBuilder<TextProps & TextMods>({ name: 'Text', component: Text })
    .implements([
        sizeDoc, textSettingsDoc, fontDoc,
    ])
    .prop('children', {
        examples: [
            { value: 'Hello World', isDefault: true }, {
                value: 'At EPAM, we believe that technology defines business success, and we relentscssly pursue the best solution for every client to solve where others fail.',
                name: 'long text',
            },
        ],
        type: 'string',
    })
    .prop('color', {
        examples: [
            'night50', 'night300', 'night400', 'night500', 'night600', 'night700', 'night800', 'night900',
        ],
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
    })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default textDoc;
