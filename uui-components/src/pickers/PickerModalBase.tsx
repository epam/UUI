import * as React from 'react';
import { DataSourceState, IEditable, IHasCaption, IModal, Lens } from '@epam/uui';
import { PickerBase, PickerBaseOptions, PickerBaseProps, PickerBaseState } from './index';

export interface PickerModalOptions<TItem, TId> {
    renderFilter?(editableFilter: IEditable<any>): React.ReactNode;
}

export type PickerModalImplProps<TItem, TId> = PickerBaseProps<TItem, TId> & IModal<any> & IHasCaption & PickerModalOptions<TItem, TId>;

interface PickerModalState extends PickerBaseState {
    showSelected: boolean;
}

const initialStateValues: DataSourceState = {
    topIndex: 0,
    visibleCount: 30,
    focusedIndex: -1, // we don't want to focus the 1st item from the start, as it confuses and people would rarely use keyboard in modals
};

export class PickerModalBase<TItem, TId> extends PickerBase<TItem, TId, PickerModalImplProps<TItem, TId>, PickerModalState> {
    stateLens = Lens.onState<PickerBaseState & PickerModalState>(this);
    showSelectionLens = this.stateLens
        .onChange((oldVal, newVal) => ({
            ...newVal,
            dataSourceState: {
                ...newVal.dataSourceState,
                ...initialStateValues,
            },
        }))
        .prop('showSelected');

    getInitialState() {
        let base = super.getInitialState();
        return {
            ...base,
            dataSourceState: {
                ...base.dataSourceState,
                ...initialStateValues,
            },
        };
    }

    getRows() {
        const view = this.getView();
        const topIndex = this.state.dataSourceState.topIndex;
        return this.state.showSelected
            ? view.getSelectedRows().slice(topIndex, topIndex + this.state.dataSourceState.visibleCount)
            : view.getVisibleRows();
    }
}

export type PickerModalProps<TItem, TId> = PickerBaseOptions<TItem, TId>
    & IHasCaption
    & (PickerModalScalarProps<TId, TItem> | PickerModalArrayProps<TId, TItem>)
    & PickerModalOptions<TItem, TId>;

export type PickerModalScalarProps<TId, TItem> = { selectionMode: 'single', valueType: 'id', initialValue: TId } & IModal<TId>
    | { selectionMode: 'single', valueType: 'entity', initialValue: TItem } & IModal<TItem>;
export type PickerModalArrayProps<TId, TItem> = { selectionMode: 'multi', valueType: 'id', initialValue: TId[] } & IModal<TId[]>
    | { selectionMode: 'multi', valueType: 'entity', initialValue: TItem[] } & IModal<TItem[]>;

