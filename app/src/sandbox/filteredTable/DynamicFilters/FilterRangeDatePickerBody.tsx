import * as React from 'react';
import { BaseRangeDatePickerProps, RangeDatePickerInputType } from "@epam/uui-core";
import { RangeDatePickerValue, BaseRangeDatePicker, PickerBodyValue } from '@epam/uui-components';
import { DropdownContainer, FlexRow, RangeDatePickerBody } from '@epam/promo';

export interface RangeDatePickerProps extends BaseRangeDatePickerProps {}

const defaultValue: RangeDatePickerValue = { from: null, to: null };

export class FilterRangeDatePickerBody extends BaseRangeDatePicker<RangeDatePickerProps> {
    state = {
        ...super.getInitialState(),
        inFocus: 'from' as RangeDatePickerInputType,
    };

    onRangeChange = (value: PickerBodyValue<RangeDatePickerValue>) => {
        if (this.state.inFocus === 'from') {
            this.setState({ inFocus: 'to' }, () => this.setValue(value));
        } else {
            this.setState({ inFocus: 'from' }, () => this.setValue(value));
        }
    }

    toggleOpening = () => {
        return ;
    }

    renderBody() {
        return (
            <DropdownContainer>
                <FlexRow>
                    <RangeDatePickerBody
                        value={ this.getValue() }
                        onValueChange={ this.onRangeChange }
                        filter={ this.props.filter }
                        changeIsOpen={ this.toggleOpening }
                        presets={ this.props.presets }
                        focusPart={ this.state.inFocus }
                        renderDay={ this.props.renderDay }
                        renderFooter={ this.props.renderFooter && (() => this.props.renderFooter(this.props.value || defaultValue)) }
                        isHoliday={ this.props.isHoliday }
                    />
                </FlexRow>
            </DropdownContainer>
        );
    }

    renderInput = (): any => {
        return null;
    }

    render() {
        return this.renderBody();
    }
}