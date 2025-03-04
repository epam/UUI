import * as React from 'react';
import * as types from '../types';
import { Overwrite } from '@epam/uui-core';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { PickerTogglerTag, PickerTogglerTagProps } from './PickerTogglerTag';
import { systemIcons } from '../../icons/icons';
import { settings } from '../../settings';
import css from './PickerToggler.module.scss';

const defaultMode = types.EditMode.FORM;

export interface PickerTogglerModsOverride {}

export interface PickerTogglerMods extends types.IHasEditMode {
    /**
     * Defines component size
     * @default 36
     */
    size?: '24' | '30' | '36' | '42' | '48';
}

function applyPickerTogglerMods(mods: PickerTogglerMods) {
    return [
        css.root,
        'uui-picker_toggler',
        `uui-size-${mods.size || settings.sizes.pickerInput.toggler.defaults.size}`,
        css['mode-' + (mods.mode || defaultMode)],
    ];
}

function PickerTogglerComponent<TItem extends string, TId>(
    props: PickerTogglerProps<TItem, TId> & Overwrite<PickerTogglerMods, PickerTogglerModsOverride>,
    ref: React.ForwardedRef<HTMLElement>,
): JSX.Element {
    const renderItem = (itemProps: PickerTogglerTagProps<TItem, TId>) => {
        const itemPropsWithSize = { ...itemProps, size: (props.size || settings.sizes.pickerInput.toggler.defaults.tag) as PickerTogglerMods['size'] };
        if (!!props.renderItem) {
            return props.renderItem(itemPropsWithSize);
        }

        return (
            <PickerTogglerTag
                { ...itemPropsWithSize }
                getName={ props.getName }
            />
        );
    };

    return (
        <UuiPickerToggler
            { ...props }
            ref={ ref }
            cx={ [applyPickerTogglerMods(props), props.cx] }
            renderItem={ renderItem }
            getName={ props.getName }
            cancelIcon={ systemIcons.clear }
            dropdownIcon={ systemIcons.foldingArrow }
        />
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as
    <TItem, TId>(props: PickerTogglerProps<TItem, TId> & { ref?: React.ForwardedRef<HTMLElement> }) => ReturnType<typeof PickerTogglerComponent>;
