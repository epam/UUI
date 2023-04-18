import React from 'react';
import { PickerListBase, PickerModalOptions } from '@epam/uui-components';
import { DataRowProps, IClickable, IDisableable, IHasCaption, IHasPlaceholder, UuiContext, UuiContexts } from '@epam/uui-core';
import { Text } from '../typography';
import { SizeMod, TextSize } from '../types';
import { LinkButton } from '../buttons';
import { PickerListItem } from './PickerListItem';
import { PickerModal } from './PickerModal';

export type PickerListProps<TItem, TId> = SizeMod & IHasPlaceholder & PickerModalOptions<TItem, TId> & {
    renderModalToggler?(props: IClickable & IHasCaption & IDisableable, selection: DataRowProps<TItem, TId>[]): React.ReactNode;
    noOptionsMessage?: React.ReactNode;
};

export class PickerList<TItem, TId> extends PickerListBase<TItem, TId, PickerListProps<TItem, TId>> {
    static contextType = UuiContext;
    sessionStartTime = (new Date()).getTime();
    context: UuiContexts;

    renderRow = (row: DataRowProps<TItem, TId>) => {
        return <PickerListItem getName={ item => this.getName(item) } { ...row } key={ row.rowKey } />;
    }

    handleShowPicker = () => {
        this.context.uuiModals
            .show(props => (
                <PickerModal<TItem, TId>
                    { ...props }
                    { ...this.props }
                    caption={ this.props.placeholder || `Please select ${ this.getEntityName() ? this.getEntityName() : "" }` }
                    initialValue={ this.props.value as any }
                    selectionMode={ this.props.selectionMode }
                    valueType={ this.props.valueType }
                />
            ))
            .then((value: any) => {
                this.appendLastSelected([...this.getSelectedIdsArray(value)]);
                this.props.onValueChange(value);
            });
    }

    defaultRenderToggler = (props: IClickable) => <LinkButton caption="Show all" { ...props } />;

    render() {
        const view = this.getView();
        const viewProps = view.getListProps();
        const selectedRows = view.getSelectedRows(0);
        const rows = this.buildRowsList();
        const showPicker = viewProps.totalCount == null || viewProps.totalCount > this.getMaxDefaultItems();
        const renderToggler = this.props.renderModalToggler || this.defaultRenderToggler;
        const renderRow = this.props.renderRow || this.renderRow;

        return (
            <div>
                { !rows.length && (this.props.noOptionsMessage || <Text color={ 'secondary' } size={ this.props.size as TextSize }>No options available</Text>) }
                { rows.map(row => renderRow({ ...row, isDisabled: this.props.isDisabled }, this.state.dataSourceState)) }
                { showPicker && renderToggler({
                    onClick: this.handleShowPicker,
                    caption: this.getModalTogglerCaption(viewProps.totalCount, view.getSelectedRowsCount()),
                    isDisabled: this.props.isDisabled,
                }, selectedRows) }
            </div>
        );
    }
}
