import React, { useState } from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { FileUploadResponse, useUuiContext } from '@epam/uui';
import * as css from './FileUpload.example.scss';

type AttachmentType = FileUploadResponse & {
    progress?: number;
};

export default function FileUploadExample() {
    const { uuiApi } = useUuiContext();
    const [attachments, setAttachments] = useState<AttachmentType[]>([]);

    const trackProgress = (progress: number, id: number): void => {
        const file = attachments.find(i => i.id === id);
        file.progress = progress;
        updateAttachment(file, file.id);
    }

    const updateAttachment = (newFile: AttachmentType, id: number): void => {
        setAttachments(attachments.map(i => i.id === id ? newFile : i));
    }

    const removeAttachment = (index: number): void => {
        setAttachments(attachments.filter((item, i) => i !== index));
    }

    const uploadFile = (files: File[]): void => {
        let tempIdCounter = 0;

        files.map(file => {
            const tempId = --tempIdCounter;

            setAttachments(attachments.concat({
                id: tempId,
                name: file.name,
                size: file.size,
                progress: 0,
            }));

            uuiApi.uploadFile('/uploadFileMock', file, {
                onProgress: (progress) => trackProgress(progress, tempId)
            }).then(res => updateAttachment({ ...res, progress: 100 }, tempId));
        });
    }

    return (
        <div className={ css.container }>
            <DropSpot onUploadFiles={ uploadFile } />
            <div className={ css.attachmentBlock }>
                { attachments?.map((i, index) =>
                    <FileCard
                        key={ index }
                        file={ i }
                        onClick={ () => removeAttachment(index) }
                    />) }
            </div>
        </div>
    );
}