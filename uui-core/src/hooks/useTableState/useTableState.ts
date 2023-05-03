import {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import isEqual from 'lodash.isequal';
import {
    ColumnsConfig, DataColumnProps, DataTableState, FiltersConfig, IEditable, ITablePreset, ITableState, TableFiltersConfig,
} from '../../types';
import { getOrderBetween } from '../../helpers';
import { useUuiContext } from '../../services';
import sortBy from 'lodash.sortby';
import { normalizeFilterConfig } from './normalizeFilterConfig';
import { clearEmptyValueFromRecord } from './clearEmptyValueFromRecord';

export const useTableState = <TFilter = Record<string, any>, TViewState = any>(params: TableStateParams<TFilter, TViewState>): ITableState<TFilter, TViewState> => {
    const context = useUuiContext();
    const [presets, setPresets] = useState(params.initialPresets ?? []);

    const getValueFromUrl = () => {
        const urlParams = context.uuiRouter.getCurrentLink().query;

        const activePreset = presets.find((p: ITablePreset<TFilter, TViewState>) => p.id === urlParams.presetId);
        const filtersConfig = normalizeFilterConfig(activePreset?.filtersConfig, urlParams.filter, params.filters);

        return {
            filter: urlParams.filter,
            columnsConfig: urlParams.columnsConfig,
            filtersConfig: filtersConfig,
            presetId: urlParams.presetId,
            page: urlParams.page,
            pageSize: urlParams.pageSize,
            sorting: urlParams.sorting,
            viewState: urlParams.viewState,
        };
    };

    const stateToQueryObject = (state: DataTableState<TFilter, TViewState>) => {
        return {
            ...context.uuiRouter.getCurrentLink().query,
            filter: state.filter,
            presetId: state.presetId,
            sorting: state.sorting,
            viewState: state.viewState,
            columnsConfig: state.columnsConfig,
            page: state.page,
            pageSize: state.pageSize,
        };
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
        return {
            ...value,
            topIndex: 0,
            visibleCount: 40,
        };
    });

    const getTableStateValue = useCallback(() => {
        if (params.onValueChange) {
            return params.value;
        }

        const { topIndex, visibleCount, filtersConfig } = tableStateValue;

        return {
            ...getValueFromUrl(),
            topIndex,
            visibleCount,
            filtersConfig,
        };
    }, [params.value, tableStateValue]);

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
        if (prevValue.page !== undefined && !isEqual(prevValue.filter, newFilter)) {
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
        const presetId = getTableStateValue().presetId;
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
            preset.id = await params?.onPresetCreate?.(preset);

            setPresets((prevValue) => [...prevValue, preset]);
            choosePreset(preset);

            return preset.id;
        },
        [choosePreset, params?.onPresetCreate],
    );

    const createNewPreset = useCallback(
        (name: string) => {
            const tableStateValue = getTableStateValue();
            const newPreset: ITablePreset<TFilter, TViewState> = {
                id: null,
                name: name,
                filter: tableStateValue.filter,
                columnsConfig: tableStateValue.columnsConfig,
                filtersConfig: tableStateValue.filtersConfig,
                sorting: tableStateValue.sorting,
                viewState: tableStateValue.viewState,
                isReadonly: false,
                order: getNewPresetOrder(),
            };

            return createPreset(newPreset);
        },
        [getTableStateValue, getNewPresetOrder],
    );

    const hasPresetChanged = useCallback(
        (preset: ITablePreset<TFilter, TViewState>) => {
            const tableStateValue = getTableStateValue();
            return (
                !isEqual(preset.filter, tableStateValue.filter)
                || !isEqual(preset.columnsConfig, tableStateValue.columnsConfig)
                || !isEqual(preset.sorting, tableStateValue.sorting)
                || !isEqual(preset.viewState, tableStateValue.viewState)
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

interface TableStateParams<TFilter = Record<string, any>, TViewState = any> extends Partial<IEditable<DataTableState<TFilter, TViewState>>> {
    columns?: DataColumnProps[];
    filters?: TableFiltersConfig<TFilter>[];
    initialPresets?: ITablePreset<TFilter, TViewState>[];
    onPresetCreate?(preset: ITablePreset<TFilter, TViewState>): Promise<number>;
    onPresetUpdate?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
    onPresetDelete?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
}
