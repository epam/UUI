import React, { useCallback, useImperativeHandle, useRef, useState, type JSX } from 'react';
import cx from 'classnames';
import { offset } from '@floating-ui/react';
import type {
    IDropdownTogglerProps,
    RangeDatePickerProps as CoreRangeDatePickerProps,
    DropdownBodyProps,
    Overwrite,
    RangeDatePickerValue,
    RangeDatePickerInputType,
} from '@epam/uui-core';
import { isMobile, useUuiContext } from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { DropdownContainer } from '../overlays';
import { FlexRow } from '../layout';
import { RangeDatePickerBody, RangeDatePickerBodyValue } from './RangeDatePickerBody';
import { RangeDatePickerInput } from './RangeDatePickerInput';
import { RangeDatePickerModal } from './RangeDatePickerModal';
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
    const value = _value || defaultRangeValue;

    const context = useUuiContext();
    const [isOpen, setIsOpen] = useState(false);
    const [inFocus, setInFocus] = useState<RangeDatePickerInputType>(null);

    const targetRef = useRef<HTMLDivElement>(null);
    const isMobileView = isMobile();

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

    const handleEscape = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            onOpenChange(false);
        }
    };

    const openModal = useCallback(() => {
        if (props.isDisabled || props.isReadonly) return;

        const valueBeforeOpen = { ...value };

        context.uuiModals.show<RangeDatePickerValue>((modalProps) => (
            <RangeDatePickerModal
                { ...modalProps }
                pickerProps={ props }
                initialValue={ valueBeforeOpen }
            />
        ))
            .then((result) => {
                if (result) {
                    onValueChange(result);
                }
            })
            .catch(() => {
                onValueChange(valueBeforeOpen);
            });
    }, [props.isDisabled, props.isReadonly, value, onValueChange]);

    const commonInputProps = {
        id: props.id,
        cx: props.inputCx,
        isDisabled: props.isDisabled,
        isInvalid: props.isInvalid,
        isReadonly: props.isReadonly,
        size: size as RangeDatePickerProps['size'],
        getPlaceholder: props.getPlaceholder,
        disableClear: props.disableClear,
        rawProps: props.rawProps,
        inFocus,
        value,
        format,
        filter: props.filter,
        onValueChange,
        onFocusInput: (e: React.FocusEvent<HTMLInputElement>, type: RangeDatePickerInputType) => {
            props.onFocus?.(e, type);
            setInFocus(type);
        },
        preventEmptyFromDate: props.preventEmptyFromDate,
        preventEmptyToDate: props.preventEmptyToDate,
    };

    const renderInput = (dropdownRenderProps?: IDropdownTogglerProps) => (
        <RangeDatePickerInput
            { ...commonInputProps }
            ref={ (node) => {
                (dropdownRenderProps as any)?.ref?.(node);
                targetRef.current = node;
            } }
            onClick={ () => dropdownRenderProps?.toggleDropdownOpening?.(true) }
            onIconClick={ isMobileView ? openModal : undefined }
            onBlurInput={ (e, type) => {
                props.onBlur?.(e, type);
                (!isOpen || isMobileView) && setInFocus(null);
            } }
            onKeyDown={ !isMobileView ? handleEscape : undefined }
        />
    );

    if (isMobileView) {
        const mobileTogglerProps: IDropdownTogglerProps = {
            isOpen: false,
            toggleDropdownOpening: openModal,
            onClick: openModal,
            ref: (node) => {
                (targetRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            },
        };
        const customTarget = props.renderTarget?.(mobileTogglerProps);
        return (React.isValidElement(customTarget) ? customTarget : renderInput()) as JSX.Element;
    }

    const renderBody = (renderProps: DropdownBodyProps): JSX.Element => (
        <DropdownContainer
            { ...renderProps }
            cx={ css.dropdownContainer }
            shards={ [targetRef] }
            returnFocus={ true }
        >
            <FlexRow>
                <RangeDatePickerBody
                    cx={ cx(props.bodyCx) }
                    value={ { selectedDate: value, inFocus } }
                    onValueChange={ onBodyValueChange }
                    filter={ props.filter }
                    presets={ props.presets }
                    renderDay={ props.renderDay }
                    renderFooter={ () => props.renderFooter?.(value) }
                    isHoliday={ props.isHoliday }
                    rawProps={ props.rawProps?.body }
                    preventEmptyToDate={ props.preventEmptyToDate }
                    preventEmptyFromDate={ props.preventEmptyFromDate }
                    initialViewMonth={ props.initialViewMonth }
                />
            </FlexRow>
        </DropdownContainer>
    );

    return (
        <Dropdown
            renderTarget={ (rp) => props.renderTarget?.(rp) || renderInput(rp) }
            renderBody={ renderBody }
            onValueChange={ onOpenChange }
            value={ isOpen }
            middleware={ [offset(6)] }
            placement={ props.placement }
            ref={ ref }
        />
    );
}

export const RangeDatePicker = React.forwardRef(RangeDatePickerComponent) as
    (props: RangeDatePickerProps & { ref?: React.ForwardedRef<HTMLElement> }) => ReturnType<typeof RangeDatePickerComponent>;
