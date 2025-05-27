import type { DocItem } from '../../documents/structure';

export const DataSourcesUsageDocItem: DocItem = {
    id: 'dataSources-usage-in-components',
    name: 'Usage',
    parentId: 'dataSources',
    examples: [
        { descriptionPath: 'dataSources-usage-in-components' },
        { name: 'DataSourceViewer', componentPath: './_examples/dataSources/DataSourceViewer.code.example.tsx', onlyCode: true },
        { name: 'Custom hierarchical list', componentPath: './_examples/dataSources/CustomHierarchicalList.example.tsx', onlyCode: true },
    ],
};
