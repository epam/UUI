import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport.js';
import {
    Icon, cx, IHasCX, IEditable, TimePickerValue, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import { NumericInput } from './NumericInput';
import { TextInput } from './TextInput';
import { IconContainer } from '../layout/IconContainer';

dayjs.extend(objectSupport);

export const uuiTimePicker = {
    container: 'uui-timepicker-container',
    iconUp: 'uui-timepicker-icon-up',
    iconDown: 'uui-timepicker-icon-down',
    input: 'uui-timepicker-input',
    elementContainer: 'uui-timepicker-item',
} as const;

const MIN_MINUTES: number = 0;
const MAX_MINUTES: number = 59;
const FORMAT_12H: number = 12;

export interface TimePickerBodyProps extends IHasCX, IEditable<TimePickerValue>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    minutesStep?: number;
    addIcon?: Icon;
    subtractIcon?: Icon;
    format?: 12 | 24;
}

export class TimePickerBody extends React.Component<TimePickerBodyProps, TimePickerValue> {
    setValue = (newTime: Dayjs) => {
        this.props.onValueChange({ hours: newTime.hour(), minutes: newTime.minute() });
    };

    onHoursChange = (newHours: number) => {
        const MAX_HOURS = this.props.format || FORMAT_12H;
        if (newHours > MAX_HOURS) newHours = MAX_HOURS;
        this.setValue(dayjs().set(this.props.value).hour(newHours));
    };

    onMinutesChange = (newMinutes: number) => {
        if (newMinutes > MAX_MINUTES) newMinutes = MAX_MINUTES;
        this.setValue(dayjs().set(this.props.value).minute(newMinutes));
    };

    onTimeTypeChange = () => {
        this.setValue(dayjs().set(this.props.value).add(12, 'h'));
    };

    handleMinutesUpClick = () => {
        const minutesStep: number = this.props.minutesStep || 5;
        const value: Dayjs = dayjs().set(this.props.value);
        const minutesToAdd: number = minutesStep - (value.minute() % minutesStep);
        this.onMinutesChange(value.add(minutesToAdd, 'm').minute());
    };

    handleMinutesDownClick = () => {
        const minutesStep: number = this.props.minutesStep || 5;
        const value: Dayjs = dayjs().set(this.props.value);
        const minutesToSubtract: number = value.minute() % minutesStep === 0 ? minutesStep : value.minute() % minutesStep;
        this.onMinutesChange(value.subtract(minutesToSubtract, 'm').minute());
    };

    render() {
        const MIN_HOURS = this.props.format === FORMAT_12H ? 1 : 0;
        const MAX_HOURS = this.props.format || FORMAT_12H;

        return (
            <div className={ cx(uuiTimePicker.container, this.props.cx) } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                <div className={ uuiTimePicker.elementContainer }>
                    <IconContainer
                        cx={ uuiTimePicker.iconUp }
                        icon={ this.props.addIcon }
                        onClick={ () => this.onHoursChange(dayjs().set(this.props.value).add(1, 'h').hour()) }
                    />
                    <NumericInput
                        cx={ uuiTimePicker.input }
                        onValueChange={ this.onHoursChange }
                        value={
                            +dayjs()
                                .set(this.props.value)
                                .format(MAX_HOURS === FORMAT_12H ? 'hh' : 'HH')
                        }
                        min={ MIN_HOURS }
                        max={ MAX_HOURS }
                    />
                    <IconContainer
                        cx={ uuiTimePicker.iconDown }
                        icon={ this.props.subtractIcon }
                        onClick={ () => this.onHoursChange(dayjs().set(this.props.value).subtract(1, 'h').hour()) }
                    />
                </div>
                <div className={ uuiTimePicker.elementContainer }>
                    <IconContainer
                        cx={ uuiTimePicker.iconUp }
                        icon={ this.props.addIcon }
                        onClick={ this.handleMinutesUpClick }
                    />
                    <NumericInput
                        cx={ uuiTimePicker.input }
                        onValueChange={ this.onMinutesChange }
                        value={ +dayjs().set(this.props.value).format('m') }
                        min={ MIN_MINUTES }
                        max={ MAX_MINUTES }
                    />
                    <IconContainer
                        cx={ uuiTimePicker.iconDown }
                        icon={ this.props.subtractIcon }
                        onClick={ this.handleMinutesDownClick }
                    />
                </div>
                {MAX_HOURS === FORMAT_12H && (
                    <div className={ uuiTimePicker.elementContainer }>
                        <IconContainer cx={ uuiTimePicker.iconUp } icon={ this.props.addIcon } onClick={ this.onTimeTypeChange } />
                        <TextInput cx={ uuiTimePicker.input } onValueChange={ () => {} } isReadonly={ true } value={ dayjs().set(this.props.value).format('A') } />
                        <IconContainer cx={ uuiTimePicker.iconDown } icon={ this.props.subtractIcon } onClick={ this.onTimeTypeChange } />
                    </div>
                )}
            </div>
        );
    }
}
