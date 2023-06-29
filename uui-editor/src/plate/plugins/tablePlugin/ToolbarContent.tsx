import React, { Fragment, useMemo } from "react";

import {
    TElementEntry,
    deleteRow,
    deleteTable,
    getTableEntries,
    insertElements,
    insertTableColumn,
    insertTableRow,
    removeNodes,
    usePlateEditorState
} from "@udecode/plate";

import { ReactComponent as UnmergeCellsIcon } from "../../../icons/table-un-merge.svg";
import { ReactComponent as InsertColumnBefore } from "../../icons/table-add-column-left.svg";
import { ReactComponent as InsertColumnAfter } from "../../../icons/table-add-column-right.svg";
import { ReactComponent as RemoveColumn } from "../../../icons/table-delete-column.svg";
import { ReactComponent as InsertRowBefore } from "../../../icons/table-add-row-before.svg";
import { ReactComponent as InsertRowAfter } from "../../../icons/table-add-row-after.svg";
import { ReactComponent as RemoveRow } from "../../../icons/table-delete-row.svg";
import { ReactComponent as RemoveTable } from "../../../icons/table-table_remove-24.svg";

import tableCSS from './Table.module.scss';
import { ToolbarButton } from "../../../implementation/ToolbarButton";
import { deleteColumn } from './deleteColumn';
import { createCell } from "./utils";

const StyledRemoveTable = () => {
    return <RemoveTable className={ tableCSS.removeTableIcon } />
}

export const TableToolbarContent = ({ cellEntries }: { cellEntries: TElementEntry[] }) => {
    const editor = usePlateEditorState();

    const { cell, row } = getTableEntries(editor) || {};
    const cellPath = useMemo(() => cell && cell[1], [cell]);
    const rowPath = useMemo(() => row && row[1][2] !== 0 && row[1], [row]);

    const unmergeCells = () => {
        const [item]: any[] = cellEntries;
        const [mergedCellElem] = item;
        const textContent = cellEntries
            .map(([data]: any) => data?.children[0]?.children[0]?.text)
            .join(' ');
        const mergedCell = createCell({ type: mergedCellElem.type, textContent });
        const emptyCell = createCell({ type: mergedCellElem.type });

        removeNodes(editor, { at: item[1] });
        for (let i = 1; i < item[0].data.colSpan; i++) {
            insertElements(editor, emptyCell, { at: item[1] });
        }
        for (let i = 1; i < item[0].data.rowSpan; i++) {
            insertElements(editor, emptyCell, {
                // plus one row, when is vertical align
                at: item[1].map((item: number, index: number) => index === 2 ? item + 1 : item),
            });
        }
        insertElements(editor, mergedCell, { at: item[1] });
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
                    disableSelect: true
                }) }
                icon={ InsertRowBefore }
            />
            <ToolbarButton
                key="insert-row-after"
                onClick={ () => insertTableRow(editor, {
                    header: cell[0].type === 'table_header_cell'
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
                cx={ tableCSS.removeTableButton }
            />
            { cellEntries &&
                cellEntries.length === 1 &&
                ((cellEntries[0][0]?.data as any)?.colSpan > 1 ||
                    (cellEntries[0][0]?.data as any)?.rowSpan > 1) && (
                    <ToolbarButton
                        key="unmerge-cells"
                        onClick={ unmergeCells }
                        icon={ UnmergeCellsIcon }
                    />
                ) }
        </Fragment>
    );
};
