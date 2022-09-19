import { Button, DataTable } from "epam-promo";
import React, { useState } from "react";
import { ArrayListViewProps, DataColumnProps, DataQueryFilter, DataRowProps, DataTableState, IDataSourceView, IEditable, LazyDataSourceApi, LazyListViewProps, Tree, useTableState } from "uui-core";

interface UseListProps<TItem, TId, TFilter>
    extends
        // these two will be merged into ListViewProps, or even to the UseListProps directly
        Partial<LazyListViewProps<TItem, TId, TFilter>>, Partial<ArrayListViewProps<TItem, TId, TFilter>>
    {
    /**
     * Set to false to disable fetching of visible rows. This doesn't disable fetching selected/checked items.
     * Useful for scenarios when list is not visible until user action (e.g. in PickerInput - until user opens dropdown)
     * Default is true.
     * */
    fetchRows?: boolean;

    tableState?: DataTableState<TFilter>;
    setTableState?: (state: DataTableState<TFilter>) => void;

    // Option 1 - use tree directly.
    // Pros:
    // - most efficient (no conversion)
    // - user can use Tree helpers
    // Cons:
    // - need to adjust lenses and form/validate somehow to work with Tree
    // -
    tree?: Tree<TItem, TId>;
    setTree?: (update: (current: Tree<TItem, TId>) => Tree<TItem, TId>) => void;
}

interface UseListApi<TItem, TId, TFilter = DataQueryFilter<TItem>>
    extends
        IDataSourceView<TItem, TId, TFilter>,
        // pass-through the IEditable<DataTableState> for:
        // 1. convenience
        // 2. to allow 'controlled' useView (which holds DataTableState inside)
        // TBD: maybe we need to pass it as tableState/setTableState, instead of value/onValueChange
        IEditable<DataTableState>
{
    // TBD: deprecate getRows() - which triggers loading as a side-effect.
    // replace it with:
    // rows: DataRowProps<TItem, TId>[] (or visibleRows?)
    // fetchRows: boolean; - in UseListProps
    getRows(): DataRowProps<TItem, TId>[];
    rows: DataRowProps<TItem, TId>[];

    getById(id: TId): DataRowProps<TItem, TId>;

    // Pass-through table-state API via these props, instead of value/onValueChange?
    //tableState?: DataTableState<TFilter>;
    //setTableState?: (state: DataTableState<TFilter>) => void;

    addItem(item: Partial<TItem>): void;
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

interface MyItem { id: number, parentId: number, name: string };
const testApi: LazyDataSourceApi<MyItem, number, DataQueryFilter<MyItem>> = null;

const columns: DataColumnProps<MyItem, number>[] = [];

// plain list, table state is controlled by useList
function LazyPlainList() {
    const list = useList<MyItem, number>({ api: testApi, getId: i => i.id });

    return <DataTable
        columns={ columns }
        { ...list }
    />;
}

// plain list, table state supplied from useState, editable rows
function ArrayPlainList() {
    const [tableState, setTableState] = useState<DataTableState>();

    const list = useList<MyItem, number>({
        items: [],
        getId: i => i.id,
        tableState,
        setTableState,
    });

    return <DataTable
        columns={ columns }
        { ...list }
    />;
}


// Tree, table state is supplied from useTableState
function TreeTable() {
    const tableState = useTableState({ columns });

    const list = useList<MyItem, number>({
        api: testApi,
        getId: i => i.id,
        getParentId: i => i.parentId,
        ...tableState,
    });

    return <DataTable
        columns={ columns }
        { ...list }
    />;
}

// editable tree
function EditableTree() {
    const [tree, setTree] = useState<Tree<MyItem, number>>(Tree.blank({}));

    const [tableState, setTableState] = useState<DataTableState>();

    const list = useList<MyItem, number>({
        tree,
        setTree,
        getId: i => i.id,
        tableState,
        setTableState,
    });


    return <div>
        <DataTable
            columns={ columns }
            { ...list }
        />;
        <Button caption="" onClick={ list./>
    </div>
}