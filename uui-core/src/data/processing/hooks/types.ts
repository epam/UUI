import { ArrayListViewProps, AsyncListViewProps, LazyListViewProps } from '../views';
import { DataSourceState, IDataSourceView } from '../../../types';

export type PropsWithType<Props, Type extends string> = Props & { type: Type };

export type LazyListProps<TItem, TId, TFilter> = PropsWithType<LazyListViewProps<TItem, TId, TFilter>, 'lazy'>;
export type AsyncListProps<TItem, TId, TFilter> = PropsWithType<AsyncListViewProps<TItem, TId, TFilter>, 'async'>;
export type ArrayListProps<TItem, TId, TFilter> = PropsWithType<ArrayListViewProps<TItem, TId, TFilter>, 'array'>;

export type ListViewProps<TItem, TId, TFilter> = LazyListProps<TItem, TId, TFilter> | AsyncListProps<TItem, TId, TFilter> | ArrayListProps<TItem, TId, TFilter>;

export type UnboxListProps<T extends ListViewProps<any, any, any>> = T extends LazyListProps<infer TItem, infer TId, infer TFilter>
    ? LazyListProps<TItem, TId, TFilter>
    : T extends AsyncListProps<infer TItem, infer TId, infer TFilter>
        ? AsyncListProps<TItem, TId, TFilter>
        : T extends ArrayListProps<infer TItem, infer TId, infer TFilter>
            ? ArrayListProps<TItem, TId, TFilter>
            : never;

export interface IView<TItem, TId, TFilter, Props extends ListViewProps<TItem, TId, TFilter>> extends IDataSourceView<TItem, TId, TFilter> {
    update(newValue: DataSourceState<TFilter, TId>, props: Props): void;
}

interface ListState<TId, TFilter> {
    listState: DataSourceState<TFilter, TId>;
    setListState: (listState: DataSourceState<TFilter, TId>) => void;
}

type ListProps<TItem, TId, TFilter> = Exclude<ListViewProps<TItem, TId, TFilter>, 'getId'> & {
    getId: Exclude<ListViewProps<TItem, TId, TFilter>['getId'], undefined>;
};

export type UseListProps<TItem, TId, TFilter> = ListProps<TItem, TId, TFilter> &
ListState<TId, TFilter> & {
    /**
         * If data loading has to be postponed, this flag has to be set to false.
         * Changing the flag to `true` will trigger data loading.
         * @default true
         */
    loadData?: boolean;
};
