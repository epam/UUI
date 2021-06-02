import { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { ColumnsConfig } from "@epam/uui";
import { svc } from "../../../services";
import { ITablePreset, PersonsTableState } from "../types";
import { normalizeFilter, parseFilterUrl } from "../helpers";

export const useTableState = <T extends ITableState>(initialState: IInitialState<T>) => {
    const [value, setValue] = useState<PersonsTableState>({
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
        const activePreset = value.presets.find(p => p.id === presetId);
        const hasColumnsConfigChanged = !isEqual(activePreset?.columnsConfig, value.columnsConfig);

        if (!hasFilterChanged && !hasColumnsConfigChanged) return;

        setValue({
            ...value,
            filter,
            columnsConfig: activePreset?.columnsConfig ?? initialState.value.columnsConfig,
        });
    }, [location.search]);

    return { value, onValueChange } as const;
};

interface IInitialState<T> {
    value: T;
    loadPresets: () => ITablePreset[];
    onValueChange?: (newValue: T) => void;
    onPresetsSave?: (newPresets: ITablePreset[]) => void;
}

type ITableState = { filter?: any, columnsConfig: ColumnsConfig } & Record<string, any>;