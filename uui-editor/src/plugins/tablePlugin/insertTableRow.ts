import { PlateEditor, findNode, getPluginType, getBlockAbove, getPluginOptions, withoutNormalizing, insertElements, TElement, select, Value, findNodePath, setNodes, getParentNode, TDescendant } from '@udecode/plate-common';
import { ELEMENT_TR, ELEMENT_TABLE, TablePlugin, getCellTypes, TTableRowElement, TTableElement, ELEMENT_TH, getEmptyCellNode } from '@udecode/plate-table';
import { Path } from 'slate';
import { getTableColumnCount } from './utils';
import { ExtendedTTableCellElement } from './types';
import { findCellByIndexes } from './findCellByIndexes';

const createEmptyCell = <V extends Value>(editor: PlateEditor<V>, row: TTableRowElement, newCellChildren: TDescendant[], colSpan: number, header?: boolean) => {
    const isHeaderRow = header === undefined
        ? (row as TElement).children.every(
            (c) => c.type === getPluginType(editor, ELEMENT_TH),
        )
        : header;

    return {
        ...getEmptyCellNode(editor, {
            header: isHeaderRow,
            newCellChildren,
        }),
        colSpan,
    };
};

export const insertTableRow = <V extends Value>(
    editor: PlateEditor<V>,
    {
        header,
        fromRow,
        at,
        disableSelect,
    }: {
        header?: boolean;
        fromRow?: Path;
        /**
       * Exact path of the row to insert the column at.
       * Will overrule `fromRow`.
       */
        at?: Path;
        disableSelect?: boolean;
    } = {},
) => {
    const trEntry = fromRow
        ? findNode(editor, {
            at: fromRow,
            match: { type: getPluginType(editor, ELEMENT_TR) },
        })
        : getBlockAbove(editor, {
            match: { type: getPluginType(editor, ELEMENT_TR) },
        });
    if (!trEntry) return;

    const [, trPath] = trEntry;

    const tableEntry = getBlockAbove(editor, {
        match: { type: getPluginType(editor, ELEMENT_TABLE) },
        at: trPath,
    });
    if (!tableEntry) return;
    const tableNode = tableEntry[0] as TTableElement;

    const { newCellChildren } = getPluginOptions<TablePlugin, V>(
        editor,
        ELEMENT_TABLE,
    );
    const [cellNode, cellPath] = findNode(editor, {
        at: fromRow,
        match: { type: getCellTypes(editor) },
    });
    const cellElement = cellNode as ExtendedTTableCellElement;

    const rowElem = trEntry[0] as TTableRowElement;
    console.log('rowElem', rowElem);

    const rowPath = cellPath.at(-2);
    const tablePath = cellPath.slice(0, -2);

    let nextRowIndex: number;
    let checkingRowIndex: number;
    let nextRowPath: number[];
    if (Path.isPath(at)) {
        nextRowIndex = cellElement.rowIndex;
        checkingRowIndex = cellElement.rowIndex - 1;
        nextRowPath = [...tablePath, rowPath];
    } else {
        nextRowIndex = cellElement.rowIndex + cellElement.rowSpan;
        checkingRowIndex = cellElement.rowIndex + cellElement.rowSpan - 1;
        nextRowPath = [...tablePath, rowPath + cellElement.rowSpan];
    }
    console.log('nextRowPath', nextRowPath);

    const firstRow = nextRowIndex === 0;
    if (firstRow) {
        checkingRowIndex = 0;
    }

    console.log('nextRowIndex', nextRowIndex, 'checkingRowIndex', checkingRowIndex);

    const colCount = getTableColumnCount(tableNode);
    const affectedCellsSet = new Set();
    Array.from({ length: colCount }, (_, i) => i).forEach((cI) => {
        const found = findCellByIndexes(tableNode, checkingRowIndex, cI);
        affectedCellsSet.add(found);
    });
    const affectedCells = Array.from(affectedCellsSet) as ExtendedTTableCellElement[];

    console.log('affectedCells', affectedCells);

    const newRowChildren: ExtendedTTableCellElement[] = [];
    affectedCells.forEach((cur) => {
        if (!cur) return;

        const curCell = cur as ExtendedTTableCellElement;
        const currentCellPath = findNodePath(editor, curCell);

        const endCurI = curCell.rowIndex + curCell.rowSpan - 1;
        console.log('current', curCell, endCurI, nextRowIndex);
        if (endCurI >= nextRowIndex && !firstRow) {
            // make higher
            setNodes<ExtendedTTableCellElement>(
                editor,
                { ...curCell, rowSpan: curCell.rowSpan + 1 },
                { at: currentCellPath },
            );
        } else {
            // add new
            const row = getParentNode(editor, currentCellPath)!;
            const rowElement = row[0] as TTableRowElement;
            const emptyCell = createEmptyCell(editor, rowElement, newCellChildren, curCell.colSpan, header) as ExtendedTTableCellElement;

            newRowChildren.push(emptyCell);
        }
    });

    console.log('newRow', newRowChildren);

    withoutNormalizing(editor, () => {
        insertElements(
            editor,
            {
                type: getPluginType(editor, ELEMENT_TR),
                children: newRowChildren,
            },
            {
                at: nextRowPath,
            },
        );
    });

    if (!disableSelect) {
        const cellEntry = getBlockAbove(editor, {
            match: { type: getCellTypes(editor) },
        });
        if (!cellEntry) return;

        const [, nextCellPath] = cellEntry;
        const cell = cellEntry[0] as ExtendedTTableCellElement;
        if (Path.isPath(at)) {
            nextCellPath[nextCellPath.length - 2] = at.at(-2)!;
        } else {
            nextCellPath[nextCellPath.length - 2] += cell.rowSpan;
        }

        select(editor, nextCellPath);
    }
};
