import { useEffect, useMemo } from 'react';
import { ArrayDataSource, ArrayDataSourceProps } from './ArrayDataSource';
import { BaseArrayListViewProps } from './views/ArrayListView';
import { DataSourceState, IDataSourceView } from '../../types';
import { AsyncListView, AsyncListViewProps } from './views/AsyncListView';

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
    }

    reload() {
        this.views.forEach((view) => view.reload());
        this.setProps({ ...this.props, items: [] });
    }

    private loadViewData(view: AsyncListView<TItem, TId, TFilter>) {
        if (!view.isLoaded) {
            view.loadData().then((loadedItems) => {
                if (loadedItems !== undefined) {
                    this.setProps({ ...this.props, items: loadedItems }); 
                    view._forceUpdate();
                }
            });
        }
    }

    getView(
        value: DataSourceState<any, TId>,
        onValueChange: (val: DataSourceState<any, TId>) => any,
        options?: Partial<BaseArrayListViewProps<TItem, TId, TFilter>>,
    ): IDataSourceView<TItem, TId, TFilter> {
        const view = this.views.get(onValueChange) as AsyncListView<TItem, TId, TFilter>;
        const { items, ...props } = this.props;
        const viewProps: AsyncListViewProps<TItem, TId, TFilter> = {
            ...props,
            ...options,
            api: this.api,
            // These defaults are added for compatibility reasons.
            // We'll require getId and getParentId callbacks in other APIs, including the views.
            getId: this.getId,
            getParentId: options?.getParentId ?? this.props.getParentId ?? this.defaultGetParentId,
        };

        if (view) {
            view.update({ value, onValueChange }, viewProps);
            this.loadViewData(view);

            return view;
        } else {
            const newView = new AsyncListView({ value, onValueChange }, viewProps);
            this.views.set(onValueChange, newView);
            return newView;
        }
    }
    
    useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: (val: DataSourceState<TFilter, TId>) => void,
        options?: Partial<AsyncListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): IDataSourceView<TItem, TId, TFilter> {
        const viewProps: AsyncListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            api: this.api,
            ...options,
            // These defaults are added for compatibility reasons.
            // We'll require getId and getParentId callbacks in other APIs, including the views.
            getId: this.getId,
            getParentId: options?.getParentId ?? this.props.getParentId ?? this.defaultGetParentId,
        };
         
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const view = useMemo(
            () => new AsyncListView({ value, onValueChange }, viewProps),
            deps,
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const unsubscribe = this.subscribe(view);
            return () => {
                unsubscribe();
            };
        }, [view]);

        view.update({ value, onValueChange }, viewProps);
        this.loadViewData(view);

        return view;
    }
}
