import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, useForm, SearchInput, Tooltip } from '@epam/uui';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, ItemsMap, Metadata,
    PatchOrdering, SortingOption, UuiContexts, getOrderBetween, indexToOrder, useDataRows, useTree, useUuiContext } from '@epam/uui-core';
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
    sorting: SortingOption<any>[],
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

const defaultSorting = [{ field: 'order' }];
let savedValue: FormState = {
    items: ItemsMap.blank({ getId: (item) => item.id }),
    sorting: defaultSorting,
};

export function ProjectTableDemo() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [tableState, setState] = useState<DataTableState>({ sorting: defaultSorting });
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

    const setTableState = useCallback<React.Dispatch<React.SetStateAction<DataTableState>>>((newState) => {
        setState((st) => {
            const updatedTableState = typeof newState === 'function' ? { ...newState(st) } : { ...st, ...newState };

            if (st.sorting !== updatedTableState.sorting) {
                setValue((currentValue) => {
                    let newItems = ItemsMap.blank<number, ProjectTask>({ getId: (item) => item.id });
                    currentValue.items.forEach(({ tempOrder, ...item }) => {
                        newItems = newItems.set(item.id, item);
                    });

                    return { ...currentValue, items: newItems, sorting: updatedTableState.sorting };
                });
            }
            return updatedTableState;
        });
    }, [setValue]);

    const dataTableFocusManager = useDataTableFocusManager<ProjectTask['id']>({}, []);

    const searchHandler = useCallback(
        (val: string | undefined) => setTableState((currentTableState) => ({
            ...currentTableState,
            search: val,
        })),
        [],
    );

    useEffect(() => {
        if (tableState.sorting !== value.sorting) {
            setState((state) => {
                if (state.sorting !== value.sorting) {
                    return { ...state, sorting: value.sorting };
                }
                return state;
            });
        }
    }, [setTableState, value.sorting, tableState.sorting]);

    const getItemTemporaryOrder = (item: ProjectTask) => item.tempOrder;

    const { tree, treeWithoutPatch, ...restProps } = useTree<ProjectTask, number>(
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
            patch: value.items,

            getNewItemPosition: () => PatchOrdering.TOP,
            getItemTemporaryOrder,
            sortBy: (item, sorting) => {
                return item[sorting.field as keyof ProjectTask] ?? '';
            },

            isDeleted: (item) => item.isDeleted,
        },
        [],
    );

    // Insert new/exiting top/bottom or above/below relative to other task
    const insertTask = useCallback((
        position: DropPosition,
        relativeTask: ProjectTask | null = null,
        existingTask: ProjectTask | null = null,
    ) => {
        const task: ProjectTask = existingTask ? { ...existingTask } : { id: lastId--, name: '' };

        if (position === 'inside') {
            task.parentId = relativeTask.id;
            position = 'top';
            relativeTask = null;
        } else if (relativeTask) {
            task.parentId = relativeTask.parentId;
        }

        const originalListIds = treeWithoutPatch.getItems(task.parentId).ids;
        const currentListIds = tree.getItems(task.parentId).ids;

        const getIndex = (list: number[], id: number) => {
            return list.indexOf(id);
        };

        const getOrderByIndex = (index: number) => {
            const id = currentListIds[index];
            const item = tree.getById(id) as ProjectTask;

            // If item is not in patch, it's order is implied as numberToOrder() of it's original index (before any patch applied)
            if (!item.tempOrder) {
                const originalIndex = getIndex(originalListIds, id);
                return indexToOrder(originalIndex);
            } else {
                return item.tempOrder;
            }
        };

        let relativeToIndex: number;
        if (relativeTask) {
            relativeToIndex = getIndex(currentListIds, relativeTask.id);
        } else {
            relativeToIndex = position === 'top' ? 0 : currentListIds.length - 1;
        }

        const indexAbove = position === 'top' ? relativeToIndex - 1 : relativeToIndex;
        const indexBelow = position === 'bottom' ? relativeToIndex + 1 : relativeToIndex;
        const orderAbove = indexAbove >= 0 ? getOrderByIndex(indexAbove) : null;
        const orderBelow = indexBelow < currentListIds.length ? getOrderByIndex(indexBelow) : null;

        task.tempOrder = getOrderBetween(orderAbove, orderBelow);

        setValue((currentValue) => {
            return {
                ...currentValue,
                items: currentValue.items.set(task.id, task),
            };
        });

        setTableState((currentTableState) => {
            return {
                ...currentTableState,
                folded: (position as DropPosition) === 'inside'
                    ? { ...currentTableState.folded, [`${task.parentId}`]: false }
                    : currentTableState.folded,
                selectedId: task.id,
            };
        });

        dataTableFocusManager?.focusRow(task.id);
    }, [setValue, setTableState, dataTableFocusManager, tree, treeWithoutPatch]);

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

    const { rows, listProps } = useDataRows({
        tree,
        ...restProps,
        getRowOptions: (task) => ({
            ...lens.prop('items').key(task.id).toProps(), // pass IEditable to each row to allow editing
            // checkbox: { isVisible: true },
            isSelectable: true,
            dnd: {
                srcData: { ...task, isTask: true },
                dstData: { ...task, isTask: true },
                canAcceptDrop: handleCanAcceptDrop,
                onDrop: handleDrop,
            },
        }),
    });

    const columns = useMemo(
        () => getColumns({ insertTask, deleteTask }),
        [insertTask, deleteTask],
    );

    const selectedItem = useMemo(() => {
        if (tableState.selectedId !== undefined) {
            return tree.getById(tableState.selectedId) as ProjectTask;
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
