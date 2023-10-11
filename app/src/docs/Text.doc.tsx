import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI, TDocsGenType,
} from '../common';

export class TextDoc extends BaseDocsBlock {
    title = 'Text';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:TextProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/typography/text.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/typography/text.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/typography/text.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="text-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/text/Basic.example.tsx" />
            </>
        );
    }
}
