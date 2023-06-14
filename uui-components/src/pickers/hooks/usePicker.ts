import { useCallback, useContext, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
import {
    DataRowOptions, DataSourceListProps, DataSourceState, IDataSourceView, PickerBaseProps, PickerFooterProps, UuiContext,
} from '@epam/uui-core';
import { applyValueToDataSourceState, dataSourceStateToValue } from '../bindingHelpers';
import { PickerState } from './types';

export function usePicker<TItem, TId, TProps extends PickerBaseProps<TItem, TId>>(
    props: TProps,
    pickerState: PickerState,
) {
    const context = useContext(UuiContext);
    const { showSelected, setShowSelected, dataSourceState, setDataSourceState } = pickerState;
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
    } = props;

    const propsRef = useRef(props);
    propsRef.current = props;

    const pickerStateRef = useRef(pickerState);
    pickerStateRef.current = pickerState;

    const handleDataSourceValueChangeRef = useRef((newDataSourceState: DataSourceState) => {
        if (pickerStateRef.current.showSelected && !newDataSourceState.checked?.length) {
            pickerStateRef.current.setShowSelected(false);
        }

        setDataSourceState(newDataSourceState);
        const newValue = dataSourceStateToValue(propsRef.current, newDataSourceState, propsRef.current.dataSource);
        if (!isEqual(propsRef.current.value, newValue)) {
            handleSelectionValueChange(newValue);
        }
    });

    const handleDataSourceValueChange = handleDataSourceValueChangeRef.current;

    const handleSelectionValueChange = useCallback((newValue: any) => {
        onValueChange(newValue);

        if (getValueChangeAnalyticsEvent) {
            const event = getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    }, [onValueChange, getValueChangeAnalyticsEvent]);

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

    const getRowOptions = (item: TItem, index: number) => {
        const options: DataRowOptions<TItem, TId> = {};
        if (isSingleSelect()) {
            options.isSelectable = true;
        } else {
            options.checkbox = { isVisible: true };
        }

        const externalOptions = props.getRowOptions ? props.getRowOptions(item, index) : {};

        return { ...options, ...externalOptions };
    };

    const clearSelection = () => {
        handleDataSourceValueChange({
            ...dataSourceState,
            selectedId: emptyValue,
            checked: [],
        });
    };

    const hasSelection = () => {
        if (Array.isArray(value)) {
            return value.length !== 0;
        } else {
            return value !== undefined && value !== null;
        }
    };

    const getView = (): IDataSourceView<TItem, TId, any> =>
        dataSource.getView(getDataSourceState(), handleDataSourceValueChange, {
            getRowOptions,
            getSearchFields: getSearchFields || ((item: TItem) => [getName(item)]),
            isFoldedByDefault,
            ...(sortBy ? { sortBy } : {}),
            ...(cascadeSelection ? { cascadeSelection } : {}),
        });

    const getSelectedRows = (visibleCount?: number) => {
        if (hasSelection()) {
            const view = getView();
            return view.getSelectedRows({ visibleCount });
        }
        return [];
    };

    const getListProps = (): DataSourceListProps => {
        const view = getView();
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

    const getFooterProps = (): PickerFooterProps<TItem, TId> => ({
        view: getView(),
        showSelected: {
            value: showSelected,
            onValueChange: setShowSelected,
        },
        clearSelection,
        selectionMode,
    });

    useEffect(() => {
        return () => {
            dataSource.unsubscribeView(handleDataSourceValueChange);
        };
    }, []);

    return {
        context,
        dataSourceState,
        getName,
        getPluralName,
        getEntityName,
        isSingleSelect,
        getSelectedIdsArray,
        getDataSourceState,
        getRowOptions,
        clearSelection,
        hasSelection,
        getSelectedRows,
        getView,
        getListProps,
        getFooterProps,
        handleDataSourceValueChange,
        handleSelectionValueChange,
    };
}
