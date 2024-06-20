import * as React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { DataPickerRow as UUIDataPickerRow } from '@epam/uui-components';
import { DataPickerCell } from './DataPickerCell';
import { PickerCellMods } from './types';
import { settings } from '../../settings';
import css from './DataPickerRow.module.scss';

export interface DataPickerRowProps<TItem, TId> extends DataRowProps<TItem, TId> {
    renderItem(item: TItem, rowProps: DataRowProps<TItem, TId>): React.ReactNode;
    padding?: '12' | '24';
    size?: '24' | '30' | '36' | '42' | '48' | '60';
    alignActions?: 'top' | 'center';
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {
    renderContent = () => {
        return (
            <DataPickerCell
                key="name"
                size={ this.props.size || (settings.sizes.dataPickerRow.dataPickerCell.default as PickerCellMods['size']) }
                padding={ this.props.padding || (settings.sizes.dataPickerRow.padding.default as PickerCellMods['padding']) }
                rowProps={ this.props }
                alignActions={ this.props.alignActions || 'top' }
                renderItem={ this.props.renderItem }
            />
        );
    };

    render() {
        return (
            <UUIDataPickerRow
                { ...this.props }
                cx={ [css.pickerRow, this.props.cx] }
                renderContent={ this.renderContent }
            />
        );
    }
}
