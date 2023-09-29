import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TUuiTsDoc, UUI3,
} from '../common';

export class SliderRatingDoc extends BaseDocsBlock {
    title = 'SliderRating';

    // TODO: no such component in "@epam/uui"
    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/loveship:SliderRatingProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/sliderRating.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="sliderRating-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/sliderRating/Basic.example.tsx" />
            </>
        );
    }
}
