import { useCallback, useEffect, useMemo, useState } from "react";
import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps, DataTableState, getColumnsConfig } from "@epam/uui";
import { svc } from "../../../services";
import { ITablePreset, ITableState } from "../types";
import { isDefaultColumnsConfig, normalizeFilter, parseFilterUrl } from "../helpers";
import { constants } from "../data";

export const useTableState = <TFilter = Record<string, any>>(params: IParams<TFilter>): ITableState<TFilter> => {
    const [tableStateValue, setTableStateValue] = useState<DataTableState>({
        topIndex: 0,
        visibleCount: 40,
        sorting: [{ field: "name" }],
        filter: params.initialFilter ?? parseFilterUrl(),
        columnsConfig: getColumnsConfig(params.columns, {}),
        page: 1,
        pageSize: 100,
    });
    const [presets, setPresets] = useState(params.initialPresets ?? []);

    const setTableState = useCallback((newValue: DataTableState) => {
        const oldQuery = svc.uuiRouter.getCurrentLink().query;
        const parsedFilter = !oldQuery.filter || oldQuery.filter === "undefined"
            ? undefined
            : JSON.parse(decodeURIComponent(oldQuery.filter));
        const isFilterEqual = isEqual(parsedFilter, newValue.filter);
        console.log(parsedFilter, newValue.filter, isFilterEqual);

        setTableStateValue(prevValue => ({
            ...prevValue,
            ...newValue,
        }));

        // setTableStateValue(prevValue => ({
        //     ...prevValue,
        //     ...newValue,
        //     page: isFilterEqual 
        //         ? newValue.page
        //         : 1,
        // }));
        
        if (!isFilterEqual || oldQuery.presetId !== +newValue.presetId) {
            const newQuery = {
                ...svc.uuiRouter.getCurrentLink().query,
                filter: encodeURIComponent(JSON.stringify(newValue.filter)),
                presetId: newValue.presetId,
            };
            if (!newValue.presetId) {
                delete newQuery.presetId;
            }

            svc.uuiRouter.redirect({
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

    const setFilter = useCallback((filter: TFilter) => {
        setTableState({
            ...tableStateValue,
            filter,
        });
    }, [tableStateValue]);
    
    const setPage = useCallback((page: number) => {
        setTableState({
            ...tableStateValue,
            page,
        });
    }, [tableStateValue]);

    useEffect(() => {
        if (presets?.length === 0 && params.initialPresets?.length > 0) {
            setPresets(params.initialPresets);
        }
    }, [params.initialPresets]);

    useEffect(() => {
        const parsedFilter = parseFilterUrl() as TFilter;
        const hasFilterChanged = !isEqual(parsedFilter, tableStateValue.filter);

        const presetId = +svc.uuiRouter.getCurrentLink().query.presetId;
        const activePreset = presets.find((p: ITablePreset) => p.id === presetId);
        const hasColumnsConfigChanged = !isEqual(activePreset?.columnsConfig, tableStateValue.columnsConfig);

        if (!hasFilterChanged && !hasColumnsConfigChanged) return;

        const newState: Partial<DataTableState> & { presetId?: number | null } = {
            filter: parsedFilter,
        };
        if (activePreset?.columnsConfig) {
            newState.columnsConfig = activePreset.columnsConfig;
        }
        if (presetId) {
            newState.presetId = presetId;
        }

        setTableState(newState);
    }, [location.search]);

    const activePresetId = useMemo(() => {
        const presetId = svc.uuiRouter.getCurrentLink().query?.presetId;
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
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
            presetId: preset.id,
        });
    }, []);

    const createNewPreset = useCallback(async (preset: string | ITablePreset) => {
        const newPreset = typeof preset === "string"
            ? {
                name: preset,
                filter: tableStateValue.filter,
                columnsConfig: tableStateValue.columnsConfig,
                isReadonly: false,
            } as ITablePreset<TFilter>
            : {
                ...preset,
                name: preset.name + "_copy",
            } as ITablePreset<TFilter>;

        newPreset.id = await params?.onPresetCreate?.(newPreset);

        setPresets(prevValue => [...prevValue, newPreset]);
        choosePreset(newPreset);
    }, [tableStateValue.filter, tableStateValue.columnsConfig, choosePreset]);

    const resetToDefault = useCallback(() => {
        choosePreset({
            ...constants.defaultPreset,
            columnsConfig: getColumnsConfig(params.columns, {}),
        });
    }, [choosePreset]);

    const hasPresetChanged = useCallback((preset: ITablePreset<TFilter> | undefined) => {
        const filter = parseFilterUrl();

        return !isEqual(preset?.filter, filter)
            || !isEqual(preset?.columnsConfig, tableStateValue.columnsConfig);
    }, [tableStateValue.columnsConfig]);

    const duplicatePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        await createNewPreset(preset);
    }, [createNewPreset]);

    const deletePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        await params?.onPresetDelete(preset);
        setPresets(prevValue => prevValue.filter(p => p.id !== preset.id));
    }, []);

    const updatePreset = useCallback(async (preset: ITablePreset<TFilter>) => {
        const newPreset = {
            ...preset,
            filter: tableStateValue.filter,
            columnsConfig: tableStateValue.columnsConfig,
        };
        await params?.onPresetUpdate(newPreset);

        setPresets(prevValue => {
            const newPresets = [...prevValue];
            newPresets.splice(presets.findIndex(p => p.id === preset.id), 1, newPreset);
            return newPresets;
        });
    }, [tableStateValue.filter, tableStateValue.columnsConfig]);

    return {
        tableState: tableStateValue,
        setTableState,
        setColumnsConfig,
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
        
        setPage,
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