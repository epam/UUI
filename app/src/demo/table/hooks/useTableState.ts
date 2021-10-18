import { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps } from "@epam/uui";
import { svc } from "../../../services";
import { ITablePreset, ITableStateApi } from "../types";
import { isDefaultColumnsConfig, normalizeFilter, parseFilterUrl } from "../helpers";
import { constants } from "../data";

export const useTableState = <TFilter, TColumns>(initialData: IInitialData<TFilter, TColumns>): ITableStateApi => {
    const [filter, setFilter] = useState(initialData.filter ?? parseFilterUrl());
    const [columnsConfig, setColumnsConfig] = useState(initialData.columnsConfig);
    const [presets, setPresets] = useState(initialData?.loadPresets() ?? []);

    useEffect(() => {
        const parsedFilter = parseFilterUrl();
        const hasFilterChanged = !isEqual(parsedFilter, filter);

        const presetId = +svc.uuiRouter.getCurrentLink().query.presetId;
        const activePreset = presets.find((p: ITablePreset) => p.id === presetId);
        const hasColumnsConfigChanged = !isEqual(activePreset?.columnsConfig, columnsConfig);

        if (!hasFilterChanged && !hasColumnsConfigChanged) return;

        setFilter(parsedFilter);
        setColumnsConfig(activePreset?.columnsConfig ?? initialData.columnsConfig);
    }, [location.search]);
    
    const onFilterChange = useCallback((newFilter: any) => {
        const normalizedFilter = normalizeFilter(newFilter);
        // if (isEqual(normalizedFilter, filter)) return;
        
        setFilter(normalizedFilter);
        
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
        // if (isEqual(newColumnsConfig, columnsConfig)) return;
        setColumnsConfig(newColumnsConfig);
    }, []);
    
    const onPresetsChange = useCallback((newPresets: ITablePreset[]) => {
        setPresets(newPresets);
        initialData?.onPresetsSave(newPresets);
    }, []);

    const getActivePresetId = useCallback(() => +svc.uuiRouter.getCurrentLink().query?.presetId, []);

    const isDefaultPresetActive = useCallback(() => {
        const searchParams = new URLSearchParams(location.search);
        return !searchParams.get("presetId") && !filter && isDefaultColumnsConfig(columnsConfig, initialData.columns);
    }, [initialData.columns, filter, columnsConfig]);

    const choosePreset = useCallback((preset: ITablePreset) => {
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

        const newPreset: ITablePreset = {
            id: newId,
            name,
            filter: filter,
            columnsConfig: columnsConfig,
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
    }, [filter, columnsConfig, presets]);
    
    const resetToDefault = useCallback(() => choosePreset(constants.defaultPreset), [choosePreset]);

    const hasPresetChanged = (preset: ITablePreset | undefined) => {
        const filter = parseFilterUrl();

        return !isEqual(preset?.filter, filter)
            || !isEqual(preset?.columnsConfig, columnsConfig);
    };

    const duplicatePreset = useCallback((preset: ITablePreset) => {
        const maxId = Math.max.apply(null, presets.map(p => p.id));

        const newPreset: ITablePreset = {
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

    const deletePreset = useCallback((preset: ITablePreset) => {
        onPresetsChange(presets.filter(p => p.id !== preset.id));
    }, [presets]);

    const renamePreset = useCallback((newPreset: ITablePreset) => {
        const newPresets = presets.map((p: ITablePreset) => p.id === newPreset.id ? newPreset : p);
        onPresetsChange(newPresets);
    }, [presets]);

    const updatePreset = useCallback((preset: ITablePreset) => {
        const newPreset = {
            ...preset,
            filter,
            columnsConfig,
        };
        const newPresets = [...presets];
        newPresets.splice(presets.findIndex(p => p.id === preset.id), 1, newPreset);
        onPresetsChange(newPresets);
    }, [presets, filter, columnsConfig]);

    return {
        columnsConfig,
        onColumnsConfigChange,

        filter,
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

interface IInitialData<TFilter, TColumns> {
    columnsConfig: ColumnsConfig;
    columns: DataColumnProps<TColumns>[];
    filter?: TFilter;
    loadPresets?: () => ITablePreset[];
    onPresetsSave?: (newPresets: ITablePreset[]) => void;
}