import * as React from 'react';
import dayjs from 'dayjs';
import {
    DropdownBodyProps, isFocusReceiverInsideFocusLock, IEditable, IDisableable, ICanBeReadonly, IHasPlaceholder,
    IDropdownToggler, IHasRawProps, CX, IHasForwardedRef, ICanFocus,
} from '@epam/uui-core';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { Dropdown } from '../overlays';

dayjs.extend(customParseFormat);

export interface TimePickerValue {
    /** Selected hours value */
    hours: number;
    /** Selected minutes value */
    minutes: number;
}

export interface BaseTimePickerProps extends IEditable<TimePickerValue | null>,
    IDisableable,
    ICanBeReadonly,
    IHasPlaceholder,
    ICanFocus<HTMLElement>,
    IHasForwardedRef<HTMLElement> {
    /** Minutes input increase/decrease step on up/down icons clicks and up/down arrow keys
     * @default 5
     */
    minutesStep?: number;
    /**
     * Time format, 12 hours with AM/PM or 24 hours
     * @default 12
     */
    format?: 12 | 24;
    /** ID to put on time picker toggler 'input' node */
    id?: string;
    /** Render callback for time picker toggler.
     * If omitted, default TextInput component will be rendered.
     */
    renderTarget?(props: IDropdownToggler): React.ReactNode;
    /** HTML attributes to put directly to TimePicker parts */
    rawProps?: {
        /** HTML attributes to put directly to the input element */
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /** HTML attributes to put directly to the body root element */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
    /** CSS class(es) to put on input-part component. See https://github.com/JedWatson/classnames#usage for details */
    inputCx?: CX;
    /** CSS class(es) to put on body-part component. See https://github.com/JedWatson/classnames#usage for details */
    bodyCx?: CX;
}

interface TimePickerState {
    isOpen: boolean;
    value: string | null;
    result: string | null;
}

const valueToTimeString = (value: TimePickerValue, format: BaseTimePickerProps['format']) => {
    if (value === null) return null;
    return dayjs()
        .set(value)
        .format(format === 24 ? 'HH:mm' : 'hh:mm A');
};

export abstract class BaseTimePicker<TProps extends BaseTimePickerProps> extends React.Component<TProps, TimePickerState> {
    state = {
        isOpen: false,
        value: valueToTimeString(this.props.value, this.props.format),
        result: valueToTimeString(this.props.value, this.props.format),
    };

    abstract renderInput: (props: IDropdownToggler) => React.ReactNode;
    abstract renderBody: (props: DropdownBodyProps) => React.ReactNode;

    componentDidUpdate(prevProps: BaseTimePickerProps) {
        if (this.props.value !== prevProps.value || this.props.format !== prevProps.format) {
            this.setState((state) =>
                ({ ...state,
                    value: valueToTimeString(this.props.value, this.props.format),
                    result: valueToTimeString(this.props.value, this.props.format),
                }));
        }
    }

    getFormat = () => {
        return this.props.format === 24 ? 'HH:mm' : 'hh:mm A';
    };

    onClear = () => {
        this.props.onValueChange(null);
        this.setState((state) => ({ ...state, result: '' }));
    };

    onToggle = (value: boolean) => {
        this.setState((state) => ({ ...state, isOpen: value }));
    };

    setTimeValue = (value: string) => {
        this.setState((state) => ({ ...state, value: value }));
    };

    setTimeResult = () => {
        const value = dayjs(this.state.result, this.getFormat(), true);
        this.props.onValueChange({ hours: value.hour(), minutes: value.minute() });
        this.setTimeValue(this.state.result);
    };

    checkTimeFormat = (newValue: string) => {
        return dayjs(newValue, this.getFormat(), true).isValid();
    };

    parseTimeNumbers = (timeNumbers: string, separator: number) => {
        let hours: number, minutes: number;

        switch (separator) {
            case 0:
                hours = 0;
                minutes = parseInt(timeNumbers.trim().slice(0, 2));
                break;
            case 1:
                hours = parseInt(timeNumbers.slice(0, 1));
                minutes = parseInt(timeNumbers.slice(1, 3));
                break;
            default:
                hours = parseInt(timeNumbers.slice(0, 2));
                minutes = parseInt(timeNumbers.slice(2, 4));
        }
        return { hours, minutes };
    };

    formatTime = (hours: number, minutes: number, meridian: 'AM' | 'PM' | false) => {
        const hoursToString = Number.isNaN(hours) ? '00' : hours.toString().padStart(2, '0');
        const minutesToString = Number.isNaN(minutes) ? '00' : minutes.toString().padStart(2, '0');

        let result = `${hoursToString}:${minutesToString}`;

        if (result === '00:00') {
            return '';
        }

        if (meridian) {
            result = result.concat(` ${meridian}`);
        }
        return result;
    };

    getMeridian = (newValue: string) => {
        let meridian: false | 'AM' | 'PM';
        const format = this.getFormat();

        if (format === 'hh:mm A') {
            meridian = newValue.toLowerCase().includes('pm') ? 'PM' : 'AM';
        } else {
            meridian = false;
        }
        return meridian;
    };

    handleInputChange = (newValue: string) => {
        const trimmedNewValue = newValue.trimStart();

        if (trimmedNewValue.length <= 8) {
            const separator = trimmedNewValue.search(/\D/);
            const meridian = this.getMeridian(trimmedNewValue);

            const timeNumbers = trimmedNewValue.replace(/\D/gi, '');

            if (timeNumbers.length >= 0 && timeNumbers.length <= 4) {
                const { hours, minutes } = this.parseTimeNumbers(timeNumbers, separator);
                const result = this.formatTime(hours, minutes, meridian);
                this.setTimeValue(trimmedNewValue);

                if (this.checkTimeFormat(result)) {
                    this.setState(({ result: result }));
                }
            }
        }
    };

    handleFocus = (e: React.FocusEvent<HTMLElement>) => {
        this.onToggle(true);
        this.props.onFocus?.(e);
    };

    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        this.onToggle(false);
        this.props.onBlur?.(e);

        if (this.state.value === '') {
            this.props.onValueChange(null);
            this.setState(({ result: null, value: null }));
        } else if (this.checkTimeFormat(this.state.result)) {
            this.setTimeResult();
        }
    };

    render() {
        return (
            <Dropdown
                renderTarget={ (props) => (this.props.renderTarget ? this.props.renderTarget(props) : this.renderInput(props)) }
                renderBody={ (props) => !this.props.isDisabled && !this.props.isReadonly && this.renderBody(props) }
                onValueChange={ !this.props.isDisabled && !this.props.isReadonly ? this.onToggle : null }
                value={ this.state.isOpen }
                modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
                forwardedRef={ this.props.forwardedRef }
            />
        );
    }
}
