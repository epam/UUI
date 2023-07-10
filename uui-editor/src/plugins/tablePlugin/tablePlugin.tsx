import React, { useRef } from 'react';

import { Dropdown } from '@epam/uui-components';
import cx from "classnames";
import { useFocused, useReadOnly, useSelected } from 'slate-react';

import { isPluginActive, isTextSelected } from "../../helpers";
import { ReactComponent as TableIcon } from "../../icons/table-add.svg";

import { PositionedToolbar } from '../../implementation/PositionedToolbar';
import { ToolbarButton } from "../../implementation/ToolbarButton";

import { Table } from './Table';
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";

import { PlateEditor, getPluginType, insertNodes, someNode, usePlateEditorState, withoutNormalizing } from '@udecode/plate-common';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TH, ELEMENT_TR, createTablePlugin, getTableGridAbove } from '@udecode/plate-table';
import { MergeToolbarContent } from './MergeToolbarContent';
import tableCSS from './Table.module.scss';
import { TableToolbarContent } from './ToolbarContent';
import { createInitialTable, selectFirstCell, updateTableStructure } from './utils';
import { withOurTable } from './withOurTable';

const noop = () => {};

const TableRenderer = (props: any) => {
    let { element: tableElem } = props;
    const editor = usePlateEditorState();
    const isReadonly = useReadOnly();
    const ref = useRef(null);
    const isFocused = useFocused();
    const isSelected = useSelected();

    const cellEntries = getTableGridAbove(editor, { format: 'cell' });
    const hasEntries = !!cellEntries?.length;
    const showToolbar = !isReadonly && isSelected && isFocused && hasEntries;

    /**
     * Assigns valid colIndexes in case of merged cells.
     * TODO: make less function invocations,
     * ideally once on migration and pasting from documents
     */
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
                <PositionedToolbar
                    placement='bottom'
                    children={
                        cellEntries.length > 1
                            ? <MergeToolbarContent cellEntries={ cellEntries } />
                            : <TableToolbarContent cellEntries={ cellEntries } />
                    }
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
                selectFirstCell(editor);
            }
        });
    }

    return (
        <ToolbarButton
            isDisabled={ isTextSelected(editor, true) }
            onClick={ onCreateTable }
            icon={ TableIcon }
        />
    );
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