import * as React from 'react';
import * as css from './Switch.scss';
import { cx, IHasRawProps, uuiMod, uuiElement, IHasCX, IDisableable, IEditable, IHasLabel, uuiMarkers, IAnalyticableOnChange, UuiContexts, UuiContext } from "@epam/uui";

export interface SwitchProps extends IHasCX, IDisableable, IEditable<boolean>, IHasLabel, IAnalyticableOnChange<boolean>, IHasRawProps<HTMLInputElement> {}

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
                role="switch"
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
                        onChange={ this.toggle }
                        disabled={ this.props.isDisabled }
                        checked={ this.props.value }
                        readOnly={ this.props.isReadonly }
                        aria-checked={ this.props.value }
                        aria-hidden={ true }
                        tabIndex={ (!this.props.isReadonly || !this.props.isDisabled) ? 0 : -1 }
                        { ...this.props.rawProps }
                    />
                    <div className={ uuiElement.switchToggler } />
                </div>
                <div role="label" className={ uuiElement.inputLabel }>{ this.props.label }</div>
            </label>
        );
    }
}