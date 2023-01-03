import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI } from '../common';

export class TextPlaceholderDoc extends BaseDocsBlock {
    title = 'TextPlaceholder';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/typography/textPlaceholder.doc.tsx',
            [UUI4]: './epam-promo/components/typography/docs/textPlaceholder.doc.tsx',
            [UUI]: './uui/components/typography/docs/textPlaceholder.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='textPlaceholder-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/textPlaceholder/Basic.example.tsx'
                />
            </>
        );
    }
}
