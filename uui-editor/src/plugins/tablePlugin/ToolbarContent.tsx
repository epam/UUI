import React, { Fragment, useMemo } from 'react';

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
import { usePlateEditorState, insertElements, TElementEntry, removeNodes, isCollapsed, getRange, createNode, TDescendant } from '@udecode/plate-common';
import { getTableEntries, insertTableColumn, insertTableRow, deleteRow, deleteTable, getEmptyCellNode } from '@udecode/plate-table';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';

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

        const colPaths = Array.from({ length: colSpan } as ArrayLike<number>, (_, index) => { return index; })
            .map((current) => {
                return colPath + current;
            });

        removeNodes(editor, { at: path });

        Array.from({ length: rowSpan } as ArrayLike<number>, (_, index) => { return index; })
            .map((current) => {
                const currentRowPath = rowPath + current;
                return colPaths.map((currentColPath) => [...tablePath, currentRowPath, currentColPath]);
            })
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
