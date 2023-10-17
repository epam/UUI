import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { StatusIndicator, StatusIndicatorProps, StatusIndicatorMods } from '@epam/promo';
import { colors } from '../../docs/helpers/colorMap';
import { DefaultContext, FormContext, ResizableContext } from '../../docs';

const statusIndicatorDoc = new DocBuilder<StatusIndicatorProps & StatusIndicatorMods>({ name: 'statusIndicator', component: StatusIndicator })
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: ['blue', 'green', 'amber', 'red', 'yellow', 'orange', 'fuchsia', 'purple', 'violet', 'cobalt', 'cyan', 'mint', 'white', 'gray60'],
    })
    .prop('fill', {
        examples: ['contrast', 'bright', 'outline'],
        defaultValue: 'contrast',
    })
    .prop('size', {
        examples: ['12', '18', '24'],
        defaultValue: '24',
    })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default statusIndicatorDoc;
