import * as React from 'react';
import { DropSpot, FileCard, FileCardItem } from '@epam/promo';
import { useUuiContext } from '@epam/uui';
import css from './FileUpload.scss';

const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

let tempIdCount = 0;

export default function FileUploadExample() {
    const { uuiApi } = useUuiContext();
    const [attachments, setAttachments] = React.useState<FileCardItem[]>([]);

    const trackProgress = (progress: number, id: number) => {
        setAttachments(attachments => attachments.map(item => (item.id === id ? { ...item, progress } : item)));
    };

    const updateFile = (file: FileCardItem, id: number) => {
        setAttachments(attachments => attachments.map(item => (item.id === id ? file : item)));
    };

    const deleteFile = (file: FileCardItem) => {
        setAttachments(attachments => attachments.filter(item => item.id !== file.id));
    };

    const uploadFile = (files: File[]) => {
        const newAttachments = [...attachments];

        files.map((file: File) => {
            const tempId = tempIdCount - 1;
            tempIdCount -= 1;
            const newFile: FileCardItem = { id: tempId, name: file.name, progress: 0, size: file.size };
            newAttachments.push(newFile);

            uuiApi
                .uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
                    onProgress: progress => trackProgress(progress, tempId),
                    getXHR: xhr => {
                        newFile.abortXHR = () => xhr.abort();
                    },
                })
                .then(res => updateFile({ ...res, progress: 100 }, tempId))
                .catch(err => updateFile({ ...newFile, progress: 100, error: err.error }, tempId));
        });

        setAttachments(newAttachments);
    };

    return (
        <div className={css.container}>
            <DropSpot onUploadFiles={uploadFile} />
            <div className={css.attachmentBlock}>
                {attachments.map((file, index) => (
                    <FileCard key={index} file={file} onClick={() => deleteFile(file)} />
                ))}
            </div>
        </div>
    );
}
