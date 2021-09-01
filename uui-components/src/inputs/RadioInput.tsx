import * as React from 'react';
import * as css from './RadioInput.scss';
import {
    IHasRawProps,
    cx,
    IHasCX,
    IDisableable,
    IEditable,
    IHasLabel,
    Icon,
    uuiMod,
    uuiElement,
    ICanBeReadonly,
    IAnalyticableOnChange,
    UuiContexts,
    uuiMarkers,
    UuiContext,
} from "@epam/uui";
import { IconContainer } from '../layout';

export interface RadioInputProps extends IHasCX, IDisableable, IEditable<boolean>, IHasLabel, ICanBeReadonly, IAnalyticableOnChange<boolean>, IHasRawProps<HTMLLabelElement> {
    icon?: Icon;
    renderLabel?(): React.ReactNode;
}

export class RadioInput extends React.Component<RadioInputProps, any> {
    static contextType = UuiContext;
    context: UuiContexts;

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onValueChange(!this.props.value);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(!this.props.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    render() {
        return (
            <label
                className={ cx(
                    css.container,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    this.props.cx,
                    (!this.props.isReadonly && !this.props.isDisabled) && uuiMarkers.clickable,
                ) }
                { ...this.props.rawProps }
            >
                <div className={ cx(uuiElement.radioInput, this.props.value && uuiMod.checked) }>
                    <input
                        type="radio"
                        checked={ this.props.value }
                        disabled={ this.props.isReadonly || this.props.isDisabled }
                        readOnly={ this.props.isReadonly }
                        aria-checked={ this.props.value }
                        tabIndex={ (!this.props.isReadonly || !this.props.isDisabled) ? 0 : undefined }
                        onChange={ (!this.props.isReadonly || !this.props.isDisabled) ? this.handleChange : null }
                    />
                    { this.props.value && <IconContainer icon={ this.props.icon } cx={ css.circle } /> }
                </div>
                { (this.props.renderLabel || this.props.label) && (
                    <div role="label" className={ uuiElement.inputLabel }>
                        { this.props.renderLabel ? this.props.renderLabel() : this.props.label }
                    </div>
                ) }
            </label>
        );
    }
}
