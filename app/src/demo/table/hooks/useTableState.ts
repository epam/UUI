import { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import { DataColumnProps, getColumnsConfig } from "@epam/uui";
import { svc } from "../../../services";
import { ITablePreset, PersonsTableState } from "../types";
import { normalizeFilter, parseFilterUrl } from "../helpers";

export const useTableState = <T extends ITableState>(initialState: IInitialState<T>) => {
    console.log(initialState);
    const [value, setValue] = useState<PersonsTableState>({
        filter: parseFilterUrl(),
        presets: [],
        ...initialState.value,
    });

    const onValueChange = useCallback((value: T) => {
        console.log("onValueChange", value);
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
            columnsConfig: activePreset?.columnsConfig ?? getColumnsConfig(initialState.columns, {}),
        });
    }, [location.search]);

    return { value, onValueChange } as const;
};

interface IInitialState<T> {
    columns: DataColumnProps<any>[];
    value: T;
    onValueChange?: (newValue: T) => void;
}

type ITableState = { filter?: any } & Record<string, any>;