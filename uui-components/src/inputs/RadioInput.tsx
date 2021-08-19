import * as React from 'react';
import * as css from './RadioInput.scss';
import { IHasRawProps, cx, IHasCX, IDisableable, IEditable, IHasLabel, Icon, uuiMod, uuiElement, ICanBeReadonly, IAnalyticableOnChange, uuiContextTypes, UuiContexts} from "@epam/uui";
import { IconContainer } from '../layout';

export interface RadioInputProps extends IHasCX, IDisableable, IEditable<boolean>, IHasLabel, ICanBeReadonly, IAnalyticableOnChange<boolean>, IHasRawProps<HTMLLabelElement> {
    icon?: Icon;
    renderLabel?(): React.ReactNode;
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
            <label
                className={ cx(
                    css.container,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    this.props.cx
                ) }
                { ...this.props.rawProps }
            >
                <div className={ cx(uuiElement.radioInput, this.props.value && uuiMod.checked) }>
                    <input
                        type="radio"
                        checked={ this.props.value }
                        disabled={ this.props.isReadonly || this.props.isDisabled }
                        readOnly={ this.props.isReadonly }
                        onChange={ this.handleChange }
                        aria-checked={ this.props.value == undefined ? false : this.props.value }
                    />
                    { this.props.value && <IconContainer icon={ this.props.icon } cx={ css.circle } /> }
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