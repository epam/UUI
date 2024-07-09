import { ATTACHMENT_PLUGIN_TYPE } from '../attachmentPlugin/attachmentPlugin';
import { IMAGE_PLUGIN_TYPE } from '../imagePlugin/imagePlugin';
import { IFRAME_PLUGIN_TYPE } from '../iframePlugin/iframePlugin';
import { useCallback } from 'react';
import type { FileUploadResponse } from '@epam/uui-core';
import {
    PlateEditor,
    getPlugin,
    KEY_INSERT_DATA,
    deleteBackward,
    insertEmptyElement,
    insertNodes,
} from '@udecode/plate-common';
import { withoutSavingHistory } from '@udecode/slate';
import { Selection } from 'slate';

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
    attachment: (file: FileUploadResponse) => ({
        type: ATTACHMENT_PLUGIN_TYPE,
        data: {
            ...file,
            fileName: file.name,
        },
        children: [{ text: '' }],
    }),
    image: (file: FileUploadResponse) => ({
        type: IMAGE_PLUGIN_TYPE,
        data: file,
        url: file.path,
        children: [{ text: '' }],
    }),
    iframe: (file: FileUploadResponse) => ({
        type: IFRAME_PLUGIN_TYPE,
        data: file,
        src: file.path,
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
) => {
    return files.map((file: FileUploadResponse) => {
        const fileType = file.type;
        const uploadType = (
            isValidFileType(fileType) ? fileType : 'attachment'
        ) as UploadType;

        return UPLOAD_BLOCKS[uploadType](file);
    });
};

export const createFileUploader = (options?: UploadFileOptions) =>
    async (
        editor: PlateEditor,
        files: File[],
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
        const fileFragments = buildFragments(res);

        // remove loader
        removeLoader();

        // insert blocks
        insertNodes(editor, fileFragments);
    };

export const useFilesUploader = (editor: PlateEditor) => {
    return useCallback(
        (files: File[], overriddenAction?: UploadType): Promise<void> => {
            const callback = getPlugin(editor, KEY_INSERT_DATA)?.options?.uploadFiles;
            if (callback) {
                return callback(
                    editor,
                    files,
                    overriddenAction,
                );
            }

            console.error('Upload function was not provided for upload plugin.');
            return Promise.reject();
        },
        [editor],
    );
};
