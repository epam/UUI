import isEqual from 'fast-deep-equal';
import { DataSourceState } from '../../../../../../../types';

export const searchWasChanged = <TFilter, TId>(
    prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>,
) => newValue?.search !== prevValue?.search;

export const sortingWasChanged = <TFilter, TId>(
    prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>,
) => !isEqual(newValue?.sorting, prevValue?.sorting);

export const filterWasChanged = <TFilter, TId>(
    prevValue: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>,
) => !isEqual(newValue?.filter, prevValue?.filter);

export const isQueryChanged = <TFilter, TId>(prevValue: DataSourceState<TFilter, TId>, newValue: DataSourceState<TFilter, TId>) =>
    searchWasChanged(prevValue, newValue)
    || sortingWasChanged(prevValue, newValue)
    || filterWasChanged(prevValue, newValue)
    || newValue?.page !== prevValue?.page
    || newValue?.pageSize !== prevValue?.pageSize;
