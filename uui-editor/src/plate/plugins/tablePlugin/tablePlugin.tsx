import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
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
    createTablePlugin,
    setNodes,
    withTable,
    Value,
    WithPlatePlugin,
    TablePlugin,
    isElement,
    KEY_DESERIALIZE_HTML,
    TTableRowElement,
    TDescendant,
} from "@udecode/plate";
import cx from "classnames";
import { Dropdown } from '@epam/uui-components';

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

import { ToolbarButton } from "../../../implementation/ToolbarButton";
import { Toolbar } from '../../../implementation/Toolbar';
import { deleteColumn } from './deleteColumn';
import { DEFAULT_COL_WIDTH } from './constants';

import { Table } from './Table';
import { TableHeaderCell } from "./TableHeaderCell";
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";

import tableCSS from './Table.module.scss';
import { useFocused, useReadOnly, useSelected } from 'slate-react';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';
import { ExtendedTTableCellElement } from './types';

const empt = {
    "data": { style: 'none', colSpan: 0, rowSpan: 1, },
    "type": "table_cell",
    colSpan: 0,
    rowSpan: 0,
    "children": [
        {
            "data": {},
            "type": "paragraph",
            "children": [
                {
                    "text": "",
                },
            ],
        },
    ],
}

const TableRenderer = (props: any) => {
    const editor = usePlateEditorState();
    const isReadonly = useReadOnly();
    const { cell, row } = getTableEntries(editor) || {};
    const ref = useRef(null);

    const { element } = props;

    const cellEntries = getTableGridAbove(editor, { format: 'cell' });

    const cellPath = useMemo(() => cell && cell[1], [cell]);
    const rowPath = useMemo(() => row && row[1][2] !== 0 && row[1], [row]);

    const hasEntries = !!cellEntries?.length;
    const [showToolbar, setShowToolbar] = useState(hasEntries);

    const isFocused = useFocused();
    const isSelected = useSelected();
    useEffect(() => {
        const block = getBlockAbove(editor);
        setShowToolbar(!isReadonly && isSelected && isFocused && block?.length && block[0].type === 'table');
    }, [isSelected, isFocused]);

    useEffect(() => setShowToolbar(!isReadonly && hasEntries), [hasEntries]);

    const onChangeDropDownValue = useCallback((value: boolean) => () => setShowToolbar(!isReadonly && value), []);

    const mergeCells = () => {
        const rowArray: any[] = [];
        cellEntries.forEach(([, path]) => rowArray.push(path[2]));

        // define colSpan
        const colSpan = cellEntries.reduce((acc, [data, path]: any) => {
            if (path[2] === cellEntries[0][1][2]) {
                return acc + (data.data?.colSpan ?? 1);
            }
            return acc;
        }, 0);

        // define rowSpan
        const alreadyCounted: number[] = [];
        const rowSpan = cellEntries.reduce((acc, [data, path]: any) => {
            const curRowCounted = alreadyCounted.includes(path[2]);
            if (path[2] !== cellEntries[0][1][2] && !curRowCounted) {
                alreadyCounted.push(path[2])
                return acc + (data.data?.rowSpan ?? 1);
            }
            return acc;
        }, 1);

        const mergedCol = {
            "data": { colSpan, rowSpan },
            "type": "table_cell",
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

        // cols to remove
        const cols: any = {};
        cellEntries.forEach(([, path]) => {
            if (cols[path[2]]) {
                cols[path[2]].push(path);
            } else {
                cols[path[2]] = [path];
            }
        });

        Object.values(cols).forEach((paths: any, i) => {
            paths?.forEach((path: [], j: number) => {
                if (i === 0 && j === paths.length - 1) {
                    setNodes(editor, mergedCol, { at: paths[j] }); // setting root
                    return;
                }
                setNodes(editor, empt, { at: paths[j] }); // set display: none to all others
            });
        });
    };

    const unmergeCells = () => {
        const [item]: any[] = cellEntries;
        const emptyCol = {
            "data": { colSpan: 1, rowSpan: 1 },
            "type": "table_cell",
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
            "type": "table_cell",
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
            <ToolbarButton
                onClick={ mergeCells }
                icon={ TableMerge }
            />
        );
    }, [cellEntries]);

    const renderToolbar = useCallback(() => {
        return (
            <Fragment>
                <ToolbarButton
                    onClick={ () => insertTableColumn(editor, { at: cellPath }) }
                    icon={ InsertColumnBefore }
                />
                <ToolbarButton
                    onClick={ () => insertTableColumn(editor) }
                    icon={ InsertColumnAfter }
                />
                <ToolbarButton
                    // TODO: improve column removal when we have merged cells in this column
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
            </Fragment>
        );
    }, [element, cellPath, rowPath, cellEntries]);

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
            onValueChange={ onChangeDropDownValue }
            value={ showToolbar }
            placement='top'
        />
    );
};


const withOurNormalizeTable = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    plugin: WithPlatePlugin<TablePlugin<V>, V, E>
) => {
    const { normalizeNode } = editor;

    /**
     * Normalize needed for tables pasted from docx.
     * They don't have cells which are merged.
     */
    editor.normalizeNode = ([node, path]) => {
        if (isElement(node)) {
            if (node.type === getPluginType(editor, ELEMENT_TABLE)) {

                const colNumber = (node.children[0].children as TDescendant[])
                    .reduce((acc, cur) => {
                        const cellElem = cur as ExtendedTTableCellElement;
                        const attrColSpan = (cellElem.attributes as { colspan?: number })?.colspan;
                        const colSpan = isNaN(attrColSpan) ? 1 : Number(attrColSpan);
                        return acc + colSpan;
                    }, 0);

                node.children.forEach((cur, rowIndex) => {
                    const rowElem = cur as TTableRowElement;

                    rowElem.children.forEach((current, colIndex) => {
                        const cellElem = current as ExtendedTTableCellElement;
                        const attrColSpan = (cellElem.attributes as { colspan?: number })?.colspan;
                        const attrRowSpan = (cellElem.attributes as { rowspan?: number })?.rowspan;
                        const colSpan = isNaN(attrColSpan) ? 1 : Number(attrColSpan);
                        const rowSpan = isNaN(attrRowSpan) ? 1 : Number(attrRowSpan);

                        // consider horizontal merge
                        if (colSpan > 1 && colNumber !== rowElem.children.length) {
                            // pasting empty cells before horizontally merged cell
                            // since pasted pasted tables from docx don't have it

                            rowElem.children.splice(colIndex, 0, ...Array(colSpan - 1).fill(empt));
                        }

                        // consider vertical merge
                        if (rowSpan > 1) {
                            // affected row indexes
                            const rows = Array.from({ length: rowSpan - 1 }, (_, index) => index + rowIndex + 1);

                            rows.forEach((rI) => {
                                const row = node.children[rI] as TTableRowElement;
                                if (row.children.length !== colNumber) {
                                    row.children.splice(colIndex, 0, empt);
                                }
                            });
                        }
                    });
                });
            }
        }

        return normalizeNode([node, path]);
    }


    return editor;
}

export const withOurTable = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    plugin: WithPlatePlugin<TablePlugin<V>, V, E>
) => {
    editor = withTable(editor, plugin);
    editor = withOurNormalizeTable(editor, plugin);

    return editor;
};

export const tablePlugin = () => createTablePlugin({
    overrideByKey: {
        [ELEMENT_TABLE]: {
            type: 'table',
            component: TableRenderer,
            withOverrides: withOurTable,
            inject: {
                pluginsByKey: {
                    [KEY_DESERIALIZE_HTML]: {
                        editor: {
                            insertData: {
                                transformFragment: (fragment) => {
                                    // wrap into paragraph pasted tables docx content
                                    return [{ type: PARAGRAPH_TYPE, children: fragment }, createNode()];
                                }
                            },
                        },
                    },
                },
            },
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
        },
    ];

    return [
        {
            type: PARAGRAPH_TYPE,
            children: [{
                type: getPluginType(editor, ELEMENT_TABLE),
                children: rows,
                data: { cellSizes: [DEFAULT_COL_WIDTH, DEFAULT_COL_WIDTH] },
            }],
        },
        createNode()
    ]
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