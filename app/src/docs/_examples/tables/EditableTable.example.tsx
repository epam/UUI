import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DataColumnProps, DataSourceState, DataTableRowProps, IImmutableMap, ItemsMap, Metadata, PatchOrdering, useArrayDataSource } from '@epam/uui-core';
import { Button, Checkbox, FlexSpacer, DataTable, DataTableCell, DataTableRow, DatePicker, FlexCell, FlexRow, Panel, PickerInput,
    TextArea, TextInput, useForm, IconButton } from '@epam/uui';
import { TodoTask } from '@epam/uui-docs';
import { ReactComponent as deleteIcon } from '@epam/assets/icons/common/content-clear-18.svg';
import css from './TablesExamples.module.scss';
import { useDataTableFocusManager } from '@epam/uui-components';
import { ReactComponent as undoIcon } from '@epam/assets/icons/content-edit_undo-outline.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/content-edit_redo-outline.svg';

// Define a blank item - for use as a new item, and to simplify mock data definition below
const blankItem: Partial<TodoTask> = {
    isDone: false,
    name: '',
    priority: null,
    comments: '',
    dueDate: '',
};

// Interface to hold form data. Here we'll only store items, so we might use ToDoItem[] as a state.
// However, we'll have an object here to extend the form state if needed later.
interface FormState {
    items: IImmutableMap<number, TodoTask>;
}

// Define priorities to use in PickerInput
const tags = [
    { id: 0, name: 'Low' }, { id: 1, name: 'Normal' }, { id: 2, name: 'High' }, { id: 3, name: 'Critical' },
];

// Define form metadata to validate form data
const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                // 'all' allows to use the same metadata for each item in items array
                props: {
                    name: { isRequired: true },
                },
            },
        },
    },
};

// To store the last item id used
let lastId = -1;

// Prepare mock data for the demo. Usually, you'll get initial data from server API call
const demoItems: TodoTask[] = [
    {
        ...blankItem, id: 0, name: 'Complete data sources re-work', comments: 'The plan is to unite all dataSources into a single "useList" hook',
    }, {
        ...blankItem, id: 1, name: 'Implement editable cells', isDone: true,
    }, {
        ...blankItem, id: 2, name: 'Find better ways to add/remove rows', dueDate: '01-09-2022', priority: 2,
    }, {
        ...blankItem, id: 3, name: 'Finalize the "Project" table demo', comments: 'We first need to build the add/remove rows helpers, and rows drag-n-drop',
    }, { ...blankItem, id: 4, name: 'Complete cells replication' }, {
        ...blankItem, id: 5, name: 'Better rows drag-n-drop support', comments: 'With state-management helpers, and tree/hierarchy support',
    },
];

let savedItem: FormState = {
    // ItemsMap is an immutable map implementation provided by UUI.
    // You can also use plain JS Map, through it will be a bit less convenient.
    items: ItemsMap.blank<number, TodoTask>({ getId: (todo) => todo.id }),
};

const defaultSorting: DataSourceState['sorting'] = [{ field: 'id', direction: 'asc' }];

export default function EditableTableExample() {
    // Use form to manage state of the editable table
    const {
        lens, save, revert, undo, canUndo, redo, canRedo, value, setValue, isChanged,
    } = useForm<FormState>({
        value: savedItem,
        onSave: (newValue) => {
            savedItem = newValue;
            return Promise.resolve({ form: newValue });
        },
        getMetadata: () => metadata,
    });

    // Define data table focus manager, to enable focusing on cells with keyboard shortcuts
    // and programmatically.
    // For example, after adding a row, the first editable cell of the new row should be focused via `dataTableFocusManager`.
    const dataTableFocusManager = useDataTableFocusManager<TodoTask['id']>({}, []);

    const handleDeleteItem = useCallback((item: TodoTask) => {
        setValue((current) => ({ ...current, items: current.items.set(item.id, { ...item, isDeleted: true }) }));
    }, [setValue]);

    // Use state to hold DataTable state - current sorting, filtering, etc.
    const [tableState, setTableState] = useState<DataSourceState>({ sorting: defaultSorting });

    const onTableStateChange = useCallback((state: React.SetStateAction<DataSourceState>) => {
        setTableState((currentTableState) => {
            let updatedState: DataSourceState;
            if (typeof state === 'function') {
                updatedState = state(currentTableState);
            } else {
                updatedState = state;
            }
            
            if (!updatedState.sorting || !updatedState.sorting.length) {
                updatedState.sorting = defaultSorting;
            }
            return updatedState;
        });
    }, [setTableState]);

    useEffect(() => {
        dataTableFocusManager?.focusRow(lastId - 1);
    }, [dataTableFocusManager]);

    // Define DataSource to use in PickerInput in the 'tags' column
    const pickerDataSource = useArrayDataSource({ items: tags }, []);

    // Define table columns. Using useMemo is required, otherwise the table will re-render on each change.
    const columns = useMemo(
        () =>
            [
                {
                    key: 'name',
                    caption: 'Name',
                    // To make column editable, we override the default renderCell behavior.
                    renderCell: (props) => (
                        <DataTableCell
                            // We use the passed rowLens, to extract IEditable instance to the cell value.
                            // This is used by the cell itself to highlight invalid cells.
                            { ...props.rowLens.prop('name').toProps() }
                            // The same IEditable is then passed to the renderEditor callback,
                            // which should render a compatible IEditable component
                            // The cell passes the mode='cell' prop, so all compatible UUI components
                            // are rendered in a 'cell mode' - adopted to use in cells (e.g. with borders removed)
                            renderEditor={ (props) => <TextInput { ...props } /> }
                            { ...props }
                        />
                    ),
                    fix: 'left',
                    width: 300,
                    isSortable: true,
                },
                {
                    key: 'isDone',
                    caption: 'Done',
                    renderCell: (props) => <DataTableCell { ...props.rowLens.prop('isDone').toProps() } renderEditor={ (props) => <Checkbox { ...props } /> } { ...props } />,
                    textAlign: 'center',
                    fix: 'left',
                    width: 80,
                },
                {
                    key: 'dueDate',
                    caption: 'Due date',
                    renderCell: (props) => <DataTableCell { ...props.rowLens.prop('dueDate').toProps() } renderEditor={ (props) => <DatePicker { ...props } /> } { ...props } />,
                    width: 150,
                },
                {
                    key: 'priority',
                    caption: 'Priority',
                    renderCell: (props) => (
                        <DataTableCell
                            { ...props.rowLens.prop('priority').toProps() }
                            renderEditor={ (props) => <PickerInput { ...props } selectionMode="single" dataSource={ pickerDataSource } /> }
                            { ...props }
                        />
                    ),
                    width: 130,
                },
                {
                    key: 'comments',
                    caption: 'Comments',
                    renderCell: (props) => (
                        <DataTableCell { ...props.rowLens.prop('comments').toProps() } renderEditor={ (props) => <TextArea { ...props } autoSize /> } { ...props } />
                    ),
                    width: 120,
                    grow: 1,
                }, 
                {
                    key: 'actions',
                    render: (item) => (
                        <IconButton
                            icon={ deleteIcon }
                            onClick={ () => handleDeleteItem(item) }
                            color="secondary"
                        />
                    ),
                    width: 55,
                    alignSelf: 'center',
                    allowResizing: false,
                },
            ] as DataColumnProps<TodoTask>[],
        [],
    );

    // Create data-source and view to supply filtered/sorted data to the table in form of DataTableRows.
    // DataSources describe the way to extract some list/tree-structured data.
    // Here we'll use ArrayDataSource - which gets data from an array, which we obtain from our Form.
    const dataSource = useArrayDataSource<TodoTask, number, unknown>(
        {
            items: demoItems,
        },
        [],
    );

    // Make an IDataSourceView instance, which takes data from the DataSource, and transforms it into DataTableRows.
    // It considers current sorting, filtering, scroll position, etc. to get a flat list of currently visible rows.
    const view = dataSource.useView(tableState, onTableStateChange, {
        getRowOptions: (item: TodoTask) => ({
            // Rows values are updated via lens.
            ...lens
                .prop('items')
                .key(item.id)
                .default(item)
                .onChange((_, current) => {
                    lastId = Math.min(current.id, lastId);

                    return current;
                })
                .toProps(),
        }),
        // Changed/added/removed items are stored in value.items and applied to the dataSource via patch.
        patch: value.items.set(lastId - 1, { ...blankItem, id: lastId - 1 }), 
        // Position, new items from the patch should be placed.
        getNewItemPosition: () => PatchOrdering.BOTTOM,
        // Getter of deleted state of the item from the patch.
        isDeleted: (item) => item.isDeleted,
    });

    // Render row callback. In simple cases, you don't need, as default implementation would work ok.
    // Here we override it to change row background for 'isDone' items.
    const renderRow = useCallback(
        (props: DataTableRowProps<TodoTask, number>) => <DataTableRow { ...props } cx={ props.value?.isDone ? css.taskIsDone : undefined } />,
        [],
    );

    // Render the table, passing the prepared data to it in form of getRows callback, list props (e.g. items counts)
    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            {/* Render a panel with Save/Revert buttons to control the form */}
            <FlexRow columnGap="12" padding="12" vPadding="12" borderBottom>
                <FlexSpacer />
                <FlexCell width="auto">
                    <Button size="18" icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } fill="outline" />
                </FlexCell>
                <FlexCell width="auto">
                    <Button size="18" icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } fill="outline" />
                </FlexCell>
                <FlexCell width="auto">
                    <Button caption="Revert" onClick={ revert } isDisabled={ !isChanged } color="secondary" fill="outline" />
                </FlexCell>
                <FlexCell width="auto">
                    <Button caption="Save" onClick={ save } color="primary" isDisabled={ !isChanged } />
                </FlexCell>
            </FlexRow>
            <FlexRow cx={ css.container }>
                {/* Render the data table */}
                <DataTable
                    { ...view.getListProps() }
                    getRows={ view.getVisibleRows }
                    value={ tableState }
                    onValueChange={ onTableStateChange }
                    columns={ columns }
                    headerTextCase="upper"
                    renderRow={ renderRow }
                    dataTableFocusManager={ dataTableFocusManager }
                />
            </FlexRow>
        </Panel>
    );
}
