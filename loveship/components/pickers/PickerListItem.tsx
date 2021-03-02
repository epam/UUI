import React from 'react';
import { DataRowProps } from '@epam/uui';
import { RadioInput, Checkbox } from '../inputs';
import { TextPlaceholder } from '../typography';
import * as css from './PickerListItem.scss';
import { Theme } from '../types';

export interface PickerListItemProps<TItem, TId> extends DataRowProps<TItem, TId> {
    getName(item: TItem): string;
    theme?: Theme;
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
            component = <Checkbox
                { ...this.props.checkbox }
                isDisabled={ this.props.isLoading || this.props.checkbox.isDisabled }
                label={ label }
                value={ this.props.isChecked }
                onValueChange={ () => this.props.onCheck(this.props) }
                theme={ this.props.theme }
            />;
        } else {
            component = <RadioInput
                label={ label }
                value={ this.props.isSelected }
                isDisabled={ this.props.isLoading || !this.props.isSelectable }
                onValueChange={ () => this.props.onSelect(this.props) }
                theme={ this.props.theme }
            />;
        }

        return <div className={ css.row }>{ component }</div>;
    }
}