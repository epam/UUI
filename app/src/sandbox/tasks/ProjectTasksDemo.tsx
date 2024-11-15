import {
    DataTable, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, useForm, ConfirmationModal,
} from '@epam/uui';
import React, { useCallback, useMemo } from 'react';
import {
    DataQueryFilter, DropPosition, Metadata, useArrayDataSource, useTableState, useUuiContext,
} from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
import { SelectedCellData, Task } from './types';
import { getDemoTasks } from './demoData';
import { getColumns } from './columns';

interface FormState {
    items: Record<number, Task>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    title: { isRequired: true },
                },
            },
        },
    },
};

let lastId = -1;

let savedValue: FormState = { items: getDemoTasks() };

export function ProjectTasksDemo() {
    const context = useUuiContext();

    const beforeLeave = useCallback((nextLocation: any, currentLocation: any) => {
        const currentPage = currentLocation.search.split('&')[0];
        const nextPage = nextLocation.search.split('&')[0];

        if ((nextLocation.pathname === currentLocation.pathname) && (currentPage === nextPage)) {
            return Promise.resolve('remain');
        } else {
            // if it's the different domain, we show our modal window
            return context.uuiModals.show<boolean>((modalProps) => <ConfirmationModal caption="Your data may be lost. Do you want to save data?" { ...modalProps } />);
        }
    }, []);
    const {
        lens, value, onValueChange, save, isChanged, revert, undo, canUndo, redo, canRedo,
    } = useForm<FormState>({
        value: savedValue,
        onSave: async (data) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = data;
        },
        getMetadata: () => metadata,
        // This example illustrates how to customize the 'beforeLeave' method to prevent a modal window from appearing when navigating between pages within the same domain.
        beforeLeave: beforeLeave as any,
    });
    const columns = useMemo(() => getColumns(), []);

    // Insert new/exiting top/bottom or above/below relative to other task
    const insertTask = (_: DropPosition, __: Task | null, existingTask: Task | null = null) => {
        const task: Task = existingTask ? { ...existingTask } : {
            id: lastId--, title: '', description: '', estimate: 0, complete: 0, status: { id: 0, name: 'To do' },
        };

        onValueChange({ ...value, items: { ...value.items, [task.id]: task } });
    };

    const { tableState, setTableState } = useTableState();

    const dataSource = useArrayDataSource<Task, number, DataQueryFilter<Task>>(
        {
            items: Object.values(value.items),
            getId: (i) => i.id,
        },
        [],
    );

    const dataView = dataSource.useView(tableState, setTableState, {
        getRowOptions: (task) => ({
            ...lens.prop('items').prop(task.id).toProps(), // pass IEditable to each row to allow editing
        }),
    });

    const onCopy = (copyFrom: SelectedCellData, selectedCells: SelectedCellData[]) => {
        const valueToCopy = copyFrom.row.value?.[copyFrom.column.key as keyof Task];
        const newItems = { ...value.items };
        for (const cell of selectedCells) {
            const cellRowId = cell.row.value.id;
            newItems[cellRowId] = { ...newItems[cellRowId], [cell.column.key]: valueToCopy };
        }

        onValueChange({ ...value, items: newItems });
    };

    return (
        <Panel background="surface-main" style={ { width: '100%' } }>
            <FlexRow columnGap="12" margin="12">
                <FlexCell width="auto">
                    <IconButton icon={ insertAfter } onClick={ () => insertTask('top', null, null) } />
                </FlexCell>
                <FlexCell width="auto">
                    <IconButton icon={ insertBefore } onClick={ () => insertTask('bottom', null, null) } />
                </FlexCell>
                <FlexSpacer />
                <FlexCell width="auto">
                    <Button size="30" icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" caption="Save" onClick={ save } isDisabled={ !isChanged } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" caption="Revert" onClick={ revert } isDisabled={ !isChanged } />
                </FlexCell>
            </FlexRow>
            <DataTable
                headerTextCase="upper"
                showColumnsConfig
                getRows={ dataView.getVisibleRows }
                columns={ columns }
                value={ tableState }
                onValueChange={ setTableState }
                onCopy={ onCopy }
                allowColumnsResizing
                { ...dataView.getListProps() }
            />
        </Panel>
    );
}
