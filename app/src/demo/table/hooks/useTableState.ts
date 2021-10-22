import { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps, DataTableState, getColumnsConfig } from "@epam/uui";
import { svc } from "../../../services";
import { ITablePreset, ITableState } from "../types";
import { isDefaultColumnsConfig, normalizeFilter, parseFilterUrl } from "../helpers";
import { constants } from "../data";

export const useTableState = <TFilter = Record<string, any>>(params: IParams<TFilter>): ITableState<TFilter> => {
    const [tableState, setTableState] = useState<DataTableState>({
        topIndex: 0,
        visibleCount: 40,
        sorting: [{ field: "name" }],
        filter: params.initialFilter ?? parseFilterUrl(),
        columnsConfig: getColumnsConfig(params.columns, {}),
    });
    const [presets, setPresets] = useState(params.initialPresets ?? []);

    const setFilter = useCallback((filter: TFilter) => {
        setTableState(prevValue => ({
            ...prevValue,
            filter,
        }));
    }, []);
    
    const setColumnsConfig = useCallback((columnsConfig: ColumnsConfig) => {
        setTableState(prevValue => ({
            ...prevValue,
            columnsConfig,
        }));
    }, []);

    useEffect(() => {
        const parsedFilter = parseFilterUrl() as TFilter;
        const hasFilterChanged = !isEqual(parsedFilter, tableState.filter);

        const presetId = +svc.uuiRouter.getCurrentLink().query.presetId;
        const activePreset = presets.find((p: ITablePreset) => p.id === presetId);
        const hasColumnsConfigChanged = !isEqual(activePreset?.columnsConfig, tableState.columnsConfig);

        if (!hasFilterChanged && !hasColumnsConfigChanged) return;

        setFilter(parsedFilter);
        setColumnsConfig(activePreset?.columnsConfig ?? tableState.columnsConfig);
    }, [location.search]);

    const onFilterChange = useCallback((newFilter: TFilter) => {
        const normalizedFilter = normalizeFilter(newFilter);
        setTableState(prevValue => ({
            ...prevValue,
            filter: normalizedFilter,
        }));

        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            filter: encodeURIComponent(JSON.stringify(normalizedFilter)),
        };

        svc.history.push({
            pathname: location.pathname,
            query: newQuery,
        });
    }, []);

    const onColumnsConfigChange = useCallback((newColumnsConfig: ColumnsConfig) => {
        setColumnsConfig(newColumnsConfig);
    }, []);

    const onPresetsChange = useCallback((newPresets: ITablePreset<TFilter>[]) => {
        setPresets(newPresets);
        params?.onPresetsChange(newPresets);
    }, []);

    // TODO: think about backend ids
    const getActivePresetId = useCallback(() => +svc.uuiRouter.getCurrentLink().query?.presetId, []);

    const isDefaultPresetActive = useCallback(() => {
        const searchParams = new URLSearchParams(location.search);
        return !searchParams.get("presetId") 
            && !tableState.filter
            && isDefaultColumnsConfig(tableState.columnsConfig, params.columns);
    }, [params.columns, tableState.filter, tableState.columnsConfig]);

    const choosePreset = useCallback((preset: ITablePreset<TFilter>) => {
        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            presetId: preset.id,
            filter: encodeURIComponent(JSON.stringify(preset.filter)),
        };

        if (preset.id === null) delete newQuery.presetId;

        onFilterChange(preset.filter);
        onColumnsConfigChange(preset.columnsConfig);

        svc.history.push({
            pathname: location.pathname,
            query: newQuery,
        });
    }, []);

    const createNewPreset = useCallback((name: string) => {
        const newId = presets.length
            ? Math.max.apply(null, presets.map(preset => preset.id)) + 1
            : 1;

        const newPreset: ITablePreset<TFilter> = {
            id: newId,
            name,
            filter: tableState.filter,
            columnsConfig: tableState.columnsConfig,
            isReadonly: false,
        };

        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            presetId: newPreset.id,
            filter: encodeURIComponent(JSON.stringify(newPreset.filter)),
        };

        if (newPreset.id === null) delete newQuery.presetId;

        onFilterChange(newPreset.filter);
        onColumnsConfigChange(newPreset.columnsConfig);
        onPresetsChange([...presets, newPreset]);

        svc.history.push({
            pathname: location.pathname,
            query: newQuery,
        });
    }, [tableState.filter, tableState.columnsConfig, presets]);

    const resetToDefault = useCallback(() => {
        choosePreset({
            ...constants.defaultPreset,
            columnsConfig: getColumnsConfig(params.columns, {}),
        });
    }, [choosePreset]);

    const hasPresetChanged = useCallback((preset: ITablePreset<TFilter> | undefined) => {
        const filter = parseFilterUrl();

        return !isEqual(preset?.filter, filter)
            || !isEqual(preset?.columnsConfig, tableState.columnsConfig);
    }, [tableState.columnsConfig]);

    const duplicatePreset = useCallback((preset: ITablePreset<TFilter>) => {
        const maxId = Math.max.apply(null, presets.map(p => p.id));

        const newPreset: ITablePreset<TFilter> = {
            id: maxId + 1,
            name: preset.name + "_copy",
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
            isReadonly: false,
        };

        choosePreset(newPreset);
        onFilterChange(newPreset.filter);
        onColumnsConfigChange(newPreset.columnsConfig);
        onPresetsChange([...presets, newPreset]);
    }, [choosePreset, presets]);

    const deletePreset = useCallback((preset: ITablePreset<TFilter>) => {
        onPresetsChange(presets.filter(p => p.id !== preset.id));
    }, [presets]);

    const renamePreset = useCallback((newPreset: ITablePreset<TFilter>) => {
        const newPresets = presets.map((p: ITablePreset<TFilter>) => p.id === newPreset.id ? newPreset : p);
        onPresetsChange(newPresets);
    }, [presets]);

    const updatePreset = useCallback((preset: ITablePreset<TFilter>) => {
        const newPreset = {
            ...preset,
            filter: tableState.filter,
            columnsConfig: tableState.columnsConfig,
        };
        const newPresets = [...presets];
        newPresets.splice(presets.findIndex(p => p.id === preset.id), 1, newPreset);
        onPresetsChange(newPresets);
    }, [presets, tableState.filter, tableState.columnsConfig]);

    const onTableStateChange = useCallback((newValue: DataTableState) => {
        onFilterChange(newValue.filter);
        onColumnsConfigChange(newValue.columnsConfig);
        setTableState({
            ...newValue,
            filter: normalizeFilter(newValue.filter),
        });
    }, []);

    return {
        tableState,
        onTableStateChange,
        onColumnsConfigChange,
        onFilterChange,

        presets,
        getActivePresetId,
        isDefaultPresetActive,
        choosePreset,
        createNewPreset,
        resetToDefault,
        hasPresetChanged,
        duplicatePreset,
        deletePreset,
        renamePreset,
        updatePreset,
    };
};

interface IParams<TFilter = Record<string, any>> {
    columns: DataColumnProps<any>[];
    initialFilter?: TFilter;
    initialPresets?: ITablePreset<TFilter>[];
    onPresetsChange?: (newPresets: ITablePreset[]) => Promise<void>;
}