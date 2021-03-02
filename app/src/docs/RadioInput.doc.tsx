import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class RadioInputDoc extends BaseDocsBlock {
    title = 'RadioInput';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/radioInput.doc.tsx',
            [UUI4]: './epam-promo/components/inputs/docs/radioInput.doc.ts',
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