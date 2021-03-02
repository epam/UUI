import * as React from 'react';
import moment from 'moment';
import { Placement } from 'popper.js';
import { DropdownBodyProps, defaultFormat, PickerBodyValue, RangeDatePickerValue, Presets, Dropdown, valueFormat } from '../..';
import { IEditable, IHasCX, IDisableable, ICanBeReadonly, IAnalyticableOnChange, uuiContextTypes, UuiContexts,
    IDropdownToggler } from '@epam/uui';
import { toCustomDateRangeFormat, toValueDateRangeFormat } from './helpers';

export interface BaseRangeDatePickerProps extends IEditable<RangeDatePickerValue>, IHasCX, IDisableable, ICanBeReadonly, IAnalyticableOnChange<RangeDatePickerValue> {
    format?: string;
    filter?(day: moment.Moment): boolean;
    renderTarget?(props: IDropdownToggler): React.ReactNode;
    renderFooter?(value: RangeDatePickerValue): React.ReactNode;
    renderDay?: (day: moment.Moment, onDayClick: (day: moment.Moment) => void) => React.ReactElement<Element>;
    presets?: Presets;
    disableClear?: boolean;
    placement?: Placement;
    isHoliday?: (day: moment.Moment) => boolean;
}

interface RangeDatePickerState extends PickerBodyValue<RangeDatePickerValue> {
    isOpen: boolean;
    inputValue: RangeDatePickerValue;
    inFocus: InputType;
}

export type InputType = 'from' | 'to';
const defaultValue: RangeDatePickerValue = { from: null, to: null };

const getStateFromValue = (value: RangeDatePickerValue, format: string) => {
    if (!value) {
        return {
            inputValue: defaultValue,
            selectedDate: defaultValue,
            displayedDate: moment().startOf('day'),
        };
    }

    const inputFormat = format || defaultFormat;
    let inputValue = toCustomDateRangeFormat(value, inputFormat);

    return {
        inputValue,
        selectedDate: value,
        displayedDate: moment(value.from, valueFormat).isValid() ? moment(value.from, valueFormat) : moment().startOf('day'),
    };
};

export abstract class BaseRangeDatePicker<TProps extends BaseRangeDatePickerProps> extends React.Component<TProps, RangeDatePickerState> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    
    state: RangeDatePickerState = {
        isOpen: false,
        view: 'DAY_SELECTION',
        ...getStateFromValue(this.props.value, this.props.format),
        inFocus: null,
    };
    toTextInput: any;
    inFocus: InputType = null;


    static getDerivedStateFromProps(props: BaseRangeDatePickerProps, state: RangeDatePickerState): RangeDatePickerState {
        if (!props.value || (props.value.from !== state.selectedDate.from || props.value.to !== state.selectedDate.to)) {
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

    handleWrapperBlur = () => {
        if (!this.state.isOpen && this.state.inFocus) {
            this.setState({ inFocus: null });
        }
    }

    valueIsValid(value: string, inputType: InputType) {
        if (moment(value, this.getFormat(), true).isValid()) {
            if (inputType === 'from') {
                return this.state.inputValue.to ? moment(value, this.getFormat(), true).valueOf() <= moment(this.state.inputValue.to, this.getFormat(), true).valueOf() : true;
            } else {
                return this.state.inputValue.from ? moment(this.state.inputValue.from, this.getFormat(), true).valueOf() <= moment(value, this.getFormat(), true).valueOf() : true;
            }
        }
        return false;
    }

    handleBlur = (inputType: InputType) => {
        if (!this.valueIsValid(this.state.inputValue[inputType], inputType) || (this.props.filter && !this.props.filter(moment(this.props.value[inputType])))) {
            switch (inputType) {
                case 'from': this.handleValueChange({ ...this.props.value, from: null }); this.getChangeHandler('from')(null); break;
                case 'to': this.handleValueChange({ ...this.props.value, to: null }); this.getChangeHandler('to')(null); break;
            }
        }
    }

    onClear = () => {
        this.handleValueChange({ from: null, to: null });
    }

    setValue = (value: PickerBodyValue<RangeDatePickerValue>) => {
        this.props.value && (this.props.value.from !== value.selectedDate.from || this.props.value.to !== value.selectedDate.to) && this.handleValueChange(value.selectedDate);
        this.setState({ ...this.state, inputValue: toCustomDateRangeFormat(value.selectedDate, this.getFormat()), ...value });
    }

    getDisplayedDateOnOpening(focus: InputType) {
        if (this.state.selectedDate?.from && this.state.selectedDate?.to) {
            return moment(this.state.selectedDate[focus]);
        } else if (this.state.selectedDate?.from) {
            return moment(this.state.selectedDate?.from);
        } else if (this.state.selectedDate?.to) {
            return moment(this.state.selectedDate?.to);
        } else {
            return moment();
        }
    }

    toggleOpening = (value: boolean, focus?: InputType) => {
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
    }

    onRangeChange = (value: PickerBodyValue<RangeDatePickerValue>) => {
        let isFromValueChanged = this.props.value.from != value.selectedDate.from;
        if (this.state.inFocus === 'from' && isFromValueChanged) {
            this.setState({ inFocus: 'to' }, () => this.setValue(value));
        } else {
            this.setValue(value);
        }
    }

    getChangeHandler = (inputType: 'from' | 'to') => (value: string) => {
        const inputValue = { ...this.state.inputValue, [inputType]: value };
        if (this.valueIsValid(value, inputType) && (!this.props.filter || this.props.filter(moment(value)))) {
            this.setValue({
                selectedDate: toValueDateRangeFormat(inputValue, this.getFormat()),
                displayedDate: inputType === "from" ? moment(value, this.getFormat()) : this.state.displayedDate,
                view: this.state.view,
            });
        } else {
            switch (inputType) {
                case 'from': this.setValue({ ...this.state, selectedDate: { from: null, to: this.state.selectedDate.to } }); break;
                case 'to': this.setValue({ ...this.state, selectedDate: { from: this.state.selectedDate.from, to: null } }); break;
            }
            this.setState({ inputValue: inputValue });

        }
    }

    handleCancel = () => {
        this.handleValueChange({ from: null, to: null });
        this.setState({ inputValue: { from: null, to: null } });
    }

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
    }

    abstract renderInput(props: any): React.ReactElement;

    abstract renderBody(props: DropdownBodyProps): React.ReactElement;

    render() {
        return (
            <Dropdown
                renderTarget={ (props: IDropdownToggler) => this.props.renderTarget ? this.props.renderTarget(props) : this.renderInput(props) }
                renderBody={ (props: DropdownBodyProps) => !this.props.isDisabled && this.renderBody(props) }
                onValueChange={ (opened) => { !this.props.isReadonly && this.toggleOpening(opened); } }
                value={ this.state.isOpen }
                modifiers={ { offset: { offset: '0,6px' } } }
                placement={ this.props.placement }
            />
        );
    }
}
