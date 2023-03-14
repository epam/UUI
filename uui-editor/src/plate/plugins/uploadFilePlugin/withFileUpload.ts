import {
    Value,
    focusEditor,
    PlateEditor,
    insertElements,
    WithPlatePlugin,
    insertEmptyElement, insertNode,
} from '@udecode/plate';
import { useRef } from "react";

export const withFileUpload = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
    >(
    editor: E,
    plugin: WithPlatePlugin<any, V, E>,
) => {
    const {
        options: { uploadFile },
    } = plugin;
    const { insertData, deleteBackward } = editor;

    editor.insertData = async (dataTransfer) => {
        const { files } = dataTransfer;

        if (files && files.length > 0) {

            for (const file of files) {
                insertEmptyElement(editor, 'loader');
                const currentSelection = { ...editor.selection };
                const prevSelection = { ...editor.prevSelection };
                const [mime] = file.type.split('/');

                const uploadedFile = uploadFile
                    ? await uploadFile(file)
                    : file;

                const result = {
                    ...uploadedFile,
                    [mime === 'image' ? 'url' : 'src']: uploadedFile.path,
                    fileName: uploadedFile.name,
                    data: {
                        ...uploadedFile,
                    },
                };

                editor.selection = currentSelection;
                editor.prevSelection = prevSelection;
                deleteBackward('block');

                insertElements(editor, {
                    ...result,
                    children: [{ text: '' }],
                });
                insertEmptyElement(editor, 'paragraph');
            }
        } else {
            insertData(dataTransfer);
        }
    };

    return editor;
};