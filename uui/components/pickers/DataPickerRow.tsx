import * as React from 'react';
import { DataRowProps, Overwrite } from '@epam/uui-core';
import { DataPickerRow as UUIDataPickerRow } from '@epam/uui-components';
import { DataPickerCell } from './DataPickerCell';
import { PickerCellMods } from './types';
import { settings } from '../../settings';
import css from './DataPickerRow.module.scss';

export interface DataPickerRowModsOverride {
}

interface DataPickerRowMods {
    size?: '24' | '30' | '36' | '42' | '48' | '60';
    padding?: '12' | '24';
    alignActions?: 'top' | 'center';
}

export interface DataPickerRowProps<TItem, TId> extends Overwrite<DataPickerRowMods, DataPickerRowModsOverride>, DataRowProps<TItem, TId> {
    renderItem(item: TItem, rowProps: DataRowProps<TItem, TId>): React.ReactNode;
}

export class DataPickerRow<TItem, TId> extends React.Component<DataPickerRowProps<TItem, TId>> {
    renderContent = () => {
        return (
            <DataPickerCell
                key="name"
                size={ this.props.size || (settings.sizes.pickerInput.body.dropdown.row.default as PickerCellMods['size']) }
                padding={ this.props.padding || (settings.sizes.pickerInput.body.dropdown.row.cell.padding as PickerCellMods['padding']) }
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
