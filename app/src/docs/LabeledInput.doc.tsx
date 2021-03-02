import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class LabeledInputDoc extends BaseDocsBlock {
    title = 'Labeled Input';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/layout/docs/labeledInput.doc.tsx',
            [UUI4]: './epam-promo/components/layout/docs/labeledInput.doc.tsx',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='labeledInput-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/labeledInput/Basic.example.tsx'
                />
            </>
        );
    }
}