import { useEffect, useMemo } from 'react';
import { IDataSourceView, DataSourceState } from '../../types/dataSources';
import { BaseDataSource } from './BaseDataSource';
import { ArrayListView, ArrayListViewProps, useDataRows } from './views';
import { ITree, NOT_FOUND_RECORD, Tree, useTree } from './views/tree';

export interface ArrayDataSourceProps<TItem, TId, TFilter> extends ArrayListViewProps<TItem, TId, TFilter> {}

export class ArrayDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: ArrayDataSourceProps<TItem, TId, TFilter>;
    tree: ITree<TItem, TId>;
    constructor(props: ArrayDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.setProps(props);
    }

    public setProps(props: ArrayDataSourceProps<TItem, TId, TFilter>) {
        this.props = props;
        if (this.props.items instanceof Tree) {
            this.tree = this.props.items;
        } else {
            this.tree = Tree.create(
                {
                    ...this.props,
                    // These defaults are added for compatibility reasons.
                    // We'll require getId and getParentId callbacks in other APIs, including the views.
                    getId: this.getId,
                    getParentId: props?.getParentId ?? this.defaultGetParentId,
                },
                this.props.items,
            );
        }
    }

    public getById = (id: TId): TItem | void => {
        const item = this.tree.getById(id);
        if (item === NOT_FOUND_RECORD) {
            return;
        }
        return item;
    };

    protected defaultGetParentId = (item: TItem) => {
        return (item as any)['parentId'];
    };

    setItem(item: TItem): void {
        const id = this.getId(item);
        const prevItem = this.getById(id);
        if (!prevItem) {
            const items = Array.isArray(this.props.items)
                ? [...this.props.items, item]
                : this.props.items.patch([item]);
            this.setProps({ ...this.props, items });
        }
    }

    getView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: (val: DataSourceState<TFilter, TId>) => void,
        options?: Partial<ArrayListViewProps<TItem, TId, TFilter>>,
    ): IDataSourceView<TItem, TId, TFilter> {
        const view = this.views.get(onValueChange) as ArrayListView<TItem, TId, TFilter>;
        const viewProps: ArrayListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            items: this.tree,
            ...options,
            // These defaults are added for compatibility reasons.
            // We'll require getId and getParentId callbacks in other APIs, including the views.
            getId: this.getId,
            getParentId: options?.getParentId ?? this.props.getParentId ?? this.defaultGetParentId,
        };

        if (view) {
            view.update({ value, onValueChange }, viewProps);
            return view;
        } else {
            const newView = new ArrayListView({ value, onValueChange }, viewProps);
            this.views.set(onValueChange, newView);
            return newView;
        }
    }

    useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>,
        options?: Partial<ArrayListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): IDataSourceView<TItem, TId, TFilter> {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, reload, ...restProps } = useTree({ 
            ...this.props,
            items: this.tree,
            ...options,
            dataSourceState: value,
            setDataSourceState: onValueChange,
            // These defaults are added for compatibility reasons.
            // We'll require getId and getParentId callbacks in other APIs, including the views.
            getId: this.getId,
            getParentId: options?.getParentId ?? this.props.getParentId ?? this.defaultGetParentId,
        }, [...deps, this]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            this.trees.set(tree, reload);
            return () => { 
                this.trees.delete(tree);
            };
        }, [tree, reload]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { visibleRows, listProps, selectAll, getById, getSelectedRows, getSelectedRowsCount, clearAllChecked } = useDataRows({
            tree,
            ...restProps,
        });

        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useMemo(() => ({
            getVisibleRows: () => visibleRows,
            getListProps: () => listProps,
            selectAll,
            getConfig: () => restProps,
            reload,
            getById,
            getSelectedRows,
            getSelectedRowsCount,
            clearAllChecked,
            activate: () => {},
            deactivate: () => {},
            loadData: () => {},
            _forceUpdate: () => {},
        }), [
            visibleRows,
            listProps,
            selectAll,
            restProps,
            reload,
            getById,
            getSelectedRows,
            getSelectedRowsCount,
            clearAllChecked,
        ]);
    }
}
