import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class DropdownMenuDoc extends BaseDocsBlock {
    title = 'Dropdown';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/overlays/docs/dropdownMenu.doc.tsx',
            [UUI4]: './epam-promo/components/overlays/docs/dropdownMenu.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='dropdown-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/dropdownMenu/Basic.example.tsx'
                />
            </>
        );
    }
}