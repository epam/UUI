import * as React from 'react';
import DefaultTabListExample from './DefaultLayout.example';
import TabsWithLinksTabListExample from './TabsWithLinks.example';
import AdditionalElementsTabListExample from './AdditionalElements.example';

export const tabListExamples = [
    {
        name: 'Default',
        value: (
            <DefaultTabListExample />
        ),
        isDefault: true,
    },
    {
        name: 'Tabs with links',
        value: (
            <TabsWithLinksTabListExample />
        ),
    },
    {
        name: 'Additional elements',
        value: (
            <AdditionalElementsTabListExample />
        ),
    },
];
