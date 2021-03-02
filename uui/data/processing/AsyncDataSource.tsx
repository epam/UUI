import { ArrayDataSource, ArrayDataSourceProps } from "./ArrayDataSource";
import { ArrayListViewProps } from './views/ArrayListView';
import { LoadingListView } from './views/LoadingListView';
import { DataSourceState } from './types';
import { IDataSourceView } from './views/types';

export interface AsyncDataSourceApiRequest<TFilter = {}> {
    filter?: TFilter;
}

export interface AsyncDataSourceProps<TItem, TId, TFilter> extends ArrayListViewProps<TItem, TId, TFilter> {
    api(request?: AsyncDataSourceApiRequest<TFilter>): Promise<TItem[]>;
}

export class AsyncDataSource<TItem = any, TId = any, TFilter = any> extends ArrayDataSource<TItem, TId> {
    api: (request?: AsyncDataSourceApiRequest<TFilter>) => Promise<TItem[]> = null;

    constructor(props: AsyncDataSourceProps<TItem, TId, TFilter>) {
        super({
            ...props,
            items: [],
        });
        this.api = props.api;
    }

    isLoading: boolean = false;
    isLoaded: boolean = false;

    private load() {
        if (!this.isLoading) {
            this.isLoading = true;
            this.api().then(res => {
                this.isLoading = false;
                this.isLoaded = true;
                this.updateIndexes(res);
                const loadingViews = new Map(this.views);
                this.views.clear();
                loadingViews.forEach(view => view._forceUpdate());
            });
        }
    }

    reload() {
        this.isLoading = false;
        this.isLoaded = false;

        this.byKey = {};
        this.byParentKey = {};
        this.nodes = [];
        this.rootNodes = [];
        this.maxDepth = null;

        const views = new Map(this.views);
        this.views.clear();
        views.forEach(view => view._forceUpdate());
    }

    getView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: ArrayListViewProps<TItem, TId, TFilter>): IDataSourceView<TItem, TId, TFilter> {
        if (!this.isLoaded) {
            this.load();
            const view = this.views.get(onValueChange) as LoadingListView<TId>;
            if (view) {
                view.update(value, {});
                return view;
            } else {
                const newView: any = new LoadingListView({ value, onValueChange }, {});
                this.views.set(onValueChange, newView);
                return newView;
            }
        }

        return super.getView(value, onValueChange, options);
    }
}

