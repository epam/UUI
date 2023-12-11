import { useEffect, useMemo } from 'react';
import { LazyListView, LazyListViewProps, NOT_FOUND_RECORD } from './views';
import { ListApiCache } from './ListApiCache';
import { BaseDataSource } from './BaseDataSource';
import { DataSourceState } from '../../types';

export interface LazyDataSourceProps<TItem, TId, TFilter> extends LazyListViewProps<TItem, TId, TFilter> {}

export class LazyDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> {
    props: LazyDataSourceProps<TItem, TId, TFilter>;
    cache: ListApiCache<TItem, TId, TFilter> = null;
    constructor(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.props = {
            ...props,
            flattenSearchResults: props.flattenSearchResults ?? true,
        };
        this.initCache();
    }

    public setProps(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        this.props = {
            ...this.props,
            ...props,
            flattenSearchResults: props.flattenSearchResults ?? true,
        };
    }

    public getById = (id: TId): TItem | void => {
        const item = this.cache.byId(id);
        if (item === NOT_FOUND_RECORD) {
            return;
        }
        return item;
    };

    private initCache() {
        this.cache = new ListApiCache({
            api: this.props.api,
            getId: this.getId,
            onUpdate: this.updateViews,
        });
    }

    setItem(item: TItem) {
        this.cache.setItem(item);
    }

    public clearCache() {
        this.initCache();
        super.reload();
    }

    public getView = <TState extends DataSourceState<any, TId>>(
        value: TState,
        onValueChange: (value: TState) => void,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>,
    ): LazyListView<TItem, TId, TFilter> => {
        const view = this.views.get(onValueChange) as LazyListView<TItem, TId, TFilter>;
        const viewProps: LazyListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            getId: this.getId,
            ...props,
        };

        if (view) {
            view.update({ value, onValueChange }, viewProps);
            return view;
        } else {
            const newView = new LazyListView({ value, onValueChange }, viewProps, this.cache);
            this.views.set(onValueChange, newView);
            return newView;
        }
    };

    useView<TState extends DataSourceState<any, TId>>(
        value: TState,
        onValueChange: (val: TState) => void,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>,
        deps: any[] = [],
    ): LazyListView<TItem, TId, TFilter> {
        const viewProps: LazyListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            getId: this.getId,
            ...props,
        };

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const view = useMemo(
            () => new LazyListView({ value, onValueChange }, viewProps, this.cache),
            [...deps, this], // every time, datasource is updated, view should be recreated
        );

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const unsubscribe = this.subscribe(view);
            return () => { unsubscribe(); };
        }, [...deps, this]); // every time, datasource is updated, view should be resubscribed

        view.update({ value, onValueChange }, viewProps);
        return view;
    }
}
