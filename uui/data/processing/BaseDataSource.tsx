import * as React from 'react';
import { DataRowOptions } from '../../types';
import { DataSourceState, IDataSource } from "./types";
import { BaseListViewProps, IDataSourceView } from './views';

export abstract class BaseDataSource<TItem, TId, TFilter = any> implements IDataSource<TItem, TId, TFilter> {

    protected views = new Map<any, IDataSourceView<TItem, TId, TFilter>>();

    constructor(public props: BaseListViewProps<TItem, TId, TFilter>) {
    }

    abstract getById(id: TId): TItem;
    abstract setItem(item: TItem): void;
    abstract getView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any): IDataSourceView<TItem, TId, TFilter>;
    abstract useView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any): IDataSourceView<TItem, TId, TFilter>;

    protected updateViews = () => {
        this.views.forEach(view => view._forceUpdate());
    }

    public unsubscribeView(onValueChange: (val: any) => any) {
        this.views.delete(onValueChange);
    }

    public getId = (item: TItem) => {
        if (item == null) {
            return null;
        }

        let id: TId;

        if (this.props.getId) {
            id = this.props.getId(item);
        } else {
            id = (item as any)['id' as any];
        }

        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${JSON.stringify(item)}`);
        }

        return id;
    }
}
