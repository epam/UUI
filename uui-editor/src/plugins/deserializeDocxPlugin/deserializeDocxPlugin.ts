import { KEY_DESERIALIZE_HTML } from "@udecode/plate-core";
import { cleanDocx } from "./cleanDocx";
import { createDeserializeDocxPlugin as createPlateDeserializeDocxPlugin } from "@udecode/plate-serializer-docx";

export const createDeserializeDocxPlugin = () =>
    createPlateDeserializeDocxPlugin({
        inject: {
            pluginsByKey: {
                [KEY_DESERIALIZE_HTML]: {
                    editor: {
                        insertData: {
                            transformData: (data, { dataTransfer }) => {
                                const rtf = dataTransfer.getData("text/rtf");
                                return cleanDocx(data, rtf);
                            },
                        },
                    },
                },
            },
        },
    });
