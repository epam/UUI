import React, { useCallback, useMemo, useRef } from 'react';

import {
    createTablePlugin,
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TR,
    TableElement,
    usePlateEditorState,
    insertTableColumn,
    insertTableRow,
    deleteTable,
    ToolbarButton as PlateToolbarButton,
    deleteColumn,
    deleteRow,
    PlateEditor,
    getTableEntries,
    removeNodes,
    getTableGridAbove,
    insertElements,
    insertNodes,
    withoutNormalizing,
    getPluginType,
    someNode,
    getBlockAbove,
    selectEditor,
    getStartPoint,
    useTableColSizes,
} from "@udecode/plate";

import { TableHeaderCell } from "./TableHeaderCell";
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";
import cx from "classnames";
import imageBlockCss from "../imagePlugin/ImageBlock.scss";
import { ToolbarButton } from "../../../implementation/ToolbarButton";
import { ReactComponent as InsertColumnBefore } from "../../icons/table-add-column-left.svg";
import { ReactComponent as InsertColumnAfter } from "../../../icons/table-add-column-right.svg";
import { ReactComponent as RemoveColumn } from "../../../icons/table-delete-column.svg";
import { ReactComponent as InsertRowBefore } from "../../../icons/table-add-row-before.svg";
import { ReactComponent as InsertRowAfter } from "../../../icons/table-add-row-after.svg";
import { ReactComponent as RemoveRow } from "../../../icons/table-delete-row.svg";
import { ReactComponent as RemoveTable } from "../../../icons/table-table_remove-24.svg";
import { ReactComponent as TableIcon } from "../../../icons/table-add.svg";
import { ReactComponent as TableMerge } from "../../../icons/table-merge.svg";
import { ReactComponent as UnmergeCellsIcon } from "../../../icons/table-un-merge.svg";
import { isPluginActive, isTextSelected } from "../../../helpers";
import { Toolbar } from '../../../implementation/Toolbar';

import tableCSS from './Table.scss';

const DEFAULT_COL_WIDTH = 200;

const Table = (props: any) => {
    const editor = usePlateEditorState();
    const { cell, row } = getTableEntries(editor) || {};

    const { element } = props;
    const { data } = element;

    const cellEntries = getTableGridAbove(editor, { format: 'cell' });

    const cellPath = useMemo(() => cell && cell[1], [cell]);
    const rowPath = useMemo(() => row && row[1][2] !== 0 && row[1], [row]);

    const mergeCells = () => {
        const rowArray: any[] = [];
        cellEntries.forEach(([, path]) => rowArray.push(path[2]));

        const colSpan = cellEntries.reduce((acc, [data, path]: any) =>
            (acc += path[2] === cellEntries[0][1][2] ? (data.data?.colSpan || 1) : 0), 0);
        const rowSpan = cellEntries.reduce((acc, [data, path]: any) =>
            (acc += path[2] !== cellEntries[0][1][2] ? (data.data?.rowSpan || 1) : 0), 1);

        const emptyCol = {
            "data": { colSpan, rowSpan },
            "type": "td",
            "children": [
                {
                    "data": {},
                    "type": "paragraph",
                    "children": [
                        {
                            "text": cellEntries.map(([data]: any) => data?.children[0]?.children[0]?.text).join(' '),
                        },
                    ],
                },
            ],
        };

        const cols: any = {};

        cellEntries.forEach(([, path]) => {
            if (cols[path[2]]) {
                cols[path[2]].push(path);
            } else {
                cols[path[2]] = [path];
            }
        });

        Object.values(cols).forEach((paths: any) => {
            paths?.forEach((path: []) => {
                removeNodes(editor, { at: paths[0] });
            });
        });

        insertElements(editor, emptyCol, { at: cellEntries[0][1] });
    };

    const unmergeCells = () => {
        const [item]: any[] = cellEntries;
        const emptyCol = {
            "data": { colSpan: 1, rowSpan: 1 },
            "type": "td",
            "children": [
                {
                    "data": {},
                    "type": "paragraph",
                    "children": [
                        {
                            "text": cellEntries.map(([data]: any) => data?.children[0]?.children[0]?.text).join(' '),
                        },
                    ],
                },
            ],
        };
        const emptyColWithoutText = {
            "data": { colSpan: 1, rowSpan: 1 },
            "type": "td",
            "children": [
                {
                    "data": {},
                    "type": "paragraph",
                    "children": [
                        {
                            "text": '',
                        },
                    ],
                },
            ],
        };

        const cols: any = {};

        cellEntries.forEach(([, path]) => {
            if (cols[path[2]]) {
                cols[path[2]].push(path);
            } else {
                cols[path[2]] = [path];
            }
        });

        removeNodes(editor, { at: item[1] });
        for (let i = 1; i < item[0].data.colSpan; i++) {
            insertElements(editor, emptyColWithoutText, { at: item[1] });
        }
        for (let i = 1; i < item[0].data.rowSpan; i++) {
            insertElements(editor, emptyColWithoutText, {
                // Plus one row, when is vertical align
                at: item[1].map((item: number, index: number) => index === 2 ? item + 1 : item),
            });
        }
        insertElements(editor, emptyCol, { at: item[1] });
    };

    const renderMergeToolbar = useCallback(() => {
        return (
            <div className={ cx(imageBlockCss.imageToolbar, 'slate-prevent-blur') }>
                <ToolbarButton
                    onClick={ mergeCells }
                    icon={ TableMerge }
                />
            </div>
        );
    }, [cellEntries]);

    const renderToolbar = useCallback(() => {
        return (
            <div className={ cx(imageBlockCss.imageToolbar, 'slate-prevent-blur') }>
                <ToolbarButton
                    onClick={ () => insertTableColumn(editor, { at: cellPath }) }
                    icon={ InsertColumnBefore }
                />
                <ToolbarButton
                    onClick={ () => insertTableColumn(editor) }
                    icon={ InsertColumnAfter }
                />
                <ToolbarButton
                    onClick={ () => deleteColumn(editor) }
                    icon={ RemoveColumn }
                />
                <ToolbarButton
                    onClick={ () => insertTableRow(editor, { at: rowPath }) }
                    icon={ InsertRowBefore }
                />
                <ToolbarButton
                    onClick={ () => insertTableRow(editor) }
                    icon={ InsertRowAfter }
                />
                <ToolbarButton
                    onClick={ () => deleteRow(editor) }
                    icon={ RemoveRow }
                />
                <ToolbarButton
                    onClick={ () => deleteTable(editor) }
                    icon={ RemoveTable }
                />
                { cellEntries && cellEntries.length === 1
                    && ((cellEntries[0][0]?.data as any)?.colSpan > 1 || (cellEntries[0][0]?.data as any)?.rowSpan > 1)
                    && <ToolbarButton
                        onClick={ unmergeCells }
                        icon={ UnmergeCellsIcon }
                    />
                }
            </div>
        );
    }, [element, cellPath, rowPath, cellEntries]);

    const colSizesRef = useRef(data.cellSizes);
    colSizesRef.current = useTableColSizes(
        colSizesRef.current ? { ...props.element, colSizes: colSizesRef.current } : props.element
    );

    const tableWidth = colSizesRef.current.reduce((acc: number, cur: number) => acc + cur, 0);
    return (
        <div className={ cx(tableCSS.tableWrapper) }>
            <TableElement
                { ...props }
                styles={ { root: { width: tableWidth, "& > div": { visibility: 'hidden' } } } }
                className={ tableCSS.table }
                element={ {
                    ...element,
                    colSizes: colSizesRef.current
                } }
            />
            { !!cellEntries?.length && <Toolbar
                placement='bottom'
                children={ cellEntries.length > 1 ? renderMergeToolbar() : renderToolbar() }
                editor={ editor }
                isTable={ !!cellEntries }
            /> }
        </div>
    );
};


export const tablePlugin = () => createTablePlugin({
    overrideByKey: {
        [ELEMENT_TABLE]: {
            component: Table,
        },
        [ELEMENT_TR]: {
            component: TableRow,
        },
        [ELEMENT_TD]: {
            component: TableCell,
        },
        [ELEMENT_TH]: {
            component: TableHeaderCell,
        },
    },
});

const createInitialTable = (editor: PlateEditor) => {
    const rows = [
        {
            type: getPluginType(editor, ELEMENT_TR),
            children: [{
                type: getPluginType(editor, ELEMENT_TH),
                children: [editor.blockFactory()],
            },
            {
                type: getPluginType(editor, ELEMENT_TH),
                children: [editor.blockFactory()],
            }],
        },
        {
            type: getPluginType(editor, ELEMENT_TR),
            children: [{
                type: getPluginType(editor, ELEMENT_TD),
                children: [editor.blockFactory()],
            },
            {
                type: getPluginType(editor, ELEMENT_TD),
                children: [editor.blockFactory()],
            }],
        }
    ];

    return {
        type: getPluginType(editor, ELEMENT_TABLE),
        children: rows,
        data: { cellSizes: [DEFAULT_COL_WIDTH, DEFAULT_COL_WIDTH] },
    };
}

const selectFirstCell = (editor: PlateEditor) => {
    if (editor.selection) {
        const tableEntry = getBlockAbove(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        if (!tableEntry) return;

        selectEditor(editor, { at: getStartPoint(editor, tableEntry[1]) });
    }
}

export const TableButton = ({ editor, }: { editor: PlateEditor; }) => {
    if (!isPluginActive(ELEMENT_TABLE)) return null;

    const onCreateTable = async () => {
        if (!editor) return;

        withoutNormalizing(editor, () => {
            const isCurrentTableSelection = !!someNode(editor, {
                match: { type: getPluginType(editor, ELEMENT_TABLE) },
            });

            if (!isCurrentTableSelection) {
                insertNodes(editor, createInitialTable(editor));
                setTimeout(() => selectFirstCell(editor), 0);
            }
        });
    }

    return (
        <PlateToolbarButton
            styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
            onMouseDown={ onCreateTable }
            icon={ <ToolbarButton
                isDisabled={ isTextSelected(editor, true) }
                onClick={ () => {} }
                icon={ TableIcon }
            /> }
        />
    );
};