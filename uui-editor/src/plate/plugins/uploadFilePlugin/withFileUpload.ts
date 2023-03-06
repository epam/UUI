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
                insertEmptyElement(editor, 'loader');
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
                deleteBackward('block');
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

// import {
//     getInjectedPlugins,
//     pipeInsertDataQuery,
//     PlateEditor,
//     Value,
//     WithPlatePlugin,
//     insertElements,
//     insertEmptyElement,
// } from '@udecode/plate';
//
// export const withFileUpload = <
//     V extends Value = Value,
//     E extends PlateEditor<V> = PlateEditor<V>
//     >(
//     editor: E,
//     plugin: WithPlatePlugin<any, V, E>,
// ) => {
//     const {
//         options: { uploadFile },
//     } = plugin;
//     const { insertData } = editor;
//     console.log(uploadFile);
//     editor.insertData = async (dataTransfer: DataTransfer) => {
//         const text = dataTransfer.getData('text/plain');
//         const { files } = dataTransfer;
//         console.log(files);
//         if (files && files.length > 0) {
//
//             const injectedPlugins = getInjectedPlugins<{}, V, E>(editor, plugin);
//             if (
//                 !pipeInsertDataQuery<{}, V, E>(injectedPlugins, {
//                     data: text,
//                     dataTransfer,
//                 })
//             ) {
//                 return insertData(dataTransfer);
//             }
//
//             for (const file of files) {
//                 insertEmptyElement(editor, 'loader');
//                 const [mime] = file.type.split('/');
//
//                 const uploadedFile = uploadFile
//                     ? await uploadFile(file)
//                     : file;
//                 console.log(uploadedFile);
//                 const result = {
//                     ...uploadedFile,
//                     [mime === 'image' ? 'url' : 'src']: uploadedFile.path,
//                     fileName: uploadedFile.name,
//                     data: {
//                         ...uploadedFile,
//                     },
//                 };
//
//                 console.log(result);
//
//                 editor.deleteBackward('block');
//                 insertElements(editor, {
//                     ...result,
//                     children: [{ text: '' }],
//                 });
//             }
//         } else {
//             insertData(dataTransfer);
//         }
//     };
//
//     return editor;
// };
