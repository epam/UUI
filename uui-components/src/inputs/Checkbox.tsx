import * as React from 'react';
import cx from 'classnames';
import * as css from './Checkbox.scss';
import { Icon, uuiMod, uuiElement, isClickableChildClicked, CheckboxCoreProps, UuiContexts, UuiContext } from '@epam/uui';
import { IconContainer } from '../layout';

export interface CheckboxProps extends CheckboxCoreProps {
    icon?: Icon;
    indeterminateIcon?: Icon;
    renderLabel?(): React.ReactNode;
}

export class Checkbox extends React.Component<CheckboxProps, any> {
    static contextType = UuiContext;
    context: UuiContexts;

    handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        !isClickableChildClicked(e) && this.props.onValueChange(!this.props.value);

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
                    this.props.cx,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                ) }>
                <input
                    type="checkbox"
                    onChange={(!this.props.isDisabled && !this.props.isReadonly) ? this.handleChange : null}
                    className={ cx(uuiElement.checkbox, (this.props.value || this.props.indeterminate) && uuiMod.checked) }
                    disabled={this.props.isDisabled}
                    readOnly={this.props.isReadonly}
                    aria-checked={this.props.value}
                    checked={this.props.value}
                />
                    { this.props.value && !this.props.indeterminate && <IconContainer icon={ this.props.icon } /> }
                    { this.props.indeterminate && <IconContainer icon={ this.props.indeterminateIcon } /> }
                    { (this.props.renderLabel || this.props.label) && (
                        <span role="label" className={ uuiElement.inputLabel }>
                            { this.props.renderLabel ? this.props.renderLabel() : this.props.label }
                        </span>
                    ) }
            </label>
        );
    }
}