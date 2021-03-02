import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class CheckboxGroupDoc extends BaseDocsBlock {
    title = 'CheckboxGroup';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/layout/docs/checkboxGroup.doc.ts',
            [UUI4]: './epam-promo/components/layout/docs/checkboxGroup.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='checkboxGroup-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Checkbox Group'
                    path='./examples/checkbox/Group.example.tsx'
                />
            </>
        );
    }
}