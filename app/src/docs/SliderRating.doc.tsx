import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3,
} from '../common';
import cx from 'classnames';
import css from './styles.module.scss';

export class SliderRatingDoc extends BaseDocsBlock {
    title = 'SliderRating';

    override getDocsGenType = (): TDocsGenType => ('@epam/loveship:SliderRatingProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/sliderRating.props.tsx',
        };
    }

    renderContent() {
        return (
            <span className={ cx(css.wrapper, css.uuiThemePromo) }>
                <EditableDocContent fileName="sliderRating-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/sliderRating/Basic.example.tsx" />
            </span>
        );
    }
}
