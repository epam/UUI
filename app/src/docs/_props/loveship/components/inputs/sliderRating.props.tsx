import * as React from 'react';
import { DocBuilder, isReadonlyDoc, isDisabledDoc } from '@epam/uui-docs';
import { SliderRating, SliderRatingProps } from '@epam/loveship';
import { iEditable, DefaultContext, FormContext } from '../../docs';
import { RichTextView } from '@epam/loveship';

const SliderRatingDoc = new DocBuilder<SliderRatingProps<number>>({ name: 'SliderRating', component: SliderRating })
    .implements([
        iEditable, isReadonlyDoc, isDisabledDoc,
    ])
    .prop('value', {
        examples: [
            0, 1, 2, 3, 4, 5,
        ],
    })
    .prop('from', { examples: [1, 2] })
    .prop('withoutNa', { examples: [true] })
    .prop('size', { examples: ['18', '24'] })
    .prop('renderTooltip', {
        examples: [
            {
                name: 'Custom Tooltip',
                value: (v) => (
                    <RichTextView size="14">
                        <p>
                            Selected value is
                            {' '}
                            {v}
                            .
                            <br />
                            You can use
                            {' '}
                            <b>markup</b>
                            {' '}
                            via RichTextView here.
                        </p>
                    </RichTextView>
                ),
            },
        ],
    })
    .withContexts(DefaultContext, FormContext);

export default SliderRatingDoc;
