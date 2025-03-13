import { useMemo, useEffect, useState } from 'react';
import { DataSourceState, IModal, Lens, PickerFooterProps } from '@epam/uui-core';
import { usePickerApi } from './usePickerApi';
import { useShowSelected } from './useShowSelected';
import { UsePickerModalProps } from './types';
import { applyValueToDataSourceState, dataSourceStateToValue } from '../bindingHelpers';

export function usePickerModal<TItem, TId>(props: UsePickerModalProps<TItem, TId>) {
    const [dsState, setDsState] = useState<DataSourceState>({
        topIndex: 0,
        visibleCount: 30,
        checked: [],
        focusedIndex: -1, // we don't want to focus the 1st item from the start, as it confuses and people would rarely use keyboard in modals
    });

    const [selection, setSelection] = useState(props.initialValue);
    const { showSelected, setShowSelected } = useShowSelected({ dataSourceState: dsState });

    const picker = usePickerApi<TItem, TId>(
        {
            ...props,
            showSelectedOnly: showSelected,
            value: selection as any,
            onValueChange: setSelection,
            dataSourceState: dsState,
            setDataSourceState: setDsState,
        },
    );
    const {
        view,
        getEntityName,
        getName,
        getListProps,
        dataSourceState,
        clearSelection,
        isSingleSelect,
        handleDataSourceValueChange,
    } = picker;

    const dataSourceStateLens = useMemo(
        () => Lens.onEditable<DataSourceState>({ value: dataSourceState, onValueChange: handleDataSourceValueChange }),
        [dataSourceState, handleDataSourceValueChange],
    );

    useEffect(() => {
        const prevValue = dataSourceStateToValue(props, dataSourceState, props.dataSource);
        if (prevValue !== props.initialValue) {
            handleDataSourceValueChange(
                applyValueToDataSourceState(
                    props,
                    dataSourceState,
                    props.initialValue,
                    props.dataSource,
                ),
            );
        }
    }, [props.initialValue]);

    const getRows = () => view.getVisibleRows();

    const getFooterProps = (): PickerFooterProps<TItem, TId> & Partial<IModal<any>> => {
        return {
            view,
            showSelected: {
                value: showSelected,
                onValueChange: setShowSelected,
            },
            selectionMode: props.selectionMode,
            clearSelection,
            selection: selection,
            search: dataSourceState.search,
            success: () => props.success(selection as any),
            abort: props.abort,
        };
    };

    return {
        selection,
        dataSourceState,
        dataSourceStateLens,
        getName,
        getEntityName,
        getListProps,
        view,
        getRows,
        getFooterProps,
        clearSelection,
        isSingleSelect,
        handleDataSourceValueChange,
    };
}
