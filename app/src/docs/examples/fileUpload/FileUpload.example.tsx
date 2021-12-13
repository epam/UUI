import * as React from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { FileUploadResponse, useUuiContext } from '@epam/uui';
import * as css from './FileUpload.scss';

type AttachmentType = FileUploadResponse & { progress?: number };
type AttachmentAction =
    | { type: 'ADD', file: AttachmentType }
    | { type: 'DELETE', index: number }
    | { type: 'UPDATE', file: AttachmentType };

const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

function fileReducer(attachments: AttachmentType[], action: AttachmentAction): AttachmentType[] {
    switch (action.type) {
        case 'ADD': {
            return attachments.concat(action.file);
        }

        case 'UPDATE': {
            return attachments.map(file => file.name === action.file.name ? action.file : file);
        }

        case 'DELETE': {
            return attachments.filter((_, index) => index !== action.index);
        }

        default: {
            throw new Error('Action not implemented');
        }
    }
}

export default function FileUploadExample() {
    const { uuiApi } = useUuiContext();
    const [attachments, dispatch] = React.useReducer(fileReducer, []);

    const trackProgress = (progress: number, name: string) => {
        dispatch({ type: 'UPDATE', file: { ...attachments.find(file => file.name === name), progress } });
    };

    const uploadFile = (files: File[]) => {
        files.map(file => {
            dispatch({ type: 'ADD', file: { id: undefined, name: file.name, size: file.size, progress: 0 } });

            uuiApi.uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
                onProgress: progress => trackProgress(progress, file.name),
            }).then(res => {
                dispatch({ type: 'UPDATE', file: { ...res, progress: 100 } });
            });
        });
    };

    return (
        <div className={ css.container }>
            <DropSpot onUploadFiles={ uploadFile } />
            <div className={ css.attachmentBlock }>
                { attachments?.map((file, index) => (
                    <FileCard key={ index } file={ file } onClick={ () => dispatch({ type: 'DELETE', index }) } />
                )) }
            </div>
        </div>
    );
}