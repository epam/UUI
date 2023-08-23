import { useCallback, useState } from 'react';
import isEqual from 'lodash.isequal';
import {
    ColumnsConfig, DataColumnProps, DataTableState, FiltersConfig, IEditable, ITablePreset, ITableState, TableFiltersConfig,
} from '../types';
import { getOrderBetween } from '../helpers';
import { useUuiContext } from '../services';
import sortBy from 'lodash.sortby';
import { clearEmptyValueFromRecord } from '../helpers/clearEmptyValueFromRecord';

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

export const useTableState = <TFilter = Record<string, any>, TViewState = any>
(params: UseTableStateHookParams<TFilter, TViewState>): ITableState<TFilter, TViewState> => {
    const context = useUuiContext();
    const [presets, setPresets] = useState(params?.initialPresets ?? []);

    const getValueFromUrl = () => {
        const urlParams = context.uuiRouter.getCurrentLink().query;

        return {
            filter: urlParams.filter,
            columnsConfig: urlParams.columnsConfig,
            presetId: urlParams.presetId,
            page: urlParams.page,
            pageSize: urlParams.pageSize,
            sorting: urlParams.sorting,
            viewState: urlParams.viewState,
        };
    };

    const stateToQueryObject = (state: DataTableState<TFilter, TViewState>) => {
        const queryObject = {
            ...context.uuiRouter.getCurrentLink().query,
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

    const setValueToUrl = (value: DataTableState<TFilter, TViewState>) => {
        const oldQuery = context.uuiRouter.getCurrentLink().query;
        const newQuery = stateToQueryObject(value);

        if (JSON.stringify(oldQuery) !== JSON.stringify(newQuery)) {
            context.uuiRouter.redirect({
                pathname: context.uuiRouter.getCurrentLink().pathname,
                query: newQuery,
            });
        }
    };

    const [tableStateValue, setTableStateValue] = useState<DataTableState<TFilter, TViewState>>(() => {
        const value = getValueFromUrl();
        const activePreset = presets.find((p: ITablePreset<TFilter, TViewState>) => p.id === value.presetId);
        const filtersConfig = normalizeFilterConfig(activePreset?.filtersConfig, value.filter, params?.filters);
        return {
            ...value,
            filtersConfig,
            topIndex: 0,
            visibleCount: 40,
        };
    });

    const getTableStateValue = useCallback(() => {
        if (params?.onValueChange) {
            return params.value;
        }

        const valueFromUrl = getValueFromUrl();
        return {
            ...tableStateValue,
            ...valueFromUrl,
        };
    }, [params?.value, tableStateValue]);

    const normalizeTableStateValue = (value: DataTableState<TFilter, TViewState>) => {
        const newFilter = clearEmptyValueFromRecord(value.filter);
        const newViewState = clearEmptyValueFromRecord(value.viewState);
        const filtersConfig = normalizeFilterConfig(value?.filtersConfig, newFilter, params.filters);
        const prevValue = getTableStateValue();

        const newTableState = {
            ...prevValue,
            ...value,
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

    const setTableState = useCallback((newValue: DataTableState<TFilter, TViewState>) => {
        const resultValue = normalizeTableStateValue(newValue);

        if (params.onValueChange) {
            params.onValueChange(resultValue);
        } else {
            setValueToUrl(resultValue);
            setTableStateValue(resultValue);
        }
    }, []);

    const setColumnsConfig = useCallback(
        (columnsConfig: ColumnsConfig) => {
            setTableState({
                ...getTableStateValue(),
                columnsConfig,
            });
        },
        [getTableStateValue],
    );

    const setFiltersConfig = useCallback(
        (filtersConfig: FiltersConfig) => {
            setTableState({
                ...getTableStateValue(),
                filtersConfig,
            });
        },
        [getTableStateValue],
    );

    const setFilter = useCallback(
        (filter: TFilter) => {
            setTableState({
                ...getTableStateValue(),
                filter,
            });
        },
        [getTableStateValue],
    );

    const getActivePresetId = () => {
        const presetId = getTableStateValue()?.presetId;
        return presetId ? +presetId : undefined;
    };

    const choosePreset = useCallback(
        (preset: ITablePreset<TFilter, TViewState>) => {
            setTableState({
                ...getTableStateValue(),
                filter: preset.filter,
                columnsConfig: preset.columnsConfig,
                filtersConfig: preset.filtersConfig,
                sorting: preset.sorting,
                presetId: preset.id,
                viewState: preset.viewState,
            });
        },
        [getTableStateValue],
    );

    const getNewPresetOrder = useCallback(() => {
        const maxOrder = sortBy(presets, (i) => i.order).reverse()[0]?.order;
        return getOrderBetween(maxOrder, null);
    }, [presets]);

    const createPreset = useCallback(
        async (preset: ITablePreset<TFilter, TViewState>) => {
            const newId = await params?.onPresetCreate?.(preset);
            const newPreset = {
                ...preset,
                id: newId,
            };

            setPresets((prevValue) => [...prevValue, newPreset]);
            choosePreset(newPreset);

            return newId;
        },
        [choosePreset, params?.onPresetCreate],
    );

    const createNewPreset = useCallback(
        (name: string) => {
            const currentTableStateValue = getTableStateValue();
            const newPreset: ITablePreset<TFilter, TViewState> = {
                id: null,
                name: name,
                filter: currentTableStateValue.filter,
                columnsConfig: currentTableStateValue.columnsConfig,
                filtersConfig: currentTableStateValue.filtersConfig,
                sorting: currentTableStateValue.sorting,
                viewState: currentTableStateValue.viewState,
                isReadonly: false,
                order: getNewPresetOrder(),
            };

            return createPreset(newPreset);
        },
        [getTableStateValue, getNewPresetOrder],
    );

    const hasPresetChanged = useCallback(
        (preset: ITablePreset<TFilter, TViewState>) => {
            const currentTableStateValue = getTableStateValue();
            return (
                !isEqual(preset.filter, currentTableStateValue.filter)
                || !isEqual(preset.columnsConfig, currentTableStateValue.columnsConfig)
                || !isEqual(preset.sorting, currentTableStateValue.sorting)
                || !isEqual(preset.viewState, currentTableStateValue.viewState)
            );
        },
        [getTableStateValue],
    );

    const duplicatePreset = useCallback(
        async (preset: ITablePreset<TFilter, TViewState>) => {
            const newPreset: ITablePreset<TFilter, TViewState> = {
                ...preset,
                isReadonly: false,
                id: null,
                name: preset.name + '_copy',
                order: getNewPresetOrder(),
            };

            return createPreset(newPreset);
        },
        [createPreset, getNewPresetOrder],
    );

    const deletePreset = useCallback(
        async (preset: ITablePreset<TFilter, TViewState>) => {
            await params?.onPresetDelete(preset);
            setTableState({
                ...getTableStateValue(),
                presetId: undefined,
            });
            setPresets((prevValue) => prevValue.filter((p) => p.id !== preset.id));
        },
        [getTableStateValue],
    );

    const updatePreset = useCallback(async (preset: ITablePreset<TFilter, TViewState>) => {
        setPresets((prevValue) => {
            const newPresets = [...prevValue];
            newPresets.splice(
                prevValue.findIndex((p) => p.id === preset.id),
                1,
                preset,
            );
            return newPresets;
        });

        params?.onPresetUpdate(preset);
    }, []);

    const getPresetLink = useCallback((preset: ITablePreset<TFilter, TViewState>) => {
        return (
            window.location.origin
            + context.uuiRouter.createHref({
                pathname: context.uuiRouter.getCurrentLink().pathname,
                query: stateToQueryObject({
                    ...preset,
                    presetId: preset.id,
                }),
            })
        );
    }, []);

    return {
        tableState: getTableStateValue(),
        setTableState,
        setColumnsConfig,
        setFiltersConfig,
        setFilter,
        presets,
        activePresetId: getActivePresetId(),
        choosePreset,
        createNewPreset,
        hasPresetChanged,
        duplicatePreset,
        deletePreset,
        updatePreset,
        getPresetLink,
    };
};

export interface UseTableStateHookParams<TFilter = Record<string, any>, TViewState = any> extends Partial<IEditable<DataTableState<TFilter, TViewState>>> {
    /** Columns configuration, can be omitted if used without tables */
    columns?: DataColumnProps[];
    /** Filters configuration, can be omitted if you don't need filters */
    filters?: TableFiltersConfig<TFilter>[];
    /** Initial presets array */
    initialPresets?: ITablePreset<TFilter, TViewState>[];
    /** Called when preset was created. Should return the ID of new preset */
    onPresetCreate?(preset: ITablePreset<TFilter, TViewState>): Promise<number>;
    /** Called when preset was updated */
    onPresetUpdate?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
    /** Called when preset was deleted */
    onPresetDelete?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
}
