import React, {
    Fragment,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import {
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TR,
    usePlateEditorState,
    insertTableColumn,
    insertTableRow,
    deleteTable,
    ToolbarButton as PlateToolbarButton,
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
    createNode,
    TTableElement,
    createTablePlugin,
    KEY_DESERIALIZE_HTML,
    getCellTypes,
    findNode,
    setElements,
    Value,
    WithPlatePlugin,
    withTable,
    TablePlugin,
    select,
    getEndPoint,
} from "@udecode/plate";
import cx from "classnames";
import { Dropdown } from '@epam/uui-components';
import { Range } from 'slate';

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
// import { ReactComponent as ClearIcon } from "../../icons/text-color-default.svg";
import { isPluginActive, isTextSelected } from "../../../helpers";

import { ToolbarButton } from "../../../implementation/ToolbarButton";
import { Toolbar } from '../../../implementation/Toolbar';
import { deleteColumn } from './deleteColumn';
import { DEFAULT_COL_WIDTH } from './constants';

import { Table } from './Table';
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";

import tableCSS from './Table.module.scss';
import { useFocused, useReadOnly, useSelected } from 'slate-react';
import { updateTableStructure } from './util';

const StyledRemoveTable = () => {
    return <RemoveTable className={ tableCSS.removeTableIcon } />
}

const noop = () => {};

const TableRenderer = (props: any) => {
    const editor = usePlateEditorState();
    const isReadonly = useReadOnly();
    const { cell, row } = getTableEntries(editor) || {};
    const ref = useRef(null);

    const { element } = props;
    let tableElem = element as TTableElement;

    const cellEntries = getTableGridAbove(editor, { format: 'cell' });

    const cellPath = useMemo(() => cell && cell[1], [cell]);
    const rowPath = useMemo(() => row && row[1][2] !== 0 && row[1], [row]);

    const hasEntries = !!cellEntries?.length;

    const isFocused = useFocused();
    const isSelected = useSelected();
    const showToolbar = !isReadonly && isSelected && isFocused && hasEntries;

    const mergeCells = () => {
        const rowArray: any[] = [];
        cellEntries.forEach(([, path]) => rowArray.push(path[2]));

        // define colSpan
        const colSpan = cellEntries.reduce((acc, [data, path]: any) => {
            if (path[1] === cellEntries[0][1][1]) {
                const cellColSpan =
                    (data?.attributes as any)?.colspan ??
                    data.data?.colSpan ??
                    data.colSpan ??
                    1;
                return acc + cellColSpan;
            }
            return acc;
        }, 0);

        // define rowSpan
        const alreadyCounted: number[] = [];
        const rowSpan = cellEntries.reduce((acc, [data, path]: any) => {
            const curRowCounted = alreadyCounted.includes(path[1]);
            if (path[1] !== cellEntries[0][1][1] && !curRowCounted) {
                alreadyCounted.push(path[1]);

                const cellRowSpan =
                    (data?.attributes as any)?.rowspan ??
                    data.data?.rowSpan ??
                    data.rowSpan ??
                    1;
                return acc + cellRowSpan;
            }
            return acc;
        }, 1);

        // cols to remove
        const cols: any = {};
        let hasHeaderCell = false;
        cellEntries.forEach(([entry, path]) => {
            if (!hasHeaderCell && entry.type === 'table_header_cell') {
                hasHeaderCell = true;
            }
            if (cols[path[1]]) {
                cols[path[1]].push(path);
            } else {
                cols[path[1]] = [path];
            }
        });

        Object.values(cols).forEach((paths: any) => {
            paths?.forEach((path: []) => {
                removeNodes(editor, { at: paths[0] });
            });
        });

        const mergedCell = {
            "data": { colSpan, rowSpan },
            "type": hasHeaderCell ? "table_header_cell" : "table_cell",
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

        insertElements(editor, mergedCell, { at: cellEntries[0][1] });
    };

    const unmergeCells = () => {
        const [item]: any[] = cellEntries;
        const [mergedCellElem] = item;
        const emptyCol = {
            "data": { colSpan: 1, rowSpan: 1 },
            "type": mergedCellElem.type,
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
            "type": mergedCellElem.type,
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
            if (cols[path[1]]) {
                cols[path[1]].push(path);
            } else {
                cols[path[1]] = [path];
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
            <ToolbarButton
                onClick={ mergeCells }
                icon={ TableMerge }
            />
        );
    }, [cellEntries]);

    let isHeaderCellSelected = false;
    if (isSelected) {
        const selectedNodes = findNode(editor, {
            at: Range.start(editor.selection),
            match: { type: getCellTypes(editor) },
        });
        isHeaderCellSelected = selectedNodes?.[0].type === 'table_header_cell'
    }

    const fillHeaderStyle = useCallback(() => {
        const [selectedNode, path] = findNode(editor, {
            at: Range.start(editor.selection),
            match: { type: getCellTypes(editor) },
        });
        const nextCellType = selectedNode.type === 'table_cell' ? 'table_header_cell' : 'table_cell';
        setElements(editor, { type: nextCellType }, {
            at: path,
            match: (node) => node.type === 'table_cell' || node.type === 'table_header_cell'
        });
    }, []);

    const renderToolbar = useCallback(() => {
        return (
            <Fragment>
                {/* <ToolbarButton
                    key='clear-header'
                    onClick={ () => fillHeaderStyle() }
                    isActive={ isHeaderCellSelected }
                    icon={ ClearIcon }
                /> */}
                <ToolbarButton
                    key='insert-column-before'
                    onClick={ () => insertTableColumn(editor, { at: cellPath }) }
                    icon={ InsertColumnBefore }
                />
                <ToolbarButton
                    key='insert-column-after'
                    onClick={ () => insertTableColumn(editor) }
                    icon={ InsertColumnAfter }
                />
                <ToolbarButton
                    key='remove-column'
                    // TODO: improve column removal when we have merged cells in this column
                    onClick={ () => deleteColumn(editor) }
                    icon={ RemoveColumn }
                />
                <ToolbarButton
                    key='insert-row-before'
                    onClick={ () => insertTableRow(editor, { at: rowPath }) }
                    icon={ InsertRowBefore }
                />
                <ToolbarButton
                    key='insert-row-after'
                    onClick={ () => insertTableRow(editor) }
                    icon={ InsertRowAfter }
                />
                <ToolbarButton
                    key='delete-row'
                    onClick={ () => deleteRow(editor) }
                    icon={ RemoveRow }
                />
                <ToolbarButton
                    key='delete-table'
                    onClick={ () => deleteTable(editor) }
                    icon={ StyledRemoveTable }
                    cx={ tableCSS.removeTableButton }
                />
                { cellEntries && cellEntries.length === 1
                    && ((cellEntries[0][0]?.data as any)?.colSpan > 1 || (cellEntries[0][0]?.data as any)?.rowSpan > 1)
                    && <ToolbarButton
                        key='unmerge-cells'
                        onClick={ unmergeCells }
                        icon={ UnmergeCellsIcon }
                    />
                }
            </Fragment>
        );
    }, [element, cellPath, rowPath, cellEntries]);

    // assign valid colIndexes in case of merged cells
    tableElem = updateTableStructure(tableElem);

    return (
        <Dropdown
            renderTarget={ (innerProps: any) => (
                <div ref={ innerProps.ref } >
                    <div ref={ ref } className={ cx(tableCSS.tableWrapper) }>
                        <Table { ...props } />
                    </div>
                </div>
            ) }
            renderBody={ () => (
                <Toolbar
                    placement='bottom'
                    children={ cellEntries.length > 1 ? renderMergeToolbar() : renderToolbar() }
                    editor={ editor }
                    isTable
                />
            ) }
            onValueChange={ noop }
            value={ showToolbar }
            placement='top'
        />
    );
};

const wiOurSetFragmentDataTable = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    plugin: WithPlatePlugin<TablePlugin<V>, V, E>
) => {
    const { setFragmentData } = editor;

    /**
     * Overrides behavior for single cell copy | cut operation.
     * TODO: move to plate
     */
    editor.setFragmentData = (
        data: DataTransfer,
        originEvent?: 'drag' | 'copy' | 'cut' | undefined
    ) => {
        const tableEntry = getTableGridAbove(editor, { format: 'table' })?.[0];
        const selectedCellEntries = getTableGridAbove(editor, { format: 'cell' });
        const initialSelection = editor.selection;
        const CELLS_NUMBER = 1;

        if (
            tableEntry &&
            initialSelection &&
            selectedCellEntries.length === CELLS_NUMBER &&
            originEvent === 'copy' || originEvent === 'cut'
        ) {
            const [[selectedCellNode, cellPath]] = selectedCellEntries;
            const cellContents = selectedCellNode.children;

            select(editor, {
                anchor: getStartPoint(editor, cellPath),
                focus: getEndPoint(editor, cellPath),
            });
            // set data from selection
            setFragmentData(data);

            const plainText = data.getData('text/plain');
            data.setData('text/csv', plainText);
            data.setData('text/tsv', plainText);
            data.setData('text/plain', plainText);

            const htmlContent = data.getData('text/html');
            data.setData('text/html', htmlContent);

            // set slate fragment
            const selectedFragmentStr = JSON.stringify(cellContents);
            const encodedFragment = window.btoa(
                encodeURIComponent(selectedFragmentStr)
            );
            data.setData('application/x-slate-fragment', encodedFragment);

            return;
        }

        setFragmentData(data, originEvent);
    }

    return editor;
}

const withOurTable = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    plugin: WithPlatePlugin<TablePlugin<V>, V, E>
) => {
    editor = withTable(editor, plugin);
    editor = wiOurSetFragmentDataTable(editor, plugin);

    return editor;
};

export const tablePlugin = () => createTablePlugin({
    overrideByKey: {
        [ELEMENT_TABLE]: {
            type: 'table',
            component: TableRenderer,
            withOverrides: withOurTable,
        },
        [ELEMENT_TR]: {
            type: 'table_row',
            component: TableRow,
        },
        [ELEMENT_TD]: {
            type: 'table_cell',
            component: TableCell,
        },
        [ELEMENT_TH]: {
            type: 'table_header_cell',
            component: TableCell,
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
        },
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