import { ArrayDataSource, ArrayDataSourceProps } from "./ArrayDataSource";
import { ArrayListViewProps } from './views/ArrayListView';
import { LoadingListView } from './views/LoadingListView';
import { DataSourceState, IDataSourceView } from "../../types";

export interface AsyncDataSourceProps<TItem, TId, TFilter> extends ArrayListViewProps<TItem, TId, TFilter> {
    api(): Promise<TItem[]>;
}

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

    isLoading: boolean = false;
    isLoaded: boolean = false;

    private recreateViews() {
        // AsyncDataSource uses two different view - LoadingListView and ArrayList view.
        // When we swap them, we need to force all views to update and clear them to get new views.
        const existingViews = new Map(this.views);
        this.views.clear();
        existingViews.forEach(view => view._forceUpdate());
    }

    private load() {
        if (!this.isLoading) {
            this.isLoading = true;
            this.api().then(res => {
                this.isLoading = false;
                this.isLoaded = true;
                this.setProps({ ...this.props, items: res });
                this.recreateViews();
            });
        }
    }

    reload() {
        this.isLoading = false;
        this.isLoaded = false;
        this.setProps({ ...this.props, items: [] });
        this.recreateViews();
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

