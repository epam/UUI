import React from 'react';
import dayjs from 'dayjs';
import { DropdownBodyProps, UuiContexts, IDropdownToggler, UuiContext, isChildFocusable, BaseRangeDatePickerProps, RangeDatePickerInputType } from '@epam/uui-core';
import { defaultFormat, PickerBodyValue, RangeDatePickerValue, Dropdown, valueFormat, supportedDateFormats } from '../../';
import { toCustomDateRangeFormat, toValueDateRangeFormat } from './helpers';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

interface RangeDatePickerState extends PickerBodyValue<RangeDatePickerValue> {
    isOpen: boolean;
    inputValue: RangeDatePickerValue;
    inFocus: RangeDatePickerInputType;
}

const defaultValue: RangeDatePickerValue = { from: null, to: null };

const getStateFromValue = (value: RangeDatePickerValue, format: string) => {
    if (!value) {
        return {
            inputValue: defaultValue,
            selectedDate: defaultValue,
            displayedDate: dayjs().startOf('day'),
        };
    }

    const inputFormat = format || defaultFormat;
    let inputValue = toCustomDateRangeFormat(value, inputFormat);

    return {
        inputValue,
        selectedDate: value,
        displayedDate: dayjs(value.from, valueFormat).isValid() ? dayjs(value.from, valueFormat) : dayjs().startOf('day'),
    };
};

export abstract class BaseRangeDatePicker<TProps extends BaseRangeDatePickerProps> extends React.Component<TProps, RangeDatePickerState> {
    static contextType = UuiContext;
    context: UuiContexts;

    inFocus: RangeDatePickerInputType;

    getInitialState(): RangeDatePickerState {
        return {
            isOpen: false,
            view: 'DAY_SELECTION',
            ...getStateFromValue(this.props.value, this.props.format),
            inFocus: null,
        };
    }

    state = this.getInitialState();

    static getDerivedStateFromProps(props: BaseRangeDatePickerProps, state: RangeDatePickerState): RangeDatePickerState {
        if (!props.value || props.value.from !== state.selectedDate.from || props.value.to !== state.selectedDate.to) {
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

    handleWrapperBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (isChildFocusable(e)) return;
        this.toggleOpening(false);
        if (!this.state.isOpen && this.state.inFocus) {
            this.setState({ inFocus: null });
        }
    };

    getValueOfDate(value: string) {
        return dayjs(value, supportedDateFormats(this.getFormat()), true).valueOf();
    }

    valueIsValid(value: string, inputType: RangeDatePickerInputType) {
        const isValidDate = dayjs(value, supportedDateFormats(this.getFormat()), true).isValid();
        const valueOfDate = this.getValueOfDate(value);
        const valueOfDateTo = this.getValueOfDate(this.state.inputValue.to);
        const valueOfDateFrom = this.getValueOfDate(this.state.inputValue.from);

        if (isValidDate) {
            if (inputType === 'from') {
                return this.state.inputValue.to ? valueOfDate <= valueOfDateTo : true;
            } else {
                return this.state.inputValue.from ? valueOfDateFrom <= valueOfDate : true;
            }
        }
        return false;
    }

    handleFocus = (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => {
        this.toggleOpening(true, inputType);
        if (this.props.onFocus) {
            this.props.onFocus(event, inputType);
        }
    };

    handleBlur = (event: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => {
        if (this.props.onBlur) {
            this.props.onBlur(event, inputType);
        }
        if (!this.valueIsValid(this.state.inputValue[inputType], inputType) || (this.props.filter && !this.props.filter(dayjs(this.props.value[inputType])))) {
            switch (inputType) {
                case 'from':
                    this.handleValueChange({ ...this.props.value, from: null });
                    this.getChangeHandler('from')(null);
                    break;
                case 'to':
                    this.handleValueChange({ ...this.props.value, to: null });
                    this.getChangeHandler('to')(null);
                    break;
            }
        } else {
            const formatInputValue = toCustomDateRangeFormat(this.state.inputValue, this.getFormat());
            this.setState({ inputValue: formatInputValue });
        }
    };

    onClear = () => {
        this.handleValueChange({ from: null, to: null });
    };

    setValue = (value: PickerBodyValue<RangeDatePickerValue>) => {
        (this.props.value?.from !== value.selectedDate?.from || this.props.value.to !== value.selectedDate.to) && this.handleValueChange(value.selectedDate);
        const formatInputValue = toCustomDateRangeFormat(value.selectedDate, this.getFormat());
        this.setState({ ...this.state, inputValue: formatInputValue, ...value });
    };

    getDisplayedDateOnOpening(focus: RangeDatePickerInputType) {
        if (this.state.selectedDate?.from && this.state.selectedDate?.to) {
            return dayjs(this.state.selectedDate[focus]);
        } else if (this.state.selectedDate?.from) {
            return dayjs(this.state.selectedDate?.from);
        } else if (this.state.selectedDate?.to) {
            return dayjs(this.state.selectedDate?.to);
        } else {
            return dayjs();
        }
    }

    toggleOpening = (value: boolean, focus?: RangeDatePickerInputType) => {
        this.setState({
            isOpen: value,
            view: 'DAY_SELECTION',
            displayedDate: this.getDisplayedDateOnOpening(focus),
            inFocus: value ? focus : null,
        });

        // if (this.props.getValueChangeAnalyticsEvent) {
        //     const event = this.props.getValueChangeAnalyticsEvent(value, this.state.isOpen);
        //     this.context.uuiAnalytics.sendEvent(event);
        // }
    };

    onRangeChange = (value: PickerBodyValue<RangeDatePickerValue>) => {
        const isFromValueChanged = this.props.value.from != value.selectedDate.from;
        const isToValueChanged = this.props.value.to != value.selectedDate.to;
        if (this.state.inFocus === 'from' && isFromValueChanged) {
            this.setState({ inFocus: 'to' }, () => this.setValue(value));
        } else if (this.state.inFocus === 'to' && isToValueChanged) {
            this.setState({ inFocus: 'from' }, () => this.setValue(value));
        } else {
            this.setValue(value);
        }
    };

    getChangeHandler = (inputType: 'from' | 'to') => (value: string) => {
        const inputValue = { ...this.state.inputValue, [inputType]: value };
        if (this.valueIsValid(value, inputType) && (!this.props.filter || this.props.filter(dayjs(value)))) {
            this.setValue({
                selectedDate: toValueDateRangeFormat(inputValue, this.getFormat()),
                displayedDate: dayjs(value, supportedDateFormats(this.getFormat())),
                view: this.state.view,
            });
        } else {
            switch (inputType) {
                case 'from':
                    this.setValue({ ...this.state, selectedDate: { from: null, to: this.state.selectedDate.to } });
                    break;
                case 'to':
                    this.setValue({ ...this.state, selectedDate: { from: this.state.selectedDate.from, to: null } });
                    break;
            }
        }
        this.setState({ inputValue: inputValue });
    };

    handleCancel = () => {
        this.handleValueChange({ from: null, to: null });
        this.setState({ inputValue: { from: null, to: null } });
    };

    getValue(): PickerBodyValue<RangeDatePickerValue> {
        return {
            selectedDate: this.props.value || defaultValue,
            displayedDate: this.state.displayedDate,
            view: this.state.view,
        };
    }

    handleValueChange = (newValue: RangeDatePickerValue) => {
        this.props.onValueChange(newValue);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(newValue, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    };

    abstract renderInput(props: IDropdownToggler): React.ReactElement;

    abstract renderBody(props: DropdownBodyProps): React.ReactElement;

    render() {
        return (
            <Dropdown
                renderTarget={(props) => (this.props.renderTarget ? this.props.renderTarget(props) : this.renderInput(props))}
                renderBody={(props) => !this.props.isReadonly && !this.props.isDisabled && this.renderBody(props)}
                onValueChange={!this.props.isReadonly && !this.props.isDisabled ? this.toggleOpening : null}
                value={this.state.isOpen}
                modifiers={[{ name: 'offset', options: { offset: [0, 6] } }]}
                placement={this.props.placement}
            />
        );
    }
}
