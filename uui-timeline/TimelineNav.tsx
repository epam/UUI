import * as React from 'react';
import { TimelineController } from './TimelineController';
import * as css from './TimelineNav.scss';
import { Scales, scales, scaleSteps } from './helpers';

import * as svgScales from './fit.svg';
import * as svgPlus from './plus.svg';
import * as svgMinus from './minus.svg';
import { Icon } from '@epam/uui';
import { Svg } from '@epam/uui-components';
import { i18n } from "./i18n";

export interface TimelineNavProps {
    timelineController: TimelineController;
}

export class TimelineNav extends React.Component<TimelineNavProps, {}> {
    componentDidMount() {
        this.props.timelineController.subscribe(this.handleForceUpdate);
    }

    componentWillUnmount() {
        this.props.timelineController.unsubscribe(this.handleForceUpdate);
    }

    private handleForceUpdate = () => {
        this.forceUpdate();
    }

    renderIcon(svgIcon: Icon) {
        return (
            <Svg svg={ svgIcon }/>
        );
    }

    renderFit() {
        const minScale = this.props.timelineController.options.minScale;
        const maxScale = this.props.timelineController.options.maxScale;

        let shortcuts = [
            { text: i18n.timelineNav.Hours, scale: scales.hour },
            { text: i18n.timelineNav.Days, scale: scales.day },
            { text: i18n.timelineNav.Weeks, scale: scales.week },
            { text: i18n.timelineNav.Months, scale: scales.month },
            { text: i18n.timelineNav.Years, scale: scales.year },
        ].filter(i => ((!minScale || i.scale >= minScale) && (!maxScale || i.scale <= maxScale)));

        return (
            <div className={ css.actions }>
                <div className={ css.button }>
                    <div className={ css.fit }>
                        { this.renderIcon(svgScales) }
                    </div>
                </div>
                <div className={ css.actionsForgivingZone } />
                <ul className={ css.actionsDropdown }>
                    <li className={ css.actionsScale }
                        onClick={ () => this.props.timelineController.moveToday() }
                    >
                        { i18n.timelineNav.Today }
                    </li>
                    { shortcuts.map((action, i) => (
                        <li
                            className={ css.actionsScale }
                            onClick={ () => {
                                this.props.timelineController.zoomTo(action.scale);
                            } }
                            key={ 'action-' + i }
                        >
                            { action.text }
                        </li>
                    )) }
                </ul>
            </div>
        );
    }

    renderZoomIn() {
        return (
            <div
                className={ `${css.button} ${!this.props.timelineController.canZoomBy(1) && css.disabled}` }
                onClick={ () => this.props.timelineController.zoomBy(1) }
            >
                <div className={ css.zoomIn }>
                    { this.renderIcon(svgPlus) }
                </div>
            </div>
        );
    }

    renderZoomOut() {
        return (
            <div
                className={ `${css.button} ${!this.props.timelineController.canZoomBy(-1) && css.disabled}` }
                onClick={ () => this.props.timelineController.zoomBy(-1) }
            >
                <div className={ css.zoomOut }>
                    { this.renderIcon(svgMinus) }
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                { this.renderFit() }
                { this.renderZoomIn() }
                { this.renderZoomOut() }
            </div>
        );
    }
}

export const timelineNav = React.createFactory(TimelineNav);
