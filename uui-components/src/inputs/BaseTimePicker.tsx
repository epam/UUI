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
    hours: number;
    minutes: number;
}

export interface BaseTimePickerProps extends IEditable<TimePickerValue | null>,
    IDisableable,
    ICanBeReadonly,
    IHasPlaceholder,
    ICanFocus<HTMLElement>,
    IHasForwardedRef<HTMLElement> {
    minutesStep?: number;
    format?: 12 | 24;
    id?: string;
    renderTarget?(props: IDropdownToggler): React.ReactNode;
    rawProps?: {
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
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
        console.log('handle input change');
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
        console.log('renderInput');
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
