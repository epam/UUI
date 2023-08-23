import { DEFAULT_COL_WIDTH } from './constants';
import {
    PlateEditor,
    getPluginType,
    getStartPoint,
    getBlockAbove,
    selectEditor,
} from '@udecode/plate-common';
import {
    ELEMENT_TABLE,
    ELEMENT_TR,
    ELEMENT_TH,
    ELEMENT_TD,
} from '@udecode/plate-table';

export const selectFirstCell = (editor: PlateEditor) => {
    if (editor.selection) {
        const tableEntry = getBlockAbove(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        if (!tableEntry) return;

        const startPoint = getStartPoint(editor, tableEntry[1]);
        selectEditor(editor, { at: startPoint });
    }
};

export const createInitialTable = (editor: PlateEditor) => {
    const rows = [
        {
            type: getPluginType(editor, ELEMENT_TR),
            children: [
                {
                    type: getPluginType(editor, ELEMENT_TH),
                    children: [editor.blockFactory()],
                },
                {
                    type: getPluginType(editor, ELEMENT_TH),
                    children: [editor.blockFactory()],
                },
            ],
        },
        {
            type: getPluginType(editor, ELEMENT_TR),
            children: [
                {
                    type: getPluginType(editor, ELEMENT_TD),
                    children: [editor.blockFactory()],
                },
                {
                    type: getPluginType(editor, ELEMENT_TD),
                    children: [editor.blockFactory()],
                },
            ],
        },
    ];

    return {
        type: getPluginType(editor, ELEMENT_TABLE),
        children: rows,
        data: { cellSizes: [DEFAULT_COL_WIDTH, DEFAULT_COL_WIDTH] },
    };
};
