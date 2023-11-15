import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { CountIndicatorProps, CountIndicator } from '@epam/uui';
import { DefaultContext } from '../../docs';

const countIndicatorDoc = new DocBuilder<CountIndicatorProps>({ name: 'CountIndicator', component: CountIndicator })
    .prop('color', {
        renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i })) } { ...editable } />,
        examples: [{ value: 'neutral', isDefault: true }, 'white', 'info', 'success', 'warning', 'critical'],
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
