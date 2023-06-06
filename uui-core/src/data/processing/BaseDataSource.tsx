import {
    BaseListViewProps, DataSourceState, IDataSource, IDataSourceView,
} from '../../types';

export abstract class BaseDataSource<TItem, TId, TFilter = any> implements IDataSource<TItem, TId, TFilter> {
    protected views = new Map<any, IDataSourceView<TItem, TId, TFilter>>();
    constructor(public props: BaseListViewProps<TItem, TId, TFilter>) {}

    abstract getById(id: TId): TItem | void;
    abstract setItem(item: TItem): void;
    abstract getView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: (val: DataSourceState<TFilter, TId>) => void,
        options?: Partial<BaseListViewProps<TItem, TId, TFilter>>
    ): IDataSourceView<TItem, TId, TFilter>;

    abstract useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: (val: DataSourceState<TFilter, TId>) => void,
        options?: Partial<BaseListViewProps<TItem, TId, TFilter>>
    ): IDataSourceView<TItem, TId, TFilter>;

    protected updateViews = () => {
        this.views.forEach((view) => view._forceUpdate());
    };

    public abstract setProps(newProps: BaseListViewProps<TItem, TId, TFilter>): void;
    public unsubscribeView(onValueChange: (val: any) => void) {
        this.views.delete(onValueChange);
    }

    public destroy() {
        this.views.forEach((view) => view.destroy());
        this.views.clear();
    }

    public getId = (item: TItem & { id?: TId }) => {
        if (item == null) return null;

        const id = this.props.getId?.(item) || item.id;

        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${JSON.stringify(item)}`);
        }

        return id;
    };
}
