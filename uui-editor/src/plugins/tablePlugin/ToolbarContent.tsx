import React, { Fragment } from 'react';

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
import { useEditorRef } from '@udecode/plate-common';
import { getTableEntries, insertTableColumn, insertTableRow, deleteRow, deleteTable, unmergeTableCells, deleteColumn } from '@udecode/plate-table';
import { TABLE_HEADER_CELL_TYPE } from './constants';

function StyledRemoveTable() {
    return <RemoveTable className={ css.removeTableIcon } />;
}

export function TableToolbarContent({ canUnmerge }:{ canUnmerge:boolean }) {
    const editor = useEditorRef();

    return (
        <Fragment>
            <ToolbarButton
                key="insert-column-before"
                onClick={ () => {
                    const { cell } = getTableEntries(editor) || {};
                    const cellPath = cell?.[1];
                    insertTableColumn(editor, { at: cellPath });
                } }
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
                onClick={ () => {
                    const { cell, row } = getTableEntries(editor) || {};
                    const cellNode = cell?.[0];
                    const rowPath = row?.[1];

                    insertTableRow(editor, {
                        header: cellNode?.type === TABLE_HEADER_CELL_TYPE,
                        at: rowPath,
                        disableSelect: true,
                    });
                } }
                icon={ InsertRowBefore }
            />
            <ToolbarButton
                key="insert-row-after"
                onClick={ () => {
                    const { cell } = getTableEntries(editor) || {};
                    const cellNode = cell?.[0];

                    insertTableRow(editor, {
                        header: cellNode?.type === TABLE_HEADER_CELL_TYPE,
                    });
                } }
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
