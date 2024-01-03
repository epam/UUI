import {
    BaseListViewProps, DataSourceState, IDataSource, IDataSourceView,
} from '../../types/dataSources';
import { NewTree } from './views';

export abstract class BaseDataSource<TItem, TId, TFilter = any> implements IDataSource<TItem, TId, TFilter> {
    protected views = new Map<any, IDataSourceView<TItem, TId, TFilter>>();
    private subscriptions = new Map<IDataSourceView<TItem, TId, TFilter>, () => void>();
    protected trees = new Map<NewTree<TItem, TId>, () => void>();

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
        onValueChange: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>,
        options?: Partial<BaseListViewProps<TItem, TId, TFilter>>,
        deps?: any[],
    ): IDataSourceView<TItem, TId, TFilter>;

    protected updateViews = () => {
        this.views.forEach((view) => view._forceUpdate());
        this.subscriptions.forEach((onUpdate) => onUpdate());
    };

    public abstract setProps(newProps: BaseListViewProps<TItem, TId, TFilter>): void;
    public unsubscribeView(onValueChange: (val: any) => void) {
        this.views.delete(onValueChange);
    }

    public destroy() {
        this.views.forEach((view) => view.deactivate());
        this.views.clear();
        this.subscriptions.forEach((_, view) => view.deactivate());
        this.subscriptions.clear();
    }

    public getId = (item: TItem & { id?: TId }) => {
        if (item == null) return null;

        const id = this.props.getId?.(item) || item.id;

        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${JSON.stringify(item)}`);
        }

        return id;
    };
    
    protected subscribe(view: IDataSourceView<TItem, TId, TFilter>) {
        view.activate();
        this.subscriptions.set(view, view._forceUpdate);
        return () => {
            this.subscriptions.delete(view);
            view.deactivate();
        };
    }
    
    protected reload() { 
        this.views.forEach((view) => view.reload());
        this.subscriptions.forEach((_, view) => view.reload());
        this.trees.forEach((reload) => reload());
    }
}
