import { useEffect } from 'react';
import { IDataSourceView, DataSourceState } from '../../types';
import { BaseDataSource } from './BaseDataSource';
import { ArrayListView, ArrayListViewProps } from './views';
import { ITree, Tree } from './views/tree';

export interface ArrayDataSourceProps<TItem, TId, TFilter, TSubtotals = void> extends ArrayListViewProps<TItem, TId, TFilter, TSubtotals> {}

export class ArrayDataSource<TItem = any, TId = any, TFilter = any, TSubtotals = void> extends BaseDataSource<TItem, TId, TFilter, TSubtotals> {
    props: ArrayDataSourceProps<TItem, TId, TFilter, TSubtotals>;
    tree: ITree<TItem, TId, TSubtotals>;

    constructor(props: ArrayDataSourceProps<TItem, TId, TFilter, TSubtotals>) {
        super(props);
        this.setProps(props);
    }

    public setProps(props: ArrayDataSourceProps<TItem, TId, TFilter, TSubtotals>) {
        this.props = props;
        if (this.props.items instanceof Tree) {
            this.tree = this.props.items;
        } else {
            this.tree = Tree.create<TItem, TId, TSubtotals>({
                ...this.props,
                // These defaults are added for compatibility reasons.
                // We'll require getId and getParentId callbacks in other APIs, including the views.
                getId: this.getId,
                getParentId: props?.getParentId || this.defaultGetParentId,
            },
                this.props.items,
            );
        }
    }

    public getById = (id: TId) => {
        return this.tree.getById(id);
    }

    private defaultGetParentId = (item: TItem) => {
        return (item as any)['parentId'];
    }

    setItem(item: TItem): void {
        // TODO
    }

    getView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: (val: DataSourceState<TFilter, TId>) => void,
        options?: Partial<ArrayListViewProps<TItem, TId, TFilter, TSubtotals>>,
    ): IDataSourceView<TItem, TId, TFilter, TSubtotals> {
        const view = this.views.get(onValueChange) as ArrayListView<TItem, TId, TFilter, TSubtotals>;
        const viewProps: ArrayListViewProps<TItem, TId, TFilter, TSubtotals> = {
            ...this.props,
            items: this.tree,
            ...options,
            // These defaults are added for compatibility reasons.
            // We'll require getId and getParentId callbacks in other APIs, including the views.
            getId: this.getId,
            getParentId: options?.getParentId || this.defaultGetParentId,
        };

        if (view) {
            view.update(value, viewProps);
            return view;
        } else {
            const newView = new ArrayListView({ value, onValueChange }, viewProps);
            this.views.set(onValueChange, newView);
            return newView;
        }
    }

    useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: (val: DataSourceState<TFilter, TId>) => void,
        options?: Partial<ArrayListViewProps<TItem, TId, TFilter, TSubtotals>>,
    ): IDataSourceView<TItem, TId, TFilter, TSubtotals> {
        useEffect(() => () => this.unsubscribeView(onValueChange), [this]);

        return this.getView(value, onValueChange, options);
    }
}
