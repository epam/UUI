import { TabList } from '@epam/uui';
import { TDocConfig, TSkin } from '@epam/uui-docs';
import React from 'react';

import {
    BaseDocsBlock,
    DocExample,
    EditableDocContent,
} from '../common';

export class TableListDoc extends BaseDocsBlock {
    title = 'Tab List';

    static override config: TDocConfig = {
        name: 'TabList',
        bySkin: {
            [TSkin.UUI]: {
                type: '@epam/uui:TabListProps',
                component: TabList,
            },
        },
    };

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
