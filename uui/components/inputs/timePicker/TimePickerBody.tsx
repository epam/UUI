import * as React from 'react';
import { cx } from '@epam/uui-core';
import { IconContainer, NumericInput, TextInput } from '@epam/uui-components';
import { uuiDayjs } from '../../../helpers/dayJsHelper';
import type { Dayjs } from '../../../helpers/dayJsHelper';
import { TimePickerBodyProps } from './types';
import { ReactComponent as ArrowIcon } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import css from './TimePicker.module.scss';

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

export function TimePickerBody(props: TimePickerBodyProps) {
    const MIN_HOURS = props.format === FORMAT_12H ? 1 : 0;
    const MAX_HOURS = props.format || FORMAT_12H;

    const setValue = (newTime: Dayjs) => {
        props.onValueChange({ hours: newTime.hour(), minutes: newTime.minute() });
    };

    const onHoursChange = (newHours: number) => {
        setValue(uuiDayjs.dayjs().set(props.value).hour(newHours));
    };

    const onMinutesChange = (newMinutes: number) => {
        setValue(uuiDayjs.dayjs().set(props.value).minute(newMinutes));
    };

    const onTimeTypeChange = () => {
        setValue(uuiDayjs.dayjs().set(props.value).add(12, 'h'));
    };

    const handleMinutesUpClick = () => {
        const minutesStep: number = props.minutesStep || 5;
        const value: Dayjs = uuiDayjs.dayjs().set(props.value);
        const minutesToAdd: number = minutesStep - (value.minute() % minutesStep);
        onMinutesChange(value.add(minutesToAdd, 'm').minute());
    };

    const handleMinutesDownClick = () => {
        const minutesStep: number = props.minutesStep || 5;
        const value: Dayjs = uuiDayjs.dayjs().set(props.value);
        const minutesToSubtract: number = value.minute() % minutesStep === 0 ? minutesStep : value.minute() % minutesStep;
        onMinutesChange(value.subtract(minutesToSubtract, 'm').minute());
    };

    return (
        <div className={ cx(css.root, uuiTimePicker.container, props.cx) } ref={ props.forwardedRef } { ...props.rawProps }>
            <div className={ css.ltrAlways }>
                <div className={ uuiTimePicker.elementContainer }>
                    <IconContainer
                        size={ 18 }
                        rawProps={ { 'aria-label': 'Increment hours' } }
                        cx={ uuiTimePicker.iconUp }
                        icon={ ArrowIcon }
                        onClick={ () => onHoursChange(uuiDayjs.dayjs().set(props.value).add(1, 'h').hour()) }
                    />
                    <NumericInput
                        cx={ uuiTimePicker.input }
                        onValueChange={ onHoursChange }
                        value={
                            +(uuiDayjs.dayjs()
                                .set(props.value)
                                .format(MAX_HOURS === FORMAT_12H ? 'hh' : 'HH'))
                        }
                        isReadonly={ true }
                        min={ MIN_HOURS }
                        max={ MAX_HOURS }
                    />
                    <IconContainer
                        size={ 18 }
                        rawProps={ { 'aria-label': 'Decrement hours' } }
                        cx={ uuiTimePicker.iconDown }
                        icon={ ArrowIcon }
                        onClick={ () => onHoursChange(uuiDayjs.dayjs().set(props.value).subtract(1, 'h').hour()) }
                    />
                </div>
                <div className={ uuiTimePicker.elementContainer }>
                    <IconContainer
                        size={ 18 }
                        rawProps={ { 'aria-label': 'Increment minutes' } }
                        cx={ uuiTimePicker.iconUp }
                        icon={ ArrowIcon }
                        onClick={ handleMinutesUpClick }
                    />
                    <NumericInput
                        cx={ uuiTimePicker.input }
                        onValueChange={ onMinutesChange }
                        value={ +uuiDayjs.dayjs().set(props.value).format('m') }
                        isReadonly={ true }
                        min={ MIN_MINUTES }
                        max={ MAX_MINUTES }
                    />
                    <IconContainer
                        size={ 18 }
                        rawProps={ { 'aria-label': 'Decrement minutes' } }
                        cx={ uuiTimePicker.iconDown }
                        icon={ ArrowIcon }
                        onClick={ handleMinutesDownClick }
                    />
                </div>
            </div>
            { MAX_HOURS === FORMAT_12H && (
                <div className={ uuiTimePicker.elementContainer }>
                    <IconContainer
                        size={ 18 }
                        cx={ uuiTimePicker.iconUp }
                        icon={ ArrowIcon }
                        onClick={ onTimeTypeChange }
                    />
                    <TextInput
                        cx={ uuiTimePicker.input }
                        onValueChange={ () => {
                        } }
                        isReadonly={ true }
                        value={ uuiDayjs.dayjs().set(props.value).format('A') }
                    />
                    <IconContainer
                        size={ 18 }
                        cx={ uuiTimePicker.iconDown }
                        icon={ ArrowIcon }
                        onClick={ onTimeTypeChange }
                    />
                </div>
            ) }
        </div>
    );
}
