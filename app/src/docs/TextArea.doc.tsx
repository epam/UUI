import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class TextAreaDoc extends BaseDocsBlock {
    title = 'TextArea';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/textArea.doc.ts',
            [UUI4]: './epam-promo/components/inputs/docs/textArea.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='textArea-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/textArea/Basic.example.tsx'
                />
                <DocExample
                    title='Advanced'
                    path='./examples/textArea/Advanced.example.tsx'
                />
            </>
        );
    }
}