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
    };

    abstract renderInput: (props: IDropdownToggler) => React.ReactNode;
    abstract renderBody: (props: DropdownBodyProps) => React.ReactNode;
    componentDidUpdate(prevProps: BaseTimePickerProps) {
        if (this.props.value !== prevProps.value) {
            this.setState((state) =>
                ({ ...state, value: valueToTimeString(this.props.value, this.props.format) }));
        }
    }

    getFormat = () => {
        return this.props.format === 24 ? 'HH:mm' : 'hh:mm A';
    };

    onClear = () => {
        this.props.onValueChange(null);
    };

    onToggle = (value: boolean) => {
        this.setState((state) => ({ ...state, isOpen: value }));
    };

    handleInputChange = (newValue: string) => {
        if (this.getFormat() === 'hh:mm A' && newValue.length < 8) {
            this.setState((state) => ({ ...state, value: newValue }));
        } else if (dayjs(newValue, this.getFormat(), true).isValid()) {
            const value = dayjs(newValue, this.getFormat(), true);
            this.props.onValueChange({ hours: value.hour(), minutes: value.minute() });
            this.setState((state) => ({ ...state, value: newValue }));
        } else {
            this.setState((state) => ({ ...state, value: newValue }));
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
            this.setState((state) => ({ ...state, value: null }));
        } else if (!dayjs(this.state.value, this.getFormat(), true).isValid()) {
            this.props.onValueChange(this.props.value);
            this.setState((state) => ({ ...state, value: valueToTimeString(this.props.value, this.props.format) }));
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
