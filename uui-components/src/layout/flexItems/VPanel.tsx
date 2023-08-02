import * as React from 'react';
import css from './VPanel.module.scss';
import {
    isEventTargetInsideClickable, uuiMarkers, VPanelProps, UuiContexts, cx, UuiContext,
} from '@epam/uui-core';

export class VPanel extends React.Component<VPanelProps> {
    static contextType = UuiContext;
    context: UuiContexts;
    handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        this.props.onClick && !isEventTargetInsideClickable(e) && this.props.onClick(e);
        this.context.uuiAnalytics.sendEvent(this.props.clickAnalyticsEvent);
    };

    render() {
        return (
            <div
                onClick={ this.props.onClick && this.handleClick }
                style={ this.props.style }
                className={ cx(this.props.cx, css.container, this.props.onClick && uuiMarkers.clickable) }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                {this.props.children}
            </div>
        );
    }
}
