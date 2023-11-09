import * as React from 'react';
import {
    cx,
    IHasRawProps,
    uuiMod,
    uuiElement,
    IHasCX,
    IDisableable,
    IEditable,
    IHasLabel,
    uuiMarkers,
    IAnalyticableOnChange,
    UuiContexts,
    UuiContext,
    IHasForwardedRef,
    IHasTabIndex,
    ICanFocus,
} from '@epam/uui-core';
import css from './Switch.module.scss';

export interface SwitchProps
    extends IHasCX,
    IDisableable,
    IEditable<boolean>,
    IHasLabel,
    IAnalyticableOnChange<boolean>,
    IHasRawProps<React.LabelHTMLAttributes<HTMLLabelElement>>,
    IHasForwardedRef<HTMLLabelElement>,
    IHasTabIndex,
    ICanFocus<HTMLInputElement> {
    id?: string;
}

export class Switch extends React.Component<SwitchProps> {
    static contextType = UuiContext;
    context: UuiContexts;
    toggle = () => {
        this.props.onValueChange(!this.props.value);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(!this.props.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    };

    render() {
        return (
            <label
                className={ cx(
                    css.container,
                    this.props.cx,
                    this.props.isDisabled && uuiMod.disabled,
                    !this.props.isReadonly && !this.props.isDisabled && uuiMarkers.clickable,
                ) }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <div
                    className={ cx(uuiElement.switchBody, this.props.value && uuiMod.checked) }
                    onFocus={ this.props.onFocus }
                    onBlur={ this.props.onBlur }
                >
                    <input
                        type="checkbox"
                        role="switch"
                        onChange={ !this.props.isReadonly ? this.toggle : undefined }
                        readOnly={ this.props.isReadonly }
                        aria-readonly={ this.props.isReadonly || undefined }
                        disabled={ this.props.isDisabled }
                        aria-disabled={ this.props.isDisabled }
                        checked={ this.props.value || false }
                        aria-checked={ this.props.value || false }
                        required={ this.props.isRequired }
                        aria-required={ this.props.isRequired || undefined }
                        tabIndex={ this.props.tabIndex }
                        id={ this.props.id }
                    />
                    <div className={ uuiElement.switchToggler } />
                </div>
                {this.props.label && <div className={ uuiElement.inputLabel }>{this.props.label}</div>}
            </label>
        );
    }
}
