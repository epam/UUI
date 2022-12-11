import {
    createListPlugin,
    createSoftBreakPlugin,
    createExitBreakPlugin,
    createHeadingPlugin,
    createSuperscriptPlugin,
    createFontColorPlugin,
    createMediaEmbedPlugin,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
} from '@udecode/plate';

import { createUUIBoldPlugin } from "./customBold";
import { createUUIItalicPlugin } from "./customItalic";
import { createUUIUnderlinePlugin } from "./customUnderline";
import { createUUICodePlugin } from "./customCode";
import { listPluginOptions } from "./createListPlugin";
import { createUUILinkPlugin } from "./linkPlugin";
import { createToDoListPlugin } from "./toDoListPlugin";
import { ImageUI, createImagePlugin } from "./imagePlugin";
import {  createUploadPlugin } from "./uploadFilePlugin";
import {  videoPlugin } from "./videoPlugin";

export const customPlugins = [
    createFontColorPlugin(),
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    createUploadPlugin(),
    videoPlugin,
    createListPlugin(listPluginOptions),
    createUUIBoldPlugin,
    createUUIItalicPlugin,
    createUUIUnderlinePlugin,
    createUUICodePlugin,
    createMediaEmbedPlugin(),
    createImagePlugin({
        component: ImageUI,
    }),
    createSuperscriptPlugin({
        type: 'uui-richTextEditor-superscript',
    }),
    createToDoListPlugin(),
    createUUILinkPlugin,
    createHeadingPlugin({
        overrideByKey: {
            [ELEMENT_H1]: {
                type: 'uui-richTextEditor-header-1',
            },
            [ELEMENT_H2]: {
                type: 'uui-richTextEditor-header-2',
            },
            [ELEMENT_H3]: {
                type: 'uui-richTextEditor-header-3',
            },
        },
    }),
];