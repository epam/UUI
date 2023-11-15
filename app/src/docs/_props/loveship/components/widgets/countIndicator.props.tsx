import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { CountIndicatorProps, CountIndicator } from '@epam/loveship';
import { DefaultContext } from '../../docs';

const colors = {
    sky: '#009ECC',
    grass: '#67A300',
    fire: '#FF4242',
    gray: '#E1E3EB',
    white: '#FFFFFF',
    sun: '#FCAA00',
};

const countIndicatorDoc = new DocBuilder<CountIndicatorProps>({ name: 'CountIndicator', component: CountIndicator })
    .prop('color', {
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: [{ value: 'gray', isDefault: true }, 'white', 'sky', 'grass', 'sun', 'fire'],
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

export default countIndicatorDoc;
