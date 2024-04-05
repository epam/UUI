import { useCallback, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import {
    ColumnsConfig, DataColumnProps, DataTableState, FiltersConfig, IEditable, ITablePreset, ITableState, TableFiltersConfig,
} from '../../types';
import { getOrderBetween } from '../../helpers';
import { useUuiContext } from '../../services';
import { stateToQueryObject, getValueFromUrl, normalizeTableStateValue, normalizeFilterConfig } from './utils';
import { getOrderComparer } from '../../data';

interface UseTableStateHookBaseParams<TFilter = Record<string, any>, TViewState = any> {
    /** Columns configuration, can be omitted if used without tables */
    columns?: DataColumnProps[];
    /** Filters configuration, can be omitted if you don't need filters */
    filters?: TableFiltersConfig<TFilter>[];
    /** Initial presets array */
    initialPresets?: ITablePreset<TFilter, TViewState>[];
    /** Called when preset was created. Should return the ID of new preset */
    onPresetCreate?(preset: ITablePreset<TFilter, TViewState>): Promise<number>;
    /** Called when preset was updated */
    onPresetUpdate?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
    /** Called when preset was deleted */
    onPresetDelete?(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
}

interface UseTableStateHookImplParams<TFilter = Record<string, any>, TViewState = any> extends UseTableStateHookBaseParams<TFilter, TViewState> {
    value: DataTableState<TFilter, TViewState>;
    onValueChange: (update: (val: DataTableState<TFilter, TViewState>) => DataTableState<TFilter, TViewState>) => void;
}

export const useTableStateImpl = <TFilter = Record<string, any>, TViewState = any>
(params: UseTableStateHookImplParams<TFilter, TViewState>): ITableState<TFilter, TViewState> => {
    const context = useUuiContext();
    const [presets, setPresets] = useState(params?.initialPresets ?? []);

    const setColumnsConfig = useCallback((columnsConfig: ColumnsConfig) => {
        params.onValueChange((val) => ({
            ...val,
            columnsConfig,
        }));
    }, []);

    const setFiltersConfig = useCallback((filtersConfig: FiltersConfig) => {
        params.onValueChange((val) => ({
            ...val,
            filtersConfig,
        }));
    }, []);

    const setFilter = useCallback((filter: TFilter) => {
        params.onValueChange((val) => ({
            ...val,
            filter,
        }));
    }, []);

    const getActivePresetId = () => {
        const presetId = params.value?.presetId;
        return presetId ? +presetId : undefined;
    };

    const choosePreset = useCallback((preset: ITablePreset<TFilter, TViewState>) => {
        params.onValueChange((val) => ({
            ...val,
            filter: preset.filter,
            columnsConfig: preset.columnsConfig,
            filtersConfig: preset.filtersConfig,
            sorting: preset.sorting,
            presetId: preset.id,
            viewState: preset.viewState,
        }));
    }, []);

    const getNewPresetOrder = useCallback(() => {
        const comparer = getOrderComparer([{ field: 'order', direction: 'desc' }]);
        const maxOrder = [...presets].sort(comparer)[0]?.order;
        return getOrderBetween(maxOrder, null);
    }, [presets]);

    const createPreset = useCallback(async (preset: ITablePreset<TFilter, TViewState>) => {
        const newId = await params?.onPresetCreate?.(preset);
        const newPreset = {
            ...preset,
            id: newId,
        };

        setPresets((prevValue) => [...prevValue, newPreset]);
        choosePreset(newPreset);

        return newId;
    }, [params?.onPresetCreate]);

    const createNewPreset = useCallback((name: string) => {
        const currentTableStateValue = params.value;
        const newPreset: ITablePreset<TFilter, TViewState> = {
            id: null,
            name: name,
            filter: currentTableStateValue.filter,
            columnsConfig: currentTableStateValue.columnsConfig,
            filtersConfig: currentTableStateValue.filtersConfig,
            sorting: currentTableStateValue.sorting,
            viewState: currentTableStateValue.viewState,
            isReadonly: false,
            order: getNewPresetOrder(),
        };

        return createPreset(newPreset);
    }, [params.value, getNewPresetOrder]);

    const hasPresetChanged = useCallback((preset: ITablePreset<TFilter, TViewState>) => {
        const currentTableStateValue = params.value;
        return (
            !isEqual(preset.filter, currentTableStateValue.filter)
            || !isEqual(preset.columnsConfig, currentTableStateValue.columnsConfig)
            || !isEqual(preset.sorting, currentTableStateValue.sorting)
            || !isEqual(preset.viewState, currentTableStateValue.viewState)
        );
    }, [params.value]);

    const duplicatePreset = useCallback(async (preset: ITablePreset<TFilter, TViewState>) => {
        const newPreset: ITablePreset<TFilter, TViewState> = {
            ...preset,
            isReadonly: false,
            id: null,
            name: preset.name + '_copy',
            order: getNewPresetOrder(),
        };

        return createPreset(newPreset);
    }, [createPreset, getNewPresetOrder]);

    const deletePreset = useCallback(
        (preset: ITablePreset<TFilter, TViewState>) => {
            const removePreset = () => {
                params.onValueChange((val) => ({
                    ...val,
                    presetId: undefined,
                }));
                setPresets((prevValue) =>
                    prevValue.filter((p) => p.id !== preset.id));
            };

            const promiseFulfilled = params?.onPresetDelete ? params.onPresetDelete(preset) : Promise.resolve();
            return promiseFulfilled
                .then(removePreset)
                .catch(() => null);
        },
        [params?.onPresetDelete],
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
    }, [params?.onPresetUpdate]);

    const getPresetLink = useCallback((preset: ITablePreset<TFilter, TViewState>) => {
        return (
            window.location.origin
            + context.uuiRouter.createHref({
                pathname: context.uuiRouter.getCurrentLink().pathname,
                query: stateToQueryObject({ ...preset, presetId: preset.id }, context.uuiRouter.getCurrentLink().query),
            })
        );
    }, []);

    const setTableState = useCallback((newValue: React.SetStateAction<DataTableState<TFilter, TViewState>>) => {
        params.onValueChange(typeof newValue === 'function' ? newValue : () => newValue);
    }, []);

    return {
        tableState: params.value,
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

export interface UseTableStateHookParams<TFilter = Record<string, any>, TViewState = any>
    extends UseTableStateHookBaseParams<TFilter, TViewState>, Partial<IEditable<DataTableState<TFilter, TViewState>>> {}

export const useTableState = <TFilter = Record<string, any>, TViewState = any>
(params: UseTableStateHookParams<TFilter, TViewState>): ITableState<TFilter, TViewState> => {
    const context = useUuiContext();

    const externalValue = useRef(params.value);

    const [tableStateValue, setTableStateValue] = useState<DataTableState<TFilter, TViewState>>(() => {
        const value = getValueFromUrl(context.uuiRouter.getCurrentLink().query);
        const activePreset = params.initialPresets?.find((p: ITablePreset<TFilter, TViewState>) => p.id === value.presetId);
        const filtersConfig = normalizeFilterConfig(activePreset?.filtersConfig, value.filter, params?.filters);
        return {
            ...value,
            filtersConfig,
            topIndex: 0,
            visibleCount: 40,
        };
    });

    const getTableStateValue = () => {
        if (params?.onValueChange) {
            return params.value;
        }

        const valueFromUrl = getValueFromUrl(context.uuiRouter.getCurrentLink().query);
        const urlKeys = Object.keys(valueFromUrl) as Array<keyof typeof valueFromUrl>;
        urlKeys.forEach((urlKey) => {
            if (!isEqual(valueFromUrl[urlKey], tableStateValue[urlKey]) || !(urlKey in tableStateValue)) {
                tableStateValue[urlKey] = valueFromUrl[urlKey];
            }
        });

        return tableStateValue;
    };

    const setValueToUrl = (value: DataTableState<TFilter, TViewState>) => {
        const oldQuery = context.uuiRouter.getCurrentLink().query;
        const newQuery = stateToQueryObject(value, context.uuiRouter.getCurrentLink().query);

        if (JSON.stringify(oldQuery) !== JSON.stringify(newQuery)) {
            context.uuiRouter.redirect({
                pathname: context.uuiRouter.getCurrentLink().pathname,
                query: newQuery,
            });
        }
    };
    const onValueChange = useCallback((update: (val: DataTableState<TFilter, TViewState>) => DataTableState<TFilter, TViewState>) => {
        if (params.onValueChange) {
            const newValue = update(externalValue.current);
            const resultValue = normalizeTableStateValue(newValue, externalValue.current, params.filters);
            externalValue.current = resultValue;
            params.onValueChange(resultValue);
        } else {
            setTableStateValue((currentValue) => {
                const newValue = update(currentValue);
                const resultValue = normalizeTableStateValue(newValue, currentValue, params.filters);
                setValueToUrl(resultValue);

                return resultValue;
            });
        }
    }, []);

    return useTableStateImpl({
        ...params,
        onValueChange,
        value: getTableStateValue(),
    });
};
