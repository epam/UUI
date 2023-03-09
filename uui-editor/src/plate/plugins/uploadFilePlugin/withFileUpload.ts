import {
    Value,
    focusEditor,
    PlateEditor,
    insertElements,
    WithPlatePlugin,
    insertEmptyElement,
} from '@udecode/plate';

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
            focusEditor(editor);
            for (const file of files) {
                // Temp close
                //insertEmptyElement(editor, 'loader');
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
                // Temp close
                //deleteBackward('block');

                insertElements(editor, {
                    ...result,
                    children: [{ text: '' }],
                });
            }
        } else {
            insertData(dataTransfer);
        }
    };

    return editor;
};