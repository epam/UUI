import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class IconContainerDoc extends BaseDocsBlock {
    title = 'Icon Container';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docProps/loveship/components/layout/iconContainer.doc.tsx',
            [UUI4]: './app/src/docProps/epam-promo/components/layout/iconContainer.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='iconContainer-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/iconContainer/Basic.example.tsx'
                />
            </>
        );
    }
}
