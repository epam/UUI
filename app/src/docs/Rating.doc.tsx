import * as React from 'react';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import * as uui from '@epam/uui';

export class RatingDoc extends BaseDocsBlock {
    title = 'Rating';

    static override config: TDocConfig = {
        name: 'Rating',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.Loveship]: { type: '@epam/loveship:RatingProps', component: loveship.Rating },
            [TSkin.Promo]: { type: '@epam/promo:RatingProps', component: promo.Rating },
        },
        doc: (doc: DocBuilder<promo.RatingProps | loveship.RatingProps>) => {
            doc.merge('Tooltip', { examples: [{ value: uui.Tooltip, name: 'Tooltip' }] });
            doc.merge('value', {
                editorType: 'MultiUnknownEditor',
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
