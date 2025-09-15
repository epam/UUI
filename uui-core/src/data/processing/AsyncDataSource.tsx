import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrayDataSource, ArrayDataSourceProps } from './ArrayDataSource';
import { useForceUpdate } from '../../hooks';
import { DataSourceState, IDataSourceView, SetDataSourceState } from '../../types';
import { useCascadeSelectionService, useDataRows, useTree, newMap } from './views';
import { ItemsStorage } from './views/tree/ItemsStorage';
import { AsyncListViewProps } from './views/types';
import { ItemsStatusCollector } from './views/tree/ItemsStatusCollector';

export interface AsyncDataSourceProps<TItem, TId, TFilter> extends AsyncListViewProps<TItem, TId, TFilter> {}

export class AsyncDataSource<TItem = any, TId = any, TFilter = any> extends ArrayDataSource<TItem, TId> {
    api: () => Promise<TItem[]> = null;
    itemsStatusCollector: ItemsStatusCollector<TItem, TId, TFilter>;

    constructor(props: AsyncDataSourceProps<TItem, TId, TFilter>) {
        super({
            ...props,
            items: [],
        });
        const params = { getId: this.getId, complexIds: this.props.complexIds };
        this.api = props.api;
        this.itemsStatusCollector = new ItemsStatusCollector(newMap(params), params);
    }

    private _cache: Promise<TItem[]>;
    private get cache(): Promise<TItem[]> {
        return this._cache;
    }

    private set cache(_cache: Promise<TItem[]> | null) {
        this._cache = _cache;
    }
    
    private cachedApi = async () => {
        if (!this.cache) {
            this.cache = this.api();
        }

        return this.cache;
    };

    public setProps(newProps: ArrayDataSourceProps<TItem, TId, TFilter>) {
        const props = { ...newProps };
        // We'll receive items=null on updates (because we inherit ArrayDataSource, but nobody would actually pass items there - they are expected to come from API)
        // so this tweak is required to not reset items on any update
        props.items = newProps.items || this.props.items;

        super.setProps(props);
        if (newProps.items && newProps.items !== this.props.items) {
            this.itemsStorage.setItems(newProps.items, { reset: true });
        }
    }

    reload() {
        this.cache = null;
        this.setProps({ ...this.props, items: [] });
        const params = { getId: this.getId, complexIds: this.props.complexIds };
        this.itemsStorage = new ItemsStorage({ items: [], params });
        this.itemsStatusCollector = new ItemsStatusCollector(newMap(params), params);
        super.reload();
    }

    useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: SetDataSourceState<any, TId>,
        options?: Partial<AsyncListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): IDataSourceView<TItem, TId, TFilter> {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const forceUpdate = useForceUpdate();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [itemsMap, setItemsMap] = useState(this.itemsStorage.getItemsMap());

        const { items, ...props } = { ...this.props, ...options };

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, reload, selectionTree, totalCount, ...restProps } = useTree({
            type: 'async',
            ...props,
            api: this.cachedApi,
            itemsMap,
            setItems: this.itemsStorage.setItems,
            itemsStatusCollector: this.itemsStatusCollector,
            isLoaded: this.props.items.length > 0,
            getId: this.getId,
            getParentId: options?.getParentId ?? this.props.getParentId ?? this.defaultGetParentId,
            dataSourceState: value,
            setDataSourceState: onValueChange,
        }, [...deps, this]);

        const clearCacheAndReload = useCallback(() => {
            this.cache = null;
            reload();
        }, [reload, this]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const unsubscribe = this.itemsStorage.subscribe((newItemsMap) => {
                if (itemsMap !== newItemsMap) {
                    setItemsMap(newItemsMap);
                }
            });

            return () => {
                unsubscribe();
            };
        }, [this.itemsStorage]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const unsubscribe = this.itemsStatusCollector.subscribe(() => {
                forceUpdate();
            });

            return () => {
                unsubscribe();
            };
        }, [this.itemsStatusCollector]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            this.trees.set(tree, reload);
            return () => {
                this.trees.delete(tree);
            };
        }, [tree, reload]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const cascadeSelectionService = useCascadeSelectionService({
            tree: selectionTree,
        });

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { rows, listProps, selectAll, getById, getSelectedRowsCount, clearAllChecked } = useDataRows({
            tree,
            ...restProps,
            ...cascadeSelectionService,
        });

        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useMemo(() => ({
            getVisibleRows: () => rows,
            getListProps: () => ({ ...listProps, totalCount }),
            selectAll,
            getConfig: () => restProps,
            reload: clearCacheAndReload,
            getById,
            getSelectedRowsCount,
            clearAllChecked,
        }), [
            rows,
            listProps,
            selectAll,
            restProps,
            totalCount,
            clearCacheAndReload,
            getById,
            getSelectedRowsCount,
            clearAllChecked,
        ]);
    }
}
