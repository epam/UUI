import React from 'react';
import * as types from '../types';
import * as css from './PickerToggler.scss';
import * as colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui';
import { TextPlaceholder } from '../typography';
import { systemIcons } from '../icons/icons';
import { Tag, TagSize } from '../widgets';

const defaultSize = '36';

const mapSize = {
    '48': '36',
    '36': '30',
    '30' : '24',
    '24': '18',
    'none': 'none',
};

export interface PickerInputMods extends types.EditMode {
    size?: types.ControlSize;
}

function applyPickerTogglerMods(mods: PickerInputMods) {
    return [
        colorStyle.colorSky,
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || 'form')],
    ];
}

export class PickerToggler extends React.Component<PickerTogglerProps<any, any> & PickerInputMods, {}> {

    renderItem = (row: DataRowProps<any, any>) => {
        const tagSize = mapSize[this.props.size] as TagSize;
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
            key={ row.rowKey }
            caption={ caption }
            color="night300"
            size={ this.props.size ? tagSize : '30' }
            onClear={ e => {
                row.onCheck && row.onCheck(row);
                e.stopPropagation();
            } }
            tabIndex={ null }
        />;
    }

    handleClear = () => {
        this.props.onClear();
        this.props.onValueChange('');
    }

    render() {
        return (
            <UuiPickerToggler
                { ...this.props }
                isDropdown={ this.props.isDropdown && !this.props.minCharsToSearch }
                cx={ [applyPickerTogglerMods(this.props), this.props.cx] }
                renderItem={ !!this.props.renderItem ? this.props.renderItem : this.renderItem }
                getName={ (row) => this.props.getName ? this.props.getName(row.value) : row.value }
                cancelIcon={ systemIcons[this.props.size || defaultSize].clear }
                dropdownIcon={ systemIcons[this.props.size || defaultSize].foldingArrow }
                onClear={ this.props.onClear ? this.handleClear : null }
            />
        );
    }
}
