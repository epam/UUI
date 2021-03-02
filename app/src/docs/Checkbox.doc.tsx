import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class CheckboxDoc extends BaseDocsBlock {
    title = 'Checkbox';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/inputs/docs/checkbox.doc.tsx',
            [UUI4]: './epam-promo/components/inputs/docs/checkbox.doc.ts',
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