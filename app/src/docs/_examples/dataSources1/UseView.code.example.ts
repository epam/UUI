import { ArrayListViewProps, IDataSourceView, DataSourceState } from '@epam/uui-core';

export type useView = <TItem, TId, TFilter>(
    value: DataSourceState<TFilter, TId>,
    onValueChange: (val: DataSourceState<TFilter, TId>) => void,
    options?: Partial<ArrayListViewProps<TItem, TId, TFilter>>,
) => IDataSourceView<TItem, TId, TFilter>;
