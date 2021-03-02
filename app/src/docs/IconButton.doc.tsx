import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3 } from '../common';

export class IconButtonDoc extends BaseDocsBlock {
    title = 'Icon Button';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/buttons/docs/iconButton.doc.ts',
            [UUI4]: './epam-promo/components/buttons/docs/iconButton.doc.tsx',
        };
    }


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='icon-button-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/iconButton/Basic.example.tsx'
                />
            </>
        );
    }
}