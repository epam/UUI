import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3 } from '../common';

export class SliderDoc extends BaseDocsBlock {
    title = 'Slider';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/Slider/docs/slider.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='slider-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/slider/Basic.example.tsx'
                />
            </>
        );
    }
}