import {
    createSoftBreakPlugin,
    createExitBreakPlugin,
    createTablePlugin,
    ELEMENT_TR, ELEMENT_TD, ELEMENT_TH
} from '@udecode/plate';

import { svc } from "@epam/app/src/services";


const uploadFile = async (file: File, onProgress: (progress: number) => any): Promise<any> => {
    return svc.uuiApi.uploadFile('/uploadFileMock', file, {
        onProgress,
    });
};

import { baseMarksPlugin } from "./baseMarksPlugin/baseMarksPlugin";
import { codeBlockPlugin } from "./codeBlockPlugin/codeBlockPlugin";
import { superscriptPlugin } from "./superscriptPlugin/superscriptPlugin";

import { listPlugin } from "./listPlugin/listPlugin";
import { linkPlugin } from "./linkPlugin/linkPlugin";
import { toDoListPlugin } from "./toDoListPlugin/toDoListPlugin";
import { headerPlugin } from "./headerPlugin/headerPlugin";
import { colorPlugin } from "./colorPlugin/colorPlugin";
import { imagePlugin } from "./imagePlugin/imagePlugin";
import { videoPlugin } from "./videoPlugin/videoPlugin";
import { notePlugin } from "./notePlugin/notePlugin";
import { quotePlugin } from "./quotePlugin/quotePlugin";
import { separatorPlugin } from "./separatorPlugin/separatorPlugin";
import { placeholderPlugin } from "./placeholderPlugin/placeholderPlugin";
import { attachmentPlugin } from "./attachmentPlugin/attachmentPlugin";
import { uploadFilePlugin } from "./uploadFilePlugin/uploadFilePlugin";
import { iframePlugin } from "./iframePlugin/iframePlugin";
import { tablePlugin } from "./tablePlugin/tablePlugin";

export const customPlugins = [
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    baseMarksPlugin(),
    codeBlockPlugin(),
    superscriptPlugin(),
    linkPlugin(),
    listPlugin(),
    toDoListPlugin(),
    headerPlugin(),
    colorPlugin(),
    imagePlugin(),
    notePlugin(),
    quotePlugin(),
    separatorPlugin(),
    placeholderPlugin({
        items: [
            {
                name: 'Name',
                field: 'name',
            },
            {
                name: 'Email',
                field: 'email',
            },
        ],
    }),
    attachmentPlugin(),
    iframePlugin(),
    uploadFilePlugin({ uploadFile }),
    videoPlugin(),

    tablePlugin(),
];