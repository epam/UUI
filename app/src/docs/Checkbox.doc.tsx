import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4, UUI } from '../common';

export class CheckboxDoc extends BaseDocsBlock {
    title = 'Checkbox';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/inputs/checkbox.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/inputs/checkbox.doc.ts',
            [UUI]: './app/src/docProps/uui/components/inputs/checkbox.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='checkbox-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/checkbox/Basic.example.tsx'
                />
                <DocExample
                    title='Checkbox Group'
                    path='./examples/checkbox/Group.example.tsx'
                />
            </>
        );
    }
}
