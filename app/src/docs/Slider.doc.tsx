import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3, UUI4, UUI } from '../common';

export class SliderDoc extends BaseDocsBlock {
    title = 'Slider';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui-components:SliderBaseProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/Slider/slider.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/slider.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/inputs/slider.props.ts',
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
