import * as React from 'react';
import cx from 'classnames';
import * as css from './Checkbox.scss';
import {  Icon, uuiMod, uuiElement, uuiMarkers, handleSpaceKey, isClickableChildClicked, CheckboxCoreProps, uuiContextTypes, UuiContexts } from '@epam/uui';
import { IconContainer } from '../layout';

export interface CheckboxProps extends CheckboxCoreProps {
    icon?: Icon;
    indeterminateIcon?: Icon;
    renderLabel?(): any;
}

export class Checkbox extends React.Component<CheckboxProps, any> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    handleChange = (e: React.SyntheticEvent<HTMLDivElement>) => {
        !isClickableChildClicked(e) && this.props.onValueChange(!this.props.value);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(!this.props.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    render() {
        return (
            <div
                className={ cx(
                    css.container,
                    this.props.cx,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    !this.props.isDisabled && uuiMarkers.clickable,
                ) }
                onClick={ (!this.props.isDisabled && !this.props.isReadonly) ? this.handleChange : undefined }
                tabIndex={ (!this.props.isDisabled && !this.props.isReadonly) ? 0 : undefined }
                onKeyDown={ (e) => !this.props.isDisabled && !this.props.isReadonly && handleSpaceKey(e, this.handleChange) }
            >
                <div
                    className={ cx(uuiElement.checkbox, (this.props.value || this.props.indeterminate) && uuiMod.checked) }
                >
                    { this.props.value && !this.props.indeterminate && <IconContainer icon={ this.props.icon } /> }
                    { this.props.indeterminate && <IconContainer icon={ this.props.indeterminateIcon } /> }
                </div>
                { (this.props.renderLabel || this.props.label) && <div className={ uuiElement.inputLabel } >{ this.props.renderLabel ? this.props.renderLabel() : this.props.label }</div> }
            </div>
        );
    }
}