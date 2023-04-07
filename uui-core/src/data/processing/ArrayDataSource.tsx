import { useEffect } from 'react';
import { IDataSourceView, DataSourceState } from '../../types';
import { BaseDataSource } from './BaseDataSource';
import { ArrayListView, ArrayListViewProps } from './views';
import { ITree, Tree } from './views/tree';

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
            this.tree = Tree.create({
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
        options?: Partial<ArrayListViewProps<TItem, TId, TFilter>>,
    ): IDataSourceView<TItem, TId, TFilter> {
        useEffect(() => () => this.unsubscribeView(onValueChange), [this]);

        return this.getView(value, onValueChange, options);
    }
}
