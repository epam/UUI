import { useCallback, useEffect, useMemo, useState } from "react";
import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps } from "@epam/uui";
import { svc } from "../../../services";
import { IPresetsApi, ITablePreset } from "../types";
import { isDefaultColumnsConfig, normalizeFilter, parseFilterUrl } from "../helpers";
import { useCreateNewPreset } from "./useCreateNewPreset";
import { useChoosePreset } from "./useChoosePreset";
import { constants } from "../data";

export const useTableState = <T extends ITableState>(initialState: IInitialState<T>, columns: DataColumnProps<any>[]): ITableStateHookResult<T> => {
    const [value, setValue] = useState<T>({
        filter: parseFilterUrl(),
        ...initialState.value,
        presets: initialState.loadPresets(),
    });

    const onValueChange = useCallback((value: T) => {
        const newValue = { ...value, filter: normalizeFilter(value.filter) };
        setValue(newValue);

        const newQuery = {
            ...svc.uuiRouter.getCurrentLink().query,
            filter: encodeURIComponent(JSON.stringify(newValue.filter)),
        };

        svc.history.push({
            pathname: location.pathname,
            query: newQuery,
        });

        initialState.onValueChange?.(value);
        initialState.onPresetsSave?.(value.presets);
    }, []);

    useEffect(() => {
        const filter = parseFilterUrl();
        const hasFilterChanged = !isEqual(filter, value.filter);

        const presetId = +svc.uuiRouter.getCurrentLink().query.presetId;
        const activePreset = value.presets.find((p: ITablePreset) => p.id === presetId);
        const hasColumnsConfigChanged = !isEqual(activePreset?.columnsConfig, value.columnsConfig);

        if (!hasFilterChanged && !hasColumnsConfigChanged) return;

        setValue({
            ...value,
            filter,
            columnsConfig: activePreset?.columnsConfig ?? initialState.value.columnsConfig,
        });
    }, [location.search]);

    const activePresetId = +svc.uuiRouter.getCurrentLink().query?.presetId;
    
    const isDefaultPresetActive = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        return !searchParams.get("presetId") && !value.filter && isDefaultColumnsConfig(value.columnsConfig, columns);
    }, [columns, value.filter, value.columnsConfig]);

    const choosePreset = useChoosePreset(value, onValueChange);
    const createNewPreset = useCreateNewPreset({ value, onValueChange, choosePreset });
    const resetToDefault = useCallback(() => choosePreset(constants.defaultPreset), [choosePreset]);

    const hasPresetChanged = (preset: ITablePreset | undefined) => {
        const filter = parseFilterUrl();

        return !isEqual(preset?.filter, filter)
            || !isEqual(preset?.columnsConfig, value.columnsConfig);
    };

    const duplicatePreset = useCallback((preset: ITablePreset) => {
        const maxId = Math.max.apply(null, value.presets.map((p: ITablePreset) => p.id));

        const newPreset: ITablePreset = {
            id: maxId + 1,
            name: preset.name + "_copy",
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
            isReadonly: false,
        };

        choosePreset(newPreset);

        onValueChange({
            ...value,
            filter: newPreset.filter,
            columnsConfig: newPreset.columnsConfig,
            presets: [...value.presets, newPreset],
        });
    }, [value, onValueChange, choosePreset]);

    const deletePreset = useCallback((preset: ITablePreset) => {
        const newPresets = value.presets.filter((p: ITablePreset) => p.id !== preset.id);
        onValueChange({
            ...value,
            presets: newPresets,
        });
    }, [value, onValueChange]);

    const renamePreset = useCallback((newPreset: ITablePreset) => {
        const newPresets = value.presets.map((p: ITablePreset) => p.id === newPreset.id ? newPreset : p);
        onValueChange({
            ...value,
            presets: newPresets,
        });
    }, [value, onValueChange]);

    const updatePreset = useCallback((preset: ITablePreset) => {
        const newPresets = [...value.presets];
        const newPreset = {
            ...preset,
            filter: value.filter,
            columnsConfig: value.columnsConfig,
        };
        newPresets.splice(newPresets.findIndex(p => p.id === preset.id), 1, newPreset);
        onValueChange({
            ...value,
            presets: newPresets,
        });
    }, [value, onValueChange]);

    return {
        value,
        onValueChange,
        presetsApi: {
            activePresetId,
            isDefaultPresetActive,
            choosePreset,
            createNewPreset,
            resetToDefault,
            hasPresetChanged,
            duplicatePreset,
            deletePreset,
            renamePreset,
            updatePreset,
        },
    } as const;
};

interface IInitialState<T> {
    value: T;
    loadPresets: () => ITablePreset[];
    onValueChange?: (newValue: T) => void;
    onPresetsSave?: (newPresets: ITablePreset[]) => void;
}

type ITableState = { filter?: any, columnsConfig: ColumnsConfig } & Record<string, any>;
interface ITableStateHookResult<T> {
    value: T;
    onValueChange(value: T): void;
    presetsApi: IPresetsApi;
}