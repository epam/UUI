import { useCallback, useEffect, useMemo, useState } from "react";
import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps, DataTableState, FiltersConfig, ITablePreset, ITableState, TableFiltersConfig } from "../../types";
import { getOrderBetween } from "../../helpers";
import { useUuiContext } from "../../services";
import sortBy from "lodash.sortby";
import { normalizeFilter } from "./normalizeFilter";
import { normalizeFilterConfig } from "./normalizeFilterConfig";
import { normalizeViewState } from "./normalizeViewState";

export const useTableState = <TFilter = Record<string, any>, TViewState = any>(params: IParams<TFilter, TViewState>): ITableState<TFilter, TViewState> => {
    const context = useUuiContext();
    const [presets, setPresets] = useState(params.initialPresets ?? []);

    const [tableStateValue, setTableStateValue] = useState<DataTableState<TFilter, TViewState>>(() => {
        const urlParams = context.uuiRouter.getCurrentLink().query;
        const activePreset = presets.find((p: ITablePreset<TFilter, TViewState>) => p.id === urlParams.presetId);
        const filter = params.initialFilter ?? urlParams.filter;

        return {
            topIndex: 0,
            visibleCount: 40,
            filter: params.initialFilter ?? urlParams.filter,
            columnsConfig: activePreset ? activePreset.columnsConfig : {},
            filtersConfig: params.filters ? normalizeFilterConfig(urlParams.filtersConfig, filter, params.filters) : undefined,
            presetId: urlParams.presetId,
            sorting: urlParams.sorting,
            viewState: urlParams.viewState,
        };
    });

    const setTableState = useCallback((newValue: DataTableState<TFilter, TViewState>) => {
        const newFilter = normalizeFilter(newValue.filter);
        const newFiltersConfig = params.filters ? normalizeFilterConfig(newValue.filtersConfig, newFilter, params.filters) : undefined;
        const newViewState = normalizeViewState(newValue.viewState);
        setTableStateValue(prevValue => {
            const newTableState = {
                ...prevValue,
                ...newValue,
                filter: newFilter,
                filtersConfig: newFiltersConfig,
                viewState: newViewState,
            };
            // reset paging on filter change
            if (prevValue.page !== undefined && !isEqual(prevValue.filter, newFilter)) {
                newTableState.page = 1;
            }

            const oldQuery = context.uuiRouter.getCurrentLink().query;
            const newQuery = stateToQueryObject(newTableState);

            // we need this condition here, because the DataSources call state updates with the same value on items load, and it causes redirect
            if (JSON.stringify(oldQuery) !== JSON.stringify(newQuery)) {
                context.uuiRouter.redirect({
                    pathname: context.uuiRouter.getCurrentLink().pathname,
                    query: newQuery,
                });
            }

            return newTableState;
        });

    }, []);

    const stateToQueryObject = (state: DataTableState<TFilter, TViewState>) => {
        return {
            ...context.uuiRouter.getCurrentLink().query,
            filter: state.filter,
            presetId: state.presetId,
            sorting: state.sorting,
            filtersConfig: state.filtersConfig,
            viewState: state.viewState,
        };
    };

    const setColumnsConfig = useCallback((columnsConfig: ColumnsConfig) => {
        setTableState({
            ...tableStateValue,
            columnsConfig,
        });
    }, [tableStateValue]);

    const setFiltersConfig = useCallback((filtersConfig: FiltersConfig) => {
        setTableState({
            ...tableStateValue,
            filtersConfig,
        });
    }, [tableStateValue]);

    const setFilter = useCallback((filter: TFilter) => {
        setTableState({
            ...tableStateValue,
            filter,
        });
    }, [tableStateValue]);

    const setViewState = useCallback((viewState: TViewState) => {
        setTableState({
            ...tableStateValue,
            viewState,
        });
    }, [tableStateValue]);

    useEffect(() => {
        const urlParams = context.uuiRouter.getCurrentLink().query;
        const paramKeys = Object.keys(urlParams);
        const stateKeys = Object.keys(tableStateValue).filter(key => paramKeys.includes(key));
        const haveUrlParamsChanged = stateKeys.some(param => {
            return !isEqual(urlParams[param], tableStateValue[param as keyof typeof tableStateValue]);
        });

        const presetId = +context.uuiRouter.getCurrentLink().query.presetId;
        const activePreset = presets.find((p: ITablePreset<TFilter, TViewState>) => p.id === presetId);
        const hasColumnsConfigChanged = !isEqual(activePreset?.columnsConfig, tableStateValue.columnsConfig);

        if (!haveUrlParamsChanged && !hasColumnsConfigChanged) return;

        setTableState({
            ...tableStateValue,
            filter: urlParams.filter,
            presetId: urlParams.presetId,
            filtersConfig: urlParams.filtersConfig,
            sorting: urlParams.sorting,
            viewState: urlParams.viewState,
        });
    }, [location.search]);

    const activePresetId = useMemo(() => {
        const presetId = context.uuiRouter.getCurrentLink().query?.presetId;
        return presetId ? +presetId : undefined;
    }, [location.search]);

    const choosePreset = useCallback((preset: ITablePreset<TFilter, TViewState>) => {
        setTableState({
            ...tableStateValue,
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
            filtersConfig: preset.filtersConfig,
            sorting: preset.sorting,
            presetId: preset.id,
            viewState: preset.viewState,
        });
    }, []);

    const getNewPresetOrder = () => {
        const maxOrder = sortBy(presets, (i) => i.order).reverse()[0]?.order;
        return getOrderBetween(maxOrder, null);
    };

    const createPreset = useCallback(async (preset: ITablePreset<TFilter, TViewState>) => {
        preset.id = await params?.onPresetCreate?.(preset);

        setPresets(prevValue => [...prevValue, preset]);
        choosePreset(preset);
        return preset.id;
    }, [tableStateValue.filter, tableStateValue.columnsConfig, tableStateValue.filtersConfig, tableStateValue.viewState, choosePreset]);


    const createNewPreset = useCallback((name: string) => {
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
    }, [getNewPresetOrder]);

    const hasPresetChanged = useCallback((preset: ITablePreset<TFilter, TViewState> | undefined) => {
        return !isEqual(preset?.filter, tableStateValue.filter)
            || !isEqual(preset?.columnsConfig, tableStateValue.columnsConfig)
            || !isEqual(preset?.sorting, tableStateValue.sorting)
            || !isEqual(preset?.viewState, tableStateValue.viewState);
    }, [tableStateValue.columnsConfig,  tableStateValue.filter, tableStateValue.sorting, tableStateValue.viewState]);

    const duplicatePreset = useCallback(async (preset: ITablePreset<TFilter, TViewState>) => {
        const newPreset: ITablePreset<TFilter, TViewState> = {
            ...preset,
            isReadonly: false,
            id: null,
            name: preset.name + '_copy', // TODO: temporary naming logic, need to be reworked
            order: getNewPresetOrder(),
        };

        return createPreset(newPreset);
    }, [getNewPresetOrder]);

    const deletePreset = useCallback(async (preset: ITablePreset<TFilter, TViewState>) => {
        await params?.onPresetDelete(preset);
        setTableState({
            ...tableStateValue,
            presetId: undefined,
        });
        setPresets(prevValue => prevValue.filter(p => p.id !== preset.id));
    }, []);

    const updatePreset = useCallback(async (preset: ITablePreset<TFilter, TViewState>) => {
        setPresets(prevValue => {
            const newPresets = [...prevValue];
            newPresets.splice(prevValue.findIndex(p => p.id === preset.id), 1, preset);
            return newPresets;
        });

        params?.onPresetUpdate(preset);
    }, []);

    const getPresetLink = useCallback((preset: ITablePreset<TFilter, TViewState>) => {
        return window.location.origin + context.uuiRouter.createHref({
            pathname: context.uuiRouter.getCurrentLink().pathname,
            query: stateToQueryObject({
                ...preset,
                presetId: preset.id,
            }),
        });
    }, []);

    return {
        tableState: tableStateValue,
        setTableState,
        setColumnsConfig,
        setFiltersConfig,
        setFilter,
        setViewState,
        presets,
        activePresetId,
        choosePreset,
        createNewPreset,
        hasPresetChanged,
        duplicatePreset,
        deletePreset,
        updatePreset,
        getPresetLink,
    };
};

interface IParams<TFilter = Record<string, any>, TViewState = any> {
    columns?: DataColumnProps[];
    filters?: TableFiltersConfig<TFilter>[];
    initialFilter?: TFilter;
    initialPresets?: ITablePreset<TFilter, TViewState>[];
    onPresetCreate?(preset: ITablePreset<TFilter, TViewState>): Promise<number>;
    onPresetUpdate?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
    onPresetDelete?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
}