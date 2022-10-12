import { useCallback, useEffect, useMemo, useState } from "react";
import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps, DataTableState, FiltersConfig, ITablePreset, ITableState } from "../../types";
import { getColumnsConfig, getOrderBetween } from "../../helpers";
import { useUuiContext } from "../../services";
import { isDefaultColumnsConfig } from "./helpers";
import { constants } from "./constants";
import sortBy from "lodash.sortby";

export const useTableState = <TFilter = Record<string, any>>(params: IParams<TFilter>): ITableState<TFilter> => {
    const context = useUuiContext();

    const [tableStateValue, setTableStateValue] = useState<DataTableState>(() => {
        const urlParams = context.uuiRouter.getCurrentLink().query;

        return {
            topIndex: 0,
            visibleCount: 40,
            filter: params.initialFilter ?? urlParams.filter,
            columnsConfig: getColumnsConfig(params.columns, {}),
            filtersConfig: urlParams.filtersConfig,
        };
    });
    const [presets, setPresets] = useState(params.initialPresets ?? []);

    const setTableState = useCallback((newValue: DataTableState) => {
        setTableStateValue(prevValue => ({
            ...prevValue,
            ...newValue,
        }));
        const oldQuery = context.uuiRouter.getCurrentLink().query;
        const newQuery = {
            ...context.uuiRouter.getCurrentLink().query,
            filter: newValue.filter,
            presetId: newValue.presetId,
            filtersConfig: newValue.filtersConfig,
        };

        // we need it here, because the DataSources call state updates with the same value on items load, and it causes redirect
        if (JSON.stringify(oldQuery) !== JSON.stringify(newQuery)) {
            context.uuiRouter.redirect({
                pathname: location.pathname,
                query: newQuery,
            });
        }

    }, []);

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

    useEffect(() => {
        const urlParams = context.uuiRouter.getCurrentLink().query;
        const paramKeys = Object.keys(urlParams);
        const stateKeys = Object.keys(tableStateValue).filter(key => paramKeys.includes(key));
        
        const haveUrlParamsChanged = stateKeys.some(param => {
            return !isEqual(urlParams[param], tableStateValue[param as keyof typeof tableStateValue]);
        });

        const presetId = +context.uuiRouter.getCurrentLink().query.presetId;
        const activePreset = presets.find((p: ITablePreset) => p.id === presetId);
        const hasColumnsConfigChanged = !isEqual(activePreset?.columnsConfig, tableStateValue.columnsConfig);

        if (!haveUrlParamsChanged && !hasColumnsConfigChanged) return;

        setTableState({
            ...tableStateValue,
            filter: urlParams.filter,
            presetId: urlParams.presetId,
            filtersConfig: urlParams.filtersConfig,
        });
    }, [location.search]);

    const activePresetId = useMemo(() => {
        const presetId = context.uuiRouter.getCurrentLink().query?.presetId;
        return presetId ? +presetId : undefined;
    }, [location.search]);

    const isDefaultPresetActive = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        return !searchParams.get("presetId")
            && !tableStateValue.filter
            && isDefaultColumnsConfig(tableStateValue.columnsConfig, params.columns);
    }, [params.columns, tableStateValue.filter, tableStateValue.columnsConfig]);

    const choosePreset = useCallback((preset: ITablePreset<TFilter>) => {
        setTableState({
            ...tableStateValue,
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
            filtersConfig: preset.filtersConfig,
            presetId: preset.id,
        });
    }, []);

    const getNewPresetOrder = () => {
        const maxOrder = sortBy(presets, (i) => i.order).reverse()[0]?.order;
        return getOrderBetween(maxOrder, null);
    };

    const createPreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        preset.id = await params?.onPresetCreate?.(preset);

        setPresets(prevValue => [...prevValue, preset]);
        choosePreset(preset);
        return preset.id;
    }, [tableStateValue.filter, tableStateValue.columnsConfig, tableStateValue.filtersConfig, choosePreset]);


    const createNewPreset = useCallback((name: string) => {
        const newPreset: ITablePreset<TFilter> = {
            id: null,
            name: name,
            filter: tableStateValue.filter,
            columnsConfig: tableStateValue.columnsConfig,
            filtersConfig: tableStateValue.filtersConfig,
            isReadonly: false,
            order: getNewPresetOrder(),
        };

        return createPreset(newPreset);
    }, [getNewPresetOrder]);

    const resetToDefault = useCallback(() => {
        choosePreset({
            ...constants.defaultPreset,
            columnsConfig: getColumnsConfig(params.columns, {}),
            filtersConfig: null,
        });
    }, [choosePreset]);

    const hasPresetChanged = useCallback((preset: ITablePreset<TFilter> | undefined) => {
        const { filter } = context.uuiRouter.getCurrentLink().query;

        return !isEqual(preset?.filter, filter)
            || !isEqual(preset?.columnsConfig, tableStateValue.columnsConfig);
    }, [tableStateValue.columnsConfig]);

    const duplicatePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        const newPreset: ITablePreset<TFilter> = {
            ...preset,
            id: null,
            name: preset.name + '_copy', // TODO: temporary naming logic, need to be reworked
            order: getNewPresetOrder(),
        };

        return createPreset(newPreset);
    }, [getNewPresetOrder]);

    const deletePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        await params?.onPresetDelete(preset);
        setPresets(prevValue => prevValue.filter(p => p.id !== preset.id));
    }, []);

    const updatePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        setPresets(prevValue => {
            const newPresets = [...prevValue];
            newPresets.splice(prevValue.findIndex(p => p.id === preset.id), 1, preset);
            return newPresets;
        });

        params?.onPresetUpdate(preset);
    }, []);

    return {
        tableState: tableStateValue,
        setTableState,
        setColumnsConfig,
        setFiltersConfig,
        setFilter,

        presets,
        activePresetId,
        isDefaultPresetActive,
        choosePreset,
        createNewPreset,
        resetToDefault,
        hasPresetChanged,
        duplicatePreset,
        deletePreset,
        updatePreset,
    };
};

interface IParams<TFilter = Record<string, any>> {
    columns: DataColumnProps[];
    initialFilter?: TFilter;
    initialPresets?: ITablePreset<TFilter>[];
    onPresetCreate?(preset: ITablePreset): Promise<number>;
    onPresetUpdate?(preset: ITablePreset): Promise<void>;
    onPresetDelete?(preset: ITablePreset): Promise<void>;
}