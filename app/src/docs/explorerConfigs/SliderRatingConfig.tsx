import * as React from 'react';
import * as loveship from '@epam/loveship';
import * as uui from '@epam/uui';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';

export const SliderRatingConfig: TDocConfig = {
    id: 'sliderRating',
    name: 'SliderRating',
    contexts: [TDocContext.Default, TDocContext.Form],
    bySkin: {
        [TSkin.Loveship]: {
            type: '@epam/loveship:SliderRatingProps',
            component: loveship.SliderRating,
            doc: (doc: DocBuilder<loveship.SliderRatingProps<any>>) => {
                const renderFn = (v: any) => (
                    <uui.RichTextView size="14">
                        <p>
                            {`Selected value is ${v}.`}
                            <br />
                            {'You can use '}
                            <b>markup</b>
                            { ' via RichTextView here.'}
                        </p>
                    </uui.RichTextView>
                );
                doc.merge('renderTooltip', { examples: [{ name: 'Custom Tooltip', value: renderFn }] });
                doc.merge('value', { examples: [0, 1, 2, 3, 4, 5] });
            },
        },
    },
};
