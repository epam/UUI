import * as React from 'react';
import * as types from '../types';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { DataRowProps } from '@epam/uui-core';
import { PickerTogglerTag, PickerTogglerTagProps } from './PickerTogglerTag';
import css from './PickerToggler.module.scss';
import { systemIcons } from '../../icons/icons';

const defaultSize = '36';
const defaultMode = types.EditMode.FORM;

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
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || defaultMode)],
    ];
}

function PickerTogglerComponent<TItem extends string, TId>(props: PickerTogglerProps<TItem, TId> & PickerTogglerMods, ref: React.ForwardedRef<HTMLElement>) {
    const renderItem = (itemProps: DataRowProps<TItem, TId> & PickerTogglerTagProps) => (
        <PickerTogglerTag
            { ...itemProps }
            key={ itemProps.id as string }
            size={ props.size }
            collapsedNames={ props.collapsedNames?.join(', ') }
            isDisabled={ props.isDisabled || props.isReadonly || itemProps.isDisabled }
        />
    );

    return (
        <UuiPickerToggler
            { ...props }
            ref={ ref }
            cx={ [applyPickerTogglerMods(props), props.cx] }
            renderItem={ !!props.renderItem ? props.renderItem : renderItem }
            getName={ (item) => (props.getName ? props.getName(item) : item) }
            cancelIcon={ systemIcons.clear }
            dropdownIcon={ systemIcons.foldingArrow }
        />
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(
    props: PickerTogglerProps<TItem, TId> & PickerTogglerMods,
    ref: React.ForwardedRef<HTMLElement>
) => JSX.Element;
