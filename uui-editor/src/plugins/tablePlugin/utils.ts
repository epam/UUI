import { DEFAULT_COL_WIDTH } from './constants';
import {
    PlateEditor,
    getPluginType,
    getStartPoint,
    getBlockAbove,
    selectEditor,
    TElement,
} from '@udecode/plate-common';
import {
    ELEMENT_TABLE,
    ELEMENT_TR,
    ELEMENT_TH,
    ELEMENT_TD,
} from '@udecode/plate-table';
import { ExtendedTTableCellElement } from './types';

export const getRowSpan = (cellElem: ExtendedTTableCellElement) => {
    const attrRowSpan = isNaN((cellElem?.attributes as any)?.rowspan)
        ? undefined
        : Number((cellElem?.attributes as any)?.rowspan);

    return cellElem.rowSpan || cellElem.data?.rowSpan || attrRowSpan || 1;
};

export const getColSpan = (cellElem: ExtendedTTableCellElement) => {
    const attrColSpan = isNaN((cellElem?.attributes as any)?.colspan)
        ? undefined
        : Number((cellElem?.attributes as any)?.colspan);

    return cellElem.colSpan || cellElem.data?.colSpan || attrColSpan || 1;
};

export const getTableColumnCount = (tableNode: TElement) => {
    const firstRow = (tableNode.children as TElement[])?.[0];
    const colCount = firstRow?.children.reduce((acc, current) => {
        let next = acc + 1;

        const cellElement = current as ExtendedTTableCellElement;
        const attrColSpan = Number(cellElement.attributes?.colspan);
        const colSpan = cellElement.colSpan || attrColSpan;
        if (colSpan && colSpan > 1) {
            next += colSpan - 1;
        }

        return next;
    }, 0);
    return colCount;
};

export const getClosest = (target: number, offsets: number[]) => {
    const closest = offsets.reduce((acc, current, index) => {
        return Math.abs(current - target) < Math.abs(acc.value - target)
            ? { value: current, index }
            : acc;
    }, {
        value: 0,
        index: 0,
    });
    return closest.index;
};

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
