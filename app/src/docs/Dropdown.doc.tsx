import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3 } from '../common';

export class DropdownDoc extends BaseDocsBlock {
    title = 'Dropdown';

    getPropsDocPath() {
        return {
            [UUI3]: './loveship/components/overlays/docs/dropdown.doc.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='dropdown-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='Basic'
                    path='./examples/dropdown/Basic.example.tsx'
                />

                <DocExample
                    title='Dropdown Open/Close modifiers'
                    path='./examples/dropdown/CloseOpenModifiers.example.tsx'
                />

                <DocExample
                    title='Handle dropdown state by yourself'
                    path='./examples/dropdown/HandleStateByYourself.example.tsx'
                />
            </>
        );
    }
}