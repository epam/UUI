import { useEffect, useMemo, useState } from 'react';
import { IDataSourceView, DataSourceState } from '../../types/dataSources';
import { BaseDataSource } from './BaseDataSource';
import { ArrayListViewProps, useCascadeSelectionService, useDataRows } from './views';
import { ITree, useTree } from './views/tree';
import { ItemsStorage } from './views/tree/ItemsStorage';

export interface ArrayDataSourceProps<TItem, TId, TFilter> extends ArrayListViewProps<TItem, TId, TFilter> {}

export class ArrayDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: ArrayDataSourceProps<TItem, TId, TFilter>;
    tree: ITree<TItem, TId>;

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
                this.itemsStorage = new ItemsStorage({ items: props.items, getId: this.getId });
            } else {
                this.itemsStorage.setItems(props.items, { reset: true });
            }
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
        const { items, ...restDSProps } = this.props;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { tree, selectionTree, reload, totalCount, ...restProps } = useTree({
            type: 'plain',
            ...restDSProps,
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
        });

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { rows, listProps, selectAll, getById, getSelectedRows, getSelectedRowsCount, clearAllChecked } = useDataRows({
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
            totalCount,
            reload,
            getById,
            getSelectedRows,
            getSelectedRowsCount,
            clearAllChecked,
        ]);
    }
}
