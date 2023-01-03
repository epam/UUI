import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4, UUI } from '../common';

export class RadioInputDoc extends BaseDocsBlock {
    title = 'RadioInput';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/inputs/radioInput.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/inputs/radioInput.doc.ts',
            [UUI]: './app/src/docProps/uui/components/inputs/radioInput.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='radioInput-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/radioInput/Basic.example.tsx'
                />
                <DocExample
                    title='RadioInput Group'
                    path='./examples/radioInput/Group.example.tsx'
                />
            </>
        );
    }
}
