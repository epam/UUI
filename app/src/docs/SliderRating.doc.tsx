import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3 } from '../common';

export class SliderRatingDoc extends BaseDocsBlock {
    title = 'SliderRating';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/sliderRating.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='sliderRating-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/sliderRating/Basic.example.tsx'
                />
            </>
        );
    }
}