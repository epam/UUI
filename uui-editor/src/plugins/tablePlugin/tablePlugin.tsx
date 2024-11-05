import React from 'react';

import { Dropdown } from '@epam/uui-components';
import { useFocused, useReadOnly, useSelected } from 'slate-react';

import { useIsPluginActive, isTextSelected } from '../../helpers';
import { ReactComponent as TableIcon } from '../../icons/table-add.svg';

import { FloatingToolbar } from '../../implementation/PositionedToolbar';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import {
    DeserializeHtml,
    PlateEditor,
    getPluginType,
    insertNodes,
    someNode,
    useEditorRef,
    withoutNormalizing,
    isElement,
    PlatePlugin,
    setNodes,
} from '@udecode/plate-common';
import {
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TR,
    TTableElement,
    TablePlugin,
    createTablePlugin,
    getTableColumnCount,
    getTableGridAbove,
    useTableMergeState,
    withTable,
} from '@udecode/plate-table';
import { MergeToolbarContent } from './MergeToolbarContent';
import { TableToolbarContent } from './ToolbarContent';
import { createInitialTable, selectFirstCell } from './utils';
import { TableRowElement } from './TableRowElement';
import { TableCellElement } from './TableCellElement';
import { TableElement } from './TableElement';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { TABLE_CELL_TYPE, TABLE_HEADER_CELL_TYPE, TABLE_TYPE, TABLE_ROW_TYPE, DEFAULT_COL_WIDTH } from './constants';
import { normalizeTableCellElement, normalizeTableElement } from '../../migrations/normalizers';
import { DeprecatedTTableCellElement } from '../../migrations/types';

const noop = () => {};

function TableRenderer(props: any) {
    const editor = useEditorRef();
    const isReadonly = useReadOnly();
    const isFocused = useFocused();
    const isSelected = useSelected();

    const cellEntries = getTableGridAbove(editor, { format: 'cell' });
    const hasEntries = !!cellEntries?.length;
    const showToolbar = !isReadonly && isSelected && isFocused && hasEntries;
    const { canMerge, canUnmerge } = useTableMergeState();

    return (
        <Dropdown
            renderTarget={ (innerProps: any) => (
                <div ref={ innerProps.ref }>
                    <TableElement { ...props } />
                </div>
            ) }
            renderBody={ () => (
                <FloatingToolbar
                    placement="bottom"
                    children={
                        canMerge ? (
                            <MergeToolbarContent />
                        ) : (
                            <TableToolbarContent canUnmerge={ canUnmerge } />
                        )
                    }
                    editor={ editor }
                    isTable
                />
            ) }
            onValueChange={ noop }
            value={ showToolbar }
            placement="top"
        />
    );
}

const getDefaultColWidths = (columnsNumber: number) =>
    Array.from({ length: columnsNumber }, () => DEFAULT_COL_WIDTH);

const initDefaultTableColWidth = (tableNode: DeprecatedTTableCellElement): TTableElement => {
    if (!tableNode.colSizes) {
        return {
            ...tableNode,
            colSizes: getDefaultColWidths(getTableColumnCount(tableNode)),
        };
    }
    return tableNode;
};

// TODO: move to plate
const createGetNodeFunc = (type: string) => {
    const getNode: DeserializeHtml['getNode'] = (element) => {
        const background = element.style.background || element.style.backgroundColor;
        if (background) {
            return {
                type,
                background,
            };
        }

        return { type };
    };
    return getNode;
};

type TablePLuginOptions = WithToolbarButton & TablePlugin;

export const tablePlugin = (): PlatePlugin<TablePLuginOptions> =>
    createTablePlugin<TablePLuginOptions>({
        overrideByKey: {
            [ELEMENT_TABLE]: {
                type: TABLE_TYPE,
                component: TableRenderer,
            },
            [ELEMENT_TR]: {
                type: TABLE_ROW_TYPE,
                component: TableRowElement,
            },
            [ELEMENT_TD]: {
                type: TABLE_CELL_TYPE,
                component: TableCellElement,
                deserializeHtml: {
                    getNode: createGetNodeFunc(TABLE_CELL_TYPE),
                },
            },
            [ELEMENT_TH]: {
                type: TABLE_HEADER_CELL_TYPE,
                component: TableCellElement,
                deserializeHtml: {
                    getNode: createGetNodeFunc(TABLE_HEADER_CELL_TYPE),
                },
            },
        },
        options: {
            enableMerging: true,
            bottomBarButton: TableButton,
        },
        withOverrides: (editor, plugin) => {
            // eslint-disable-next-line no-param-reassign
            editor = withTable(editor, plugin);

            const { normalizeNode } = editor;

            editor.normalizeNode = (entry) => {
                const [node, path] = entry;

                if (isElement(node) && node.type === TABLE_TYPE) {
                    const normalized = initDefaultTableColWidth(normalizeTableElement(entry) as DeprecatedTTableCellElement);
                    setNodes(
                        editor,
                        normalized,
                        { at: path },
                    );
                    return;
                }

                if (isElement(node) && (TABLE_CELL_TYPE === node.type || TABLE_CELL_TYPE === node.type)) {
                    normalizeTableCellElement(editor, entry);
                    return;
                }

                normalizeNode(entry);
            };

            return editor;
        },
    });

export function TableButton({ editor }: { editor: PlateEditor }) {
    if (!useIsPluginActive(ELEMENT_TABLE)) return null;

    const onCreateTable = async () => {
        if (!editor) return;

        withoutNormalizing(editor, () => {
            const isCurrentTableSelection = !!someNode(editor, {
                match: { type: getPluginType(editor, ELEMENT_TABLE) },
            });

            if (!isCurrentTableSelection) {
                insertNodes(editor, createInitialTable(editor));
                selectFirstCell(editor);
            }
        });
    };

    return (
        <ToolbarButton
            isDisabled={ isTextSelected(editor, true) }
            onClick={ onCreateTable }
            icon={ TableIcon }
        />
    );
}
