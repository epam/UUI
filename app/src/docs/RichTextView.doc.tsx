import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class RichTextViewDoc extends BaseDocsBlock {
    title = 'RichTextView';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/typography/docs/richTextView.doc.tsx',
            [UUI4]: './epam-promo/components/typography/docs/richTextView.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='richTextView-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/richTextView/Basic.example.tsx'
                />
            </>
        );
    }
}