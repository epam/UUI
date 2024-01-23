import { useEffect, useMemo, useState } from 'react';
import { ArrayDataSource, ArrayDataSourceProps } from './ArrayDataSource';
import { DataSourceState, IDataSourceView } from '../../types';
import { useDataRows, useTree } from './views';
import { ItemsStorage } from './views/tree/ItemsStorage';
import { AsyncListViewProps } from './views/types';

export interface AsyncDataSourceProps<TItem, TId, TFilter> extends AsyncListViewProps<TItem, TId, TFilter> {}

export class AsyncDataSource<TItem = any, TId = any, TFilter = any> extends ArrayDataSource<TItem, TId> {
    api: () => Promise<TItem[]> = null;
    constructor(props: AsyncDataSourceProps<TItem, TId, TFilter>) {
        super({
            ...props,
            items: [],
        });
        this.api = props.api;
    }

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
        this.setProps({ ...this.props, items: [] });
        this.itemsStorage = new ItemsStorage({ items: [], getId: this.getId });
        super.reload();
    }

    useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<any, TId>>>,
        options?: Partial<AsyncListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): IDataSourceView<TItem, TId, TFilter> {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [itemsMap, setItemsMap] = useState(this.itemsStorage.getItemsMap());
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, reload, ...restProps } = useTree({
            type: 'async',
            ...this.props,
            api: this.api,
            ...options,
            itemsMap,
            setItems: this.itemsStorage.setItems,
            getId: this.getId,
            getParentId: options?.getParentId ?? this.props.getParentId ?? this.defaultGetParentId,
            dataSourceState: value,
            setDataSourceState: onValueChange,
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
