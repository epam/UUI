import { useEffect, useMemo, useState } from 'react';
import { LazyListViewProps, useCascadeSelectionService, useDataRows, useTree, newMap } from './views';
import { BaseDataSource } from './BaseDataSource';
import { DataSourceState, IDataSourceView, IMap, SetDataSourceState } from '../../types';
import { ItemsStorage } from './views/tree/ItemsStorage';
import { RecordStatus } from './views/tree/types';

export interface LazyDataSourceProps<TItem, TId, TFilter> extends LazyListViewProps<TItem, TId, TFilter> {}

export class LazyDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: LazyDataSourceProps<TItem, TId, TFilter>;
    itemsStatusMap: IMap<TId, RecordStatus> = null;
    itemsStorage: ItemsStorage<TItem, TId>;

    constructor(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.props = {
            ...props,
            flattenSearchResults: props.flattenSearchResults ?? true,
        };
        const params = { getId: this.getId, complexIds: this.props.complexIds };
        this.itemsStorage = new ItemsStorage({ items: [], params });
        this.itemsStatusMap = newMap(params);
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
        const params = { getId: this.getId, complexIds: this.props.complexIds };
        this.itemsStorage = new ItemsStorage({ items: [], params });
        this.itemsStatusMap = newMap(params);
        super.reload();
    }

    useView<TState extends DataSourceState<any, TId>>(
        value: TState,
        onValueChange: SetDataSourceState<any, TId>,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): IDataSourceView<TItem, TId, TFilter> {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [itemsMap, setItemsMap] = useState(this.itemsStorage.getItemsMap());

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, selectionTree, reload, totalCount, loadMissingRecordsOnCheck, ...restProps } = useTree({
            type: 'lazy',
            ...this.props,
            itemsMap,
            itemsStatusMap: this.itemsStatusMap,
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
            this.trees.set(tree, reload);
            return () => { 
                this.trees.delete(tree);
            };
        }, [tree, reload]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const cascadeSelectionService = useCascadeSelectionService({
            tree: selectionTree,
            cascadeSelection: restProps.cascadeSelection,
            getRowOptions: restProps.getRowOptions,
            rowOptions: restProps.rowOptions,
            getItemStatus: restProps.getItemStatus,
            loadMissingRecordsOnCheck,
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
            reload,
            getById,
            getSelectedRowsCount,
            clearAllChecked,
        }), [
            rows,
            listProps,
            selectAll,
            restProps,
            totalCount,
            reload,
            getById,
            getSelectedRowsCount,
            clearAllChecked,
        ]);
    }
}
