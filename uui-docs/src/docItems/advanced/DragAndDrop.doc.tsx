import { DocItem } from '../_types/docItem';

export const DragAndDropDocItem: DocItem = {
    id: 'dnd',
    name: 'Drag and Drop',
    parentId: 'advanced',
    examples: [
        { descriptionPath: 'DragAndDrop-intro' },
        { name: 'Basic', componentPath: './_examples/dnd/Basic.example.tsx' },
        { descriptionPath: 'DragAndDrop-stateManagement' },
    ],
};
