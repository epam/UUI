import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class LinkButtonDoc extends BaseDocsBlock {
    title = 'Link Button';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/buttons/docs/linkButton.doc.tsx',
            [UUI4]: './epam-promo/components/buttons/docs/linkButton.doc.ts',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='link-button-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/linkButton/Basic.example.tsx'
                />
            </>
        );
    }
}