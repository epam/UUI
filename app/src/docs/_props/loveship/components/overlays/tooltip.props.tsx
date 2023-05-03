import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { TooltipProps } from '@epam/uui-components';
import { Button, Tooltip, TooltipMods } from '@epam/loveship';
import { DefaultContext } from '../../docs';

const tooltipDoc = new DocBuilder<TooltipProps & TooltipMods>({ name: 'Tooltip', component: Tooltip })
    .prop('content', {
        examples: [{ value: 'Some text', isDefault: true }, { value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa', name: 'long text' }],
        type: 'string',
    })
    .prop('children', {
        examples: [{ value: <Button color="sky" size="36" caption="Button" />, name: 'Blue button', isDefault: true }],
    })
    .prop('placement', {
        examples: [
            'auto-start', 'auto', 'auto-end', 'top-start', { value: 'top', isDefault: true }, 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start',
        ],
    })
    .prop('renderContent', { examples: [() => <div style={ { width: '80px', height: '32px', border: '1px dashed black' } }>Component</div>] })
    .prop('closeOnMouseLeave', { examples: [{ name: 'toggler', value: 'toggler', isDefault: true }, 'boundary'] })
    .prop('color', { examples: ['white', 'night800', 'fire'] })
    .prop('closeDelay', {
        examples: [
            { value: 0, isDefault: true }, { value: 500 }, { value: 1000 },
        ],
    })
    .prop('openDelay', {
        examples: [
            { value: 0, isDefault: true }, { value: 500 }, { value: 1000 },
        ],
    })
    .prop('onValueChange', { examples: (ctx) => [{ value: ctx.getChangeHandler('onValueChange'), name: '(newValue) => { ... }' }] })
    .prop('value', { examples: [true, false] })
    .withContexts(DefaultContext);

export default tooltipDoc;
