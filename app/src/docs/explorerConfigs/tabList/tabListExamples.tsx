import * as React from 'react';
import BasicTabListExample from './BasicLayout.example';
import TabsWithLinksTabListExample from './TabsWithLinks.example';
import AdditionalElementsTabListExample from './AdditionalElements.example';

export const tabListExamples = [
    {
        name: 'Basic',
        value: (
            <BasicTabListExample />
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
