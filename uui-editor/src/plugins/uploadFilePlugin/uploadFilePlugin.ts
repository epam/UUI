import {
    PlateEditor,
    createInsertDataPlugin,
    Value,
    select,
    findEventRange,
} from '@udecode/plate-common';
import {
    UploadFileOptions,
    UploadType,
    createFileUploader,
} from './file_uploader';

interface UploadFilePluginOptions {
    uploadFiles: (
        editor: PlateEditor,
        files: File[],
        overriddenAction?: UploadType
    ) => Promise<void>;
}

const isFilesUploadEvent = (dataTransfer: DataTransfer) => {
    const text = dataTransfer.getData('text/plain');
    const { files } = dataTransfer;

    if (!text && files && files.length !== 0) return true;

    return false;
};

export const uploadFilePlugin = (uploadOptions?: UploadFileOptions) =>
    createInsertDataPlugin<UploadFilePluginOptions, Value, PlateEditor<Value>>({
        options: { uploadFiles: createFileUploader(uploadOptions) },
        handlers: {
            onDrop: (editor, plugin) => {
                return (event) => {
                    if (!isFilesUploadEvent(event.dataTransfer)) return false;

                    event.preventDefault();
                    event.stopPropagation();

                    // update selection depending on drop location
                    const at = findEventRange(editor, event);
                    if (!at) return false;
                    select(editor, at);

                    const { files } = event.dataTransfer;
                    plugin.options.uploadFiles(editor, Array.from(files));
                    return true;
                };
            },
            onPaste: (editor, plugin) => {
                return (event) => {
                    if (!isFilesUploadEvent(event.clipboardData)) return false;

                    event.preventDefault();
                    event.stopPropagation();

                    const { files } = event.clipboardData;
                    plugin.options.uploadFiles(editor, Array.from(files));
                    return true;
                };
            },
        },
    });
