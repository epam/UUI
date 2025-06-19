import React from 'react';

import {
    BaseDocsBlock,
    DocExample,
    EditableDocContent,
} from '../common';

export class TableListDoc extends BaseDocsBlock {
    title = 'Tab List';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tab-list-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample
                    title="Horizontal layout"
                    path="./_examples/tabList/HorizontalLayout.example.tsx"
                />
                <DocExample
                    title="Vertical layout"
                    path="./_examples/tabList/VerticalLayout.example.tsx"
                />
                <DocExample
                    title="Tabs with links"
                    path="./_examples/tabList/TabsWithLinks.example.tsx"
                />
                <DocExample
                    title="Additional elements"
                    path="./_examples/tabList/AdditionalElements.example.tsx"
                />
            </>
        );
    }
}
