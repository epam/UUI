import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, useForm, SearchInput, Tooltip } from '@epam/uui';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, IMap, ITree, ItemsMap, Metadata, Position, UuiContexts, useDataRows, useTree, useUuiContext } from '@epam/uui-core';
import { useDataTableFocusManager } from '@epam/uui-components';

import { ReactComponent as undoIcon } from '@epam/assets/icons/content-edit_undo-outline.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/content-edit_redo-outline.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/table-row_plus_after-outline.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/table-row_plus_before-outline.svg';
import { ReactComponent as deleteLast } from '@epam/assets/icons/table-row_remove-outline.svg';
import { ReactComponent as add } from '@epam/assets/icons/action-add-outline.svg';

import { Task } from './types';
import { getColumns } from './columns';

import css from './ProjectTableDemo.module.scss';
import { TApi } from '../../data';
import { ProjectTask } from '@epam/uui-docs';

interface FormState {
    items: ItemsMap<number, ProjectTask>;
    positions: IMap<number, Position<number>>;
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

let savedValue: FormState = {
    items: ItemsMap.blank({ getId: (item) => item.id }),
    positions: new Map(),
};

export function ProjectTableDemo() {
    const svc = useUuiContext<TApi, UuiContexts>();

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

    const [tableState, setTableState] = useState<DataTableState>({ sorting: [{ field: 'order' }] });
    const dataTableFocusManager = useDataTableFocusManager<ProjectTask['id']>({}, []);

    const currentTreeRef = useRef<ITree<ProjectTask, number>>(null);

    // Insert new/exiting top/bottom or above/below relative to other task
    const insertTask = useCallback((position: DropPosition, relativeTask: Task | null = null, existingTask: Task | null = null) => {
        let tempRelativeTask = relativeTask;
        let newItemPosition: Position<number>;
        const task: Task = existingTask ? { ...existingTask } : { id: lastId--, name: '' };

        if (position === 'inside') {
            task.parentId = relativeTask.id;
            tempRelativeTask = null; // just insert as the first child
            newItemPosition = 'top';
        }

        if (tempRelativeTask) {
            task.parentId = tempRelativeTask.parentId;
        }

        setValue((currentValue) => {
            // task.order = getInsertionOrder(
            //     orders,
            //     position === 'bottom' || position === 'inside' ? 'after' : 'before', // 'inside' drop should also insert at the top of the list, so it's ok to default to 'before'
            //     tempRelativeTask?.order,
            // );

            if (tempRelativeTask) {
                if (position === 'bottom') {
                    newItemPosition = { after: tempRelativeTask.id };
                }

                if (position === 'top') {
                    const { ids } = currentTreeRef.current.getItems(tempRelativeTask.parentId);
                    const index = ids.findIndex((id) => id === tempRelativeTask.id);
                    if (index <= 0) {
                        newItemPosition = 'top';
                    } else {
                        const afterId = ids[index - 1];
                        newItemPosition = { after: afterId };
                    }
                }
            }

            const newPositions = new Map(currentValue.positions);
            if (existingTask) {
                let newRelativeTasksPosition: Position<number>;
                const { ids } = currentTreeRef.current.getItems(existingTask.parentId);
                const index = ids.findIndex((id) => id === existingTask.id);
                if (index <= 0) {
                    newRelativeTasksPosition = 'top';
                } else {
                    const afterId = ids[index - 1];
                    newRelativeTasksPosition = { after: afterId };
                }
                for (const [id, prevPosition] of currentValue.positions) {
                    if (typeof prevPosition === 'object' && 'after' in prevPosition && prevPosition.after === existingTask.id) {
                        newPositions.set(id, newRelativeTasksPosition);
                    }
                }
            }
            newPositions.set(task.id, newItemPosition);

            return { ...currentValue, items: currentValue.items.set(task.id, task), positions: newPositions };
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
            ...currentValue, items: currentValue.items.set(task.id, { ...task, isDeleted: true }),
        }));
    }, [setValue]);

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<ProjectTask & { isTask: boolean }, Task>) => {
        if (!params.srcData.isTask || params.srcData.id === params.dstData.id) {
            return null;
        } else {
            return { bottom: true, top: true, inside: true };
        }
    }, []);

    const handleDrop = useCallback(
        (params: DropParams<ProjectTask, Task>) => insertTask(params.position, params.dstData, params.srcData),
        [insertTask],
    );

    const searchHandler = useCallback(
        (val: string | undefined) => setTableState((currentTableState) => ({
            ...currentTableState,
            search: val,
        })),
        [],
    );

    const { tree, ...restProps } = useTree<ProjectTask, number>(
        {
            type: 'lazy',
            api: (rq, ctx) => {
                const filter = { parentId: ctx?.parentId };
                return svc.api.demo.projectTasks({ ...rq, filter });
            },
            dataSourceState: tableState,
            setDataSourceState: setTableState,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (task) => task.childCount,
            backgroundReload: true,
            patchItems: value.items,
            getPosition: (item: ProjectTask) => value.positions.has(item.id) ? value.positions.get(item.id) : 'initial',
            isDeleted: (item) => item.isDeleted,
            getRowOptions: (task) => ({
                ...lens.prop('items').key(task.id).toProps(), // pass IEditable to ezach row to allow editing
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
        [],
    );

    currentTreeRef.current = tree;

    const { rows, listProps } = useDataRows({
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
        if (selectedItem === undefined) return;
        
        const prevRows = [...rows];
        deleteTask(selectedItem);
        const index = prevRows.findIndex((task) => task.id === selectedItem.id);
        const newSelectedIndex = index === prevRows.length - 1
            ? (prevRows.length - 2)
            : (index + 1);

        setTableState((state) => ({
            ...state,
            selectedId: newSelectedIndex >= 0 ? prevRows[newSelectedIndex].id : undefined,
        }));
    }, [deleteTask, rows, selectedItem, setTableState]);

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
                        <IconButton size="24" icon={ insertAfter } onClick={ () => insertTask('bottom', selectedItem) } />
                    </Tooltip>
                </FlexCell>
                <FlexCell width="auto">
                    <Tooltip content={ getKeybindingWithControl('Add new task above', 'Shift + Enter') } placement="bottom">
                        <IconButton size="24" icon={ insertBefore } onClick={ () => insertTask('top', selectedItem) } />
                    </Tooltip>
                </FlexCell>
                <FlexCell width="auto">
                    <Tooltip content={ getKeybindingWithControl('Delete task', 'Backspace') } placement="bottom">
                        <IconButton size="24" icon={ deleteLast } onClick={ () => deleteSelectedItem() } isDisabled={ selectedItem === undefined } />
                    </Tooltip>
                </FlexCell>
                <FlexSpacer />
                <FlexCell cx={ css.search } width={ 295 }>
                    <SearchInput value={ tableState.search } onValueChange={ searchHandler } placeholder="Search" debounceDelay={ 1000 } />
                </FlexCell>
                <div className={ css.divider } />
                <FlexCell width="auto">
                    <IconButton size="18" icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
                </FlexCell>
                <FlexCell width="auto">
                    <IconButton size="18" icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
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
                rows={ rows }
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
