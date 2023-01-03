import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class NumericInputDoc extends BaseDocsBlock {
    title = 'NumericInput';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/inputs/numericInput.doc.ts',
            [UUI4]: './app/src/docProps/epam-promo/components/inputs/numericInput.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='numericInput-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/numericInput/Basic.example.tsx'
                />
                <DocExample
                    title='Formatting options'
                    path='./examples/numericInput/Formatting.example.tsx'
                />
                <DocExample
                    title='Size'
                    path='./examples/numericInput/Size.example.tsx'
                />
            </>
        );
    }
}
