import * as React from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { svc } from '../../../services';
import { FileUploadResponse } from '@epam/uui';
import * as css from './FileUpload.example.scss';


type AttachmentType = FileUploadResponse & {
    progress?: number;
};

interface FileUploadExampleState {
    attachments: AttachmentType[];
}

export class FileUploadExample extends React.Component<any, FileUploadExampleState> {
    state: FileUploadExampleState = {
        attachments: [],
    };

    trackProgress(progress: number, id: number) {
        const attachments = this.state.attachments;
        const file = attachments.find(i => i.id === id);
        file.progress = progress;
        this.updateAttachment(file, file.id);
    }

    updateAttachment(newFile: any, id: number) {
        const attachments = this.state.attachments;
        this.setState({ attachments: attachments.map(i => i.id === id ? newFile : i) });
    }

    removeAttachment(index: number) {
        const attachments = this.state.attachments;
        this.setState({ attachments: attachments.filter((item, i) => i !== index) });
    }

    uploadFile = (files: File[]): void => {
        let tempIdCounter = 0;
        const attachments = this.state.attachments;

        files.map(file => {
            const tempId = --tempIdCounter;
            attachments.push({
                id: tempId,
                name: file.name,
                size: file.size,
                progress: 0,
            });
            svc.uuiApi.uploadFile('/uploadFileMock', file, {onProgress: (progress) => this.trackProgress(progress, tempId)}).then(res => {
                this.updateAttachment({ ...res, progress: 100 }, tempId);
            });
        });

        this.setState({ attachments });
    }

    render() {
        const attachments = this.state.attachments;
        return (
            <div className={ css.container }>
                <DropSpot onUploadFiles={ this.uploadFile } />
                <div className={ css.attachmentBlock }>
                    { attachments?.map((i, index) =>
                        <FileCard
                            key={ index }
                            file={ i }
                            onClick={ () => this.removeAttachment(index) }
                        />) }
                </div>
            </div>
        );
    }
}