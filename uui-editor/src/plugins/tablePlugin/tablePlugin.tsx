import React, { useRef } from 'react';

import { ToolbarButton as PlateToolbarButton } from '@udecode/plate-ui';

import cx from "classnames";
import { Dropdown } from '@epam/uui-components';
import { useFocused, useReadOnly, useSelected } from 'slate-react';

import { ReactComponent as TableIcon } from "../../icons/table-add.svg";
import { isPluginActive, isTextSelected } from "../../helpers";

import { ToolbarButton } from "../../implementation/ToolbarButton";
import { Toolbar } from '../../implementation/Toolbar';

import { Table } from './Table';
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";

import tableCSS from './Table.module.scss';
import { updateTableStructure } from './utils';
import { TableToolbarContent } from './ToolbarContent';
import { MergeToolbarContent } from './MergeToolbarContent';
import { withOurTable } from './withOurTable';
import { createInitialTable, selectFirstCell } from './utils';
import { usePlateEditorState, PlateEditor, getPluginType, withoutNormalizing, someNode, insertNodes } from '@udecode/plate-common';
import { getTableGridAbove, ELEMENT_TABLE, createTablePlugin, ELEMENT_TR, ELEMENT_TD, ELEMENT_TH } from '@udecode/plate-table';

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
                <Toolbar
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
                setTimeout(() => selectFirstCell(editor), 0);
            }
        });
    }

    return (
        <PlateToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            onMouseDown={ onCreateTable }
            icon={ <ToolbarButton
                isDisabled={ isTextSelected(editor, true) }
                onClick={ () => {} }
                icon={ TableIcon }
            /> }
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