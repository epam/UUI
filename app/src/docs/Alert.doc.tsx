import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class AlertDoc extends BaseDocsBlock {
    title = 'Alert';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/overlays/alert.doc.tsx',
            [UUI4]: './epam-promo/components/overlays/docs/alert.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='alert-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/alert/Basic.example.tsx'
                />
            </>
        );
    }
}
