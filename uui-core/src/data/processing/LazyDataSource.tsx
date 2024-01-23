import { useEffect, useMemo, useState } from 'react';
import { LazyListViewProps, useDataRows, useTree } from './views';
import { ListApiCache } from './ListApiCache';
import { BaseDataSource } from './BaseDataSource';
import { DataSourceState } from '../../types';
import { ItemsStorage } from './views/tree/ItemsStorage';

export interface LazyDataSourceProps<TItem, TId, TFilter> extends LazyListViewProps<TItem, TId, TFilter> {}

export class LazyDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: LazyDataSourceProps<TItem, TId, TFilter>;
    cache: ListApiCache<TItem, TId, TFilter> = null;
    itemsStorage: ItemsStorage<TItem, TId>;

    constructor(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.props = {
            ...props,
            flattenSearchResults: props.flattenSearchResults ?? true,
        };
        this.itemsStorage = new ItemsStorage({ items: [], getId: this.getId });
    }

    public setProps(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        this.props = {
            ...this.props,
            ...props,
            flattenSearchResults: props.flattenSearchResults ?? true,
        };
    }

    public getById = (id: TId): TItem | void => {
        const map = this.itemsStorage.getItemsMap();
        return map.has(id) ? map.get(id) : null;
    };

    setItem(item: TItem) {
        this.itemsStorage.setItems([item]);
    }

    public clearCache() {
        this.itemsStorage = new ItemsStorage({ items: [], getId: this.getId });
        super.reload();
    }

    useView<TState extends DataSourceState<any, TId>>(
        value: TState,
        onValueChange: React.Dispatch<React.SetStateAction<TState>>,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [itemsMap, setItemsMap] = useState(this.itemsStorage.getItemsMap());

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, reload, ...restProps } = useTree({
            type: 'lazy',
            ...this.props,
            itemsMap,
            setItems: this.itemsStorage.setItems,
            dataSourceState: value,
            setDataSourceState: onValueChange as React.Dispatch<React.SetStateAction<DataSourceState<any, TId>>>,
            // These defaults are added for compatibility reasons.
            // We'll require getId and getParentId callbacks in other APIs, including the views.
            getId: this.getId,
            ...props,
        }, [...deps, this]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const unsubscribe = this.itemsStorage.subscribe(() => {
                setItemsMap(this.itemsStorage.getItemsMap());
            });
            
            return () => {
                unsubscribe();
            };
        }, []);
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            this.trees.set(tree, reload);
            return () => { 
                this.trees.delete(tree);
            };
        }, [tree, reload]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { rows, listProps, selectAll, getById, getSelectedRows, getSelectedRowsCount, clearAllChecked } = useDataRows({
            tree,
            ...restProps,
        });

        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useMemo(() => ({
            getVisibleRows: () => rows,
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
            rows,
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
