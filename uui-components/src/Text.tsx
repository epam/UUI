import * as React from 'react';
import cx from 'classnames';
import { UuiContexts, uuiContextTypes, IHasCX, IHasChildren, IClickable, IAnalyticableClick } from '@epam/uui';
import * as css from './Text.scss';

export type TextProps = IHasCX & IHasChildren & IClickable & IAnalyticableClick;

export class Text extends React.Component<TextProps> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    
    onClick = (e?: any) => {
        this.props.onClick && this.props.onClick(e);
        this.context.uuiAnalytics.sendEvent(this.props.clickAnalyticsEvent);
    }
    
    render() {
        return (
            <div onClick={ this.props.onClick && this.onClick } className={ cx(this.props.cx, css.container) }>
                { this.props.children }
            </div>
        );
    }
}