import * as React from 'react';
import { DropSpot, FileCard } from '@epam/promo';
import { FileUploadResponse, useUuiContext } from '@epam/uui';
import * as css from './FileUpload.scss';

type AttachmentType = FileUploadResponse & { progress?: number };

enum AttachmentActions {
    ADD = 'ADD_FILE',
    DELETE = 'REMOVE_FILE',
    UPDATE = 'UPDATE_FILE',
}

type AttachmentAction =
    | { type: AttachmentActions.ADD, file: AttachmentType }
    | { type: AttachmentActions.DELETE, index: number }
    | { type: AttachmentActions.UPDATE, file: AttachmentType };

const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

function fileReducer(attachments: AttachmentType[], action: AttachmentAction) {
    switch (action.type) {
        case AttachmentActions.ADD: {
            return attachments.concat(action.file);
        }

        case AttachmentActions.UPDATE: {
            return attachments.map(file => file.name === action.file.name ? action.file : file);
        }

        case AttachmentActions.DELETE: {
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

    const addFile = (file: File, tempId: number) => {
        dispatch({
            type: AttachmentActions.ADD,
            file: {
                id: tempId,
                name: file.name,
                size: file.size,
                progress: 0,
            }
        });
    };

    const trackProgress = (progress: number, id: number) => {
        const file = attachments.find(i => i.id === id);
        dispatch({
            type: AttachmentActions.UPDATE,
            file: { ...file, progress },
        });
    };

    const finishUploading = (file: FileUploadResponse) => {
        dispatch({
            type: AttachmentActions.UPDATE,
            file: { ...file, progress: 100 },
        });
    };

    const deleteFile = (index: number) => {
        dispatch({ type: AttachmentActions.DELETE, index });
    };

    const uploadFile = (files: File[]) => {
        let tempIdCounter = 0;
        files.forEach(file => {
            const tempId = --tempIdCounter;
            addFile(file, tempId);

            uuiApi.uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
                onProgress: progress => trackProgress(progress, tempId),
            }).then(finishUploading);
        });
    };

    return (
        <div className={ css.container }>
            <DropSpot onUploadFiles={ uploadFile } />
            <div className={ css.attachmentBlock }>
                { attachments?.map((file, index) => (
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