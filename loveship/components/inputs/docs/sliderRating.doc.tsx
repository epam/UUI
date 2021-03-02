import * as React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { SliderRating, SliderRatingProps } from '../SliderRating';
import { iEditable, DefaultContext, FormContext, GridContext } from '../../../docs';
import { RichTextView } from '../../typography';

const SliderRatingDoc = new DocBuilder<SliderRatingProps<number>>({ name: 'SliderRating', component: SliderRating })
    .implements([iEditable, isReadonlyDoc] as any)
    .prop('value', { examples: [0, 1, 2, 3, 4, 5] })
    .prop('from', { examples: [1, 2] })
    .prop('withoutNa', { examples: [true] })
    .prop('size', {examples: ['18', '24']})
    .prop('renderTooltip', { examples: [
        {
            name: 'Custom Tooltip',
            value: (v: number) => <RichTextView theme='dark' size='14'>
                <p>Selected value is { v }.<br/>
                You can use <b>markup</b> via RichTextView here.
                </p>
            </RichTextView>,
        },
    ]})
    .withContexts(DefaultContext, FormContext, GridContext);

export = SliderRatingDoc;