import { DocItem } from './_types/docItem';

export const VirtualListDocItem: DocItem = {
    id: 'virtualList',
    name: 'Virtual List',
    parentId: 'components',
    examples: [
        { descriptionPath: 'virtual-list-descriptions' },
        { name: 'Basic', componentPath: './_examples/virtualList/Basic.example.tsx' },
        { name: 'Scroll to index', componentPath: './_examples/virtualList/ScrollTo.example.tsx' },
        { name: 'Advanced', componentPath: './_examples/virtualList/Advanced.example.tsx' },
    ],
};
