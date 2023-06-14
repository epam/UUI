import { useMemo } from 'react';
import { DataSourceState, IHasCaption, IModal, Lens, PickerBaseOptions, PickerBaseProps, PickerFooterProps } from '@epam/uui-core';
import { usePicker } from './usePicker';
import { PickerModalOptions } from '../PickerModalBase';
import { usePickerModalState } from './usePickerModalState';

export type PickerModalScalarProps<TId, TItem> =
    | ({ selectionMode: 'single'; valueType: 'id'; initialValue: TId } & IModal<TId>)
    | ({ selectionMode: 'single'; valueType: 'entity'; initialValue: TItem } & IModal<TItem>);
export type PickerModalArrayProps<TId, TItem> =
    | ({ selectionMode: 'multi'; valueType: 'id'; initialValue: TId[] } & IModal<TId[]>)
    | ({ selectionMode: 'multi'; valueType: 'entity'; initialValue: TItem[] } & IModal<TItem[]>);

export type UsePickerModalProps<TItem, TId> = PickerBaseOptions<TItem, TId> &
IHasCaption &
(PickerModalScalarProps<TId, TItem> | PickerModalArrayProps<TId, TItem>) &
PickerModalOptions<TItem, TId>;

type PickerProps<TItem, TId> = PickerBaseProps<TItem, TId> & IModal<any> & IHasCaption & PickerModalOptions<TItem, TId>;

const initialStateValues: DataSourceState = {
    topIndex: 0,
    visibleCount: 30,
    focusedIndex: -1, // we don't want to focus the 1st item from the start, as it confuses and people would rarely use keyboard in modals
};

export function usePickerModal<TItem, TId>(props: UsePickerModalProps<TItem, TId>) {
    const pickerListState = usePickerModalState<TItem, TId>({
        dataSourceState: initialStateValues,
        selection: props.initialValue,
    });

    const { dataSourceState, setDataSourceState, showSelected, setShowSelected, selection, setSelection } = pickerListState;
    const dataSourceStateLens = useMemo(
        () => Lens
            .onEditable<DataSourceState>({ value: dataSourceState, onValueChange: setDataSourceState })
            .onChange((_, newVal) => ({ ...newVal, ...initialStateValues })),
        [dataSourceState, setDataSourceState],
    );
    const showSelectedLens = useMemo(
        () => Lens
            .onEditable<boolean>({ value: showSelected, onValueChange: setShowSelected }),
        [showSelected, setShowSelected],
    );

    const pickerProps: PickerProps<TItem, TId> = {
        ...props,
        value: selection,
        onValueChange: setSelection,
    } as PickerProps<TItem, TId>;

    const picker = usePicker<TItem, TId, PickerProps<TItem, TId>>(
        pickerProps,
        pickerListState,
    );
    const {
        context,
        getView,
        getEntityName,
        getName,
        getListProps,
        getDataSourceState,
        clearSelection,
        isSingleSelect,
        handleDataSourceValueChange,
    } = picker;

    const getRows = () => {
        const view = getView();
        const { topIndex, visibleCount } = dataSourceState;
        return showSelected ? view.getSelectedRows({ topIndex, visibleCount }) : view.getVisibleRows();
    };

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
        showSelectedLens,
        getName,
        getEntityName,
        getListProps,
        getView,
        getRows,
        getFooterProps,
        getDataSourceState,
        clearSelection,
        isSingleSelect,
        handleDataSourceValueChange,
    };
}
