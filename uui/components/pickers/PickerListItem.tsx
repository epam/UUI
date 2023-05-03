import React from 'react';
import { DataRowProps } from '@epam/uui-core';
import { Checkbox, RadioInput } from '../inputs';
import { TextPlaceholder } from '../typography';
import css from './PickerListItem.scss';

export interface PickerListItemProps<TItem, TId> extends DataRowProps<TItem, TId> {
    getName(item: TItem): string;
}

export class PickerListItem<TItem, TId> extends React.Component<PickerListItemProps<TItem, TId>> {
    render() {
        let label: any;

        if (this.props.isLoading) {
            label = <TextPlaceholder wordsCount={ 2 } />;
        } else {
            label = this.props.getName(this.props.value);
        }

        let component: any;

        if (this.props.checkbox) {
            component = (
                <Checkbox
                    { ...this.props.checkbox }
                    isDisabled={ this.props.isLoading || this.props.checkbox.isDisabled || this.props.isDisabled }
                    label={ label }
                    value={ this.props.isChecked }
                    onValueChange={ () => this.props.onCheck(this.props) }
                />
            );
        } else {
            component = (
                <RadioInput
                    label={ label }
                    value={ this.props.isSelected }
                    isDisabled={ this.props.isLoading || !this.props.isSelectable || this.props.isDisabled }
                    onValueChange={ () => this.props.onSelect(this.props) }
                />
            );
        }

        return <div className={ css.row }>{component}</div>;
    }
}
