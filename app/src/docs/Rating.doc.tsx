import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class RatingDoc extends BaseDocsBlock {
    title = 'Rating';

    static override config: TDocConfig = {
        name: 'Rating',
        contexts: [TDocContext.Default, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:RatingProps', component: uui.Rating },
            [TSkin.Loveship]: { type: '@epam/uui:RatingProps', component: loveship.Rating },
            [TSkin.Promo]: { type: '@epam/uui:RatingProps', component: promo.Rating },
            [TSkin.Electric]: { type: '@epam/uui:RatingProps', component: electric.Rating },
        },
        doc: (doc: DocBuilder<uui.RatingProps>) => {
            doc.merge('Tooltip', { examples: [{ value: uui.Tooltip, name: 'Tooltip' }] });
            doc.merge('value', {
                editorType: 'MultiUnknownEditor',
                examples: [
                    0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
                ],
            });
            doc.merge('hint', { examples: [{ value: (rating) => `${rating} star(s)`, name: '(rating) => string' }] });
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
