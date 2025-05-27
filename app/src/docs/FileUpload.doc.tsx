import { DocItem } from '../documents/structure';

export const FileUploadDocItem: DocItem = {
    id: 'fileUpload',
    name: 'File Upload',
    parentId: 'components',
    examples: [
        { descriptionPath: 'file-upload-descriptions' },
        { name: 'File Upload', componentPath: './_examples/fileUpload/FileUpload.example.tsx' },
        { name: 'With custom infoText', componentPath: './_examples/fileUpload/FileUploadCustomInfoText.example.tsx' },
    ],
};
