import { DocItem } from '../documents/structure';

export const RichTextEditorDocItem: DocItem = {
    id: 'rteOverview',
    name: 'Overview',
    parentId: 'richTextEditor',
    examples: [
        { componentPath: './_examples/richTextEditor/Basic.example.tsx' },
        { name: 'Inner scroll behavior', componentPath: './_examples/richTextEditor/WithInnerScroll.example.tsx' },
    ],
    order: 1,
    tags: ['RTE', 'RichTextEditor'],
};
