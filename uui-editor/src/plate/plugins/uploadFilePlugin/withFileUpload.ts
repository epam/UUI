import {
    Value,
    PlateEditor,
    insertElements,
    insertEmptyElement,
    getInjectedPlugins,
    pipeInsertDataQuery,
    pipeInsertFragment,
    pipeTransformData,
    WithPlatePlugin,
    pipeTransformFragment,
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
    const { insertData } = editor;

    editor.insertData = async (dataTransfer) => {

        const text = dataTransfer.getData('text/plain');
        const { files } = dataTransfer;

        if (files && files.length > 0) {

            const injectedPlugins = getInjectedPlugins<{}, V, E>(editor, plugin);
            if (
                !pipeInsertDataQuery<{}, V, E>(injectedPlugins, {
                    data: text,
                    dataTransfer,
                })
            ) {
                return insertData(dataTransfer);
            }

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

                editor.deleteBackward('block');
                insertElements(editor, {
                    ...result,
                    children: [{ text: '' }],
                });
            }
        } else {

            const inserted = [...editor.plugins].reverse().some((plugin) => {
                const insertDataOptions = plugin.editor.insertData;
                if (!insertDataOptions) return false;

                const injectedPlugins = getInjectedPlugins<{}, V>(editor, plugin);
                const { format, getFragment } = insertDataOptions;
                if (!format) return false;

                let data = dataTransfer.getData(format);
                if (!data) return;

                if (
                    !pipeInsertDataQuery<{}, V>(injectedPlugins, {
                        data,
                        dataTransfer,
                    })
                ) {
                    return false;
                }

                data = pipeTransformData(injectedPlugins, {
                    data,
                    dataTransfer,
                });

                let fragment = getFragment?.({
                    data,
                    dataTransfer,
                });
                if (!fragment?.length) return false;

                fragment = pipeTransformFragment(injectedPlugins, {
                    fragment,
                    data,
                    dataTransfer,
                });
                if (!fragment.length) return false;

                pipeInsertFragment(editor, injectedPlugins, {
                    fragment,
                    data,
                    dataTransfer,
                });

                return true;
            });
            if (inserted) return;

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
