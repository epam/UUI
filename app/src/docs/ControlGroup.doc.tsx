import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4 } from '../common';

export class ControlGroupDoc extends BaseDocsBlock {
    title = 'Control Group';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/layout/controlGroup.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/layout/controlGroup.doc.tsx',
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
