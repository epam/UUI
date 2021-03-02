import React from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Icon } from '@epam/uui';
import { NumericInput } from './NumericInput';
import { TextInput } from './TextInput';
import { IconContainer } from '../layout/IconContainer';
import { IHasCX, IEditable, TimePickerValue } from '@epam/uui';

export const uuiTimePicker = {
    container: 'uui-timepicker-container',
    iconUp: 'uui-timepicker-icon-up',
    iconDown: 'uui-timepicker-icon-down',
    input: 'uui-timepicker-input',
    elementContainer: 'uui-timepicker-item',
};

const MIN_MINUTES: number = 0;
const MAX_MINUTES: number = 59;
const FORMAT_12H: number = 12;

export interface TimePickerBodyProps extends IHasCX, IEditable<TimePickerValue> {
    minutesStep?: number;
    addIcon?: Icon;
    subtractIcon?: Icon;
    format?: 12 | 24;
}

export class TimePickerBody extends React.Component<TimePickerBodyProps, TimePickerValue> {
    setValue = (newTime: moment.Moment) => {
        this.props.onValueChange({ hours: newTime.hours(), minutes: newTime.minutes() });
    }

    onHoursChange = (newHours: number) => {
        this.setValue(moment(this.props.value).hours(newHours));
    }

    onMinutesChange = (newMinutes: number) => {
        this.setValue(moment(this.props.value).minutes(newMinutes));
    }

    onTimeTypeChange = () => {
        this.setValue(moment(this.props.value).add(12, 'hours'));
    }

    render() {
        const minutesStep = this.props.minutesStep || 5;
        const MIN_HOURS = this.props.format === FORMAT_12H ? 1 : 0;
        const MAX_HOURS = this.props.format || FORMAT_12H;

        return (
            <div className={ cx(uuiTimePicker.container, this.props.cx) }>
                <div className={ uuiTimePicker.elementContainer }>
                    <IconContainer
                        cx={ uuiTimePicker.iconUp }
                        icon={ this.props.addIcon }
                        onClick={ () => this.onHoursChange(moment(this.props.value).add(1, 'h').hours()) }
                    />
                    <NumericInput
                        cx={ uuiTimePicker.input }
                        onValueChange={ this.onHoursChange }
                        value={ +moment(this.props.value).format(MAX_HOURS === FORMAT_12H ? 'hh' : 'HH') }
                        min={ MIN_HOURS }
                        max={ MAX_HOURS }
                    />
                    <IconContainer
                        cx={ uuiTimePicker.iconDown }
                        icon={ this.props.subtractIcon }
                        onClick={ () => this.onHoursChange(moment(this.props.value).subtract(1, 'h').hours()) }
                    />
                </div>
                <div className={ uuiTimePicker.elementContainer }>
                    <IconContainer
                        cx={ uuiTimePicker.iconUp }
                        icon={ this.props.addIcon }
                        onClick={ () => this.onMinutesChange(moment(this.props.value).add(minutesStep, 'm').minutes()) }
                    />
                    <NumericInput
                        cx={ uuiTimePicker.input }
                        onValueChange={ this.onMinutesChange }
                        value={ +moment(this.props.value).format('m') }
                        min={ MIN_MINUTES }
                        max={ MAX_MINUTES }
                    />
                    <IconContainer
                        cx={ uuiTimePicker.iconDown }
                        icon={ this.props.subtractIcon }
                        onClick={ () => this.onMinutesChange(moment(this.props.value).subtract(minutesStep, 'm').minutes()) }
                    />
                </div>
                { MAX_HOURS === FORMAT_12H && (
                    <div className={ uuiTimePicker.elementContainer }>
                        <IconContainer
                            cx={ uuiTimePicker.iconUp }
                            icon={ this.props.addIcon }
                            onClick={ this.onTimeTypeChange }
                        />
                        <TextInput
                            cx={ uuiTimePicker.input }
                            onValueChange={ () => {} }
                            isReadonly={ true }
                            value={ moment(this.props.value).format('A') }
                        />
                        <IconContainer
                            cx={ uuiTimePicker.iconDown }
                            icon={ this.props.subtractIcon }
                            onClick={ this.onTimeTypeChange }
                        />
                    </div>
                ) }
            </div>
        );
    }
}
