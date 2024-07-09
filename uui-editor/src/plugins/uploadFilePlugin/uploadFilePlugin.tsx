import React from 'react';
import {
    createInsertDataPlugin,
    select,
    findEventRange,
} from '@udecode/plate-common';
import {
    UploadFileOptions,
    createFileUploader,
} from './file_uploader';
import { Spinner } from '@epam/uui';
import css from './Loader.module.scss';

const isFilesUploadEvent = (dataTransfer: DataTransfer) => {
    const text = dataTransfer.getData('text/plain');
    const { files } = dataTransfer;

    if (!text && files && files.length !== 0) return true;

    return false;
};

export const uploadFilePlugin = (uploadOptions?: UploadFileOptions) =>
    createInsertDataPlugin({
        options: { uploadFiles: createFileUploader(uploadOptions) },
        handlers: {
            onDrop: (editor, plugin) => {
                return (event) => {
                    if (!isFilesUploadEvent(event.dataTransfer)) return false;

                    event.preventDefault();
                    event.stopPropagation();

                    // update selection depending on drop location
                    const at = findEventRange(editor, event);
                    if (!at) return false;
                    select(editor, at);

                    const { files } = event.dataTransfer;
                    plugin.options.uploadFiles(editor, Array.from(files));
                    return true;
                };
            },
            onPaste: (editor, plugin) => {
                return (event) => {
                    if (!isFilesUploadEvent(event.clipboardData)) return false;

                    event.preventDefault();
                    event.stopPropagation();

                    const { files } = event.clipboardData;
                    plugin.options.uploadFiles(editor, Array.from(files));
                    return true;
                };
            },
        },
        plugins: [
            {
                key: 'loader',
                type: 'loader',
                isElement: true,
                isVoid: true,
                component: (props) => (
                    <>
                        { props.children }
                        <Spinner { ...props } cx={ css.loader } />
                    </>
                ),
            },
        ],
    });
