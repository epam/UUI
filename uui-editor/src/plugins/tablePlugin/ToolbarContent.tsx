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
import { useEditorState } from '@udecode/plate-common';
import { getTableEntries, insertTableColumn, insertTableRow, deleteRow, deleteTable, unmergeTableCells, deleteColumn } from '@udecode/plate-table';

function StyledRemoveTable() {
    return <RemoveTable className={ css.removeTableIcon } />;
}

export function TableToolbarContent({ canUnmerge }:{ canUnmerge:boolean }) {
    const editor = useEditorState(); // TODO: use useEditorRef

    const { cell, row } = getTableEntries(editor) || {};
    const cellPath = useMemo(() => cell && cell[1], [cell]);
    const rowPath = useMemo(() => row && row[1][2] !== 0 && row[1], [row]);

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
            { canUnmerge && (<ToolbarButton key="unmerge-cells" onClick={ () => unmergeTableCells(editor) } icon={ UnmergeCellsIcon } />) }
        </Fragment>
    );
}
