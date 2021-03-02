import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class RadioGroupDoc extends BaseDocsBlock {
    title = 'RadioGroup';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/layout/docs/radioGroup.doc.ts',
            [UUI4]: './epam-promo/components/layout/docs/radioGroup.doc.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='radioGroup-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='RadioInput Group'
                    path='./examples/radioInput/Group.example.tsx'
                />
            </>
        );
    }
}