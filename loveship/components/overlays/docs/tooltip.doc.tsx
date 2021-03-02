import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { TooltipProps } from '@epam/uui-components';
import { Button, Tooltip, TooltipMods } from '../../../components';
import { DefaultContext } from '../../../docs';

const Sfc = (props: any) => <div ref={ props.ref }>123</div>;

const tooltipDoc = new DocBuilder<TooltipProps & TooltipMods>({ name: 'Tooltip', component: Tooltip })
    .prop('trigger', { examples: [{ value: 'hover', isDefault: true },  'click', 'press'] })
    .prop('content', { examples: [{ value: 'Some text', isDefault: true },
            {value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa', name: 'long text' }], type: 'string' })
    .prop('children', {
        examples: [{ value:<Button color="sky" size="36" caption="Button"/>, name: 'Blue button', isDefault: true }, { value: <Sfc>123</Sfc>, name: 'sfc' }],
    })
    .prop('placement', {
        examples: [
            'auto-start', 'auto', 'auto-end', 'top-start',
            { value: 'top', isDefault: true },
            'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start',
        ],
    })
    .prop('renderContent', { examples: [() => <div style={ { border: '1px dashed black' } }>Component</div>] })
    .prop('color', { examples: ['white', 'night900'] })
    .withContexts(DefaultContext);

export = tooltipDoc;