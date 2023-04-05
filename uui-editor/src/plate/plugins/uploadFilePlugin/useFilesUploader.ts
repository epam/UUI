import { useMemo } from "react";
import { KEY_INSERT_DATA, PlateEditor, getPlugins } from "@udecode/plate";

import { createFileUploader } from "./file_uploader";

export const useFilesUploader = (editor: PlateEditor) => {
    const uploadFilePlugin = useMemo(
        () =>
            getPlugins(editor).find((plugin) => plugin.key === KEY_INSERT_DATA),
        [editor]
    );

    return useMemo(
        () =>
            createFileUploader(editor, uploadFilePlugin.options.uploadOptions),
        [editor]
    );
};
