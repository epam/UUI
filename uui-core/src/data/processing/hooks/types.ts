import { ArrayListViewProps, AsyncListViewProps, LazyListViewProps } from "../views";
import { DataSourceState, IDataSourceView } from "../../../types";
import { SubtotalsConfig } from "../views/subtotals";

export type PropsWithType<Props, Type extends string> = Props & { type: Type };

export type LazyListProps<TItem, TId, TFilter, TSubtotals = void> = PropsWithType<LazyListViewProps<TItem, TId, TFilter, TSubtotals>, 'lazy'>;
export type AsyncListProps<TItem, TId, TFilter, TSubtotals = void> = PropsWithType<AsyncListViewProps<TItem, TId, TFilter, TSubtotals>, 'async'>;
export type ArrayListProps<TItem, TId, TFilter, TSubtotals = void> = PropsWithType<ArrayListViewProps<TItem, TId, TFilter, TSubtotals>, 'array'>;

export type ListViewProps<TItem, TId, TFilter, TSubtotals = void> =
    | LazyListProps<TItem, TId, TFilter, TSubtotals>
    | AsyncListProps<TItem, TId, TFilter, TSubtotals>
    | ArrayListProps<TItem, TId, TFilter, TSubtotals>;

export type UnboxListProps<T extends ListViewProps<any, any, any, any>> = T extends LazyListProps<infer TItem, infer TId, infer TFilter, infer TSubtotals>
    ? LazyListProps<TItem, TId, TFilter, TSubtotals>
    : T extends AsyncListProps<infer TItem, infer TId, infer TFilter, infer TSubtotals>
    ? AsyncListProps<TItem, TId, TFilter, TSubtotals>
    : T extends ArrayListProps<infer TItem, infer TId, infer TFilter, infer TSubtotals>
    ? ArrayListProps<TItem, TId, TFilter, TSubtotals>
    : never;

export interface IView<
    TItem, TId, TFilter, TSubtotals, Props extends ListViewProps<TItem, TId, TFilter, TSubtotals>
> extends IDataSourceView<TItem, TId, TFilter, TSubtotals> {
    update(newValue: DataSourceState<TFilter, TId>, props: Props): void;
}

interface ListState<TId, TFilter> {
    listState: DataSourceState<TFilter, TId>;
    setListState: (listState: DataSourceState<TFilter, TId>) => void;
}

type ListProps<TItem, TId, TFilter, TSubtotals = void> = Exclude<ListViewProps<TItem, TId, TFilter, TSubtotals>, 'getId'> & {
    getId: Exclude<ListViewProps<TItem, TId, TFilter, TSubtotals>['getId'], undefined>;
};

export type UseListProps<TItem, TId, TFilter, TSubtotals = void> = ListProps<TItem, TId, TFilter, TSubtotals> & ListState<TId, TFilter> & {
    /**
     * If data loading has to be postponed, this flag has to be set to false.
     * Changing the flag to `true` will trigger data loading.
     * @default true
     */
    loadData?: boolean;

    subtotals?: SubtotalsConfig<TItem, TSubtotals>;
};
