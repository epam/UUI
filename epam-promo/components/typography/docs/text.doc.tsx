import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { TextProps } from '@epam/uui-components';
import { TextMods, Text } from '../Text';
import { sizeDoc, fontDoc, textSettingsDoc, DefaultContext, FormContext } from '../../../docs';
import { colors } from "../../../helpers/colorMap";

const textDoc = new DocBuilder<TextProps & TextMods>({ name: 'Text', component: Text })
    .implements([sizeDoc, textSettingsDoc, fontDoc] as any)
    .prop('children', {
        examples: [
            { value: 'Hello World', isDefault: true },
            {
                value: 'At EPAM, we believe that technology defines business success, and we relentlessly pursue the best solution for every client to solve where others fail.',
                name: 'long text',
            },
        ], type: 'string'})
    .prop('color', {
        examples: ['gray5', 'gray60', 'gray80', 'gray90'],
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />,
    })
    .withContexts(DefaultContext, FormContext);

export = textDoc;