import { useCallback, useContext, useLayoutEffect } from 'react';
import isEqual from 'react-fast-compare';
import {
    DataSourceListProps, DataSourceState, PickerBaseProps, PickerFooterProps, UuiContext, usePrevious,
} from '@epam/uui-core';
import { applyValueToDataSourceState, dataSourceStateToValue } from '../bindingHelpers';
import { PickerState } from './types';

export function usePicker<TItem, TId, TProps extends PickerBaseProps<TItem, TId>>(
    props: TProps,
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

        if ((!prevDataSourceState && (dataSourceState.checked?.length || dataSourceState.selectedId != null))
            || (prevDataSourceState && (
                !isEqual(prevDataSourceState.checked, dataSourceState.checked)
                || dataSourceState.selectedId !== prevDataSourceState.selectedId
            ))
        ) {
            const newValue = dataSourceStateToValue(props, dataSourceState, dataSource);
            if (!isEqual(value, newValue)) {
                handleSelectionValueChange(newValue);
            }
        }
    }, [dataSourceState]);

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
        view.clearAllChecked();

        handleDataSourceValueChange({
            ...dataSourceState,
            selectedId: emptyValue as undefined,
        });
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
        handleDataSourceValueChange({ ...dataSourceState, search: '' });
    };

    const getFooterProps = (): PickerFooterProps<TItem, TId> => ({
        view,
        showSelected: {
            value: showSelected,
            onValueChange: toggleShowOnlySelected,
        },
        clearSelection,
        selectionMode,
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
        context,
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
