import {
    KEY_INSERT_DATA,
    PlateEditor,
    deleteBackward,
    focusEditor,
    getPlugin,
    insertEmptyElement,
} from "@udecode/plate";
import { IMAGE_PLUGIN_KEY } from "../imagePlugin/imagePlugin";
import { ATTACHMENT_PLUGIN_KEY } from "../attachmentPlugin/attachmentPlugin";
import { IFRAME_PLUGIN_KEY } from "../iframePlugin/iframePlugin";
import { useCallback } from "react";

export type UploadType = keyof typeof UPLOAD_BLOCKS;

export interface UploadFileOptions {
    uploadFile?: UploadFile;
}

interface UploadedFile extends File {
    type: UploadType;
    path: string;
}

type UploadFile = (
    file: File,
    onProgress?: (progress: any) => any
) => Promise<UploadedFile>;

const UPLOAD_BLOCKS = {
    attachment: (file: UploadedFile) => ({
        type: ATTACHMENT_PLUGIN_KEY,
        data: { ...file, fileName: file.name },
        children: [{ text: "" }],
    }),
    image: (file: UploadedFile) => ({
        type: IMAGE_PLUGIN_KEY,
        data: file,
        url: file.path,
        children: [{ text: "" }],
    }),
    iframe: (file: UploadedFile) => ({
        type: IFRAME_PLUGIN_KEY,
        data: file,
        src: file.path,
        children: [{ text: "" }],
    }),
};

const upload = async (
    files: File[],
    invokeUpload: UploadFile
): Promise<UploadedFile[]> => {
    const filesData: Array<UploadedFile> = [];

    try {
        for (const file of files) {
            const uploadedFile = await invokeUpload(file);
            filesData.push(uploadedFile);
        }
    } catch (e) {
        // TODO: add error handling
        throw new Error(e);
    }

    return filesData;
};

const isValidFileType = (fileType: string) => {
    return Object.keys(UPLOAD_BLOCKS).includes(fileType);
};

const buildFragments = (
    files: UploadedFile[],
    overriddenAction?: UploadType
) => {
    return files.map((file: UploadedFile) => {
        const fileType = file.type;
        const uploadType = (
            isValidFileType(fileType) ? fileType : "attachment"
        ) as UploadType;

        return UPLOAD_BLOCKS[overriddenAction || uploadType](file);
    });
};

export const createFileUploader =
    (options: UploadFileOptions) =>
    async (
        editor: PlateEditor,
        files: File[],
        overriddenAction?: UploadType
    ) => {
        const uploadFile = options?.uploadFile;
        if (!uploadFile) return;

        // show loader
        insertEmptyElement(editor, "loader");
        const currentSelection = { ...editor.selection };
        const prevSelection = { ...editor.prevSelection };

        // upload files
        const uploadedFiles = await upload(files, uploadFile);

        // build fragments
        const fileFragments = buildFragments(uploadedFiles, overriddenAction);

        // remove loader
        editor.selection = currentSelection;
        editor.prevSelection = prevSelection;
        deleteBackward(editor, { unit: "block" });

        // insert blocks
        editor.insertFragment(fileFragments);
        focusEditor(editor);
    };

export const useFilesUploader = (editor: PlateEditor) => {
    return useCallback(
        (files: File[], overriddenAction?: UploadType): Promise<void> =>
            getPlugin(editor, KEY_INSERT_DATA).options.uploadFiles(
                editor,
                files,
                overriddenAction
            ),
        [editor]
    );
};
