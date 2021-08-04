import * as React from 'react';
import * as css from './RadioInput.scss';
import {IHasCX, IDisableable, IEditable, IHasLabel, Icon, cx, uuiMod, uuiElement, ICanBeReadonly, IAnalyticableOnChange, uuiContextTypes, UuiContexts} from "@epam/uui";
import { IconContainer } from '../layout';

export interface RadioInputProps extends IHasCX, IDisableable, IEditable<boolean>, IHasLabel, ICanBeReadonly, IAnalyticableOnChange<boolean> {
    icon?: Icon;
    renderLabel?(): any;
}

export class RadioInput extends React.Component<RadioInputProps, any> {
    static contextTypes = uuiContextTypes;
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
            <label className={ cx(
                css.container,
                this.props.value && uuiMod.checked,
                this.props.isDisabled && uuiMod.disabled,
                this.props.isReadonly && uuiMod.readonly,
                this.props.isInvalid && uuiMod.invalid,
                this.props.cx
            ) }>
                <input
                    type="radio"
                    checked={ this.props.value }
                    className={ uuiElement.radioInput }
                    disabled={ this.props.isReadonly || this.props.isDisabled }
                    readOnly={ this.props.isReadonly }
                    aria-checked={this.props.value}
                    tabIndex={ (!this.props.isReadonly || !this.props.isDisabled) ? 0 : undefined }
                    onChange={ (!this.props.isReadonly || !this.props.isDisabled) ? this.handleChange : null }
                />
                { this.props.value && <IconContainer icon={ this.props.icon } cx={ css.circle } /> }
                { (this.props.renderLabel || this.props.label) && (
                    <span role="label" className={ uuiElement.inputLabel }>
                        { this.props.renderLabel ? this.props.renderLabel() : this.props.label }
                    </span>
                ) }
            </label>
        );
    }
}