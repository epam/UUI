import isEqual from 'react-fast-compare';
import { DataTableState, FiltersConfig, TableFiltersConfig } from '../../types/tables';
import { clearEmptyValueFromRecord, getOrderBetween } from '../../helpers';

export const stateToQueryObject = (state: DataTableState, currentQuery: any) => {
    const queryObject = {
        ...currentQuery,
        filter: state.filter,
        presetId: state.presetId,
        sorting: state.sorting,
        viewState: state.viewState,
        columnsConfig: state.columnsConfig,
        page: state.page,
        pageSize: state.pageSize,
    };

    return clearEmptyValueFromRecord(queryObject) || {};
};

export const getValueFromUrl = (query: any) => {
    return {
        filter: query.filter,
        columnsConfig: query.columnsConfig,
        presetId: query.presetId,
        page: query.page,
        pageSize: query.pageSize,
        sorting: query.sorting,
        viewState: query.viewState,
    };
};

export const normalizeTableStateValue = <TFilter, TViewState>(
    newValue: DataTableState<TFilter, TViewState>,
    prevValue: DataTableState<TFilter, TViewState>,
    filters: TableFiltersConfig<TFilter>[],
) => {
    const newFilter = clearEmptyValueFromRecord(newValue.filter);
    const newViewState = clearEmptyValueFromRecord(newValue.viewState);
    const filtersConfig = normalizeFilterConfig(newValue?.filtersConfig, newFilter, filters);

    const newTableState = {
        ...newValue,
        filtersConfig: filtersConfig,
        filter: newFilter,
        viewState: newViewState,
    };

    // reset paging on filter change
    if (prevValue?.page !== undefined && !isEqual(prevValue?.filter, newFilter)) {
        newTableState.page = 1;
    }
    return newTableState;
};

export const normalizeFilterConfig = <TFilter>(filtersConfig: FiltersConfig, filterValue: Record<string, any> | undefined, filters: TableFiltersConfig<TFilter>[]) => {
    if (!filters) {
        return undefined;
    }

    const result: FiltersConfig = {};
    let order: string | null = null;
    filters.forEach((filter) => {
        if (filter.isAlwaysVisible || filterValue?.[filter.field as string] || filtersConfig?.[filter.field]) {
            const newOrder = filtersConfig?.[filter?.field]?.order || getOrderBetween(order, null);
            const isVisible = filtersConfig?.[filter?.field]?.isVisible;
            result[filter.field] = {
                isVisible: isVisible ?? true,
                order: newOrder,
            };
            order = newOrder;
        }
    });
    return result;
};
