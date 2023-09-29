import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TUuiTsDoc, UUI3,
} from '../common';

export class SliderDoc extends BaseDocsBlock {
    title = 'Slider';

    // TODO: no such component in "@epam/uui"
    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/uui-components:SliderBaseProps');

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
