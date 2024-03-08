import React, { useCallback, useMemo, useState } from 'react';
import { DataColumnProps, DataTableRowProps, ItemsMap, Metadata, UuiContexts, useArrayDataSource, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { Button, Checkbox, FlexSpacer, DataTable, DataTableCell, DataTableRow, DatePicker, FlexCell, FlexRow, Panel, PickerInput,
    TextArea, TextInput, useForm, IconButton } from '@epam/uui';
import { TodoTask } from '@epam/uui-docs';
import { ReactComponent as deleteIcon } from '@epam/assets/icons/common/content-clear-18.svg';
import css from './TablesExamples.module.scss';
import { TApi } from '../../../data';

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
    items: ItemsMap<number, TodoTask>;
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

let savedItem: FormState = {
    items: ItemsMap.blank<number, TodoTask>({ getId: (todo) => todo.id }),
};

// To store the last item id used
let id = -1;

export default function EditableTableExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    // Use form to manage state of the editable table
    const {
        lens, save, revert, value, setValue, isChanged,
    } = useForm<FormState>({
        value: savedItem,
        onSave: (newValue) => {
            savedItem = newValue;
            return Promise.resolve({ form: newValue });
        },
        getMetadata: () => metadata,
    });

    const newItems = useMemo(() => new Map<number, boolean>(), []);

    // Prepare callback to add a new item to the list.
    const handleNewItem = useCallback(() => {
        const newItem = { ...blankItem, id: --id };

        newItems.set(newItem.id, true);
        // We can manipulate form state directly with the setValue
        // - pretty much like we do with the setState of React.useState.
        setValue((current) => ({ ...current, items: current.items.set(newItem.id, newItem) }));
    }, [setValue, newItems]);

    const handleDeleteItem = useCallback((item: TodoTask) => {
        setValue((current) => ({ ...current, items: current.items.set(item.id, { ...item, isDeleted: true }) }));
    }, [setValue]);

    // Use state to hold DataTable state - current sorting, filtering, etc.
    const [tableState, setTableState] = useState({});

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
    // Here we'll use ArrayDataSource - which gets data from an array, which we obtain from our Form
    const dataSource = useAsyncDataSource<TodoTask, number, unknown>(
        {
            api: svc.api.demo.todos,
        },
        [],
    );

    // Make an IDataSourceView instance, which takes data from the DataSource, and transforms it into DataTableRows.
    // It considers current sorting, filtering, scroll position, etc. to get a flat list of currently visible rows.
    const view = dataSource.useView(tableState, setTableState, {
        getRowOptions: (item: TodoTask) => ({
            ...lens.prop('items').getItem(item.id).default(item).toProps(),
        }),
        patchItems: value.items,
        getPosition: (item: TodoTask) => newItems.get(item.id) ? 'bottom' : 'initial',
        isDeletedProp: 'isDeleted',
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
            <FlexRow spacing="12" padding="12" vPadding="12" borderBottom>
                <FlexCell width="auto">
                    <Button caption="Add task" onClick={ handleNewItem } />
                </FlexCell>
                <FlexSpacer />
                <FlexCell width="auto">
                    <Button caption="Revert" onClick={ revert } isDisabled={ !isChanged } color="secondary" />
                </FlexCell>
                <FlexCell width="auto">
                    <Button caption="Save" onClick={ save } color="accent" isDisabled={ !isChanged } />
                </FlexCell>
            </FlexRow>
            <FlexRow cx={ css.container }>
                {/* Render the data table */}
                <DataTable
                    { ...view.getListProps() }
                    getRows={ view.getVisibleRows }
                    value={ tableState }
                    onValueChange={ setTableState }
                    columns={ columns }
                    headerTextCase="upper"
                    renderRow={ renderRow }
                />
            </FlexRow>
        </Panel>
    );
}
