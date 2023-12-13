import * as React from 'react';
import {
    DropdownBodyProps, UuiContexts, IDropdownToggler, UuiContext, isFocusReceiverInsideFocusLock, DatePickerCoreProps,
} from '@epam/uui-core';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import utc from 'dayjs/plugin/utc.js';
import {
    PickerBodyValue, defaultFormat, valueFormat, ViewType, supportedDateFormats,
} from './DatePickerBodyBase';
import { toValueDateFormat, toCustomDateFormat } from './helpers';
import { Dropdown } from '../../overlays';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

interface DatePickerState extends PickerBodyValue<string> {
    isOpen: boolean;
    inputValue: string | null;
}

const getStateFromValue = (value: string | null, format: string) => {
    if (!value) {
        return {
            inputValue: '',
            selectedDate: value,
            displayedDate: dayjs().startOf('day'),
        };
    }

    const inputFormat = format || defaultFormat;
    const inputValue = toCustomDateFormat(value, inputFormat);

    return {
        inputValue,
        selectedDate: value,
        displayedDate: dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day'),
    };
};

export abstract class BaseDatePicker<TProps extends DatePickerCoreProps> extends React.Component<TProps, DatePickerState> {
    static contextType = UuiContext;
    context: UuiContexts;
    state: DatePickerState = {
        isOpen: false,
        view: 'DAY_SELECTION',
        ...getStateFromValue(this.props.value, this.props.format),
    };

    abstract renderInput(props: IDropdownToggler): React.ReactNode;
    abstract renderBody(props: DropdownBodyProps): React.ReactNode;
    static getDerivedStateFromProps(props: any, state: DatePickerState): DatePickerState | null {
        if (props.value !== state.selectedDate) {
            return {
                ...state,
                ...getStateFromValue(props.value, props.format),
            };
        }

        return null;
    }

    getFormat() {
        return this.props.format || defaultFormat;
    }

    getIsValidDate = (value: string) => {
        if (!value) return false;
        const parsedDate = dayjs(value, supportedDateFormats(this.getFormat()), true);
        const isValidDate = parsedDate.isValid();
        if (!isValidDate) return false;
        return this.props.filter ? this.props.filter(parsedDate) : true;
    };

    handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        this.onToggle(true);
        this.props.onFocus?.(e);
    };

    handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (isFocusReceiverInsideFocusLock(e)) return;
        this.onToggle(false);
        if (this.getIsValidDate(this.state.inputValue)) {
            this.setState(
                (state) => ({ inputValue: toCustomDateFormat(state.inputValue, this.getFormat()) }),
            );
        } else {
            if (this.state.inputValue !== '' && this.state.inputValue != null) {
                this.handleValueChange(null);
                this.setState({ inputValue: null, selectedDate: null });
            }
        }
    };

    handleInputChange = (value: string) => {
        const resultValue = toValueDateFormat(value, this.getFormat());
        if (this.getIsValidDate(value)) {
            this.handleValueChange(resultValue);
            this.setState({ inputValue: value });
        } else {
            this.setState({ inputValue: value });
        }
    };

    setSelectedDate = (value: string) => {
        this.props.value !== value && this.handleValueChange(value);

        this.setState({ selectedDate: value, inputValue: toCustomDateFormat(value, this.getFormat()) });
    };

    setDisplayedDateAndView = (displayedDate: Dayjs, view: ViewType) =>
        this.setState((state) => ({ ...state, displayedDate: displayedDate, view: view }));

    handleCancel = () => {
        this.handleValueChange(null);
        this.setState({ inputValue: null, selectedDate: null });
    };

    getValue(): PickerBodyValue<string> {
        return {
            selectedDate: this.props.value,
            displayedDate: this.state.displayedDate,
            view: this.state.view,
        };
    }

    onToggle = (value: boolean) => {
        this.setState((state) => ({
            isOpen: value,
            view: 'DAY_SELECTION',
            displayedDate: state.selectedDate ? dayjs(state.selectedDate) : dayjs(),
        }));
        if (!value) this.props.onBlur?.();
    };

    handleValueChange = (newValue: string | null) => {
        this.props.onValueChange(newValue);
        this.setState({
            selectedDate: newValue,
            displayedDate: dayjs(newValue, valueFormat).isValid() ? dayjs(newValue, valueFormat) : dayjs().startOf('day'),
        });

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(newValue, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
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
                placement={ this.props.placement }
                forwardedRef={ this.props.forwardedRef }
            />
        );
    }
}
