import * as React from 'react';
import {IHasCX, CX, IEditable, IAnalyticableOnChange, uuiContextTypes, UuiContexts} from "../types";
import debounce from 'lodash.debounce';

/**
 * IEditableDebouncer component options.
 */
export interface IEditableDebouncerOptions {
    /** Pass true to disable debouncing */
    disableDebounce?: boolean;
    /** Debounce delay in ms */
    debounceDelay?: number;
}

/**
 * IEditableDebouncer component props.
 */
export interface IEditableDebouncerProps<T> extends IEditable<T>, IEditableDebouncerOptions, IAnalyticableOnChange<T> {
    /**
     * Render wrapped component.
     */
    render: (props: IEditable<T>) => React.ReactNode;
}

const defaultDelay = 500;

/**
 * Wrap other IEditable components into the IEditableDebouncer to debounce onValueChange calls.
 * Useful for search inputs, or any other components that cause expensive computations on change.
 * Wrapped component still behaves as controlled component, and will react to external value changes immediately.
 */
export class IEditableDebouncer<T> extends React.Component<IEditableDebouncerProps<T>, { value: T }> {
    public static contextTypes = uuiContextTypes;
    public context: UuiContexts;
    
    lastSentValue: T = this.props.value;

    state = {
        value: this.props.value,
    };

    componentWillReceiveProps(nextProps: IEditable<T>) {
        if (nextProps.value !== this.lastSentValue) {
            this.setState({ value: nextProps.value });
        }
    }

    debouncedOnValueChange = debounce(
        value => {
            this.lastSentValue = value;
            this.props.onValueChange(value);
            
            if (this.props.getValueChangeAnalyticsEvent) {
                const event = this.props.getValueChangeAnalyticsEvent(value, this.props.value);
                this.context.uuiAnalytics.sendEvent(event);
            }
        },
        this.props.debounceDelay != null ? this.props.debounceDelay : defaultDelay,
        { leading: false, trailing: true },
    );

    handleValueChange = (newValue: T) => {
        this.setState({ value: newValue });
        if (this.props.disableDebounce) {
            this.props.onValueChange(newValue);
        } else {
            this.debouncedOnValueChange(newValue);
        }
    }

    render() {
        const props: IEditable<T> = {
            value: this.state.value,
            onValueChange: this.handleValueChange,
        };
        return this.props.render && this.props.render(props);
    }
}