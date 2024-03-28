import { Button, DataTable } from '@epam/promo';
import React, { useState } from 'react';
import {
    ArrayListViewProps,
    DataColumnProps,
    DataQueryFilter,
    DataRowProps,
    DataTableState,
    IDataSourceView,
    IEditable,
    ITree,
    LazyDataSourceApi,
    LazyListViewProps,
    Metadata,
    useForm,
    useTableState,
} from '@epam/uui-core';

type UseListProps<TItem, TId, TFilter> =
    // these two will be merged into BaseListViewProps, or even to the UseListProps directly
    (LazyListViewProps<TItem, TId, TFilter> | Partial<ArrayListViewProps<TItem, TId, TFilter>>) & {
        /**
         * Set to false to disable fetching of visible rows. This doesn't disable fetching selected/checked items.
         * Useful for scenarios when list is not visible until user action (e.g. in PickerInput - until user opens dropdown)
         * Default is true.
         */
        fetchRows?: boolean;

        fetchById?: boolean;

        // TableState is passed to the dataSource.useView/getView via 1nd and 2rd parameters (useView(value, onValueChange, options))
        // We don't need metadata and validation for these, supplying them via lenses is a rare case, so let's put them like this:
        tableState?: DataTableState<TFilter>;
        setTableState?: (state: DataTableState<TFilter>) => void;
    } & // // We need to decide on how to put items/setItems into useList
    // We want to support several formats:
    // - items: TItem[] // simple, backward-compatible. Tree manipulation is hard, and we need to re-build the tree on each change
    // - [maybe] byId: Map<TId, TItem> // a bit more efficient and convenient. However, it can't store the order of items. And we'd need to re-build the tree anyway
    // - tree: Tree<TItem, TId> // convenient and efficient. But not serializable, and we need to adjust metadata/validate/lenses to support it
    //
    // We also need to pass metadata and validationState along with the value. It seems like we are forced to use IEditable here.
    // Let's try to use IEditable directly:
    (Partial<IEditable<TItem[]>> | Partial<IEditable<ITree<TItem, TId>>>);

interface UseListApi<TItem, TId, TFilter = DataQueryFilter<TItem>>
    extends IDataSourceView<TItem, TId, TFilter>,
    // pass-through the IEditable<DataTableState> for:
    // 1. convenience
    // 2. to allow 'controlled' useView (which holds DataTableState inside)
    // TBD: maybe we need to pass it as tableState/setTableState, instead of value/onValueChange
    IEditable<DataTableState> {
    // TBD: deprecate getRows() - which triggers loading as a side-effect.
    // replace it with:
    // rows: DataRowProps<TItem, TId>[] (or visibleRows?)
    // fetchRows: boolean; - in UseListProps
    getRows(): DataRowProps<TItem, TId>[];
    rows: DataRowProps<TItem, TId>[];

    getById(id: TId): DataRowProps<TItem, TId>;

    reload(): void;

    // Pass-through table-state API via these props, instead of value/onValueChange?
    // tableState?: DataTableState<TFilter>;
    // setTableState?: (state: DataTableState<TFilter>) => void;

    addItem(): void;
    deleteItem(id: TId): void;
}

// TDB: naming.
// a) single useList() hook
// b) useList() and useTree hooks.
//    useTree() is an extended version (with required getChildCount, getParentId, etc.)
//    the problem here is that it's harder to use UseListProps as input for pickers
//    - as there'll be two types of props (for list and tree)
function useList<TItem, TId, TFilter = DataQueryFilter<TItem>>(props: UseListProps<TItem, TId, TFilter>) {
    return null as UseListApi<TItem, TId, TFilter>;
}

interface MyItem {
    id: number;
    parentId: number;
    name: string;
}
const testApi: LazyDataSourceApi<MyItem, number, DataQueryFilter<MyItem>> = null;

const columns: DataColumnProps<MyItem, number>[] = [];

// plain list, table state is controlled by useList
function LazyPlainList() {
    // const list = useList<MyItem, number>({ api: testApi, getId: i => i.id });
    const list = useList<MyItem, number>({ api: testApi, getId: (i) => i.id });

    return <DataTable columns={ columns } { ...list } />;
}

// plain list, table state supplied from useState, editable rows
function ArrayPlainList() {
    const [tableState, setTableState] = useState<DataTableState>();

    const list = useList<MyItem, number>({
        items: [],
        getId: (i) => i.id,
        tableState,
        setTableState,
    });

    return <DataTable columns={ columns } { ...list } />;
}

// Tree, table state is supplied from useTableState
function TreeTable() {
    const tableState = useTableState({ columns });

    const list = useList<MyItem, number>({
        api: testApi,
        getId: (i) => i.id,
        getParentId: (i) => i.parentId,
        fetchRows: false,
        ...tableState,
    });

    list.reload();

    return <DataTable columns={ columns } { ...list } />;
}

// editable tree
interface FormState {
    items: MyItem[]; // Tree<MyItem, number>;
    someOtherField: string;
}

const formMetadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                // props: { // need to do some type-fu here
                // }
            },
        },
        someOtherField: { isRequired: true },
    },
};

function EditableTree() {
    const { lens } = useForm({
        value: {
            items: [],
            someOtherField: '',
        },
        getMetadata: () => formMetadata,
        onSave: () => Promise.resolve(),
    });

    const list = useList<MyItem, number>({
        getId: (i) => i.id,
        ...lens.prop('items').toProps(),
    });

    return (
        <div>
            <DataTable columns={ columns } { ...list } />
            ;
            <Button caption="Add Item" onClick={ () => list.addItem() } />
        </div>
    );
}
