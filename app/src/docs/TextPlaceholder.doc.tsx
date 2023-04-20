import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI,
} from '../common';

export class TextPlaceholderDoc extends BaseDocsBlock {
    title = 'TextPlaceholder';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/typography/textPlaceholder.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/typography/textPlaceholder.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/typography/textPlaceholder.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="textPlaceholder-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/textPlaceholder/Basic.example.tsx" />
            </>
        );
    }
}
