import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class FileUploadDoc extends BaseDocsBlock {
    title = 'File Upload';


    renderContent() {
        return (
            <>
                <EditableDocContent fileName='file-upload-descriptions' />
                { this.renderSectionTitle('Examples') }
                <DocExample
                    title='File Upload'
                    path='./examples/fileUpload/FileUpload.example.tsx'
                />
            </>
        );
    }
}