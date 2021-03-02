import * as React from 'react';
import * as types from '../types';
import * as css from './PickerToggler.scss';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui';
import { TextPlaceholder } from '../typography';
import { systemIcons } from '../../icons/icons';
import { Tag } from '../widgets';

const defaultSize = '36';

export interface PickerTogglerMods {
    size?: '24' | '30' | '36' | '42' | '48';
}

function applyPickerTogglerMods(mods: PickerTogglerMods) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
    ];
}

export class PickerToggler extends React.Component<PickerTogglerProps<any> & PickerTogglerMods, {}> {
    getPickerTogglerButtonSize = (propSize: types.ControlSize) => {
        switch (propSize) {
            case '48':
                return '42';
            case '42':
                return '36';
            case '36':
                return '30';
            case '30':
                return '24';
            case '24':
                return '18';
        }
    }

    renderItem = (row: DataRowProps<any, any>) => {
        let caption;
        let maxItems = (this.props.maxItems || this.props.maxItems === 0) ? this.props.maxItems : 100;

        if (!row.isLoading) {
            if (!this.props.getName || this.props.selection && this.props.selection.length > maxItems) {
                caption = row.value;
            } else {
                caption = this.props.getName(row.value);
            }
        } else {
            caption = <TextPlaceholder/>;
        }

        return <Tag
                key={ row.id }
                caption={ caption }
                size={ this.props.size ? this.getPickerTogglerButtonSize(this.props.size) : '30' }
                onClear={ e => {
                    row.onCheck && row.onCheck(row);
                    e.stopPropagation();
                } }
                tabIndex={ undefined }
            />;
    }

    handleClear = () => {
        this.props.onClear && this.props.onClear();
        this.props.onValueChange && this.props.onValueChange('');
    }

    render() {
        return (
            <UuiPickerToggler
                { ...this.props }
                cx={ [applyPickerTogglerMods(this.props), this.props.cx] }
                renderItem={ !!this.props.renderItem ? this.props.renderItem : this.renderItem }
                getName={ (row) => this.props.getName ? this.props.getName(row.value) : row.value }
                cancelIcon={ systemIcons[this.props.size || defaultSize].clear }
                dropdownIcon={ systemIcons[this.props.size || defaultSize].foldingArrow }
                onClear={ this.props.onClear ? this.handleClear : undefined }
            />
        );
    }
}
