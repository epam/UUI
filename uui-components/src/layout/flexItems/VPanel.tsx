import * as React from 'react';
import css from './VPanel.module.scss';
import {
    isEventTargetInsideClickable, uuiMarkers, VPanelProps, cx, useUuiContext,
} from '@epam/uui-core';

export function VPanel(props: VPanelProps) {
    const { uuiAnalytics } = useUuiContext();

    const handleClick = (e: React.SyntheticEvent<HTMLDivElement>) => {
        props.onClick && !isEventTargetInsideClickable(e) && props.onClick(e);
        uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    return (
        <div
            onClick={ props.onClick && handleClick }
            style={ props.style }
            className={ cx(props.cx, css.container, props.onClick && uuiMarkers.clickable) }
            ref={ props.ref }
            { ...props.rawProps }
        >
            {props.children}
        </div>
    );
}
