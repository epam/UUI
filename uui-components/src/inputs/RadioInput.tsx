import * as React from 'react';
import cx from 'classnames';
import * as css from './RadioInput.scss';
import {IHasCX, IDisableable, IEditable, IHasLabel, Icon, handleSpaceKey, uuiMod, uuiElement, ICanBeReadonly, IAnalyticableOnChange, uuiContextTypes, UuiContexts} from "@epam/uui";
import { IconContainer } from '../layout';

export interface RadioInputProps extends IHasCX, IDisableable, IEditable<boolean>, IHasLabel, ICanBeReadonly, IAnalyticableOnChange<boolean> {
    icon?: Icon;
    renderLabel?(): any;
}

export class RadioInput extends React.Component<RadioInputProps, any> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    
    handleChange = () => {
        this.props.onValueChange(!this.props.value);
        
        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(!this.props.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    render() {
        return (
            <div
                className={ cx(css.container,  this.props.isDisabled && uuiMod.disabled, this.props.isReadonly && uuiMod.readonly, this.props.isInvalid && uuiMod.invalid, this.props.cx) }
                onClick={ (!this.props.isDisabled && !this.props.isReadonly) ? this.handleChange : undefined }
                onKeyDown={ (e) => (!this.props.isDisabled && !this.props.isReadonly) && handleSpaceKey(e, this.handleChange) }
                tabIndex={ 0 }
            >
                <div
                    className={ cx(uuiElement.radioInput, this.props.value && uuiMod.checked) }
                >
                    { this.props.value && <IconContainer icon={ this.props.icon } /> }
                </div>
                { (this.props.renderLabel || this.props.label) && <div className={ uuiElement.inputLabel } >{ this.props.renderLabel ? this.props.renderLabel() : this.props.label }</div> }
            </div>
        );
    }
}