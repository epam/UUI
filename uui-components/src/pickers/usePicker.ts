import { useCallback, useContext, useEffect } from 'react';
import isEqual from 'lodash.isequal';
import { DataRowOptions, DataSourceListProps, DataSourceState, IDataSourceView, PickerFooterProps, UuiContext } from '@epam/uui-core';
import { PickerInputBaseProps } from './PickerInputBase';
import { applyValueToDataSourceState, dataSourceStateToValue } from './bindingHelpers';
import { PickerState } from './usePickerState';

export function usePicker<TItem, TId>(
    props: PickerInputBaseProps<TItem, TId>,
    { showSelected, setShowSelected, dataSourceState, setDataSourceState }: PickerState,
) {
    const context = useContext(UuiContext);
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

    const handleSelectionValueChange = useCallback((newValue: any) => {
        onValueChange(newValue);

        if (getValueChangeAnalyticsEvent) {
            const event = getValueChangeAnalyticsEvent(newValue, value);
            context.uuiAnalytics.sendEvent(event);
        }
    }, [onValueChange, getValueChangeAnalyticsEvent, value]);

    const handleDataSourceValueChange = useCallback((newDataSourceState: DataSourceState) => {
        if (showSelected && !newDataSourceState.checked?.length) {
            setShowSelected(false);
        }

        setDataSourceState(newDataSourceState);
        const newValue = dataSourceStateToValue(props, newDataSourceState, dataSource);

        if (!isEqual(value, newValue)) {
            handleSelectionValueChange(newValue);
        }
    }, [
        handleSelectionValueChange,
        setDataSourceState,
        setShowSelected,
        props,
        value,
    ]);

    const getName = useCallback((i: (TItem & { name?: string }) | void) => {
        const unknownStr = 'Unknown';
        if (props.getName) {
            try {
                return props.getName(i as TItem);
            } catch (e) {
                return unknownStr;
            }
        }
        return i ? i.name : unknownStr;
    }, [props.getName]);

    const getPluralName = useCallback(() => {
        if (!entityName) return;
        if (entityName.endsWith('s')) return entityName.concat('es');
        if (entityName.endsWith('y')) return entityName.concat('(s)');
        return entityName.concat('s');
    }, [entityName]);

    const getEntityName = useCallback((countSelected?: number) => {
        if ((!entityName && !entityPluralName) || (!entityName && countSelected === 1)) return '';
        if ((countSelected <= 1 && entityName) || selectionMode === 'single') return entityName;
        return entityPluralName || getPluralName();
    }, [entityName, entityPluralName, selectionMode, getPluralName]);

    const isSingleSelect = useCallback(
        () => selectionMode === 'single',
        [selectionMode],
    );

    const getSelectedIdsArray = useCallback((selected: TId | TId[] | null | undefined): TId[] => {
        if (selected) {
            if (isSingleSelect()) {
                return [selected as TId];
            } else {
                return selected as TId[];
            }
        }
        return [];
    }, [isSingleSelect]);

    const getDataSourceState = useCallback(
        () => applyValueToDataSourceState(props, dataSourceState, props.value, props.dataSource),
        [props, dataSourceState],
    );

    const getRowOptions = useCallback((item: TItem, index: number) => {
        const options: DataRowOptions<TItem, TId> = {};
        if (isSingleSelect()) {
            options.isSelectable = true;
        } else {
            options.checkbox = { isVisible: true };
        }

        const externalOptions = props.getRowOptions ? props.getRowOptions(item, index) : {};

        return { ...options, ...externalOptions };
    }, [isSingleSelect, props.getRowOptions]);

    const clearSelection = useCallback(() => {
        handleDataSourceValueChange({
            ...dataSourceState,
            selectedId: emptyValue,
            checked: [],
        });
    }, [handleDataSourceValueChange, emptyValue, dataSourceState]);

    const hasSelection = useCallback(() => {
        if (Array.isArray(value)) {
            return value.length !== 0;
        } else {
            return value !== undefined && value !== null;
        }
    }, [value]);

    const getView = useCallback(
        (): IDataSourceView<TItem, TId, any> =>
            dataSource.getView(getDataSourceState(), handleDataSourceValueChange, {
                getRowOptions,
                getSearchFields: getSearchFields || ((item: TItem) => [getName(item)]),
                isFoldedByDefault,
                ...(sortBy ? { sortBy } : {}),
                ...(cascadeSelection ? { cascadeSelection } : {}),
            }),
        [
            getDataSourceState,
            handleDataSourceValueChange,
            getRowOptions,
            getSearchFields,
            getName,
            isFoldedByDefault,
            sortBy,
            cascadeSelection,
        ],
    );

    const getSelectedRows = useCallback((visibleCount?: number) => {
        if (hasSelection()) {
            const view = getView();
            return view.getSelectedRows({ visibleCount });
        }
        return [];
    }, [getView, hasSelection]);

    const getListProps = useCallback((): DataSourceListProps => {
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
    }, [getView, getDataSourceState, showSelected]);

    const getFooterProps = useCallback((): PickerFooterProps<TItem, TId> => ({
        view: getView(),
        showSelected: {
            value: showSelected,
            onValueChange: setShowSelected,
        },
        clearSelection,
        selectionMode,
    }), [getView, showSelected, setShowSelected, clearSelection, selectionMode]);

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
