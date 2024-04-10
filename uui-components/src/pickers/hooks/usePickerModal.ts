import { useMemo, useEffect } from 'react';
import { DataSourceState, IHasCaption, IModal, Lens, PickerBaseProps, PickerFooterProps } from '@epam/uui-core';
import { usePicker } from './usePicker';
import { usePickerModalState } from './usePickerModalState';
import { PickerModalOptions, UsePickerModalProps } from './types';
import { applyValueToDataSourceState, dataSourceStateToValue } from '../bindingHelpers';

type PickerProps<TItem, TId> = PickerBaseProps<TItem, TId> & IModal<any> & IHasCaption & PickerModalOptions<TItem, TId>;

const initialStateValues: DataSourceState = {
    topIndex: 0,
    visibleCount: 30,
    focusedIndex: -1, // we don't want to focus the 1st item from the start, as it confuses and people would rarely use keyboard in modals
};

export function usePickerModal<TItem, TId>(props: UsePickerModalProps<TItem, TId>) {
    const pickerListState = usePickerModalState<TItem, TId>({
        dataSourceState: { ...initialStateValues },
        selection: props.initialValue,
        selectionMode: props.selectionMode,
    });

    const { dataSourceState, selection, setSelection } = pickerListState;

    const pickerProps: PickerProps<TItem, TId> = {
        ...props,
        showSelectedOnly: pickerListState.showSelected,
        value: selection,
        onValueChange: setSelection,
    } as PickerProps<TItem, TId>;

    const picker = usePicker<TItem, TId, PickerProps<TItem, TId>>(
        pickerProps,
        pickerListState,
    );
    const {
        context,
        view,
        getEntityName,
        getName,
        getListProps,
        getDataSourceState,
        clearSelection,
        isSingleSelect,
        handleDataSourceValueChange,
    } = picker;

    const dataSourceStateLens = useMemo(
        () => Lens
            .onEditable<DataSourceState>({ value: dataSourceState, onValueChange: handleDataSourceValueChange })
            .onChange((_, newVal) => ({ ...newVal, ...initialStateValues })),
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
        const footerProps = picker.getFooterProps();

        return {
            ...footerProps,
            success: () => props.success(selection as any),
            abort: props.abort,
        };
    };

    return {
        context,
        selection,
        dataSourceState,
        dataSourceStateLens,
        getName,
        getEntityName,
        getListProps,
        view,
        getRows,
        getFooterProps,
        getDataSourceState,
        clearSelection,
        isSingleSelect,
        handleDataSourceValueChange,
    };
}
