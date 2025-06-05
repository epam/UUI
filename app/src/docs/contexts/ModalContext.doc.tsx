import { DocItem } from '../../documents/structure';

export const ModalContextDocItem: DocItem = {
    id: 'modalContext',
    name: 'Modal Context',
    parentId: 'contexts',
    examples: [
        { descriptionPath: 'modal-context-descriptions' },
        { name: 'Example', componentPath: './_examples/modals/Basic.example.tsx' },
    ],
    tags: ['contexts'],
};
