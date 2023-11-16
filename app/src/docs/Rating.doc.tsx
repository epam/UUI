import * as React from 'react';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class RatingDoc extends BaseDocsBlock {
    title = 'Rating';

    override config: TDocConfig = {
        name: 'Rating',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI3_loveship]: { type: '@epam/loveship:RatingProps', component: loveship.Rating },
            [TSkin.UUI4_promo]: { type: '@epam/promo:RatingProps', component: promo.Rating },
        },
        doc: (doc: DocBuilder<promo.RatingProps | loveship.RatingProps>) => {
            doc.merge('value', {
                renderEditor: 'MultiUnknownEditor',
                examples: [
                    0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="rating-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/rating/Basic.example.tsx" />
            </>
        );
    }
}
