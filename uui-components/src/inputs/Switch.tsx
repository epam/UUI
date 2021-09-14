import * as React from 'react';
import * as css from './Switch.scss';
import { cx, IHasRawProps, uuiMod, uuiElement, IHasCX, IDisableable, IEditable, IHasLabel, uuiMarkers, IAnalyticableOnChange, UuiContexts, UuiContext } from "@epam/uui";

export interface SwitchProps extends IHasCX, IDisableable, IEditable<boolean>, IHasLabel, IAnalyticableOnChange<boolean>, IHasRawProps<HTMLLabelElement> {}

export class Switch extends React.Component<SwitchProps, any> {
    static contextType = UuiContext;
    context: UuiContexts;

    toggle = () => {
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
                    this.props.cx,
                    this.props.isDisabled && uuiMod.disabled,
                    (!this.props.isReadonly && !this.props.isDisabled) && uuiMarkers.clickable
                ) }
            >
                <div className={ cx(uuiElement.switchBody, this.props.value && uuiMod.checked) }>
                    <input
                        type="checkbox"
                        role="switch"
                        onChange={ this.toggle }
                        disabled={ this.props.isDisabled }
                        checked={ this.props.value }
                        aria-checked={ this.props.value == undefined ? false : this.props.value }
                        readOnly={ this.props.isReadonly }
                    />
                    <div className={ uuiElement.switchToggler } />
                </div>
                <div className={ uuiElement.inputLabel }>{ this.props.label }</div>
            </label>
        );
    }
}