import { DocItem } from './_types/docItem';

export const ModalsDocItem: DocItem = {
    id: 'modals',
    name: 'Modals',
    parentId: 'components',
    examples: [
        { descriptionPath: 'modals-descriptions' },
        { name: 'Basic', componentPath: './_examples/modals/Basic.example.tsx' },
        { name: 'Modal with Form', componentPath: './_examples/modals/ModalWithForm.example.tsx' },
        { name: 'Disabling close on click outside modal and modal header cross', componentPath: './_examples/modals/DisableClickOutsideAndCross.example.tsx' },
    ],
};
