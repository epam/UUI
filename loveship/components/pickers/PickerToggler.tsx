import React from 'react';
import * as types from '../types';
import * as colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui';
import { TextPlaceholder } from '../typography';
import { systemIcons } from '../icons/icons';
import { Tag, TagSize } from '../widgets';
import * as css from './PickerToggler.scss';

const defaultSize = '36';
const defaultMode = 'form';

const mapSize = {
    '48': '42',
    '42': '36',
    '36': '30',
    '30': '24',
    '24': '18',
    'none': 'none',
};

export interface PickerTogglerMods extends types.EditMode {
    size?: types.ControlSize;
}

function applyPickerTogglerMods(mods: PickerTogglerMods) {
    return [
        colorStyle.colorSky,
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || defaultMode)],
    ];
}

export class PickerToggler extends React.Component<PickerTogglerProps<any, any> & PickerTogglerMods, {}> {

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
            tabIndex={ -1 }
            size={ this.props.size ? tagSize : '30' }
            onClear={ e => {
                row.onCheck && row.onCheck(row);
                e.stopPropagation();
            } }
        />;
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
            />
        );
    }
}
