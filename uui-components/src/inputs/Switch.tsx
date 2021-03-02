import * as React from 'react';
import * as css from './Switch.scss';
import cx from 'classnames';
import {uuiMod, uuiElement, IHasCX, IDisableable, IEditable, IHasLabel, uuiMarkers, IAnalyticableOnChange, uuiContextTypes, UuiContexts} from "@epam/uui";

export interface SwitchProps extends IHasCX, IDisableable, IEditable<boolean>, IHasLabel, IAnalyticableOnChange<boolean> {
}

export class Switch extends React.Component<SwitchProps, any> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    
    toggle = () => {
        this.props.onValueChange(!this.props.value);
        
        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(!this.props.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    handleKeyDown = (e: any): void => {
        if (e.keyCode === 32) {
            e.preventDefault();
            this.toggle();
        }
    }

    render() {
        return (
            <div
                className={ cx(
                    css.container,
                    this.props.cx,
                    this.props.isDisabled && uuiMod.disabled,
                    (!this.props.isReadonly && !this.props.isDisabled) && uuiMarkers.clickable,
                ) }
                onClick={ !this.props.isDisabled ? this.toggle : undefined }
                tabIndex={ 0 }
                onKeyDown={ (e) => !this.props.isDisabled && this.handleKeyDown }
            >
                <div className={ cx(uuiElement.switchBody, this.props.value && uuiMod.checked) }>
                    <div className={ cx(uuiElement.switchToggler) }/>
                </div>
                <div className={ uuiElement.inputLabel }>{ this.props.label }</div>
            </div>
        );
    }
}