import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, useForm, SearchInput, Tooltip } from '@epam/uui';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, ItemsMap, Metadata, useDataRows, useTree } from '@epam/uui-core';
import { useDataTableFocusManager } from '@epam/uui-components';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
import { ReactComponent as deleteLast } from '@epam/assets/icons/common/table-row_remove-24.svg';
import { ReactComponent as add } from '@epam/assets/icons/common/action-add-12.svg';

import { Task } from './types';
import { getDemoTasks } from './demoData';
import { getColumns } from './columns';
import { deleteTaskWithChildren, getInsertionOrder } from './helpers';

import css from './ProjectTableDemo.module.scss';

interface FormState {
    items: ItemsMap<number, Task>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    name: { isRequired: true },
                },
            },
        },
    },
};

let lastId = -1;

let savedValue: FormState = { items: ItemsMap.fromObject(getDemoTasks(), (item) => item.id) };

export function ProjectTableDemo() {
    const {
        value, save, isChanged, revert, undo, canUndo, redo, canRedo, setValue, lens,
    } = useForm<FormState>({
        value: savedValue,
        onSave: async (data) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = data;
        },
        getMetadata: () => metadata,
    });

    const [tableState, setTableState] = useState<DataTableState>({ sorting: [{ field: 'order' }], visibleCount: 1000 });
    const dataTableFocusManager = useDataTableFocusManager<Task['id']>({}, []);

    // Insert new/exiting top/bottom or above/below relative to other task
    const insertTask = useCallback((position: DropPosition, relativeTask: Task | null = null, existingTask: Task | null = null) => {
        let tempRelativeTask = relativeTask;
        const task: Task = existingTask ? { ...existingTask } : { id: lastId--, name: '' };
        if (position === 'inside') {
            task.parentId = relativeTask.id;
            tempRelativeTask = null; // just insert as the first child
        }

        if (tempRelativeTask) {
            task.parentId = tempRelativeTask.parentId;
        }

        setValue((currentValue) => {
            const orders: string[] = [];
            currentValue.items.forEach((item) => {
                if (item.parentId === task.parentId) {
                    orders.push(item.order);
                }
            });
        
            task.order = getInsertionOrder(
                orders,
                position === 'bottom' || position === 'inside' ? 'after' : 'before', // 'inside' drop should also insert at the top of the list, so it's ok to default to 'before'
                tempRelativeTask?.order,
            );

            return { ...currentValue, items: currentValue.items.set(task.id, task) };
        });

        setTableState((currentTableState) => {
            return {
                ...currentTableState,
                folded: position === 'inside'
                    ? { ...currentTableState.folded, [`${task.parentId}`]: false }
                    : currentTableState.folded,
                selectedId: task.id,
            };
        });

        dataTableFocusManager?.focusRow(task.id);
    }, [setValue, setTableState, dataTableFocusManager]);

    const deleteTask = useCallback((task: Task) => {
        setValue((currentValue) => ({
            ...currentValue, items: deleteTaskWithChildren(currentValue.items, task),
        }));
    }, [setValue]);

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<Task & { isTask: boolean }, Task>) => {
        if (!params.srcData.isTask || params.srcData.id === params.dstData.id) {
            return null;
        } else {
            return { bottom: true, top: true, inside: true };
        }
    }, []);

    const handleDrop = useCallback(
        (params: DropParams<Task, Task>) => insertTask(params.position, params.dstData, params.srcData),
        [insertTask],
    );

    const searchHandler = useCallback(
        (val: string | undefined) => setTableState((currentTableState) => ({
            ...currentTableState,
            search: val,
        })),
        [],
    );

    const { tree, ...restProps } = useTree(
        {
            type: 'plain',
            dataSourceState: tableState,
            setDataSourceState: setTableState,
            itemsMap: value.items,
            getSearchFields: (item) => [item.name],
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getRowOptions: (task) => ({
                ...lens.prop('items').getItem(task.id).toProps(), // pass IEditable to ezach row to allow editing
                // checkbox: { isVisible: true },
                isSelectable: true,
                dnd: {
                    srcData: { ...task, isTask: true },
                    dstData: { ...task, isTask: true },
                    canAcceptDrop: handleCanAcceptDrop,
                    onDrop: handleDrop,
                },
            }),
        },
        [value.items],
    );

    const { visibleRows, listProps } = useDataRows({
        tree, ...restProps,
    });

    const columns = useMemo(
        () => getColumns({ insertTask, deleteTask }),
        [insertTask, deleteTask],
    );

    const selectedItem = useMemo(() => {
        if (tableState.selectedId !== undefined) {
            return value.items.get(tableState.selectedId);
        }
        return undefined;
    }, [tableState.selectedId, value.items]);

    const deleteSelectedItem = useCallback(() => {
        const prevRows = [...visibleRows];
        deleteTask(selectedItem);
        if (selectedItem !== undefined) {
            const index = prevRows.findIndex((task) => task.id === selectedItem.id);
            const newSelectedIndex = index === prevRows.length - 1
                ? (prevRows.length - 2)
                : (index + 1);

            setTableState((state) => ({
                ...state,
                selectedId: newSelectedIndex >= 0 ? prevRows[newSelectedIndex].id : undefined,
            }));
        }
    }, [deleteTask, visibleRows, selectedItem, setTableState]);

    const keydownHandler = useCallback((event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.code === 'Enter') {
            event.preventDefault();
            insertTask('top', selectedItem);
            return;
        }

        if ((event.metaKey || event.ctrlKey) && event.code === 'Enter') {
            event.preventDefault();
            insertTask('bottom', selectedItem);
            return;
        }

        if ((event.metaKey || event.ctrlKey) && event.code === 'Backspace') {
            event.preventDefault();
            deleteSelectedItem();
            return;
        }
    }, [insertTask, selectedItem, deleteSelectedItem]);

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, [keydownHandler]);

    const getKeybindingWithControl = (tooltip: string, keybindingWithoutControl: string) => {
        const controlKey = navigator.platform.indexOf('Mac') === 0 ? '⌘' : 'Ctrl';
        return (
            <>
                { tooltip } 
                {' '}
                <br />
                { `(${controlKey} + ${keybindingWithoutControl})` }
            </>
        );
    };

    return (
        <Panel cx={ css.container }>
            <FlexRow spacing="18" padding="24" vPadding="18" borderBottom={ true } background="surface-main">
                <FlexCell width="auto">
                    <Tooltip content={ getKeybindingWithControl('Add new task', 'Enter') } placement="bottom">
                        <Button size="30" icon={ add } caption="Add Task" onClick={ () => insertTask('bottom') } />
                    </Tooltip>
                </FlexCell>
                <FlexCell width="auto">
                    <Tooltip content={ getKeybindingWithControl('Add new task below', 'Enter') } placement="bottom">
                        <IconButton icon={ insertAfter } onClick={ () => insertTask('bottom', selectedItem) } />
                    </Tooltip>
                </FlexCell>
                <FlexCell width="auto">
                    <Tooltip content={ getKeybindingWithControl('Add new task above', 'Shift + Enter') } placement="bottom">
                        <IconButton icon={ insertBefore } onClick={ () => insertTask('top', selectedItem) } />
                    </Tooltip>
                </FlexCell>
                <FlexCell width="auto">
                    <Tooltip content={ getKeybindingWithControl('Delete task', 'Backspace') } placement="bottom">
                        <IconButton icon={ deleteLast } onClick={ () => deleteSelectedItem() } />
                    </Tooltip>
                </FlexCell>
                <FlexSpacer />
                <FlexCell cx={ css.search } width={ 295 }>
                    <SearchInput value={ tableState.search } onValueChange={ searchHandler } placeholder="Search" debounceDelay={ 1000 } />
                </FlexCell>
                <div className={ css.divider } />
                <FlexCell width="auto">
                    <IconButton icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
                </FlexCell>
                <FlexCell width="auto">
                    <IconButton icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" caption="Cancel" onClick={ revert } isDisabled={ !isChanged } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="30" color="accent" caption="Save" onClick={ save } isDisabled={ !isChanged } />
                </FlexCell>
            </FlexRow>
            <DataTable
                headerTextCase="upper"
                getRows={ () => visibleRows }
                columns={ columns }
                value={ tableState }
                onValueChange={ setTableState }
                dataTableFocusManager={ dataTableFocusManager }
                showColumnsConfig
                allowColumnsResizing
                allowColumnsReordering
                { ...listProps }
            />
        </Panel>
    );
}
