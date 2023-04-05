import {
    PlateEditor,
    deleteBackward,
    focusEditor,
    insertEmptyElement,
} from "@udecode/plate";
import { IMAGE_PLUGIN_KEY } from "../imagePlugin/imagePlugin";
import { ATTACHMENT_PLUGIN_KEY } from "../attachmentPlugin/attachmentPlugin";
import { IFRAME_PLUGIN_KEY } from "../iframePlugin/iframePlugin";

type UploadType = keyof typeof UPLOAD_BLOCKS;

interface UploadedFile extends File {
    type: UploadType;
    path: string;
}

type UploadFile = (
    file: File,
    onProgress?: (progress: any) => any
) => Promise<UploadedFile>;

export interface UploadFileOptions {
    uploadFile: UploadFile;
}

const buildAttachmentBlock = (file: File | UploadedFile) => ({
    type: ATTACHMENT_PLUGIN_KEY,
    data: file,
    children: [{ text: "" }],
});

const UPLOAD_BLOCKS = {
    attachment: (file: UploadedFile) => buildAttachmentBlock(file),
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

const uploadFiles = async (
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
    (editor: PlateEditor, uploadOptions?: UploadFileOptions) =>
    async (files: File[], overriddenAction?: UploadType) => {
        const uploadFile = uploadOptions?.uploadFile;
        if(!uploadFile) return;

        // show loader
        insertEmptyElement(editor, "loader");
        const currentSelection = { ...editor.selection };
        const prevSelection = { ...editor.prevSelection };

        // upload files
        const uploadedFiles =  await uploadFiles(files, uploadFile);

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
