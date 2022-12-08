import * as React from 'react';
import * as types from '../types';
import colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui-core';
import { TextPlaceholder } from '../typography';
import { systemIcons } from '../icons/icons';
import { Tag, TagSize } from '../widgets';
import css from './PickerToggler.scss';

const defaultSize = '36';
const defaultMode = 'form';

const mapSize = {
    '48': '42',
    '42': '36',
    '36': '30',
    '30': '24',
    '24': '18',
    'none': 'none',
} as const;

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

function PickerTogglerComponent<TItem extends string, TId>(props: PickerTogglerProps<TItem, TId> & PickerTogglerMods, ref: React.ForwardedRef<HTMLElement>) {
    const getCaption = (row: DataRowProps<TItem, TId>) => {
        const maxItems = (props.maxItems || props.maxItems === 0) ? props.maxItems : 100;

        if (row.isLoading) {
            return <TextPlaceholder />;
        } else if (!props.getName || props.selection?.length > maxItems) {
            return row.value;
        } else {
            return props.getName(row.value);
        }
    };

    const renderItem = (row: DataRowProps<TItem, TId>) => {
        const tagSize = mapSize[props.size] as TagSize;

        return (
            <Tag
                key={ row.rowKey }
                caption={ getCaption(row) }
                color="night300"
                tabIndex={ -1 }
                size={ props.size ? tagSize : '30' }
                onClear={ e => {
                    row.onCheck?.(row);
                    e.stopPropagation();
                } }
                isDisabled={ props.isDisabled || props.isReadonly || row?.checkbox?.isDisabled }
            />
        );
    };

    return (
        <UuiPickerToggler
            { ...props }
            ref={ ref }
            isDropdown={ props.isDropdown && !props.minCharsToSearch }
            cx={ [applyPickerTogglerMods(props), props.cx] }
            renderItem={ !!props.renderItem ? props.renderItem : renderItem }
            getName={ (item) => props.getName ? props.getName(item) : item }
            cancelIcon={ systemIcons[props.size || defaultSize].clear }
            dropdownIcon={ systemIcons[props.size || defaultSize].foldingArrow }
        />
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(props: PickerTogglerProps<TItem, TId>, ref: React.ForwardedRef<HTMLElement>) => JSX.Element;
