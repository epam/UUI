import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimelineController, msPerDay } from '@epam/uui-timeline';
import { Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, useForm, SearchInput, Tooltip, MultiSwitch } from '@epam/uui';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, IImmutableMap, ItemsMap, Metadata, NOT_FOUND_RECORD, Tree, useDataRows, useTree } from '@epam/uui-core';
import { useDataTableFocusManager } from '@epam/uui-components';

import { ReactComponent as undoIcon } from '@epam/assets/icons/content-edit_undo-outline.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/content-edit_redo-outline.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/table-row_plus_after-outline.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/table-row_plus_before-outline.svg';
import { ReactComponent as deleteLast } from '@epam/assets/icons/table-row_remove-outline.svg';
import { ReactComponent as add } from '@epam/assets/icons/action-add-outline.svg';
import { ReactComponent as zoomIn } from '@epam/assets/icons/action-add-outline.svg';
import { ReactComponent as zoomOut } from '@epam/assets/icons/content-minus-outline.svg';
import { ReactComponent as fitContent } from '@epam/assets/icons/action-align_center-outline.svg';
import { Task } from './types';
import { getDemoTasks } from './demoData';
import { deleteTaskWithChildren, setTaskInsertPosition } from './helpers';

import css from './ProjectTableDemo.module.scss';
import { TimelineMode } from './TimelineMode';
import { TableMode } from './TableMode';

interface FormState {
    items: IImmutableMap<number, Task>;
}

interface ViewMode {
    id: 'timeline' | 'table';
    caption: string;
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

let savedValue: FormState = { items: ItemsMap.blank<number, Task>({ getId: (item) => item.id }) };

const items = Object.values(getDemoTasks());
export function ProjectTableDemo() {
    const viewModes: ViewMode[] = [{ id: 'timeline', caption: 'Timeline' }, { id: 'table', caption: 'Table' }];
    const [selectedViewMode, setSelectedViewMode] = useState<ViewMode['id']>('timeline');

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

    const searchHandler = useCallback(
        (val: string | undefined) => setTableState((currentTableState) => ({
            ...currentTableState,
            search: val,
        })),
        [],
    );

    const { tree, ...restProps } = useTree({
        type: 'sync',
        dataSourceState: tableState, 
        setDataSourceState: setTableState,
        items,

        patch: value.items,
        getSearchFields: (item) => [item.name],
        getId: (i) => i.id,
        getParentId: (i) => i.parentId,
        fixItemBetweenSortings: false,
        isDeleted: ({ isDeleted }) => isDeleted,
    }, []);

    const deleteTask = useCallback((task: Task) => {
        setValue((currentValue) => ({
            ...currentValue,
            items: deleteTaskWithChildren(task, currentValue.items, treeRef.current),
        }));
    }, [setValue]);

    const getMinMaxDate = () => {
        let minStartDate;
        let maxDueDate;
        for (const item of items) {
            let estimatedDate;
            let dueDate;
            if (item.startDate) {
                const startDate = new Date(item.startDate);
                const startDateTime = startDate.getTime();
                if (minStartDate === undefined || startDateTime < minStartDate) {
                    minStartDate = startDateTime;
                }
                if (item.estimate) {
                    startDate.setDate(startDate.getDate() + item.estimate);
                    estimatedDate = startDate.getTime();
                }
            }
            
            if (item.dueDate) {
                dueDate = new Date(item.dueDate).getTime();
            }
            
            let localMaxDueDate;
            if (estimatedDate === undefined) {
                if (dueDate !== undefined) {
                    localMaxDueDate = dueDate;
                }
            } else if (dueDate === undefined) {
                localMaxDueDate = estimatedDate;
            } else {
                localMaxDueDate = Math.max(dueDate, estimatedDate);
            }
           
            maxDueDate = maxDueDate === undefined ? localMaxDueDate : Math.max(localMaxDueDate ?? 0, maxDueDate);
        }
        let from: Date;
        let to: Date;
        if (minStartDate && maxDueDate) {
            from = new Date();
            from.setTime(minStartDate);
            to = new Date();
            to.setTime(maxDueDate);
        }
        
        return { from, to };
    };

    const timelineController = useMemo(() => {
        const { from, to } = getMinMaxDate();

        const timeController = new TimelineController({ widthPx: 0, center: new Date(), pxPerMs: 32 / msPerDay });
        if (from && to) {
            timeController.setViewportRange({ from, to, widthPx: 0 }, false);
        }
        return timeController;
    }, []);

    const treeRef = useRef(tree);
    
    treeRef.current = tree;

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<Task & { isTask: boolean }, Task>) => {
        if (!params.srcData.isTask || params.srcData.id === params.dstData.id) {
            return null;
        } 
        const parents = Tree.getPathById(params.dstData.id, treeRef.current);
        if (parents.some((parent) => parent.id === params.srcData.id)) {
            return null;
        }

        return { bottom: true, top: true, inside: true };
    }, []);

    const insertTask = useCallback((position: DropPosition, relativeTask: Task | null = null, existingTask: Task | null = null) => {
        const taskToInsert = existingTask ? { ...existingTask } : { id: lastId--, name: '' };
        const task: Task = setTaskInsertPosition(taskToInsert, relativeTask, position, treeRef.current);

        setValue((currentValue) => ({ ...currentValue, items: currentValue.items.set(task.id, task) }));

        setTableState((currentTableState) => ({
            ...currentTableState,
            folded: position === 'inside'
                ? { ...currentTableState.folded, [`${task.parentId}`]: false }
                : currentTableState.folded,
            selectedId: task.id,
        }));

        dataTableFocusManager?.focusRow(task.id);
    }, [setValue, dataTableFocusManager]);

    const handleDrop = useCallback(
        (params: DropParams<Task, Task>) => insertTask(params.position, params.dstData, params.srcData),
        [insertTask],
    );

    const { rows, listProps } = useDataRows({
        tree,
        ...restProps,
        getRowOptions: (task) => ({
            ...lens.prop('items').key(task.id).toProps(), // pass IEditable to each row to allow editing
            isSelectable: true,
            dnd: {
                srcData: { ...task, isTask: true },
                dstData: { ...task, isTask: true },
                canAcceptDrop: handleCanAcceptDrop,
                onDrop: handleDrop,
            },
        }),
    });

    const selectedItem = useMemo(() => {
        if (tableState.selectedId !== undefined) {
            const item = tree.getById(tableState.selectedId);
            if (item === NOT_FOUND_RECORD) {
                return undefined;
            }
            return item;
        }
        return undefined;
    }, [tableState.selectedId, tree]);

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
    const { from, to } = getMinMaxDate();

    return (
        <Panel cx={ css.container }>
            <FlexRow columnGap="18" padding="24" vPadding="18" borderBottom={ true } background="surface-main">
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
                <FlexCell width="auto">
                    <Button
                        icon={ fitContent }
                        iconPosition="left"
                        caption="Fit content"
                        onClick={ () => {
                            if (from && to) {
                                timelineController.setViewportRange({ from, to, widthPx: timelineController.currentViewport.widthPx }, true);
                            } 
                        } }
                    />
                </FlexCell>

                <FlexCell width="auto">
                    <Button icon={ zoomIn } iconPosition="right" caption="Zoom In" isDisabled={ !timelineController.canZoomBy(1) } onClick={ () => timelineController.zoomBy(1) } />
                </FlexCell>
                <FlexCell width="auto">
                    <Button icon={ zoomOut } iconPosition="right" caption="Zoom Out" isDisabled={ !timelineController.canZoomBy(-1) } fill="outline" onClick={ () => timelineController.zoomBy(-1) } />
                </FlexCell>
                <FlexCell width={ 150 }>
                    <MultiSwitch
                        items={ viewModes }
                        value={ selectedViewMode }
                        onValueChange={ setSelectedViewMode }
                    />
                </FlexCell>
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
            
            { selectedViewMode === 'timeline'
                ? (
                    <TimelineMode
                        tableState={ tableState } 
                        setTableState={ setTableState }
                        listProps={ listProps }
                        rows={ rows }
                        timelineController={ timelineController }
                        dataTableFocusManager={ dataTableFocusManager }
                        insertTask={ insertTask }
                        deleteTask={ deleteTask }
                    />
                ) : (
                    <TableMode
                        tableState={ tableState } 
                        setTableState={ setTableState }
                        listProps={ listProps }
                        rows={ rows }
                        dataTableFocusManager={ dataTableFocusManager }
                        insertTask={ insertTask }
                        deleteTask={ deleteTask }
                    />
                )}
        </Panel>
    );
}
