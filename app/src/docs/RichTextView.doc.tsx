import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI, TDocsGenType } from '../common';
import cx from 'classnames';
import css from './styles.module.scss';

export class RichTextViewDoc extends BaseDocsBlock {
    title = 'RichTextView';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:RichTextViewProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/typography/richTextView.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/typography/richTextView.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/typography/richTextView.props.tsx',
        };
    }

    renderContent() {
        return (
            <span className={ cx(css.wrapper) }>
                <EditableDocContent fileName="richTextView-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/richTextView/Basic.example.tsx" />
            </span>
        );
    }
}
