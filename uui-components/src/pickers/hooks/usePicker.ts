import { useCallback, useContext, useLayoutEffect } from 'react';
import isEqual from 'react-fast-compare';
import {
    DataSourceListProps, DataSourceState, PickerBaseProps, PickerFooterProps, UuiContext, usePrevious,
} from '@epam/uui-core';
import { applyValueToDataSourceState, dataSourceStateToValue } from '../bindingHelpers';
import { PickerState } from './types';

type UsePickerProps<TItem, TId> = PickerBaseProps<TItem, TId> & {
    /**
     * Enables/disables selected rows only in Picker.
     */
    showSelectedOnly?: boolean;
};

export function usePicker<TItem, TId>(
    props: UsePickerProps<TItem, TId>,
    pickerState: PickerState,
) {
    const context = useContext(UuiContext);
    const { showSelected, setShowSelected, dataSourceState, setDataSourceState } = pickerState;
    const prevDataSourceState = usePrevious(dataSourceState);

    const {
        dataSource,
        emptyValue,
        value,
        onValueChange,
        getValueChangeAnalyticsEvent,
        entityName,
        entityPluralName,
        selectionMode,
        getSearchFields,
        isFoldedByDefault,
        sortBy,
        cascadeSelection,
        showSelectedOnly,
    } = props;

    const handleSelectionValueChange = useCallback((newValue: any) => {
        onValueChange(newValue);

        if (getValueChangeAnalyticsEvent) {
            const event = getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    }, [onValueChange, getValueChangeAnalyticsEvent]);

    const handleDataSourceValueChange = useCallback((newDataSourceState: React.SetStateAction<DataSourceState<any, TId>>) => {
        setDataSourceState((st) => {
            let newDsState: DataSourceState;
            if (typeof newDataSourceState === 'function') {
                newDsState = newDataSourceState(st);
            } else {
                newDsState = newDataSourceState;
            }

            if ((newDsState.search || st.search) && newDsState.search !== st.search) {
                newDsState.focusedIndex = 0;
            }

            return newDsState;
        });
    }, [setDataSourceState]);

    useLayoutEffect(() => {
        if (showSelected && (!dataSourceState.checked?.length || dataSourceState.search)) {
            setShowSelected(false);
        }

        const newValue = dataSourceStateToValue(props, dataSourceState, dataSource);
        if ((!prevDataSourceState && (dataSourceState.checked?.length || dataSourceState.selectedId != null))
            || (prevDataSourceState && (
                !isEqual(prevDataSourceState.checked, dataSourceState.checked)
                || (!(dataSourceState.selectedId == null && prevDataSourceState.selectedId == null)
                    && dataSourceState.selectedId !== prevDataSourceState.selectedId)
            ))
        ) {
            // For entity mode we should check only ids because external entity can be different from ds entity
            if (props.valueType === 'entity') {
                if (props.selectionMode === 'single') {
                    if (props.dataSource.getId(value as TItem) !== props.dataSource.getId(newValue as TItem)) {
                        handleSelectionValueChange(newValue);
                    }
                } else {
                    const newIds = (newValue as TItem[])?.map((i) =>props.dataSource.getId(i));
                    const prevIds = (value as TItem[])?.map((i) =>props.dataSource.getId(i));
                    if (!isEqual(newIds, prevIds)) {
                        handleSelectionValueChange(newValue);
                    }
                }
            } else {
                if (!isEqual(value, newValue)) {
                    handleSelectionValueChange(newValue);
                }
            }
        }

        const { checked, selectedId } = getDataSourceState();

        if (prevDataSourceState && (
            props.selectionMode === 'multi'
                ? (isEqual(prevDataSourceState.checked, dataSourceState.checked)
                        && (checked?.length || dataSourceState.checked?.length) && !isEqual(dataSourceState.checked, checked))
                : ((dataSourceState.selectedId === prevDataSourceState.selectedId)
                        && (!isEqual(dataSourceState.selectedId, selectedId)))
        )) {
            handleDataSourceValueChange((dsState) => ({
                ...dsState,
                ...(props.selectionMode === 'multi'
                    ? { checked }
                    : { selectedId }),
            }));
        }
    }, [dataSourceState, value]);

    const getName = (i: (TItem & { name?: string }) | void) => {
        const unknownStr = 'Unknown';
        if (props.getName) {
            try {
                return props.getName(i as TItem);
            } catch (e) {
                return unknownStr;
            }
        }
        return i ? i.name : unknownStr;
    };

    const getPluralName = () => {
        if (!entityName) return;
        if (entityName.endsWith('s')) return entityName.concat('es');
        if (entityName.endsWith('y')) return entityName.concat('(s)');
        return entityName.concat('s');
    };

    const getEntityName = (countSelected?: number) => {
        if ((!entityName && !entityPluralName) || (!entityName && countSelected === 1)) return '';
        if ((countSelected <= 1 && entityName) || selectionMode === 'single') return entityName;
        return entityPluralName || getPluralName();
    };

    const isSingleSelect = () => selectionMode === 'single';

    const getSelectedIdsArray = (selected: TId | TId[] | null | undefined): TId[] => {
        if (selected) {
            if (isSingleSelect()) {
                return [selected as TId];
            } else {
                return selected as TId[];
            }
        }
        return [];
    };

    const getDataSourceState = () => applyValueToDataSourceState(props, dataSourceState, props.value, props.dataSource);

    const getRowOptions = () => {
        if (isSingleSelect()) {
            return { isSelectable: true };
        }

        return { checkbox: { isVisible: true } };
    };

    const clearSelection = () => {
        if (selectionMode === 'single') {
            handleDataSourceValueChange((dsState) =>({
                ...dsState,
                selectedId: emptyValue as undefined | null,
            }));
        } else {
            view.clearAllChecked();
        }
    };

    const hasSelection = () => {
        if (Array.isArray(value)) {
            return value.length !== 0;
        } else {
            return value !== undefined && value !== null;
        }
    };

    const view = dataSource.useView(getDataSourceState(), handleDataSourceValueChange, {
        rowOptions: getRowOptions(),
        getSearchFields: getSearchFields || ((item: TItem) => [getName(item)]),
        ...(isFoldedByDefault ? { isFoldedByDefault } : {}),
        ...(sortBy ? { sortBy } : {}),
        ...(cascadeSelection ? { cascadeSelection } : {}),
        ...(props.getRowOptions ? { getRowOptions: props.getRowOptions } : {}),
        backgroundReload: true,
        showSelectedOnly,
    }, [dataSource]);

    const getListProps = (): DataSourceListProps => {
        const listProps = view.getListProps();
        if (showSelected) {
            const checked = getDataSourceState().checked;
            const checkedCount = checked ? checked.length : 0;
            return {
                ...listProps,
                rowsCount: checkedCount,
                knownRowsCount: checkedCount,
                exactRowsCount: checkedCount,
            };
        } else {
            return listProps;
        }
    };

    const toggleShowOnlySelected = (val: boolean) => {
        setShowSelected(val);
    };

    const getFooterProps = (): PickerFooterProps<TItem, TId> => ({
        view,
        showSelected: {
            value: showSelected,
            onValueChange: toggleShowOnlySelected,
        },
        clearSelection,
        selectionMode,
        selection: dataSourceStateToValue<TId, TItem>(props, dataSourceState, dataSource),
        search: pickerState.dataSourceState.search,
    });

    const getSelectedRows = (itemsToTake: number) => {
        const dsState = getDataSourceState();
        let checked = [];
        if (props.selectionMode === 'single') {
            checked = dsState.selectedId !== null && dsState.selectedId !== undefined ? [dsState.selectedId] : [];
        } else {
            checked = dsState.checked ?? [];
        }
        return checked
            .slice(0, itemsToTake)
            .map((id, index) => view.getById(id, index));
    };

    return {
        dataSourceState,
        getName,
        getPluralName,
        getEntityName,
        isSingleSelect,
        getSelectedIdsArray,
        getSelectedRows,
        getDataSourceState,
        getRowOptions,
        clearSelection,
        hasSelection,
        view,
        getListProps,
        getFooterProps,
        handleDataSourceValueChange,
        handleSelectionValueChange,
    };
}
