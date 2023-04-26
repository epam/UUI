import React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class DropdownMenuDoc extends BaseDocsBlock {
    title = 'DropdownMenu';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dropdownMenu-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="DropdownMenu" path="./_examples/dropdownMenu/Basic.example.tsx" />
            </>
        );
    }
}
