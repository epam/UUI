import { DocItem } from '../documents/structure';

export const FormDocItem: DocItem = {
    id: 'form',
    name: 'Form',
    parentId: 'components',
    examples: [
        { descriptionPath: 'form-descriptions' },
        { name: 'Basic', componentPath: './_examples/form/Basic.example.tsx' },
        { name: 'Complex validation', componentPath: './_examples/form/ComplexValidation.example.tsx' },
        { name: 'Handle successful or failed saves', componentPath: './_examples/form/HandleSuccessSaveAndError.example.tsx' },
        { name: 'Modal with Form', componentPath: './_examples/modals/ModalWithForm.example.tsx' },
        { name: 'Leave form with unsaved changes handling', componentPath: './_examples/form/FormLeaveHandling.example.tsx' },
        { name: 'Validation on change', componentPath: './_examples/form/FormValidateOnChange.example.tsx' },
        { name: 'Undo/redo and revert form', componentPath: './_examples/form/Advanced.example.tsx' },
        { name: 'Server-side validation', componentPath: './_examples/form/ServerValidation.example.tsx' },
        { name: 'Usage with class components', componentPath: './_examples/form/FormWIthClasses.example.tsx' },
    ],
};
