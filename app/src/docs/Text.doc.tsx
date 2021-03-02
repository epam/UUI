import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class TextDoc extends BaseDocsBlock {
    title = 'Text';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/typography/docs/text.doc.tsx',
            [UUI4]: './epam-promo/components/typography/docs/text.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='text-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/text/Basic.example.tsx'
                />
            </>
        );
    }
}