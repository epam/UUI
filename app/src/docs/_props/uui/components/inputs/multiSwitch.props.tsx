import React from 'react';
import { ColorPicker, DocBuilder, isDisabledDoc } from '@epam/uui-docs';
import { MultiSwitch, MultiSwitchProps } from '@epam/uui';
import {
    DefaultContext, sizeDoc, iEditable,
} from '../../docs';

const multiSwitchDoc = new DocBuilder<MultiSwitchProps<any>>({ name: 'MultiSwitch', component: MultiSwitch })
    .implements([
        sizeDoc, iEditable, isDisabledDoc,
    ])
    .prop('items', {
        examples: [
            {
                name: 'Context Switch',
                value: [
                    { id: 1, caption: 'Form' }, { id: 2, caption: 'Default' }, { id: 3, caption: 'Resizable' },
                ],
                isDefault: true,
            }, {
                name: 'Toggle Switch',
                value: [{ id: 1, caption: 'On' }, { id: 2, caption: 'Off' }],
            },
        ],
        isRequired: true,
    })
    .prop('color', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i })) } { ...editable } />,
        examples: [
            'primary', 'secondary',
        ] })
    .withContexts(DefaultContext);

export default multiSwitchDoc;
