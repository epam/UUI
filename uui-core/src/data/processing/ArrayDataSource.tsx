import { useEffect, useMemo } from 'react';
import { IDataSourceView, DataSourceState, SetDataSourceState } from '../../types/dataSources';
import { BaseDataSource } from './BaseDataSource';
import { ArrayListViewProps, useCascadeSelectionService, useDataRows, newMap, ITree, useTree } from './views';
import { ItemsStorage } from './views/tree/ItemsStorage';
import { IMap } from '../../types';
import { RecordStatus } from './views/tree/types';

export interface ArrayDataSourceProps<TItem, TId, TFilter> extends ArrayListViewProps<TItem, TId, TFilter> {}

export class ArrayDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: ArrayDataSourceProps<TItem, TId, TFilter>;
    tree: ITree<TItem, TId>;

    itemsStorage: ItemsStorage<TItem, TId>;
    itemsStatusMap: IMap<TId, RecordStatus>;
    
    constructor(props: ArrayDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.setProps(props);
        const params = { getId: this.getId, complexIds: props.complexIds };
        this.itemsStatusMap = newMap(params);
        this.itemsStorage = new ItemsStorage({ items: [], params: params });
    }

    public setProps(props: ArrayDataSourceProps<TItem, TId, TFilter>) {
        this.props = props;
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
        onValueChange: SetDataSourceState<TFilter, TId>,
        options?: Partial<ArrayListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): IDataSourceView<TItem, TId, TFilter> {
        const { items, ...restDSProps } = this.props;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, selectionTree, reload, totalCount, ...restProps } = useTree({
            type: 'sync',
            ...restDSProps,
            ...options,
            
            items,
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
