import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class ControlGroupDoc extends BaseDocsBlock {
    title = 'Control Group';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/layout/docs/controlGroup.doc.tsx',
            [UUI4]: './epam-promo/components/layout/docs/controlGroup.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='controlGroup-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/controlGroup/Basic.example.tsx'
                />
            </>
        );
    }
}