import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { CountIndicatorProps, CountIndicator } from '@epam/promo';
import { DefaultContext } from '../../docs';

const colors = {
    blue: '#007BBD',
    green: '#65A300',
    red: '#DB3A1A',
    gray: '#E1E3EB',
    white: '#FFFFFF',
    amber: '#FFC000',
};

const CountIndicatorDoc = new DocBuilder<CountIndicatorProps>({ name: 'CountIndicator', component: CountIndicator })
    .prop('color', {
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: [{ value: 'gray', isDefault: true }, 'white', 'blue', 'green', 'amber', 'red'],
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

export default CountIndicatorDoc;
