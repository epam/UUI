import * as React from 'react';
import { LazyDataSourceApi, LazyDataSourceApiRequestOptions, DataSourceState, ILazyDataSource } from './types';
import { LazyListView, LazyListViewProps } from './views';
import { ListApiCache } from './ListApiCache';
import { BaseDataSource } from "./BaseDataSource";
import { useEffect } from "react";

export interface LazyDataSourceProps<TItem, TId, TFilter> extends LazyListViewProps<TItem, TId, TFilter> {
}

export class LazyDataSource<TItem = any, TId = any, TFilter = any> extends BaseDataSource<TItem, TId, TFilter> implements ILazyDataSource<TItem, TFilter, TId> {
    props: LazyDataSourceProps<TItem, TId, TFilter>;
    cache: ListApiCache<TItem, TId, TFilter> = null;

    constructor(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        super(props);
        this.props = props;
        this.initCache();
    }

    public getById = (id: TId) => {
        return this.cache.byId(id);
    }

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
        this.views.forEach((view: any) => view.reload());
        this.updateViews();
    }

    public getView = (
        value: DataSourceState<any, TId>,
        onValueChange: (val: DataSourceState<any, TId>) => any,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>,
    ): LazyListView<TItem, TId, TFilter> => {
        const view = this.views.get(onValueChange) as LazyListView<TItem, TId, TFilter>;
        const viewProps: LazyListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            getId: this.getId,
            ...props,
        };

        if (view) {
            view.update(value, viewProps);
            return view;
        } else {
            const newView: any = new LazyListView({ value, onValueChange }, viewProps, this.cache);
            this.views.set(onValueChange, newView);
            return newView;
        }
    }

    useView(
        value: DataSourceState<any, TId>,
        onValueChange: (val: DataSourceState<any, TId>) => any,
        props?: Partial<LazyListViewProps<TItem, TId, TFilter>>
    ): LazyListView<TItem, TId, TFilter> {
        useEffect(() => () => this.unsubscribeView(onValueChange), [this]);

        return this.getView(value, onValueChange, props);
    }

    public getList(from: number, count: number, options: LazyDataSourceApiRequestOptions<TItem, TFilter>) {
        return this.cache.query({ ...options, filter: { ...this.props.filter, ...options.filter }, range: { from, count }});
    }
}
