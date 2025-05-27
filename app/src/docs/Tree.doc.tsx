import { DocItem } from '../documents/structure';

export const TreeDocItem: DocItem = {
    id: 'tree',
    name: 'Tree',
    parentId: 'components',
    examples: [
        { descriptionPath: 'tree-descriptions' },
        { name: 'Basic', componentPath: './_examples/dataSources/CustomHierarchicalList.example.tsx' },
    ],
    tags: ['tree', 'virtualList', 'dataSources'],
};
