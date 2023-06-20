import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI3,
} from '../common';

export class SliderDoc extends BaseDocsBlock {
    title = 'Slider';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/Slider/slider.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="slider-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/slider/Basic.example.tsx" />
            </>
        );
    }
}
