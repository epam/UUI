import * as React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { PickerToggler as UuiPickerToggler, PickerTogglerProps } from '@epam/uui-components';
import { TextPlaceholder } from '../typography';
import { systemIcons } from '../../icons/icons';
import { Tag } from '../widgets';
import * as types from '../types';
import css from './PickerToggler.scss';

const defaultSize = '36';
const defaultMode = types.EditMode.FORM;

export interface PickerTogglerMods extends types.IHasEditMode {
    size?: '24' | '30' | '36' | '42' | '48';
}

function applyPickerTogglerMods(mods: PickerTogglerMods) {
    return [css.root, css['size-' + (mods.size || defaultSize)], css['mode-' + (mods.mode || defaultMode)]];
}

function PickerTogglerComponent<TItem extends string, TId>(props: PickerTogglerProps<TItem, TId> & PickerTogglerMods, ref: React.ForwardedRef<HTMLElement>) {
    const getPickerTogglerButtonSize = (propSize: types.ControlSize) => {
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
    };

    const getCaption = (row: DataRowProps<TItem, TId>) => {
        const maxItems = props.maxItems || props.maxItems === 0 ? props.maxItems : 100;

        if (row.isLoading) {
            return <TextPlaceholder />;
        } else if (!props.getName || props.selectedRowsCount > maxItems) {
            return row.value;
        } else {
            return props.getName(row.value);
        }
    };

    const renderItem = (row: DataRowProps<TItem, TId>) => (
        <Tag
            key={row.rowKey}
            caption={getCaption(row)}
            tabIndex={-1}
            size={props.size ? getPickerTogglerButtonSize(props.size) : '30'}
            onClear={(e) => {
                row.onCheck?.(row);
                e.stopPropagation();
            }}
            isDisabled={props.isDisabled || props.isReadonly || row?.checkbox?.isDisabled}
        />
    );

    return (
        <UuiPickerToggler
            {...props}
            ref={ref}
            cx={[applyPickerTogglerMods(props), props.cx]}
            renderItem={!!props.renderItem ? props.renderItem : renderItem}
            getName={(item) => (props.getName ? props.getName(item) : item)}
            cancelIcon={systemIcons[props.size || defaultSize].clear}
            dropdownIcon={systemIcons[props.size || defaultSize].foldingArrow}
        />
    );
}

export const PickerToggler = React.forwardRef(PickerTogglerComponent) as <TItem, TId>(
    props: PickerTogglerProps<TItem, TId> & PickerTogglerMods,
    ref: React.ForwardedRef<HTMLElement>
) => JSX.Element;
