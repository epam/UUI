import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton, DataTableRow } from '@epam/promo';
import React, { useCallback, useMemo } from 'react';
import { AcceptDropParams, DataQueryFilter, DataTableRowProps, DataTableState, DropParams, Metadata, Tree, useArrayDataSource, useTableState } from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
import { InsertTaskCallback, Task } from './types';
import { getDemoTasks } from './demoData';
import { getColumns } from './columns';

interface FormState {
    items: Record<number, Task>;
    totalEstimate: number;
    maxId: number;
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

const blankTree = Tree.blank<Task, number>({ getId: task => task.id, getParentId: task => task.parentId });

function updateSubtotals(state: FormState) {
    const tree = blankTree.append(Object.values(state.items));
    const subtotals = tree.computeSubtotals(
        (task, hasChildren) => ({
            estimate: hasChildren ? 0 : (task.estimate || 0),
            maxId: task.id,
        }),
        (a, b) => ({
            estimate: a.estimate + b.estimate,
            maxId: Math.max(a.maxId, b.maxId),
        })
    )
    const total = subtotals.get(undefined);
    subtotals.delete(undefined);
    Array.from(subtotals.entries()).forEach(([id, subtotals]) => {
        state.items[id] = ({ ...state.items[id], estimate: subtotals.estimate })
    });
    return {
        ...state,
        totalEstimate: total.estimate,
        maxId: total.maxId,
    };
}

let savedValue: FormState = updateSubtotals({ items: getDemoTasks(), maxId: 0, totalEstimate: 0 });

export const ProjectDemo = () => {
    const { lens, value, setValue, save, isChanged, revert, undo, canUndo, redo, canRedo } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = value;
        },
        getMetadata: () => metadata,
    });

    const [ tableState, setTableState] = React.useState<DataTableState>({});

    const insertTask: InsertTaskCallback = useCallback((task) => {
        setValue(currentValue => {
            const newTask: Task = {
                ...task,
                name: task.name ?? '',
                id: task.id ?? (currentValue.maxId + 1)
            };
            return updateSubtotals({ ...currentValue, items: { ...currentValue.items, [newTask.id]: newTask }});
        });

        setTableState(current => ({ ...current, folded: { ...current.folded, [task.parentId]: false }}))
    }, []);

    const deleteTask = useCallback((id: number) => {
        setValue(currentValue => {
            const items = { ...currentValue.items };
            delete items[id];
            return { ...currentValue, items };
        });
    }, []);

    const handleCanAcceptDrop = useCallback(
        (params: AcceptDropParams<Task, Task>) => ({ bottom: true, top: true, inside: true })
    , []);

    const handleDrop = useCallback((params: DropParams<Task, Task>) => console.log(params), []);

    const handleOnChange = useCallback((prev, next) => {
        return updateSubtotals(next);
    }, []);

    const columns = useMemo(() => getColumns({ insertTask, deleteTask }), []);

    const tasks = Object.values(value.items);

    let tree = Tree.create({ getId: i => i.id, getParentId: i => i.parentId }, tasks);

    // generate 'add item' placeholders
    let lastPlaceholderId = value.maxId + 1;
    tree.getAllParentNodes().reverse().forEach(parent => {
        tree = tree.append([{ id: lastPlaceholderId++, parentId: parent.id, name: "" }]);
    });

    const dataSource = useArrayDataSource<Task, number, DataQueryFilter<Task>>({
        items: tree,
    }, []);

    const dataView = dataSource.useView(tableState, setTableState, {
        getRowOptions: (task) => ({
            ...lens
                .onChange(handleOnChange)
                .prop('items')
                .prop(task.id)
                .toProps(), // pass IEditable to each row to allow editing
            value: tree.getById(task.id),
            //checkbox: { isVisible: true },
            isSelectable: true,
            dnd: {
                srcData: task.id,
                dstData: task.id,
                canAcceptDrop: handleCanAcceptDrop,
                onDrop: handleDrop,
            },
        }),
        sortBy: t => t.order,
    });

    const renderRow =  useCallback((props: DataTableRowProps<Task, number>) => <DataTableRow
        key={ props.rowKey }
        {...props}
        background={ props.isFoldable ? 'gray5' : 'white' }
    />, []);

    return <Panel style={ { width: '100%' } }>
        <FlexRow spacing='12' margin='12'>
            <FlexCell width='auto'>
                <IconButton icon={ insertAfter } onClick={() => insertTask({})} />
            </FlexCell>
            <FlexCell width='auto'>
                <IconButton icon={ insertBefore } onClick={() => {}} />
            </FlexCell>
            <FlexSpacer />
            <FlexCell width='auto'>
                <Button size='30' icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
            </FlexCell>
            <FlexCell width='auto'>
                <Button size='30' icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
            </FlexCell>
            <FlexCell width='auto'>
                <Button size='30' caption="Save" onClick={ save } isDisabled={ !isChanged } />
            </FlexCell>
            <FlexCell width='auto'>
                <Button size='30' caption="Revert" onClick={ revert } isDisabled={ !isChanged } />
            </FlexCell>
        </FlexRow>
        <DataTable
            headerTextCase='upper'
            getRows={ dataView.getVisibleRows }
            columns={ columns }
            value={ tableState }
            onValueChange={ setTableState }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
            showCellDivider={ false }
            renderRow={ renderRow }
            { ...dataView.getListProps() }
        />
    </Panel>;
};