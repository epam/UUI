import React, { useEffect } from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { usePlateEditorState, TElementEntry, removeNodes, insertElements, getRange, findNode, TElement, getPluginType } from '@udecode/plate-common';
import { ELEMENT_TABLE, TTableCellElement, TTableElement, TTableRowElement, getCellTypes, getEmptyCellNode } from '@udecode/plate-table';
import { Path } from 'slate';
import { getColSpan, getRowSpan } from './utils';
import { ExtendedTTableCellElement } from './types';
import { getTableGridAbove } from './getTableGridAbove';

export function MergeToolbarContent({ cellEntries: selectedCellEntries }: { cellEntries: TElementEntry[] }) {
    const editor = usePlateEditorState();

    const cellEntriesWithinTable = getTableGridAbove(editor, { format: 'table' });

    useEffect(() => {
        const cells = selectedCellEntries.map(
            ([el, path]) => JSON.stringify(
                el.children.flatMap((node: any) => ([node.children[0].text, path])),
            ),
        );
        const [[table]] = cellEntriesWithinTable;
        const tableEl = table as TTableElement;
        console.log('selected', cells, 'cellEntriesWithinTable', tableEl.children);
    }, [selectedCellEntries, cellEntriesWithinTable]);

    const mergeCells = () => {
        const [[table]] = cellEntriesWithinTable;
        const firstRow = table.children?.[0] as TTableRowElement;

        // define colSpan
        const colSpan = firstRow.children.reduce((acc, cur) => {
            const cellElement = cur as ExtendedTTableCellElement;
            return acc + cellElement?.colSpan || 1;
        }, 0);

        // define rowSpan
        const firstCell = firstRow.children?.[0] as ExtendedTTableCellElement;
        const firstColIndex = firstCell.colIndex;
        const rowSpan = table.children.reduce((acc, cur) => {
            const rowEl = cur as TTableRowElement;
            const cellEl = rowEl.children?.[0] as ExtendedTTableCellElement;

            // consider only first col
            if (firstColIndex === cellEl?.colIndex) {
                const curRowSpan = cellEl?.rowSpan || 1;
                return acc + curRowSpan;
            }
            return acc;
        }, 0);

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

        console.log('colSpan', colSpan, 'rowSpan', rowSpan, 'cols', cols);

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
                    removeNodes(editor, { at: paths[0] });
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
