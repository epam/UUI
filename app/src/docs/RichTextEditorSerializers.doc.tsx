import { DocItem } from '../documents/structure';

export const RichTextEditorSerializersDocItem: DocItem = {
    id: 'rteSerializers',
    name: 'Serializers',
    parentId: 'richTextEditor',
    examples: [
        { name: 'MD format', componentPath: './_examples/richTextEditor/MdSerialization.example.tsx' },
        { name: 'HTML format', componentPath: './_examples/richTextEditor/HtmlSerialization.example.tsx' },
    ],
    order: 2,
    tags: ['RTE', 'RichTextEditor'],
};
