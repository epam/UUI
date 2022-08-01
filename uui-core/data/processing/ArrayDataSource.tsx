import { useEffect } from 'react';
import { DataSourceItemId, IDataSourceView, DataSourceState } from '../../types';
import { BaseDataSource } from './BaseDataSource';
import { ArrayListView, ArrayListViewProps,  } from './views';
import { Tree } from './views/Tree';

export type ArrayDataSourceProps<TItem, TId, TFilter> = ArrayListViewProps<TItem, TId, TFilter> & {
    items: TItem[] | Tree<TItem, TId>;
};

export class ArrayDataSource<TItem = any, TId extends DataSourceItemId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: ArrayDataSourceProps<TItem, TId, TFilter>;
    tree: Tree<TItem, TId>;

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
                    // This default is added for compatibility reasons. We require getId callback in other APIs
                    getId: this.getId,
                },
                this.props.items
            );
        }
    }

    public getById = (id: TId) => {
        return this.tree.getById(id);
    }

    protected getKey(item: TItem) {
        return JSON.stringify(this.getId(item));
    }

    protected idToKey(id: TId) {
        return JSON.stringify(id);
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
            // This default is added for compatibility reasons. We require getId callback in other APIs
            getId: this.getId,
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
        options?: ArrayListViewProps<TItem, TId, TFilter>
    ): IDataSourceView<TItem, TId, TFilter> {
        useEffect(() => () => this.unsubscribeView(onValueChange), [this]);

        return this.getView(value, onValueChange, options);
    }
}
