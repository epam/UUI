import { PlateEditor, deleteBackward, focusEditor, getPlugins, insertEmptyElement } from "@udecode/plate";
import { ATTACHMENT_KEY, UploadFileOptions } from "./attachmentPlugin";

export const createFileUploader = (editor: PlateEditor) => async (files: File[]) => {
    const plugins = getPlugins(editor);
    const plugin = plugins.find(plugin => plugin.key === ATTACHMENT_KEY);
    const uploadFile = plugin.options.uploadOptions?.uploadFile as UploadFileOptions['uploadFile'];

    // show loader
    insertEmptyElement(editor, 'loader');
    const currentSelection = { ...editor.selection };
    const prevSelection = { ...editor.prevSelection };

    // upload files
    const loadedFilesData: File[] = [];
    for (const file of files) {
        loadedFilesData.push(uploadFile ? await uploadFile(file) : file);
    }

    // remove loader
    editor.selection = currentSelection;
    editor.prevSelection = prevSelection;
    deleteBackward(editor, { unit: 'block' });

    const fileFragments = loadedFilesData.map((data) => ({
        data,
        type: ATTACHMENT_KEY,
        children: [{ text: '' }],
    }));

    // insert blocks
    editor.insertFragment(fileFragments);
    focusEditor(editor);
}