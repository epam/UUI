import { useEffect, useMemo, useState } from 'react';
import { IDataSourceView, DataSourceState } from '../../types/dataSources';
import { BaseDataSource } from './BaseDataSource';
import { ArrayListViewProps, useDataRows } from './views';
import { PureTreeState, useTree } from './views/tree';
import { ItemsStorage } from './views/tree/ItemsStorage';

export interface ArrayDataSourceProps<TItem, TId, TFilter> extends ArrayListViewProps<TItem, TId, TFilter> {}

export class ArrayDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: ArrayDataSourceProps<TItem, TId, TFilter>;
    tree: PureTreeState<TItem, TId>;

    itemsStorage: ItemsStorage<TItem, TId>;
    
    constructor(props: ArrayDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.setProps(props);
    }

    public setProps(props: ArrayDataSourceProps<TItem, TId, TFilter>) {
        const currentItems = this.props?.items;

        this.props = props;
        if (props.items && currentItems !== props.items) {
            if (!this.itemsStorage) {
                this.itemsStorage = new ItemsStorage({ items: [], getId: this.getId });
            }
            this.itemsStorage.setItems(props.items, { reset: true });
        }
    }

    public getById = (id: TId): TItem | undefined => {
        return this.itemsStorage.getItemsMap().get(id);
    };

    protected defaultGetParentId = (item: TItem) => {
        return (item as any)['parentId'];
    };

    setItem(item: TItem): void {
        const id = this.getId(item);
        const prevItem = this.getById(id);
        if (!prevItem) {
            this.itemsStorage.setItems([item]);
        }
    }

    useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>,
        options?: Partial<ArrayListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): IDataSourceView<TItem, TId, TFilter> {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [itemsMap, setItemsMap] = useState(this.itemsStorage.getItemsMap());

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, reload, ...restProps } = useTree({
            type: 'plain',
            ...this.props,
            ...options,
            
            itemsMap,
            setItems: this.itemsStorage.setItems,
            dataSourceState: value,
            setDataSourceState: onValueChange,
            // These defaults are added for compatibility reasons.
            // We'll require getId and getParentId callbacks in other APIs, including the views.
            getId: this.getId,
            getParentId: options?.getParentId ?? this.props.getParentId ?? this.defaultGetParentId,
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
