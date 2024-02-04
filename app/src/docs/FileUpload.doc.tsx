import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../common';

export class FileUploadDoc extends BaseDocsBlock {
    title = 'File Upload';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="file-upload-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="File Upload" path="./_examples/fileUpload/FileUpload.example.tsx" />
                <DocExample title="With custom infoText" path="./_examples/fileUpload/FileUploadCustomInfoText.example.tsx" />
            </>
        );
    }
}
