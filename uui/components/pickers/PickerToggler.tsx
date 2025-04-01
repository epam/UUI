import * as React from 'react';
import { Overwrite } from '@epam/uui-core';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps as UuiPickerTogglerProps } from '@epam/uui-components';
import { PickerTogglerTag, PickerTogglerTagProps } from './PickerTogglerTag';
import type { IHasEditMode } from '../types';
import { EditMode } from '../types';
import { settings } from '../../settings';

import css from './PickerToggler.module.scss';

const defaultMode = EditMode.FORM;

export interface PickerTogglerModsOverride {}

export interface PickerTogglerMods extends IHasEditMode {
    /**
     * Defines component size
     * @default 36
     */
    size?: '24' | '30' | '36' | '42' | '48';
}

export type PickerTogglerProps<TItem, TId> = UuiPickerTogglerProps<TItem, TId> & Overwrite<PickerTogglerMods, PickerTogglerModsOverride>;

function applyPickerTogglerMods(mods: PickerTogglerMods) {
    return [
        css.root,
        'uui-picker_toggler',
        `uui-size-${mods.size || settings.pickerInput.sizes.toggler.default}`,
        'uui-control-mode-' + (mods.mode || defaultMode),
    ];
}

function PickerTogglerComponent<TItem, TId>(
    props: PickerTogglerProps<TItem, TId>,
    ref: React.ForwardedRef<HTMLElement>,
): JSX.Element {
    const renderItem = (itemProps: PickerTogglerTagProps<TItem, TId>) => {
        const itemPropsWithSize = { ...itemProps, size: props.size || settings.pickerInput.sizes.toggler.tag };
        if (!!props.renderItem) {
            return props.renderItem(itemPropsWithSize);
        }

        return (
            <PickerTogglerTag
                { ...itemPropsWithSize }
                key={ itemProps.rowProps?.id as string }
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
            cancelIcon={ settings.pickerInput.icons.toggler.clearIcon }
            dropdownIcon={ settings.pickerInput.icons.toggler.dropdownIcon }
        />
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as
    <TItem, TId>(props: PickerTogglerProps<TItem, TId> & { ref?: React.ForwardedRef<HTMLElement> }) => ReturnType<typeof PickerTogglerComponent>;
