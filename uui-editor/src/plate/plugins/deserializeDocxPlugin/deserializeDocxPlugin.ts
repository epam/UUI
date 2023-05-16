import {
    DeserializeHtml,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE,
    ELEMENT_PARAGRAPH,
    KEY_DESERIALIZE_DOCX,
    KEY_DESERIALIZE_HTML,
    KEY_INDENT,
    KEY_LIST_STYLE_TYPE,
    KEY_TEXT_INDENT,
    ListStyleType,
    PlatePlugin,
    createDeserializeDocxPlugin as createPlateDeserializeDocxPlugin,
    createPluginFactory,
    getDocxIndent,
    getDocxListContentHtml,
    getDocxListIndent,
    getDocxTextIndent,
    getTextListStyleType,
    isDocxContent,
    isDocxList,
} from "@udecode/plate";
import { cleanDocx } from "./cleanDocx";

const getListNode =
    (type: string): DeserializeHtml["getNode"] =>
    (element) => {
        const node: any = { type };

        if (isDocxList(element)) {
            node[KEY_INDENT] = getDocxListIndent(element);

            const text = element.textContent ?? "";

            node[KEY_LIST_STYLE_TYPE] =
                getTextListStyleType(text) ?? ListStyleType.Disc;

            element.innerHTML = getDocxListContentHtml(element);
        } else {
            const indent = getDocxIndent(element);
            if (indent) {
                node[KEY_INDENT] = indent;
            }

            const textIndent = getDocxTextIndent(element);
            if (textIndent) {
                node[KEY_TEXT_INDENT] = textIndent;
            }
        }

        return node;
    };

const KEYS = [
    ELEMENT_PARAGRAPH,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
];

const overrideByKey: Record<string, Partial<PlatePlugin>> = {};

KEYS.forEach((key) => {
    overrideByKey[key] = {
        then: (editor, { type }) => ({
            deserializeHtml: {
                getNode: getListNode(type),
            },
        }),
    };
});

export const createDeserializeDocxPlugin = () => createPlateDeserializeDocxPlugin({
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

const createDeserializeDocxPlugin1 = createPluginFactory({
    key: KEY_DESERIALIZE_DOCX,
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
    overrideByKey: {
        ...overrideByKey,
        [ELEMENT_IMAGE]: {
            editor: {
                insertData: {
                    query: ({ dataTransfer }) => {
                        const data = dataTransfer.getData("text/html");
                        const { body } = new DOMParser().parseFromString(
                            data,
                            "text/html"
                        );

                        return !isDocxContent(body);
                    },
                },
            },
        },
    },
});
