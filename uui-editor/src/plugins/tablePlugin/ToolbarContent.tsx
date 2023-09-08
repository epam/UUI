import React, { Fragment, useEffect, useMemo } from 'react';

import { ReactComponent as UnmergeCellsIcon } from '../../icons/table-un-merge.svg';
import { ReactComponent as InsertColumnBefore } from '../../icons/table-add-column-left.svg';
import { ReactComponent as InsertColumnAfter } from '../../icons/table-add-column-right.svg';
import { ReactComponent as RemoveColumn } from '../../icons/table-delete-column.svg';
import { ReactComponent as InsertRowBefore } from '../../icons/table-add-row-before.svg';
import { ReactComponent as InsertRowAfter } from '../../icons/table-add-row-after.svg';
import { ReactComponent as RemoveRow } from '../../icons/table-delete-row.svg';
import { ReactComponent as RemoveTable } from '../../icons/table-table_remove-24.svg';

import css from './ToolbarContent.module.scss';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { deleteColumn } from './deleteColumn';
import { usePlateEditorState, insertElements, TElementEntry, removeNodes, isCollapsed, TDescendant, findNode, getPluginType, findNodePath } from '@udecode/plate-common';
import { getTableEntries, insertTableColumn, deleteRow, deleteTable, getEmptyCellNode, ELEMENT_TABLE, TTableElement, getCellTypes, TTableRowElement } from '@udecode/plate-table';
import { insertTableRow } from './insertTableRow';

function StyledRemoveTable() {
    return <RemoveTable className={ css.removeTableIcon } />;
}

export function TableToolbarContent({ cellEntries }: { cellEntries: TElementEntry[] }) {
    const editor = usePlateEditorState();

    const { cell, row } = getTableEntries(editor) || {};
    const cellPath = useMemo(() => cell && cell[1], [cell]);
    const rowPath = useMemo(() => row && row[1][2] !== 0 && row[1], [row]);

    const canUnmerge = isCollapsed(editor.selection)
    && cellEntries
    && cellEntries.length === 1
    && ((cellEntries[0][0] as any)?.colSpan > 1
        || (cellEntries[0][0] as any)?.rowSpan > 1);

    useEffect(() => {
        const [[cellElem, path]] = cellEntries;
        const tableEntry = findNode(editor, {
            at: path,
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        console.log('tableNode', tableEntry[0]);
    }, [cellEntries]);

    const unmergeCells = () => {
        const [[cellElem, path]] = cellEntries;

        // creating new object per iteration is essential here
        const createEmptyCell = (children?: TDescendant[]) => {
            return {
                ...getEmptyCellNode(editor, {
                    header: cellElem.type === 'th',
                    newCellChildren: children,
                }),
                colSpan: 1,
                rowSpan: 1,
            };
        };

        const tablePath = path.slice(0, -2);

        const cellPath = path.slice(-2);
        const [rowPath, colPath] = cellPath;
        const colSpan = cellElem.colSpan;
        const rowSpan = cellElem.rowSpan;

        console.log('cellPath', cellPath, 'rowSpan', rowSpan, 'colSpan', colSpan);

        const colPaths = Array.from({ length: colSpan } as ArrayLike<number>, (_, index) => { return index; })
            .map((current) => {
                return colPath + current;
            });

        let paths = Array.from({ length: rowSpan } as ArrayLike<number>, (_, index) => { return index; })
            .map((current) => {
                const currentRowPath = rowPath + current;
                return colPaths.map((currentColPath) => [...tablePath, currentRowPath, currentColPath]);
            });

        const tableEntry = findNode(editor, {
            at: path,
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        const table = tableEntry?.[0] as TTableElement;
        // console.log('found table', table);

        paths = paths.map((cellsPaths) => {
            const currentPath = cellsPaths[0]; // pick starting cell in the row
            const [rowIndex, colIndex] = currentPath.slice(-2);
            console.log('cellsPaths', cellsPaths);

            let newCellPaths = cellsPaths;
            if (colIndex > 0) {
                const prevCellInRowPath = [...tablePath, rowIndex, colIndex - 1];
                const foundEntry = findNode(editor, {
                    at: prevCellInRowPath,
                    match: { type: getCellTypes(editor) },
                });
                console.log('prevCellInRowPath', prevCellInRowPath, 'foundEntry', foundEntry);

                /**
                 * Search for the last cell path in the row.
                 * We can't just paste new cell with path gaps.
                 * Slate needs elements with paths one by each other.
                 */
                if (!foundEntry) {
                    const currentRow = table.children[rowIndex] as TTableRowElement;
                    console.log('table', table, rowIndex, currentRow);
                    const endingCell = currentRow.children.at(-1);
                    const endingCellPath = findNodePath(editor, endingCell);
                    console.log('endingCell', endingCell, 'endingCellPath', endingCellPath);

                    const [, startingColIndex] = endingCellPath.slice(-2);
                    const startWith = startingColIndex === 0 ? startingColIndex : startingColIndex + 1;

                    newCellPaths = cellsPaths.map((currentCellPath, i) => {
                        const currentRowPath = currentCellPath.slice(0, -1);
                        const newPath = [...currentRowPath, startWith + i];
                        return newPath;
                    });
                    // if (startingColIndex === 0) {

                    //     // removeNodes(editor, { at: endingCellPath.slice(0, -1) });

                    //     // const newRow =
                    //     newCellPaths = cellsPaths.map((currentCellPath, i) => {
                    //         const currentRowPath = currentCellPath.slice(0, -1);
                    //         const newPath = [...currentRowPath, startingColIndex + i];
                    //         return newPath;
                    //     });
                    // } else {

                    //     newCellPaths = cellsPaths.map((currentCellPath, i) => {
                    //         const currentRowPath = currentCellPath.slice(0, -1);
                    //         const newPath = [...currentRowPath, startingColIndex + i + 1];
                    //         return newPath;
                    //     });
                    // }

                    // console.log('newCellPaths', newCellPaths);
                }
            }
            return newCellPaths;
        });

        console.log('-----------------');

        removeNodes(editor, { at: path });

        console.log('paths', paths);
        paths
            .flat()
            .forEach((p, index) => insertElements(
                editor,
                index === 0 ? createEmptyCell(cellElem.children) : createEmptyCell(),
                { at: p },
            ));
    };

    return (
        <Fragment>
            <ToolbarButton
                key="insert-column-before"
                onClick={ () => insertTableColumn(editor, { at: cellPath }) }
                icon={ InsertColumnBefore }
            />
            <ToolbarButton
                key="insert-column-after"
                onClick={ () => insertTableColumn(editor) }
                icon={ InsertColumnAfter }
            />
            <ToolbarButton
                key="remove-column"
                // TODO: improve column removal when we have merged cells in this column
                onClick={ () => deleteColumn(editor) }
                icon={ RemoveColumn }
            />
            <ToolbarButton
                key="insert-row-before"
                onClick={ () => insertTableRow(editor, {
                    header: cell[0].type === 'table_header_cell',
                    at: rowPath,
                    disableSelect: true,
                }) }
                icon={ InsertRowBefore }
            />
            <ToolbarButton
                key="insert-row-after"
                onClick={ () => insertTableRow(editor, {
                    header: cell[0].type === 'table_header_cell',
                }) }
                icon={ InsertRowAfter }
            />
            <ToolbarButton
                key="delete-row"
                onClick={ () => deleteRow(editor) }
                icon={ RemoveRow }
            />
            <ToolbarButton
                key="delete-table"
                onClick={ () => deleteTable(editor) }
                icon={ StyledRemoveTable }
                cx={ css.removeTableButton }
            />
            { canUnmerge && (
                <ToolbarButton
                    key="unmerge-cells"
                    onClick={ unmergeCells }
                    icon={ UnmergeCellsIcon }
                />
            ) }
        </Fragment>
    );
}
