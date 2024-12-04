import { useCallback } from 'react';
import type { FileUploadResponse } from '@epam/uui-core';
import {
    PlateEditor,
    getPlugin,
    deleteBackward,
    insertEmptyElement,
    insertNodes,
} from '@udecode/plate-common';
import { withoutSavingHistory } from '@udecode/slate';
import { Selection } from 'slate';
import { ATTACHMENT_TYPE } from '../attachmentPlugin/constants';
import { IMAGE_TYPE } from '../imagePlugin/constants';
import { IFRAME_TYPE } from '../iframePlugin/constants';
import { TImageElement } from '../imagePlugin/types';
import { TIframeElement } from '../iframePlugin/types';
import { TAttachmentElement } from '../attachmentPlugin/types';
import { UPLOAD_PLUGIN_KEY } from './constants';

export type UploadType = keyof typeof UPLOAD_BLOCKS;

type UploadFile = (
    file: File,
    onProgress?: (progress: number) => any
) => Promise<FileUploadResponse>;

export interface UploadFileOptions {
    uploadFile: UploadFile;
}

type FileUploader = (
    editor: PlateEditor,
    files: File[],
    overriddenAction?: UploadType,
) => Promise<void>;

export interface FileUploaderOptions {
    uploadFiles?: FileUploader;
}

const UPLOAD_BLOCKS = {
    attachment: (file: FileUploadResponse): TAttachmentElement => ({
        type: ATTACHMENT_TYPE,
        data: {
            ...file,
            fileName: file.name,
        },
        children: [{ text: '' }],
    }),
    image: (file: FileUploadResponse): TImageElement => ({
        type: IMAGE_TYPE,
        url: file.path!,
        data: file,
        width: 'fit-content',
        children: [{ text: '' }],
    }),
    iframe: (file: FileUploadResponse): TIframeElement => ({
        type: IFRAME_TYPE,
        url: file.path!,
        data: file,
        children: [{ text: '' }],
    }),
};

const upload = async (
    files: File[],
    invokeUpload: UploadFile,
): Promise<FileUploadResponse[]> => {
    const filesData: Array<FileUploadResponse> = [];

    for (const file of files) {
        const response = await invokeUpload(file);
        filesData.push(response);
    }

    return filesData;
};

const isValidFileType = (fileType?: string) => {
    return fileType && Object.keys(UPLOAD_BLOCKS).includes(fileType);
};

const buildFragments = (
    files: FileUploadResponse[],
    blockType?: UploadType,
) => {
    return files.map((file: FileUploadResponse) => {
        const fileType = file.type;
        if (blockType) {
            return UPLOAD_BLOCKS[blockType](file);
        } else {
            const blockTypeByFile = (isValidFileType(fileType) ? fileType : ATTACHMENT_TYPE) as UploadType;

            return UPLOAD_BLOCKS[blockTypeByFile](file);
        }
    });
};

export const createFileUploader = (options?: UploadFileOptions) =>
    async (
        editor: PlateEditor,
        files: File[],
        blockType: UploadType,
    ) => {
        const uploadFile = options?.uploadFile;
        if (!uploadFile) return;

        withoutSavingHistory(editor, () => {
            // show loader
            insertEmptyElement(editor, 'loader');
        });

        const currentSelection = { ...editor.selection } as Selection;
        const prevSelection = { ...editor.prevSelection } as Selection;

        const removeLoader = () => {
            withoutSavingHistory(editor, () => {
                // remove loader
                editor.selection = currentSelection;
                editor.prevSelection = prevSelection;
                deleteBackward(editor, { unit: 'block' });
            });
        };

        // upload files
        let res;
        try {
            res = await upload(files, uploadFile);
        } catch (e) {
            return removeLoader();
        }

        // build fragments
        const fileFragments = buildFragments(res, blockType);

        // remove loader
        removeLoader();

        // insert blocks
        insertNodes(editor, fileFragments);
    };

export const useFilesUploader = (editor: PlateEditor) => {
    return useCallback(
        (files: File[], blockType?: UploadType): Promise<void> => {
            const callback = getPlugin<FileUploaderOptions>(editor, UPLOAD_PLUGIN_KEY)?.options.uploadFiles;

            if (callback) {
                return callback(
                    editor,
                    files,
                    blockType,
                );
            }

            console.error('Upload function was not provided for upload plugin.');
            return Promise.reject();
        },
        [editor],
    );
};
