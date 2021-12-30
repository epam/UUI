import * as React from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { FileUploadResponse, useUuiContext } from '@epam/uui';
import * as css from './FileUpload.scss';

type AttachmentType = FileUploadResponse & { progress?: number };

const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

export default function FileUploadExample() {
    const { uuiApi } = useUuiContext();
    const [attachments, setAttachments] = React.useState<AttachmentType[]>([]);

    const trackProgress = (progress: number, id: number) => {
        const file = attachments.find(i => i.id === id);
        setAttachments(attachments.map(f => f.id === file.id ? { ...file, progress } : f));
    };

    const updateFile = (file: AttachmentType, id: number) => {
        setAttachments(attachments.map(f => f.id === id ? file : f));
    };

    const deleteFile = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const uploadFile = (files: File[]) => {
        const newAttachments = attachments.slice();

        files.map((file, index) => {
            const tempId = index - 1;
            attachments.push({ id: tempId, name: file.name, size: file.size });
            uuiApi.uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
                onProgress: progress => trackProgress(progress, tempId),
            }).then(res => updateFile({ ...res, progress: 100 }, tempId));
        });

        setAttachments(newAttachments);
    };

    return (
        <div className={ css.container }>
            <DropSpot onUploadFiles={ uploadFile } />
            <div className={ css.attachmentBlock }>
                { attachments.map((file, index) => (
                    <FileCard
                        key={ index }
                        file={ file }
                        onClick={ () => deleteFile(index) }
                    />
                )) }
            </div>
        </div>
    );
}