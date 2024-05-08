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
import { Selection } from 'slate';
import { ATTACHMENT_PLUGIN_TYPE } from '../attachmentPlugin/constants';
import { IMAGE_PLUGIN_TYPE } from '../imagePlugin/constants';
import { IFRAME_PLUGIN_TYPE } from '../iframePlugin/constants';

export type UploadType = keyof typeof UPLOAD_BLOCKS;

export interface UploadFileOptions {
    uploadFile?: UploadFile;
}

type UploadFile = (
    file: File,
    onProgress?: (progress: number) => any
) => Promise<FileUploadResponse>;

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

    try {
        for (const file of files) {
            const response = await invokeUpload(file);
            filesData.push(response);
        }
    } catch (e) {
        // TODO: add error handling
        throw new Error(e);
    }

    return filesData;
};

const isValidFileType = (fileType?: string) => {
    return fileType && Object.keys(UPLOAD_BLOCKS).includes(fileType);
};

const buildFragments = (
    files: FileUploadResponse[],
    overriddenAction?: UploadType,
) => {
    return files.map((file: FileUploadResponse) => {
        const fileType = file.type;
        const uploadType = (
            isValidFileType(fileType) ? fileType : 'attachment'
        ) as UploadType;

        return UPLOAD_BLOCKS[overriddenAction || uploadType](file);
    });
};

export const createFileUploader = (options?: UploadFileOptions) =>
    async (
        editor: PlateEditor,
        files: File[],
        overriddenAction?: UploadType,
    ) => {
        const uploadFile = options?.uploadFile;
        if (!uploadFile) return;

        // show loader
        insertEmptyElement(editor, 'loader');
        const currentSelection = { ...editor.selection } as Selection;
        const prevSelection = { ...editor.prevSelection } as Selection;

        // upload files
        const responses = await upload(files, uploadFile);

        // build fragments
        const fileFragments = buildFragments(responses, overriddenAction);

        // remove loader
        editor.selection = currentSelection;
        editor.prevSelection = prevSelection;
        deleteBackward(editor, { unit: 'block' });

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
