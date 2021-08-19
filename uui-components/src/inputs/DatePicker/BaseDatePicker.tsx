import * as React from 'react';
import {
    IEditable, IHasCX, IDisableable, IHasPlaceholder, ICanBeReadonly, IAnalyticableOnChange, uuiContextTypes,
    UuiContexts, IDropdownToggler } from '@epam/uui';
import dayjs, { Dayjs } from 'dayjs';
import { PickerBodyValue, defaultFormat, valueFormat, ViewType } from '..';
import { toValueDateFormat, toCustomDateFormat } from './helpers';
import { Dropdown } from '../..';

export interface BaseDatePickerProps extends IEditable<string | null>, IHasCX, IDisableable, IHasPlaceholder, ICanBeReadonly, IAnalyticableOnChange<string> {
    format: string;
    filter?(day: Dayjs): boolean;
    renderTarget?(props: IDropdownToggler): React.ReactNode;
    iconPosition?: 'left' | 'right';
    disableClear?: boolean;
    renderDay?: (day: Dayjs, onDayClick: (day: Dayjs) => void) => React.ReactElement<Element>;
    isHoliday?: (day: Dayjs) => boolean;
}

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
    let inputValue = toCustomDateFormat(value, inputFormat);

    return {
        inputValue,
        selectedDate: value,
        displayedDate: dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day'),
    };
};

export abstract class BaseDatePicker<TProps extends BaseDatePickerProps> extends React.Component<TProps, DatePickerState> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    state: DatePickerState = {
        isOpen: false,
        view: 'DAY_SELECTION',
        ...getStateFromValue(this.props.value, this.props.format),
    };

    abstract renderInput(props: IDropdownToggler): React.ReactElement<any, any>;
    abstract renderBody(): React.ReactElement<any, any> ;

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

    handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!this.state.isOpen) this.onToggle(true);
    }

    handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isValidDate = dayjs(this.state.inputValue, this.getFormat(), true).isValid();
        const isValidFilter = this.props.filter && !this.props.filter(dayjs(this.state.inputValue, this.getFormat()));

        if (!isValidDate || !isValidFilter) {
            this.handleValueChange(null);
            this.setState({ inputValue: null });
        }
    }

    handleInputChange = (value: string) => {
        const resultValue = toValueDateFormat(value, this.getFormat());
        if (dayjs(value, this.getFormat(), true).isValid() && (!this.props.filter || this.props.filter(dayjs(value, this.getFormat())))) {
            this.handleValueChange(resultValue);
            this.setState({ inputValue: value });
        } else {
            this.setState({ inputValue: value });
        }
    }

    setSelectedDate = (value: string) => {
        this.props.value !== value && this.handleValueChange(value);

        this.setState({ selectedDate: value, inputValue: toCustomDateFormat(value, this.getFormat()) });
    }

    setDisplayedDateAndView = (displayedDate: Dayjs, view: ViewType) => this.setState({...this.state, displayedDate: displayedDate, view: view});


    handleCancel = () => {
        this.handleValueChange(null);
        this.setState({ inputValue: null, selectedDate: null });
    }

    getValue(): PickerBodyValue<string> {
        return {
            selectedDate: this.props.value,
            displayedDate: this.state.displayedDate,
            view: this.state.view,
        };
    }

    onToggle = (value: boolean) => {
        this.setState({
            isOpen: value,
            view: 'DAY_SELECTION',
            displayedDate: this.state.selectedDate ? dayjs(this.state.selectedDate) : dayjs(),
        });
    }

    handleValueChange = (newValue: string | null) => {
        this.props.onValueChange(newValue);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(newValue, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    render() {
        return (
            <Dropdown
                renderTarget={ (props: IDropdownToggler) => this.props.renderTarget ? this.props.renderTarget(props) : this.renderInput(props) }
                renderBody={ (props) =>
                    !this.props.isDisabled && !this.props.isReadonly && this.renderBody() }
                onValueChange={ (opened) => !this.props.isReadonly && this.onToggle(opened) }
                value={ this.state.isOpen }
                modifiers={ [{ name: 'offset', options: {offset: [0, 6]}}] }
            />
        );
    }
}