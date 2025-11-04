import React, { useImperativeHandle, useState, type JSX } from 'react';
import cx from 'classnames';
import { offset } from '@floating-ui/react';
import type { RangeDatePickerProps as CoreRangeDatePickerProps, DropdownBodyProps, Overwrite, RangeDatePickerValue, RangeDatePickerInputType } from '@epam/uui-core';
import { useUuiContext } from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { RangeDatePickerBody, RangeDatePickerBodyValue } from './RangeDatePickerBody';
import { RangeDatePickerInput } from './RangeDatePickerInput';
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
export interface RangeDatePickerProps extends CoreRangeDatePickerProps, Overwrite<RangeDatePickerMods, RangeDatePickerModsOverride> {}

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
                        preventEmptyToDate={ props.preventEmptyToDate }
                        preventEmptyFromDate={ props.preventEmptyFromDate }
                        preselectedViewDate={ props.preselectedViewDate }
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
                        preventEmptyFromDate={ props.preventEmptyFromDate }
                        preventEmptyToDate={ props.preventEmptyToDate }
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
