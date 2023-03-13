import React, { useCallback, useEffect, useMemo } from 'react';

import {
    createTablePlugin,
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TR,
    PlateTableElement,
    usePlateEditorState,
    insertTableColumn,
    insertTableRow,
    deleteTable,
    ToolbarButton as PlateToolbarButton,
    getSelectionBoundingClientRect,
    deleteColumn,
    deleteRow,
    PlateEditor,
    insertTable,
    getTableEntries,
    removeNodes,
    getTableGridAbove,
    insertElements,
} from "@udecode/plate";

import { TableHeaderCell } from "./TableHeaderCell";
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";
import cx from "classnames";
import css from "../imagePlugin/ImageBlock.scss";
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
import { Dropdown } from "@epam/uui-components";
import { uuiSkin } from "@epam/uui-core";
import { isPluginActive, isTextSelected } from "../../../helpers";
import { Toolbar } from '../../../implementation/Toolbar';

import tableCSS from './Table.scss';

const { FlexRow } = uuiSkin;

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
                removeNodes(editor, { at: paths[0]});
            });
        });

        insertElements(editor, emptyCol, {at: cellEntries[0][1]});
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

        removeNodes(editor, { at: item[1]});
        for (let i = 1; i < item[0].data.colSpan; i++) {
            insertElements(editor, emptyColWithoutText, {at: item[1]});
        }
        for (let i = 1; i < item[0].data.rowSpan; i++) {
            insertElements(editor, emptyColWithoutText, {
                // Plus one row, when is vertical align
                at: item[1].map((item: number, index: number) => index === 2 ? item + 1 : item),
            });
        }
        insertElements(editor, emptyCol, {at: item[1]});
    };

    const renderMergeToolbar = useCallback(() => {
        return (
            <div className={ cx(css.imageToolbar, 'slate-prevent-blur') }>
                <ToolbarButton
                    onClick={ mergeCells }
                    icon={ TableMerge }
                />
            </div>
        );
    }, [cellEntries]);

    const renderToolbar = useCallback(() => {
        return (
            <div className={ cx(css.imageToolbar, 'slate-prevent-blur') }>
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
                    onClick={ () =>  insertTableRow(editor, { at: rowPath }) }
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
                /> }
            </div>
        );
    }, [element, cellPath, rowPath, cellEntries]);

    return (
        <div className={ cx(css.wrapper, tableCSS.tableWrapper) }>
            <PlateTableElement
                { ...props }
                className={ tableCSS.table }
                element={ {
                    ...element,
                    ...(data?.cellSizes ? { colSizes: data?.cellSizes } : {}),
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
    // return (
    //     <Dropdown
    //         renderTarget={ (innerProps: any) => (
    //             <div ref={ innerProps.ref } className={ cx(css.wrapper, tableCSS.tableWrapper) }>
    //                 <PlateTableElement
    //                     { ...props }
    //                     className={ tableCSS.table }
    //                     element={ {
    //                         ...element,
    //                         ...(data?.cellSizes ? { colSizes: data?.cellSizes } : {}),
    //                     } }
    //                 />
    //             </div>
    //         ) }
    //         renderBody={ () =>  <FlexRow cx={ css.imageToolbarWrapper }>
    //             <Toolbar
    //                 children={ cellEntries && cellEntries.length > 1 ? renderMergeToolbar() : renderToolbar() }
    //                 editor={ editor }
    //                 isImage={ false }
    //             />
    //         </FlexRow> }
    //         value={ !!cellEntries?.length }
    //         placement='bottom'
    //     />
    // );
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

interface ITableButton {
    editor: PlateEditor;
}


export const TableButton = ({
                                editor,
                            }: ITableButton) => {

    if (!isPluginActive(ELEMENT_TABLE)) return null;

    return (
        <PlateToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
            onMouseDown={ async (event) => {
                if (!editor) return;

                insertTable(editor, { colCount: 2, rowCount: 2 });
            } }
            icon={ <ToolbarButton
                isDisabled={ isTextSelected(editor, true) }
                onClick={ () => {} }
                icon={ TableIcon }
                //isActive={ block?.length && block[0].type === 'image' }
            /> }
        />
    );
};

// import { Editor as CoreEditor } from "slate";
// import EditTable from 'slate-uui-table-plugin';
// import * as React from "react";
// import { Table } from "./Table";
// import { TableRow } from "./TableRow";
// import { TableCell } from "./TableCell";
// import { TableHeaderCell } from "./TableHeaderCell";
// import { Editor } from "slate-react";
// import { ReactComponent as TableIcon } from "../../icons/table-add.svg";
// import { ToolbarButton } from '../../implementation/ToolbarButton';
// import {getBlockDesirialiser, isTextSelected} from '../../helpers';
// import { mergeCellsPlugin } from '../tableMergePlugin/tableMergePlugin';
//
// export const tablePlugin = () => {
//     const editTable = EditTable();
//
//     const renderBlock = (props: any, editor: CoreEditor, next: () => any) => {
//         switch (props.node.type) {
//             case 'table': return <Table { ...props } editor={ editor } />;
//             case 'table_row': return <TableRow { ...props } />;
//             case 'table_cell': return <TableCell { ...props } editor={ editor } />;
//             case 'table_header_cell': return <TableHeaderCell { ...props } editor={ editor } />;
//         }
//         return next();
//     };
//
//     const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {
//         let parentNode: any = editor.value.document.getParent(editor.value.focusBlock.key);
//
//         if ((event.key === 'Backspace' || event.key === 'Delete') && parentNode.type === 'table_cell' && parentNode.nodes.toArray().length === 1 && editor.value.focusBlock.text === '') {
//             return;
//         }
//
//         next();
//     };
//
//     const getCellIndex = (editor: any, elem: any) => {
//         let counter = 0;
//         let elemPosition = 0;
//         const elemParent = editor.value.document.getParent(elem.key);
//
//         (editor.value.document as any).getParent(elemParent.key).nodes.forEach((elem: any) => {
//             elem.key === elemParent.key ? elemPosition = counter : counter += 1;
//         });
//
//         return elemPosition;
//     };
//
//     // Add new column to the table on correct new column position
//     const addNewColumn = (editor: CoreEditor, props: any, position?: 'before' | 'after') => {
//         let startBlockIndex = getCellIndex(editor, editor.value.startBlock);
//         const parentElem: any = editor.value.document.getParent(editor.value.document.getPath(editor.value.startBlock.key));
//
//         if (position !== 'before') {
//             startBlockIndex++;
//         }
//
//         if (parentElem.data !== undefined && parentElem.data.get('colSpan') > 1 && position !== 'before') {
//             startBlockIndex += parentElem.data.get('colSpan') - 1;
//         }
//         (editor as any).insertColumn(startBlockIndex, {typeHeaderCell: 'table_header_cell'});
//     };
//
//     const removeSelectedColumn = (editor: CoreEditor, props: any) => {
//         let startBlockIndex = getCellIndex(editor, editor.value.startBlock);
//         const selectedCell: any = editor.value.document.getParent(editor.value.document.getPath(editor.value.startBlock.key));
//         const selectedRow: any = editor.value.document.getParent(editor.value.document.getPath(selectedCell.key));
//         const selectedTable: any = editor.value.document.getParent(editor.value.document.getPath(selectedRow.key));
//         let cellColspan = selectedCell.data.get('colSpan');
//
//         if (selectedRow.nodes.size === 1) {
//             return;
//         }
//
//         if (cellColspan > 1) {
//             for (let i = 0; i < cellColspan; i++) {
//                 (editor as any).removeColumn(startBlockIndex);
//             }
//         } else {
//             selectedTable.nodes.toArray().map((row: any) => {
//                 row.nodes.toArray().map((cell: any, cellIndex: number, rows: any[]) => {
//                     let colspan = cell.data.get('colSpan');
//                     if (startBlockIndex === cellIndex && colspan > 1) {
//                         let nextCell = rows[cellIndex + 1];
//                         editor.setNodeByKey(nextCell.key, {
//                             ...nextCell,
//                             data: {
//                                 colSpan: colspan - 1,
//                             },
//                         });
//                     } else if (colspan > 1 && (startBlockIndex > cellIndex && startBlockIndex < cellIndex + colspan)) {
//                         editor.setNodeByKey(cell.key, {
//                             ...cell,
//                             data: {
//                                 colSpan: colspan - 1,
//                             },
//                         });
//                     }
//                 });
//             });
//             let cellSizes = selectedTable.data.get('cellSizes').filter((item: any, index: number) => index != startBlockIndex);
//             const newData = selectedTable.data.set('cellSizes', cellSizes);
//             editor.setNodeByKey(selectedTable.key, {
//                 ...selectedTable as any,
//                 data: newData,
//             });
//             (editor as any).removeColumn(startBlockIndex);
//         }
//     };
//
//     // Add new row to the table on correct new row position
//     const getRowIndex = (editor: any) => {
//         let rowSpanIndex = 0;
//         let rowIndex = 0;
//         const selectedCell: any = editor.value.document.getParent(editor.value.document.getPath(editor.value.startBlock.key));
//         const selectedRow: any = editor.value.document.getParent(editor.value.document.getPath(selectedCell.key));
//         const selectedTable: any = editor.value.document.getParent(editor.value.document.getPath(selectedRow.key));
//
//         for (let i = 0; i < selectedTable.nodes.toArray().length; i++) {
//             if (selectedTable.nodes.toArray()[i].key === selectedRow.key) {
//                 rowIndex = i;
//             }
//         }
//
//         for (let i = 0; i < selectedRow.nodes.toArray().length; i++) {
//             if (selectedRow.nodes.toArray()[i].data !== undefined && selectedRow.nodes.toArray()[i].data.get('rowSpan') > 1 && selectedRow.nodes.toArray()[i].data.get('rowSpan') > rowSpanIndex) {
//                 rowSpanIndex = selectedRow.nodes.toArray()[i].data.get('rowSpan');
//             }
//         }
//
//         return {
//             rowIndex,
//             rowSpanIndex,
//         };
//     };
//
//     // Add new row to the table on correct new row position
//     const addNewRow = (editor: CoreEditor, props: any, position?: 'before' | 'after') => {
//         let { rowIndex, rowSpanIndex } = getRowIndex(editor);
//         const selectedCell: any = editor.value.document.getParent(editor.value.document.getPath(editor.value.startBlock.key));
//         const selectedRow: any = editor.value.document.getParent(editor.value.document.getPath(selectedCell.key));
//         const selectedTable: any = editor.value.document.getParent(editor.value.document.getPath(selectedRow.key));
//         let currentRowIndex = rowIndex;
//         let maxRowClospan = 1;
//         let shouldHideCells = false;
//
//         if (position === 'before' && selectedCell.type === 'table_header_cell' && selectedTable.nodes.size === 1) {
//             return;
//         }
//
//         while (selectedTable.nodes.toArray()[currentRowIndex].nodes.toArray().some((item: any) => item.data.get('style') === 'none') && currentRowIndex > 0) {
//             currentRowIndex--;
//         }
//
//         if (currentRowIndex !== rowIndex) {
//             selectedTable.nodes.toArray()[currentRowIndex].nodes.toArray().map((item: any) => {
//                 let cellRowSpan = item.data.get('rowSpan');
//                 let isArterPasteValid = position !== 'before' && cellRowSpan > rowIndex - currentRowIndex + 1;
//                 let isBeforePasteValid = position === 'before' && cellRowSpan > rowIndex - currentRowIndex;
//                 if (cellRowSpan && (isArterPasteValid || isBeforePasteValid)) {
//                     editor.setNodeByKey(item.key, {
//                         ...item,
//                         data: {
//                             rowSpan: cellRowSpan + 1,
//                         },
//                     });
//                     shouldHideCells = true;
//                 }
//             });
//         } else {
//             selectedRow.nodes.toArray().map((item: any) => {
//                 let cellRowSpan = item.data.get('rowSpan');
//                 if (cellRowSpan && cellRowSpan > 1 && position !== 'before') {
//                     editor.setNodeByKey(item.key, {
//                         ...item,
//                         data: {
//                             rowSpan: cellRowSpan + 1,
//                         },
//                     });
//                     shouldHideCells = true;
//                 }
//             });
//         }
//
//         position !== 'before' ? rowIndex += rowSpanIndex : null;
//         let insertIndex = position === 'before' ? rowIndex : rowIndex + 1;
//
//         let editorAfterInsert = insertIndex === 0 && selectedCell.type === 'table_cell'
//             ? (editor as any).insertHeaderRow(insertIndex)
//             : selectedCell.type === 'table_header_cell' && selectedTable.nodes.toArray()[rowIndex + 1]
//                 ? (editor as any).insertHeaderRow(insertIndex)
//                 : (editor as any).insertRow(insertIndex);
//
//         if (shouldHideCells) {
//             const currentCell: any = editorAfterInsert.value.document.getParent(editorAfterInsert.value.document.getPath(editorAfterInsert.value.anchorBlock.key));
//             const newRow: any = editorAfterInsert.value.document.getParent(editorAfterInsert.value.document.getPath(currentCell.key));
//
//             newRow.nodes.toArray().map((item: any, index: number) => {
//                 if (index < maxRowClospan) {
//                     editor.setNodeByKey(item.key, {
//                         ...item,
//                         data: {
//                             style: 'none',
//                         },
//                     });
//                 }
//             });
//
//         }
//     };
//
//     const removeSelectedRow = (editor: CoreEditor, props: any) => {
//         let { rowIndex } = getRowIndex(editor);
//         const selectedCell: any = editor.value.document.getParent(editor.value.document.getPath(editor.value.startBlock.key));
//         let rowSpanIndex = selectedCell.data.get('rowSpan');
//         const selectedRow: any = editor.value.document.getParent(editor.value.document.getPath(selectedCell.key));
//         const selectedTable: any = editor.value.document.getParent(editor.value.document.getPath(selectedRow.key));
//
//         if (selectedTable.nodes.size === 1) {
//             return;
//         }
//
//         if (rowSpanIndex > 1) {
//             for (let i = 0; i < rowSpanIndex; i++) {
//                 (editor as any).removeRow(rowIndex);
//             }
//         } else {
//             let currentRowIndex = rowIndex;
//             while (selectedTable.nodes.toArray()[currentRowIndex].nodes.toArray().some((item: any) => item.data.get('style') === 'none')) {
//                 currentRowIndex--;
//             }
//
//             if (currentRowIndex !== rowIndex) {
//                 selectedTable.nodes.toArray()[currentRowIndex].nodes.toArray().map((item: any) => {
//                     let cellRowSpan = item.data.get('rowSpan');
//                     cellRowSpan && cellRowSpan > 1 ? editor.setNodeByKey(item.key, {
//                         ...item,
//                         data: {
//                             rowSpan: cellRowSpan - 1,
//                         },
//                     }) : null;
//                 });
//             } else {
//                 let rowSpansInRow: any[] = [];
//                 let rowSpansInRowIndex: any[] = [];
//                 selectedRow.nodes.toArray().map((item: any, index: number) => {
//                     let cellRowSpan = item.data.get('rowSpan');
//                     if (cellRowSpan > 1) {
//                         rowSpansInRow.push(cellRowSpan);
//                         rowSpansInRowIndex.push(index);
//                     }
//                 });
//                 if (rowSpansInRow.length > 0) {
//                     let nextRow = selectedTable.nodes.toArray()[rowIndex + 1];
//                     rowSpansInRowIndex.map((rowIndex: any, arrayIndex: number) => {
//                         editor.setNodeByKey(nextRow.nodes.toArray()[rowIndex].key, {
//                             ...nextRow.nodes.toArray()[rowIndex],
//                             data: {
//                                 rowSpan: rowSpansInRow[arrayIndex] - 1,
//                             },
//                         });
//                     });
//                 }
//             }
//             (editor as any).removeRow(rowIndex);
//         }
//     };
//
//     const insertTableIn = (editor: CoreEditor) => {
//         const currentKey = editor.value.focusBlock.key;
//         (editor as any).insertEmptyBlock();
//         (editor as any).insertTableByKey(currentKey, 0, 2, 2);
//     };
//
//
//
//     return {
//         ...editTable,
//         ...mergeCellsPlugin(),
//         normalizeNode: null,
//         schema: null,
//         renderBlock,
//         sidebarButtons: [TableButton],
//         onKeyDown,
//         commands: {
//             ...editTable.commands,
//             addNewColumn,
//             addNewRow,
//             removeSelectedRow,
//             removeSelectedColumn,
//             insertTableIn,
//         },
//         serializers: [tableCellDesializer, tableDesializer, tableHeaderCellDesializer],
//         makeSerializerRules: null,
//     };
// };
//
// export const TableButton = (props: { editor: Editor }) => {
//     return <ToolbarButton isDisabled={ isTextSelected(props.editor) } onClick={ () => ((props.editor as any).insertTableIn()) } icon={ TableIcon } />;
// };
//
// const TABLE_TAGS: any = {
//     table: 'table',
//     tr: 'table_row',
// };
//
// const tableCellDesializer = (el: any, next: any) => {
//     if (el.tagName.toLowerCase() === 'td') {
//         return {
//             object: 'block',
//             type: 'table_cell',
//             nodes: next(el.childNodes),
//             data: {
//                 colSpan: el.getAttribute('colspan'),
//                 rowSpan: el.getAttribute('rowspan'),
//             },
//         };
//     }
// };
//
// const tableHeaderCellDesializer = (el: any, next: any) => {
//     if (el.tagName.toLowerCase() === 'th') {
//         return {
//             object: 'block',
//             type: 'table_header_cell',
//             nodes: next(el.childNodes),
//             data: {
//                 colSpan: el.getAttribute('colspan'),
//                 rowSpan: el.getAttribute('rowspan'),
//             },
//         };
//     }
// };
//
// const tableDesializer = getBlockDesirialiser(TABLE_TAGS);
