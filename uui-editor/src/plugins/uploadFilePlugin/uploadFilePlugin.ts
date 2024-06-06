import {
    createInsertDataPlugin,
    select,
    findEventRange,
    PlatePlugin,
} from '@udecode/plate-common';
import {
    UploadFileOptions,
    createFileUploader,
} from './file_uploader';

const isFilesUploadEvent = (dataTransfer: DataTransfer) => {
    const text = dataTransfer.getData('text/plain');
    const { files } = dataTransfer;

    if (!text && files && files.length !== 0) return true;

    return false;
};

export const uploadFilePlugin = (uploadOptions?: UploadFileOptions): PlatePlugin =>
    createInsertDataPlugin({
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
