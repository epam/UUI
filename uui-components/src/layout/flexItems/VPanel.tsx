import * as React from 'react';
import * as css from './VPanel.scss';
import {
    isClickableChildClicked,
    uuiMarkers,
    VPanelProps,
    UuiContexts,
    cx,
    UuiContext,
} from '@epam/uui';

export class VPanel extends React.Component<VPanelProps> {
    static contextType = UuiContext;
    context: UuiContexts;

    handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        this.props.onClick && !isClickableChildClicked(e) && this.props.onClick(e);
        this.context.uuiAnalytics.sendEvent(this.props.clickAnalyticsEvent);
    }

    render() {
        return (
            <div
                onClick={ this.props.onClick && this.handleClick }
                style={ this.props.style }
                className={ cx(
                    this.props.cx,
                    css.container,
                    this.props.onClick && uuiMarkers.clickable
                ) }
                { ...this.props.rawProps }
            >
                { this.props.children }
            </div>
        );
    }
}