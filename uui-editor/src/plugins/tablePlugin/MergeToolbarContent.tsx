import React, { useEffect } from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { usePlateEditorState, TElementEntry, removeNodes, insertElements, getRange, findNode, TElement, getPluginType, TDescendant } from '@udecode/plate-common';
import { ELEMENT_TABLE, ELEMENT_TR, TTableCellElement, TTableElement, TTableRowElement, getCellTypes, getEmptyCellNode, getEmptyRowNode } from '@udecode/plate-table';
import { Path } from 'slate';
import { getColSpan, getRowSpan } from './utils';
import { ExtendedTTableCellElement } from './types';
import { getTableGridAbove } from './getTableGridAbove';

const getRowSpanInCol = (table: TTableCellElement, colIndex: number) => {
    return table.children.reduce((acc, cur) => {
        const rowEl = cur as TTableRowElement;
        const cellEl = rowEl.children.find((cell) => {
            const cellElem = cell as ExtendedTTableCellElement;
            return cellElem?.colIndex === colIndex;
        }) as ExtendedTTableCellElement;

        // console.log('cellEl', cellEl);

        if (colIndex === cellEl?.colIndex) {
            const curRowSpan = cellEl?.rowSpan || 1;
            return acc + curRowSpan;
        }
        return acc;
    }, 0);
};

export function MergeToolbarContent({
    cellEntries: selectedCellEntries,
    cellEntriesAsTable,
}: {
    cellEntries: TElementEntry[],
    cellEntriesAsTable: TElementEntry[]
}) {
    const editor = usePlateEditorState();

    // const cellEntriesWithinTable = getTableGridAbove(editor, { format: 'table' });

    // useEffect(() => {
    //     const cells = selectedCellEntries.map(
    //         ([el, path]) => JSON.stringify(
    //             el.children.flatMap((node: any) => ([node.children[0].text, path])),
    //         ),
    //     );
    //     const [[table]] = cellEntriesAsTable;
    //     const tableEl = table as TTableElement;
    //     // console.log('selected', cells, 'cellEntriesWithinTable', tableEl.children);
    // }, [selectedCellEntries, cellEntriesAsTable]);

    const mergeCells = () => {
        const [[table]] = cellEntriesAsTable;
        const firstRow = table.children?.[0] as TTableRowElement;

        // define colSpan
        const colSpan = firstRow.children.reduce((acc, cur) => {
            const cellElement = cur as ExtendedTTableCellElement;
            return acc + cellElement?.colSpan || 1;
        }, 0);

        // define rowSpan
        const firstCell = firstRow.children?.[0] as ExtendedTTableCellElement;
        const firstColIndex = firstCell.colIndex;
        const rowSpan = getRowSpanInCol(table, firstColIndex);

        // const isValid = isTableRectangular(table);
        // console.log('isValid', isValid);

        // const rowSpans = Array.from({ length: colSpan } as ArrayLike<number>, (_, index) => {
        //     const relativeColIndex = firstColIndex + index;
        //     return getRowSpanInCol(table, relativeColIndex);
        // });
        // const rowsValid = allEqual(rowSpans);
        // console.log('rowsValid', rowsValid, 'rowSpans', rowSpans);

        const [startElem, startCellPath] = selectedCellEntries[0];
        const startCellElem = startElem as ExtendedTTableCellElement;

        const startRowIndex = startCellElem.rowIndex;
        const startColIndex = startCellElem.colIndex;
        const endRowIndex = startRowIndex + rowSpan - 1;
        const endColIndex = startColIndex + colSpan - 1;

        // console.log('dimensions', startRowIndex, startColIndex, endRowIndex, endColIndex);

        // console.log('startPath', startCellPath.slice(-2));
        // console.log('dimensions', rowSpan, colSpan);

        const contents = [];
        for (const cellEntry of selectedCellEntries) {
            const [el] = cellEntry;
            contents.push(...el.children); // TODO: make deep clone here
        }

        const cols: any = {};
        let hasHeaderCell = false;
        selectedCellEntries.forEach(([entry, path]) => {
            if (!hasHeaderCell && entry.type === 'table_header_cell') {
                hasHeaderCell = true;
            }
            if (cols[path[1]]) {
                cols[path[1]].push(path);
            } else {
                cols[path[1]] = [path];
            }
        });

        // console.log('colSpan', colSpan, 'rowSpan', rowSpan, 'cols', cols);

        // removes multiple cells with on same path.
        // once cell removed, next cell in the row will settle down on that path
        Object.values(cols).forEach((paths: any) => {
            paths?.forEach(() => {
                const validEntry = findNode(editor, {
                    at: paths[0],
                    match: { type: getCellTypes(editor) },
                });
                const validNode = validEntry?.[0] as ExtendedTTableCellElement;
                const shouldRemove = !!selectedCellEntries.find((entry) => {
                    const cellElem = entry[0] as ExtendedTTableCellElement;
                    return cellElem === validNode;
                });

                if (validNode && shouldRemove) {
                    console.log('removing node at path', paths[0]);
                    removeNodes(editor, { at: paths[0] });

                    const colIndex = paths[0].at(-1);
                    if (colIndex === 0) {
                        // just removed last cell in the row
                        const rowPath = paths[0].slice(0, -1);
                        console.log('rowPath', rowPath);

                        // const emptyRow = {
                        //     type: getPluginType(editor, ELEMENT_TR),
                        //     children: [] as TDescendant[],
                        // };
                        // removeNodes(editor, { at: paths[0].slice(0, -1) });
                        // insertElements(editor, {
                        //     ...getEmptyCellNode(editor, {
                        //         header: selectedCellEntries[0][0].type === 'th',
                        //         // newCellChildren: contents,
                        //     }),
                        //     dummy: true,
                        //     colSpan: 0,
                        //     rowSpan: 0,
                        // }, { at: paths[0] });
                    }
                }
            });
        });

        const mergedCell = {
            ...getEmptyCellNode(editor, {
                header: selectedCellEntries[0][0].type === 'th',
                newCellChildren: contents,
            }),
            colSpan,
            rowSpan,
        };

        insertElements(editor, mergedCell, { at: startCellPath });
    };

    return (
        <ToolbarButton
            onClick={ mergeCells }
            icon={ TableMerge }
        />
    );
}
