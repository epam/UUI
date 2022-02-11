import * as React from 'react';
import { UuiContexts, IHasCX, IHasChildren, IClickable, IAnalyticableClick, UuiContext, IHasRawProps, cx, IHasForwardedRef } from '@epam/uui';
import * as css from './Text.scss';

export type TextProps = IHasCX & IHasChildren & IClickable & IAnalyticableClick & IHasRawProps<HTMLDivElement> & IHasForwardedRef<HTMLDivElement>;

export class Text extends React.Component<TextProps> {
    static contextType = UuiContext;
    context: UuiContexts;

    onClick = (e: React.MouseEvent) => {
        this.props.onClick && this.props.onClick(e);
        this.context.uuiAnalytics.sendEvent(this.props.clickAnalyticsEvent);
    }

    render() {
        return (
            <div
                onClick={ this.props.onClick && this.onClick }
                className={ cx(this.props.cx, css.container) }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                { this.props.children }
            </div>
        );
    }
}