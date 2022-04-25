import * as React from 'react';
import { cx, ICanFocus, uuiMarkers } from '@epam/uui-core';
import * as css from './Checkbox.scss';
import { Icon, uuiMod, uuiElement, isClickableChildClicked, CheckboxCoreProps, UuiContexts, UuiContext } from '@epam/uui-core';
import { IconContainer } from '../layout';

export interface CheckboxProps extends CheckboxCoreProps, ICanFocus<HTMLInputElement> {
    icon?: Icon;
    indeterminateIcon?: Icon;
    renderLabel?(): React.ReactNode;
    tabIndex?: number;
    id?: string;
}

export class Checkbox extends React.Component<CheckboxProps> {
    static contextType = UuiContext;
    context: UuiContexts;

    handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        !isClickableChildClicked(e) && this.props.onValueChange(!this.props.value);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(!this.props.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    handleOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        this.props.onFocus?.(event);
    }

    handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        this.props.onBlur?.(event);
    }

    render() {
        return (
            <label
                className={ cx(
                    css.container,
                    this.props.cx,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    (!this.props.isReadonly && !this.props.isDisabled) && uuiMarkers.clickable,
                ) }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <div
                    className={ cx(uuiElement.checkbox, (this.props.value || this.props.indeterminate) && uuiMod.checked) }
                    onFocus={ this.handleOnFocus }
                    onBlur={ this.handleOnBlur }
                >
                    <input
                        type="checkbox"
                        onChange={ !this.props.isReadonly ? this.handleChange : undefined }
                        disabled={ this.props.isDisabled }
                        aria-disabled={ this.props.isDisabled || undefined }
                        readOnly={ this.props.isReadonly }
                        aria-readonly={ this.props.isReadonly || undefined }
                        checked={ this.props.value || false }
                        aria-checked={ this.props.value == undefined ? false : this.props.value }
                        required={ this.props.isRequired }
                        aria-required={ this.props.isRequired || undefined }
                        tabIndex={ this.props.tabIndex }
                        id={ this.props.id }
                    />
                    { this.props.value && !this.props.indeterminate && <IconContainer icon={ this.props.icon } /> }
                    { this.props.indeterminate && <IconContainer icon={ this.props.indeterminateIcon } /> }
                </div>
                { (this.props.renderLabel || this.props.label) && (
                    <div className={ uuiElement.inputLabel }>
                        { this.props.renderLabel ? this.props.renderLabel() : this.props.label }
                    </div>
                ) }
            </label>
        );
    }
}