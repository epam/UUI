import { DocItem } from './_types/docItem';

export const PickerModalDocItem: DocItem = {
    id: 'pickerModal',
    name: 'Picker Modal',
    parentId: 'components',
    examples: [
        { descriptionPath: 'pickerModal-descriptions' },
        { name: 'Basic', componentPath: './_examples/pickerModal/BasicPickerModal.example.tsx' },
        { name: 'Async tree with entity value type', componentPath: './_examples/pickerModal/AsyncTreePickerModalWithEntity.example.tsx' },
        { name: 'LazyTree', componentPath: './_examples/pickerModal/LazyTreePickerModal.example.tsx' },
    ],
    tags: ['PickerList'],
};
