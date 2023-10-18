import * as React from 'react';
import { ColorPicker, DocBuilder } from '@epam/uui-docs';
import { StatusIndicator, StatusIndicatorProps, StatusIndicatorMods } from '@epam/loveship';
import { colors } from '../../docs/helpers/colorMap';
import { DefaultContext, FormContext, ResizableContext } from '../../docs';

const statusIndicatorDoc = new DocBuilder<StatusIndicatorProps & StatusIndicatorMods>({ name: 'statusIndicator', component: StatusIndicator })
    .prop('color', {
        renderEditor: (editable, examples) => <ColorPicker colors={ examples.map((i) => ({ value: i, hex: colors[i] })) } { ...editable } />,
        examples: ['sky', 'grass', 'sun', 'fire', 'yellow', 'orange', 'fuchsia', 'purple', 'violet', 'cobalt', 'cyan', 'mint', 'white', 'night600'],
    })
    .prop('fill', {
        examples: ['solid', 'outline'],
        defaultValue: 'solid',
    })
    .prop('size', {
        examples: ['12', '18', '24'],
        defaultValue: '24',
    })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default statusIndicatorDoc;
