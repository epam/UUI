import React from 'react';
import { PickerListBase, PickerModalOptions } from '@epam/uui-components';
import { UuiContexts, uuiContextTypes, DataRowProps, IClickable, IHasCaption, IHasPlaceholder } from '@epam/uui';
import { PickerModal } from './PickerModal';
import { LinkButton } from '../buttons';
import { PickerListItem } from './PickerListItem';
import { Theme, SizeMod, TextSize } from '../types';
import { Text } from '../typography';

export type PickerListProps<TItem, TId> = SizeMod & IHasPlaceholder & PickerModalOptions<TItem, TId> & {
    theme?: Theme;
    renderModalToggler?(props: IClickable & IHasCaption, selection: DataRowProps<TItem, TId>[]): React.ReactNode;
    noOptionsMessage?: React.ReactNode;
};

export class PickerList<TItem, TId> extends PickerListBase<TItem, TId, PickerListProps<TItem, TId>> {
    static contextTypes = uuiContextTypes;
    sessionStartTime = (new Date()).getTime();
    context: UuiContexts;

    renderRow = (row: DataRowProps<TItem, TId>) => {
        return <PickerListItem theme={ this.props.theme } getName={ item => this.getName(item) } { ...row } key={ row.rowKey }/>;
    }

    handleShowPicker = () => {
        this.context.uuiModals.show(props => <PickerModal<TItem, TId>
                { ...props }
                { ...this.props }
                caption={ this.props.placeholder || `Please select ${ this.getEntityName() ? this.getEntityName() : "" }` }
                initialValue={ this.props.value as any }
                selectionMode={ this.props.selectionMode as any }
                valueType={ this.props.valueType as any }
            />)
            .then((value: any) => {
                this.appendLastSelected([...this.getSelectedIdsArray(value)]);
                (this.props.onValueChange as any)(value);
            });
    }

    defaultRenderToggler = (props: IClickable) => <LinkButton
        caption='Show all'
        { ...props }
    />

    render() {
        const view = this.getView();
        const viewProps = view.getListProps();
        const selectedRows = view.getSelectedRows();
        const rows = this.buildRowsList();
        // This is incorrect condition to hide Show More, it won't work for small tree. Added as a temporary solution.
        const showPicker = viewProps.totalCount == null || viewProps.totalCount > this.getMaxDefaultItems();
        const renderToggler = this.props.renderModalToggler || this.defaultRenderToggler;
        const renderRow = this.props.renderRow || this.renderRow;

        return (
            <div>
                { !rows.length && (this.props.noOptionsMessage ?
                    this.props.noOptionsMessage :
                    <Text color={ this.props.theme === 'dark' ? 'night300' : 'night500'  } size={ this.props.size as TextSize }>No options available</Text>) }
                { rows.map(row => renderRow(row)) }
                { showPicker && renderToggler({ onClick: this.handleShowPicker, caption: this.getModalTogglerCaption(viewProps.totalCount, selectedRows.length) }, selectedRows) }
            </div>
        );
    }
}
