import { useEffect } from "react";
import { BaseListViewProps, DataSourceState, IDataSource, IDataSourceView } from "../../types";

export abstract class BaseDataSource<TItem, TId, TFilter = any> implements IDataSource<TItem, TId, TFilter> {

    protected views = new Map<any, IDataSourceView<TItem, TId, TFilter>>();

    constructor(public props: BaseListViewProps<TItem, TId, TFilter>) {}

    abstract getById(id: TId): TItem;
    abstract setItem(item: TItem): void;
    abstract getView<TState extends DataSourceState<TFilter, TId>>(
        value: TState,
        onValueChange: (val: TState) => void,
        options?: Partial<BaseListViewProps<TItem, TId, TFilter>>,
    ): IDataSourceView<TItem, TId, TFilter>;

    protected updateViews = () => {
        this.views.forEach(view => view._forceUpdate());
    }

    public abstract setProps(newProps: BaseListViewProps<TItem, TId, TFilter>): void;

    public unsubscribeView(onValueChange: (val: any) => void) {
        const view = this.views.get(onValueChange);
        view?.destroy();
    }

    public destroy() {
        this.views.forEach(view => view.destroy());
    }

    public enable() {
        this.views.forEach(view => view.enable());
    }

    public getId = (item: TItem & { id?: TId }) => {
        if (item == null) return null;

        const id = this.props.getId?.(item) || item.id;

        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${ JSON.stringify(item) }`);
        }

        return id;
    }

    useView<
        TState extends DataSourceState<TFilter, TId>,
        TViewProps extends BaseListViewProps<TItem, TId, TFilter>,
        >(
            value: TState,
            onValueChange: (val: TState) => void,
            options?: Partial<TViewProps>,
    ): IDataSourceView<TItem, TId, TFilter> {
        useEffect(() => {
            const view = this.getView(value, onValueChange, options);
            view?.enable();

            return () => this.unsubscribeView(onValueChange);
        }, [this]);

        return this.getView(value, onValueChange, options);
    }
}
