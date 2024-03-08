import {
    BaseListViewProps, DataSourceState, IDataSource, IDataSourceView, SetDataSourceState,
} from '../../types/dataSources';
import { ITree } from './views';

export abstract class BaseDataSource<TItem, TId, TFilter = any> implements IDataSource<TItem, TId, TFilter> {
    protected trees = new Map<ITree<TItem, TId>, () => void>();

    constructor(public props: BaseListViewProps<TItem, TId, TFilter>) {}

    abstract getById(id: TId): TItem | void;
    abstract setItem(item: TItem): void;

    abstract useView(
        value: DataSourceState<TFilter, TId>,
        onValueChange: SetDataSourceState<TFilter, TId>,
        options?: Partial<BaseListViewProps<TItem, TId, TFilter>>,
        deps?: any[],
    ): IDataSourceView<TItem, TId, TFilter>;

    public abstract setProps(newProps: BaseListViewProps<TItem, TId, TFilter>): void;

    public destroy() {
        this.trees.clear();
    }

    public getId = (item: TItem & { id?: TId }): TId => {
        if (item == null) return null;

        const id = this.props.getId?.(item) || item.id;

        if (id == null) {
            throw new Error(`Item ID not found. Check 'getId' prop value. Item: ${JSON.stringify(item)}`);
        }

        return id;
    };

    protected reload() { 
        this.trees.forEach((reload) => reload());
    }
}
