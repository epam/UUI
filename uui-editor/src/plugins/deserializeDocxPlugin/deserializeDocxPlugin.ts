import {
    KEY_DESERIALIZE_HTML,
    createDeserializeDocxPlugin as createPlateDeserializeDocxPlugin,
} from "@udecode/plate";
import { cleanDocx } from "./cleanDocx";

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
