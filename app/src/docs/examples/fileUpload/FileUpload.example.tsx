import * as React from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { FileUploadResponse, useUuiContext } from '@epam/uui';
import * as css from './FileUpload.scss';

type AttachmentType = FileUploadResponse & { progress?: number, abortXHR?: () => void; uploadError: { isError: boolean, message?: string } };

const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

interface FileWithAbort extends File {
    abortXHR?: () => void;
}

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

    const deleteFile = (index: number, file: AttachmentType) => {
        file.uploadError.isError && file.abortXHR();
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const uploadFile = (files: File[]) => {
        const newAttachments = attachments.slice();

        files.map((file: FileWithAbort, index) => {
            const tempId = index - 1;
            const newFile: AttachmentType = { id: tempId, name: file.name, size: file.size, uploadError: {isError: false} };
            uuiApi.uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
                onProgress: progress => trackProgress(progress, tempId),
                getXHR: (xhr) => {
                    newFile.abortXHR = xhr.abort;
                    newFile.abortXHR = newFile.abortXHR.bind(xhr);
                    return xhr.setRequestHeader('my-header', 'value');
                },
            })
                .then(res => updateFile({ ...res, progress: 100, uploadError: {isError: false} }, tempId))
                .catch(res => updateFile({ ...newFile, progress: 100, uploadError: {isError: true, message: JSON.parse(res)?.error || 'Upload filed'} }, tempId));
            attachments.push(newFile);
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
                        onClick={ () => deleteFile(index, file) }
                    />
                )) }
            </div>
        </div>
    );
}