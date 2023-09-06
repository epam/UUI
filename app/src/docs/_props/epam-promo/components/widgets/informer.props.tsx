import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { InformerProps, Informer, InformerColors } from '@epam/promo';
import { DefaultContext } from '../../docs';

const colors = {
    blue: '#007BBD',
    green: '#65A300',
    red: '#DB3A1A',
    gray: '#E1E3EB',
    white: '#FFFFFF',
    amber: '#FFC000',
};

const informerDoc = new DocBuilder<InformerProps>({ name: 'Informer', component: Informer })
    .prop('color', {
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: [{ value: 'gray', isDefault: true }, ...InformerColors.slice(1)],
    })
    .prop('caption', {
        examples: [
            { value: '7', isDefault: true }, { value: '+15' }, { value: '$99.9' },
        ],
        type: 'string',
    })
    .prop('size', {
        examples: [
            '12', '18', '24',
        ],
        defaultValue: '24',
    })
    .withContexts(DefaultContext);

export default informerDoc;
