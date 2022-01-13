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
        if (presets.length === 0 && params.initialPresets.length > 0) {
            setPresets(params.initialPresets);
        }
    }, [params.initialPresets]);

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

        svc.uuiRouter.redirect({
            pathname: location.pathname,
            query: newQuery,
        });
    }, []);

    const onColumnsConfigChange: typeof setColumnsConfig = useCallback(value => {
        setColumnsConfig(value);
    }, []);

    const onPresetsChange: typeof setPresets = useCallback(value => {
        setPresets(value);
    }, []);

    const getActivePresetId = useCallback(() => {
        const presetId = svc.uuiRouter.getCurrentLink().query?.presetId;
        return presetId ? +presetId : undefined;
    }, [location.search]);

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

        svc.uuiRouter.redirect({
            pathname: location.pathname,
            query: newQuery,
        });
    }, []);

    const createNewPreset = useCallback(async (preset: string | ITablePreset) => {
        const newPreset = typeof preset === "string" 
            ? {
                name: preset,
                filter: tableState.filter,
                columnsConfig: tableState.columnsConfig,
                isReadonly: false,
            } as ITablePreset<TFilter>
            : {
                ...preset,
                name: preset.name + "_copy",
            } as ITablePreset<TFilter>;

        newPreset.id = await params?.onPresetCreate(newPreset);
        
        onPresetsChange(prevValue => [...prevValue, newPreset]);
        choosePreset(newPreset);
    }, [tableState.filter, tableState.columnsConfig, choosePreset]);

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

    const duplicatePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        await createNewPreset(preset);
    }, [createNewPreset]);

    const deletePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        await params?.onPresetDelete(preset);
        onPresetsChange(prevValue => prevValue.filter(p => p.id !== preset.id));
    }, []);

    const updatePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        const newPreset = {
            ...preset,
            filter: tableState.filter,
            columnsConfig: tableState.columnsConfig,
        };
        await params?.onPresetUpdate(newPreset);
        
        onPresetsChange(prevValue => {
            const newPresets = [...prevValue];
            newPresets.splice(presets.findIndex(p => p.id === preset.id), 1, newPreset);
            return newPresets;
        });
    }, [tableState.filter, tableState.columnsConfig]);

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
        updatePreset,
    };
};

interface IParams<TFilter = Record<string, any>> {
    columns: DataColumnProps<any>[];
    initialFilter?: TFilter;
    initialPresets?: ITablePreset<TFilter>[];
    onPresetCreate(preset: ITablePreset): Promise<number>;
    onPresetUpdate?(preset: ITablePreset): Promise<void>;
    onPresetDelete?(preset: ITablePreset): Promise<void>;
}