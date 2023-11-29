import { useEffect, useRef } from 'react';
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
        this.props = props;
        this.initCache();
    }

    public setProps(props: LazyDataSourceProps<TItem, TId, TFilter>) {
        this.props = props;
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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const initializedRef = useRef<boolean>(false);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const viewRef = useRef<LazyListView<TItem, TId, TFilter>>(null);
    
        const viewProps: LazyListViewProps<TItem, TId, TFilter> = {
            ...this.props,
            getId: this.getId,
            ...props,
        };
         
        const createView = () => new LazyListView({ value, onValueChange }, viewProps, this.cache);
        if (!initializedRef.current && !viewRef.current) {
            viewRef.current = createView();
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (initializedRef.current) {
                viewRef.current = createView();
            }
            const unsubscribe = this.subscribe(viewRef.current);
        
            initializedRef.current = true;
            return () => { unsubscribe(); };
        }, [...deps, this]);

        viewRef.current.update({ value, onValueChange }, viewProps);
        return viewRef.current;
    }
}
