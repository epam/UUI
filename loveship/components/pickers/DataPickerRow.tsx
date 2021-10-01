import React from 'react';
import { DataRowProps, DataColumnProps } from '@epam/uui';
import { DataPickerRow as UUIDataPickerRow } from '@epam/uui-components';
import { DataTableRowMods } from '../tables';
import { IconButton } from '../buttons';
import { FlexSpacer } from '../layout';
import { DataTableCell } from '../tables';
import * as tickIcon from '../icons/notification-done-18.svg';
import * as smallSizeIcon from '../icons/notification-done-12.svg';
import * as css from './DataPickerRow.scss';

export interface DataPickerRowProps<TItem, TId> extends DataRowProps<TItem, TId>, DataTableRowMods {
    renderItem(item: TItem, rowProps: DataRowProps<TItem, TId>): React.ReactNode;
    alignActions?: 'top' | 'center';
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {
    column: DataColumnProps<TItem> =
        {
            key: 'name',
            grow: 1,
            render: (item, rowProps) => <div key={ rowProps.id } className={ css.renderItem }>
                { this.props.renderItem(item, rowProps) }
                <FlexSpacer />
                { (rowProps.isChildrenSelected || rowProps.isSelected) && <div className={ css.iconWrapper }>
                    <IconButton icon={ this.props.size === '24' ? smallSizeIcon : tickIcon } color={ rowProps.isChildrenSelected ? 'night400' : 'sky' } />
                </div> }
            </div>,
        };

    renderContent = () => {
        return <DataTableCell
            key='name'
            size={ this.props.size || '36' }
            padding={ this.props.padding || '12' }
            isFirstColumn={ true }
            isLastColumn={ false }
            column={ this.column }
            rowProps={ this.props }
            alignActions={ this.props.alignActions || 'top' }
        />;
    }

    render() {
        return <UUIDataPickerRow
            { ...this.props }
            cx={ [css.pickerRow, this.props.cx] }
            renderContent={ this.renderContent }
        />;
    }
}
