import * as React from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { useUuiContext, FileUploadResponse } from '@epam/uui';
import * as css from './FileUpload.scss';

const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

interface NewFile extends Partial<File & FileUploadResponse> {
    progress?: number;
    abortXHR?: () => void;
}

let tempIdCount = 0;

export default function FileUploadExample() {
    const { uuiApi } = useUuiContext();
    const [attachments, setAttachments] = React.useState<NewFile[]>([]);

    const trackProgress = (progress: number, id: number) => {
        setAttachments((attachments) => attachments.map(item => item.id === id ? { ...item, progress } : item));
    };

    const updateFile = (file: NewFile, id: number) => {
        setAttachments((attachments) => attachments.map((item) => item.id === id ? file : item));
    };

    const deleteFile = (file: NewFile) => {
        setAttachments((attachments) => attachments.filter((item) => item.id !== file.id));
    };

    const uploadFile = (files: File[]) => {
        const newAttachments = [...attachments];

        files.map((file: File) => {
            const tempId = tempIdCount - 1;
            tempIdCount -= 1;
            const newFile: NewFile = { id: tempId, name: file.name, progress: 0, size: file.size, uploadError: { isError: false } };
            newAttachments.push(newFile);

            uuiApi.uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
                onProgress: progress => trackProgress(progress, tempId),
                getXHR: (xhr) => {
                    newFile.abortXHR = () => xhr.abort();
                },
            })
                .then((res) => updateFile({ ...res, progress: 100, uploadError: { isError: false } }, tempId))
                .catch(() => updateFile({ ...newFile, progress: 100, uploadError: { isError: true, message: 'Upload error' } }, tempId));
        });

        setAttachments(newAttachments);
    };

    return (
        <div className={ css.container }>
            <DropSpot onUploadFiles={ uploadFile }/>
            <div className={ css.attachmentBlock }>
                { attachments.map((file, index) => (
                    <FileCard key={ index } file={ file } onClick={ () => deleteFile(file) }/>
                )) }
            </div>
        </div>
    );
}