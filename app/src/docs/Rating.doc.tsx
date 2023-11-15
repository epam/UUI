import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';

export class RatingDoc extends BaseDocsBlock {
    title = 'Rating';

    override config: TDocConfig = {
        name: 'Rating',
        bySkin: {
            [TSkin.UUI3_loveship]: {
                type: '@epam/loveship:RatingProps',
                component: loveship.Rating,
                doc: (doc: DocBuilder<loveship.RatingProps>) => {
                    doc.withContexts(loveshipDocs.FormContext);
                    doc.merge('Tooltip', { examples: [{ value: loveship.Tooltip, name: 'Tooltip', isDefault: true }], isRequired: true });
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/promo:RatingProps',
                component: promo.Rating,
                doc: (doc: DocBuilder<promo.RatingProps>) => {
                    doc.withContexts(promoDocs.FormContext);
                    doc.merge('Tooltip', { examples: [{ value: promo.Tooltip, name: 'Tooltip', isDefault: true }], isRequired: true });
                },
            },
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
