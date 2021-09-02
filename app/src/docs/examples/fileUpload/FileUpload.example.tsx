import React, { useState } from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { FileUploadResponse, useUuiContext } from '@epam/uui';
import * as css from './FileUpload.example.scss';

type AttachmentType = FileUploadResponse & {
    progress?: number;
};

export default function FileUploadExample() {
    const { uuiApi } = useUuiContext();
    const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';
    const [attachments, setAttachments] = useState<AttachmentType[]>([]);

    const updateAttachment = (newFile: AttachmentType): void => {
        setAttachments(attachments.map(file => file.id === newFile.id ? newFile : file));
    }

    const trackProgress = (progress: number, tempId: number): void => {
        const file: AttachmentType = attachments.find(file => file.id === tempId);
        updateAttachment({ ...file, progress });
    }

    const removeAttachment = (index: number): void => {
        setAttachments(attachments.filter((_, i) => i !== index));
    }

    const uploadFile = (files: File[]): void => {
        let tempIdCounter = 0;

        Promise.all(files.map(file => {
            const tempId = --tempIdCounter;

            setAttachments([
                ...attachments, {
                    id: tempId,
                    name: file.name,
                    size: file.size,
                    progress: 0,
                }
            ]);

            uuiApi.uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
                onProgress: (progress) => trackProgress(progress, tempId)
            }).then(res => updateAttachment({ ...res, progress: 100 }));
        }));
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