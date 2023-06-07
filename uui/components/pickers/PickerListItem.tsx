import React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { Checkbox, RadioInput } from '../inputs';
import { TextPlaceholder } from '../typography';
import css from './PickerListItem.module.scss';

export interface PickerListItemProps<TItem, TId> extends DataRowProps<TItem, TId> {
    getName(item: TItem): string;
}

export function PickerListItem<TItem, TId>(props: PickerListItemProps<TItem, TId>) {
    let label: any;

    if (props.isLoading) {
        label = <TextPlaceholder wordsCount={ 2 } />;
    } else {
        label = props.getName(props.value);
    }

    let component: any;

    if (props.checkbox) {
        component = (
            <Checkbox
                { ...props.checkbox }
                isDisabled={ props.isLoading || props.checkbox.isDisabled || props.isDisabled }
                label={ label }
                value={ props.isChecked }
                onValueChange={ () => props.onCheck(props) }
            />
        );
    } else {
        component = (
            <RadioInput
                label={ label }
                value={ props.isSelected }
                isDisabled={ props.isLoading || !props.isSelectable || props.isDisabled }
                onValueChange={ () => props.onSelect(props) }
            />
        );
    }

    return (
        <div
            className={ css.row }
            data-testid={ `uui-PickerListItem-${props.rowKey}` }
        >
            {component}
        </div>
    );
}
