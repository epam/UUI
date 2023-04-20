import * as React from 'react';
import { DataSourceState, IEditable, IHasCaption, IHasRawProps, IModal, Lens, PickerBaseOptions, PickerBaseProps, PickerFooterProps } from '@epam/uui-core';
import { PickerBase, PickerBaseState } from './index';

export interface PickerModalOptions<TItem, TId> extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    renderFilter?(editableFilter: IEditable<any>): React.ReactNode;
    renderFooter?: (props: PickerFooterProps<TItem, TId> & Partial<IModal<any>>) => React.ReactNode;
    disallowClickOutside?: boolean;
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
        const base = super.getInitialState();
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
        const { topIndex, visibleCount } = this.state.dataSourceState;
        return this.state.showSelected ? view.getSelectedRows({ topIndex, visibleCount }) : view.getVisibleRows();
    }

    getFooterProps(): PickerFooterProps<TItem, TId> & Partial<IModal<any>> {
        const footerProps = super.getFooterProps();

        return {
            ...footerProps,
            success: this.props.success,
            abort: this.props.abort,
        };
    }
}

export type PickerModalProps<TItem, TId> = PickerBaseOptions<TItem, TId> &
    IHasCaption &
    (PickerModalScalarProps<TId, TItem> | PickerModalArrayProps<TId, TItem>) &
    PickerModalOptions<TItem, TId>;

export type PickerModalScalarProps<TId, TItem> =
    | ({ selectionMode: 'single'; valueType: 'id'; initialValue: TId } & IModal<TId>)
    | ({ selectionMode: 'single'; valueType: 'entity'; initialValue: TItem } & IModal<TItem>);
export type PickerModalArrayProps<TId, TItem> =
    | ({ selectionMode: 'multi'; valueType: 'id'; initialValue: TId[] } & IModal<TId[]>)
    | ({ selectionMode: 'multi'; valueType: 'entity'; initialValue: TItem[] } & IModal<TItem[]>);
