import * as React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { TextPlaceholder } from '../typography';
import { getIcon } from '../../icons';
import { Tag } from '../widgets';
import * as types from '../types';
import '../../assets/styles/variables/pickers/pickerToggler.scss';
import * as css from './PickerToggler.scss';

const defaultMode = types.EditMode.FORM;

export interface PickerTogglerMods extends types.IHasEditMode {
    size?: string;
}

function applyPickerTogglerMods(mods: PickerTogglerMods) {
    return [
        'picker-toggler-vars',
        css.root,
        css['size-' + (mods.size)],
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

    const renderItem = (row: DataRowProps<any, any>) => (
        <Tag
            key={ row.id }
            caption={ getCaption(row) }
            tabIndex={ -1 }
            size={ props.size }
            onClear={ e => {
                row.onCheck && row.onCheck(row);
                e.stopPropagation();
            } }
            isDisabled={ props.isDisabled || props.isReadonly || row?.checkbox?.isDisabled }
        />
    );

    return (
        <UuiPickerToggler
            { ...props }
            ref={ ref }
            cx={ [applyPickerTogglerMods(props), props.cx] }
            renderItem={ !!props.renderItem ? props.renderItem : renderItem }
            getName={ (item) => props.getName ? props.getName(item) : item }
            cancelIcon={ getIcon('clear') }
            dropdownIcon={ getIcon('foldingArrow') }
        />
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(props: PickerTogglerProps<TItem, TId> & PickerTogglerMods, ref: React.ForwardedRef<HTMLElement>) => JSX.Element;