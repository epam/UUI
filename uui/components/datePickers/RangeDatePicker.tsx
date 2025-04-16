import React, { ReactElement, ReactNode, useImperativeHandle, useState, type JSX } from 'react';
import cx from 'classnames';
import { offset } from '@floating-ui/react';
import type {
    CommonDatePickerProps, RangeDatePickerPresets,
    DropdownBodyProps, IAnalyticableOnChange, IEditable, IHasRawProps, Overwrite,
} from '@epam/uui-core';
import { useUuiContext } from '@epam/uui-core';
import { DayProps, Dropdown } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { RangeDatePickerBody } from './RangeDatePickerBody';
import { RangeDatePickerInput } from './RangeDatePickerInput';
import type {
    RangeDatePickerBodyValue,
    RangeDatePickerInputType,
    RangeDatePickerValue,
} from './types';
import { defaultFormat, defaultRangeValue } from './helpers';
import { settings } from '../../settings';

import css from './RangeDatePicker.module.scss';

export interface RangeDatePickerModsOverride {}

type RangeDatePickerMods = {
    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';
};

/**
 * Represents the properties of the RangeDatePicker component
 */
export interface RangeDatePickerProps extends
    Overwrite<RangeDatePickerMods, RangeDatePickerModsOverride>,
    IEditable<RangeDatePickerValue | null>,
    IAnalyticableOnChange<RangeDatePickerValue | null>,
    CommonDatePickerProps {
    /**
     * Range presets (like 'this week', 'this month', etc.) to display at the right of the Picker's body.
     * UUI provides defaults in the 'rangeDatePickerPresets' exported variable - you can use it as is, or build on top of it (e.g. add your presets)
     */
    presets?: RangeDatePickerPresets;

    /**
     * Allows to add a custom footer to the Picker's dropdown body
     */
    renderFooter?(value: RangeDatePickerValue): ReactNode;

    /**
     * Called when component gets input focus
     */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => void;

    /**
     * Called when component looses input focus
     */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>, inputType: RangeDatePickerInputType) => void;

    /**
     * Called when component is opened/closed
     */
    onOpenChange?: (isOpen: boolean) => void

    /**
     * A pure function that gets placeholder for 'from' or 'to' input.
     */
    getPlaceholder?(type: RangeDatePickerInputType): string;

    /**
     * Overrides rendering of the single day. For example, to highlight certain days
     */
    renderDay?: (renderProps: DayProps) => ReactElement<Element>;

    /**
     * rawProps as HTML attributes
     */
    rawProps?: {
        /**
         * Any HTML attributes (native or 'data-') to put on 'from' input
         */
        from?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /**
         * Any HTML attributes (native or 'data-') to put on 'to' input
         */
        to?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /**
         * Any HTML attributes (native or 'data-') to put on date picker body
         */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };
}

function RangeDatePickerComponent(props: RangeDatePickerProps, ref: React.ForwardedRef<HTMLElement>): JSX.Element {
    const { value: _value, format = defaultFormat, size = settings.rangeDatePicker.sizes.default } = props;
    const value = _value || defaultRangeValue; // also handles null in comparison to default value

    const context = useUuiContext();
    const [isOpen, setIsOpen] = useState(false);
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>(null);

    const targetRef = React.useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => targetRef.current);

    const onValueChange = (newValue: RangeDatePickerValue) => {
        const fromChanged = value?.from !== newValue?.from;
        const toChanged = value?.to !== newValue?.to;
        if (fromChanged || toChanged) {
            props.onValueChange(newValue);
            if (props.getValueChangeAnalyticsEvent) {
                const event = props.getValueChangeAnalyticsEvent(newValue, value);
                context.uuiAnalytics.sendEvent(event);
            }
        }
    };

    const onOpenChange = (newIsOpen: boolean) => {
        setIsOpen(newIsOpen);
        props.onOpenChange?.(newIsOpen);
        if (!inFocus && newIsOpen) {
            setInFocus('from');
            if (targetRef.current) {
                const inputElement = targetRef.current.querySelector<HTMLInputElement>('.uui-input');
                inputElement?.focus();
            }
        }
    };

    const onBodyValueChange = (newValue: RangeDatePickerBodyValue<RangeDatePickerValue>) => {
        setInFocus(newValue.inFocus ?? inFocus);
        onValueChange(newValue.selectedDate);

        const toChanged = value.to !== newValue.selectedDate.to;
        const closeBody = newValue.selectedDate.from && newValue.selectedDate.to
         && inFocus === 'to'
           && toChanged;

        if (closeBody) {
            onOpenChange(false);
        }
    };

    const renderBody = (renderProps: DropdownBodyProps): JSX.Element => {
        return (
            <DropdownContainer
                { ...renderProps }
                cx={ cx(css.dropdownContainer) }
                shards={ [targetRef] }
                returnFocus={ true }
            >
                <FlexRow>
                    <RangeDatePickerBody
                        cx={ cx(props.bodyCx) }
                        value={ {
                            selectedDate: _value,
                            inFocus,
                        } }
                        onValueChange={ onBodyValueChange }
                        filter={ props.filter }
                        presets={ props.presets }
                        renderDay={ props.renderDay }
                        renderFooter={ () => {
                            return props.renderFooter?.(value);
                        } }
                        isHoliday={ props.isHoliday }
                        rawProps={ props.rawProps?.body }
                    />
                </FlexRow>
            </DropdownContainer>
        );
    };

    const handleEscape = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            onOpenChange(false);
        }
    };

    return (
        <Dropdown
            renderTarget={ (renderProps) => {
                return props.renderTarget?.(renderProps) || (
                    <RangeDatePickerInput
                        id={ props.id }
                        ref={ (node) => { (renderProps as any).ref(node); targetRef.current = node; } }
                        cx={ props.inputCx }
                        onClick={ () => renderProps.toggleDropdownOpening(true) }
                        isDisabled={ props.isDisabled }
                        isInvalid={ props.isInvalid }
                        isReadonly={ props.isReadonly }
                        size={ size as RangeDatePickerProps['size'] }
                        getPlaceholder={ props.getPlaceholder }
                        disableClear={ props.disableClear }
                        rawProps={ props.rawProps }
                        inFocus={ inFocus }
                        value={ value }
                        format={ format }
                        filter={ props.filter }
                        onValueChange={ onValueChange }
                        onFocusInput={ (e, type) => {
                            props.onFocus?.(e, type);
                            setInFocus(type);
                        } }
                        onBlurInput={ (e, type) => { props.onBlur?.(e, type); !isOpen && setInFocus(null); } }
                        onKeyDown={ handleEscape }
                    />
                );
            } }
            renderBody={ (renderProps) => renderBody(renderProps) }
            onValueChange={ (v) => onOpenChange(v) }
            value={ isOpen }
            middleware={ [offset(6)] }
            placement={ props.placement }
            ref={ ref }
        />
    );
}

export const RangeDatePicker = React.forwardRef(RangeDatePickerComponent) as
    (props: RangeDatePickerProps & { ref?: React.ForwardedRef<HTMLElement> }) => ReturnType<typeof RangeDatePickerComponent>;
