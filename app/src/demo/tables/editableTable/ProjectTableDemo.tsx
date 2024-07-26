import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimelineController, msPerDay } from '@epam/uui-timeline';
import { Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, useForm, SearchInput, Tooltip, MultiSwitch } from '@epam/uui';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, IImmutableMap, ItemsMap, Metadata,
    NOT_FOUND_RECORD, Tree, useDataRows, usePrevious, useTree } from '@epam/uui-core';
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
import { deleteTaskWithChildren, getMinMaxDate, scheduleTasks, setTaskInsertPosition } from './helpers';
import { ReactComponent as TableViewOutlineIcon } from '@epam/assets/icons/content-view_table-outline.svg';
import { ReactComponent as TimelineViewOutlineIcon } from '@epam/assets/icons/editor-chart_gantt-outline.svg';

import css from './ProjectTableDemo.module.scss';
import { TimelineMode } from './TimelineMode';
import { TableMode } from './TableMode';

interface FormState {
    items: IImmutableMap<number, Task>;
}

interface ViewMode {
    id: 'timeline' | 'table';
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
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
    const viewModes: ViewMode[] = [
        { id: 'table', icon: TableViewOutlineIcon },
        { id: 'timeline', icon: TimelineViewOutlineIcon },
    ];
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

    const [tableState, setTableState] = useState<DataTableState>({ sorting: [{ field: 'order' }], visibleCount: 30 });
    const dataTableFocusManager = useDataTableFocusManager<Task['id']>({}, []);

    const searchHandler = useCallback(
        (val: string | undefined) => setTableState((currentTableState) => ({
            ...currentTableState,
            search: val,
        })),
        [],
    );
    
    const { tree, patch, ...restProps } = useTree<Task, number>({
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
        isFoldedByDefault: () => false,
    }, []);

    const treeRef = useRef(tree);
    const patchRef = useRef(patch);
    
    treeRef.current = tree;
    patchRef.current = patch;
    const deleteTask = useCallback((task: Task) => {
        setValue((currentValue) => {
            const updatedItems = deleteTaskWithChildren(task, currentValue.items, treeRef.current);
            let allDeleted = task.parentId === null ? false : true;
            if (task.parentId !== null) {
                const children = treeRef.current.getItems(task.parentId).ids;
                for (const id of children) {
                    const item = treeRef.current.getById(id);
                    if (item === NOT_FOUND_RECORD) {
                        continue;
                    }

                    if (item.id !== task.id && !item.isDeleted) {
                        allDeleted = false;
                        break;
                    }
                }
            }
            
            return {
                ...currentValue,
                items: scheduleTasks(
                    patchRef.current,
                    allDeleted
                        ? updatedItems.set(task.parentId, { ...updatedItems.get(task.parentId), type: 'task' })
                        : updatedItems,
                ),
            };
        });
    }, [setValue]);

    const timelineController = useMemo(
        () => new TimelineController({ widthPx: 0, center: new Date(), pxPerMs: 32 / msPerDay }),
        [],
    );
    const prevWidthPx = usePrevious(timelineController.currentViewport?.widthPx);

    useEffect(() => {
        if (!prevWidthPx && timelineController.currentViewport.widthPx) {
            const { from, to } = getMinMaxDate(treeRef.current);
            if (from && to) {
                timelineController.setViewportRange({ from, to, widthPx: timelineController.currentViewport.widthPx }, false);
            }
        }
    }, [timelineController, timelineController.currentViewport.widthPx, prevWidthPx]);

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
        const taskToInsert: Task = existingTask ? { ...existingTask, type: 'task' } : { id: lastId--, name: '', type: 'task' };
        const task: Task = setTaskInsertPosition(taskToInsert, relativeTask, position, treeRef.current);

        let parentTask = relativeTask;
        if (position === 'inside' && relativeTask.type !== 'story') {
            parentTask = { ...relativeTask, type: 'story' };
        }

        let prevParentTask = taskToInsert.parentId === null ? null : treeRef.current.getById(taskToInsert.parentId);
        if (taskToInsert.parentId !== null && prevParentTask !== null && prevParentTask !== NOT_FOUND_RECORD && taskToInsert.parentId !== task.parentId) {
            const children = treeRef.current.getItems(taskToInsert.parentId);
            const areAllMoved = children.ids.every((id) => id === taskToInsert.id);
            if (areAllMoved) {
                prevParentTask = { ...prevParentTask, type: 'task' };
            }
        }

        setValue((currentValue) => {
            let currentItems = currentValue.items
                .set(task.id, task)
                .set(parentTask.id, parentTask);
            if (prevParentTask !== null && prevParentTask !== NOT_FOUND_RECORD) {
                currentItems = currentItems.set(prevParentTask.id, prevParentTask);
            }

            return {
                ...currentValue,
                items: scheduleTasks(patchRef.current, currentItems),
            };
        });

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

    const formLens = useMemo(() => {
        return lens
            .prop('items')
            .onChange((prevValue, nextValue) => {
                const shouldReschedule = (id: number) => {
                    const prevTask = prevValue.get(id);
                    const t = nextValue.get(id);
                    return !prevValue.has(id)
                    || prevTask.estimate !== t.estimate
                    || prevTask.startDate !== t.startDate
                    || prevTask.dueDate !== t.dueDate
                    || prevTask.assignee !== t.assignee
                    || prevTask.status !== t.status;
                };
                for (const [id] of nextValue) {
                    if (shouldReschedule(id)) {
                        return scheduleTasks(patchRef.current, nextValue);
                    }
                }
            
                return nextValue;
            });
    }, [lens]);
    
    const { rows, listProps } = useDataRows({
        tree,
        ...restProps,
        getRowOptions: (task) => {
            return {
                ...formLens.key(task.id).toProps(), // pass IEditable to each row to allow editing
                isSelectable: true,
                dnd: {
                    srcData: { ...task, isTask: true },
                    dstData: { ...task, isTask: true },
                    canAcceptDrop: handleCanAcceptDrop,
                    onDrop: handleDrop,
                },
            };
        },
    });

    const selectedItem = useMemo(() => {
        if (tableState.selectedId !== undefined) {
            const item = treeRef.current.getById(tableState.selectedId);
            if (item === NOT_FOUND_RECORD) {
                return undefined;
            }
            return item;
        }
        return undefined;
    }, [tableState.selectedId]);

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
                <FlexCell cx={ css.search } width={ 295 }>
                    <SearchInput value={ tableState.search } onValueChange={ searchHandler } placeholder="Search" debounceDelay={ 1000 } />
                </FlexCell>

                <div className={ css.divider } />

                { selectedViewMode === 'timeline'
                && (
                    <FlexRow columnGap="6" background="surface-main">
                        <FlexCell width="auto">
                            <Button
                                icon={ fitContent }
                                iconPosition="left"
                                caption="Fit content"
                                fill="outline"
                                onClick={ () => {
                                    const minMax = getMinMaxDate(tree);
                                    if (minMax.from && minMax.to) {
                                        timelineController.setViewportRange({
                                            from: minMax.from,
                                            to: minMax.to,
                                            widthPx: timelineController.currentViewport.widthPx,
                                        }, true);
                                    } 
                                } }
                            />
                        </FlexCell>
                        <FlexCell width="auto">
                            <Button icon={ zoomOut } iconPosition="right" isDisabled={ !timelineController.canZoomBy(-1) } fill="outline" onClick={ () => timelineController.zoomBy(-1) } />
                        </FlexCell>
                        <FlexCell width="auto">
                            <Button icon={ zoomIn } iconPosition="right" isDisabled={ !timelineController.canZoomBy(1) } fill="outline" onClick={ () => timelineController.zoomBy(1) } />
                        </FlexCell>
                    </FlexRow>
                )}
                <FlexCell width={ 150 }>
                    <MultiSwitch
                        items={ viewModes }
                        value={ selectedViewMode }
                        onValueChange={ setSelectedViewMode }
                    />
                </FlexCell>

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
