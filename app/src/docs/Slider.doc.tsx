import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3,
} from '../common';
import cx from 'classnames';
import css from './styles.module.scss';

export class SliderDoc extends BaseDocsBlock {
    title = 'Slider';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui-components:SliderBaseProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/Slider/slider.props.ts',
        };
    }

    renderContent() {
        return (
            <span className={ cx(css.wrapper, css.uuiThemePromo) }>
                <EditableDocContent fileName="slider-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/slider/Basic.example.tsx" />
            </span>
        );
    }
}
