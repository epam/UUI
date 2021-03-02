import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class RatingDoc extends BaseDocsBlock {
    title = 'Rating';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/rating.doc.ts',
            [UUI4]: './epam-promo/components/inputs/docs/rating.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='rating-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/rating/Basic.example.tsx'
                />
            </>
        );
    }
}