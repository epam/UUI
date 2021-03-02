import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class IconContainerDoc extends BaseDocsBlock {
    title = 'Icon Container';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/layout/docs/iconContainer.doc.tsx',
            [UUI4]: './epam-promo/components/layout/docs/iconContainer.doc.tsx',
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