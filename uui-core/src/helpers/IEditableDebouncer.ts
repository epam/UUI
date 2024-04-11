import React from 'react';
import { IEditable, IAnalyticableOnChange } from '../types';
import debounce from 'lodash.debounce';
import { useUuiContext } from '../services';
import {
    ReactElement, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

/**
 * IEditableDebouncer component options.
 */
export interface IEditableDebouncerOptions {
    /** Pass true to disable debouncing */
    disableDebounce?: boolean;
    /** Debounce delay in ms. Default value is 500ms */
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

const IEditableDebouncerImpl = <T>(props: IEditableDebouncerProps<T>) => {
    const [state, setState] = useState({ value: props.value });
    const lastSentValue = useRef(props.value);
    const context = useUuiContext();

    useEffect(() => {
        if ((props.value !== lastSentValue.current)) {
            setState({ value: props.value });
            lastSentValue.current = props.value;
        }
    }, [props.value]);

    const debouncedOnValueChange = useMemo(() => {
        return debounce(
            (value) => {
                lastSentValue.current = value;
                props.onValueChange(value);

                if (props.getValueChangeAnalyticsEvent) {
                    const event = props.getValueChangeAnalyticsEvent(value, props.value);
                    context.uuiAnalytics.sendEvent(event);
                }
            },
            props.debounceDelay != null ? props.debounceDelay : defaultDelay,
            { leading: false, trailing: true },
        );
    }, [
        props.onValueChange, props.getValueChangeAnalyticsEvent, props.debounceDelay, props.value,
    ]);

    const handleValueChange = useCallback(
        (newValue: T) => {
            setState({ value: newValue });
            if (props.disableDebounce) {
                props.onValueChange(newValue);
            } else {
                debouncedOnValueChange(newValue);
            }
        },
        [
            props.disableDebounce, props.onValueChange, debouncedOnValueChange,
        ],
    );

    const propsToRender: IEditable<T> = useMemo(
        () => ({
            value: state.value,
            onValueChange: handleValueChange,
        }),
        [state.value, handleValueChange],
    );

    return props.render?.(propsToRender) as ReactElement;
};

/**
 * Wrap other IEditable components into the IEditableDebouncer to debounce onValueChange calls.
 * Useful for search inputs, or any other components that cause expensive computations on change.
 * Wrapped component still behaves as controlled component, and will react to external value changes immediately.
 */
export const IEditableDebouncer = /* @__PURE__ */React.memo(IEditableDebouncerImpl) as typeof IEditableDebouncerImpl;
