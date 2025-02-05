import * as React from 'react';
import css from './Timeline.module.scss';
import {
    msPerDay, TimelineController, TimelineScale, TimelineNav, TimelineGrid, Item,
} from '@epam/uui-timeline';
import { DemoCanvasBars } from './DemoCanvasBars';
import { Button } from '@epam/loveship';
import { svc } from '../../services';

interface Row {
    items: Item[];
}

const selectedDay = new Date(2018, 7, 9, 12, 0, 0);

export class Timeline extends React.Component {
    timeline: any = null;
    timelineController = new TimelineController({ center: new Date(2018, 7, 15), pxPerMs: 32 / msPerDay, widthPx: 0 });
    dataRows: Row[] = [];
    constructor(props: {}, context: {}) {
        super(props, context);
        svc.api.demo.schedules().then((employees) => {
            const rows = employees.map((employee) => ({ items: employee.events }));
            this.dataRows = rows.map((employee) => {
                const items: Item[] = employee.items.map((event) => ({
                    from: new Date(event.startDate),
                    to: new Date(event.endDate),
                    color: event.status === 'FREE' ? '#acd24e' : '#c0c3ce',
                    minPixPerDay: event.eventType === 'EXCHANGE' ? 200 : 10,
                    fillType: event.status === 'TENTATIVE' ? 'shaded' : 'solid',
                    priority: event.status === 'FREE' ? 0 : event.status === 'TENTATIVE' ? 1 : 2,
                    opacity: event.status === 'FREE' ? 0.3 : 1.0,
                    height: event.status === 'FREE' ? 30 : 18,
                }));
                return { items: items };
            });
            this.forceUpdate();
        });
    }

    componentDidMount() {
        this.timelineController.setWidth(this.timeline.offsetWidth);
        this.forceUpdate();

        window.onresize = () => {
            this.timelineController.setViewport(
                {
                    center: this.timelineController.currentViewport.center,
                    pxPerMs: this.timeline.clientWidth / msPerDay,
                    widthPx: this.timeline.clientWidth,
                },
                false,
            );
            this.forceUpdate();
        };
    }

    componentWillUnmount() {
        window.onresize = null;
    }

    handleZoomToDay = () => {
        this.timelineController.setViewport({ center: selectedDay, pxPerMs: this.timeline.clientWidth / msPerDay, widthPx: this.timeline.clientWidth }, true);
        this.timelineController.setShiftPercent(1);
    };

    handleZoomToMonth = () => {
        this.timelineController.setViewport({ center: selectedDay, pxPerMs: 30 / msPerDay, widthPx: this.timeline.clientWidth }, true);
        this.timelineController.setShiftPercent(0.3);
    };

    render() {
        return (
            <div
                ref={ (el) => {
                    this.timeline = el;
                } }
                className={ css.timeline }
                onWheel={ (e) => this.timelineController.handleWheelEvent(e.nativeEvent as WheelEvent) }
            >
                <div className={ css.layer } onMouseDown={ this.timelineController.startDrag }>
                    <TimelineGrid className={ css.grid } timelineController={ this.timelineController } />
                </div>
                <div className={ css.layer } onMouseDown={ this.timelineController.startDrag }>
                    <div className={ css.header }>
                        <TimelineScale timelineController={ this.timelineController } />
                    </div>
                    {this.dataRows.map((row, index) => (
                        <div className={ css.row } key={ 'row-' + index }>
                            <DemoCanvasBars timelineController={ this.timelineController } items={ row.items } />
                        </div>
                    ))}
                </div>
                <div className={ css.nav }>
                    <TimelineNav timelineController={ this.timelineController } />
                    <Button fill="white" caption="Zoom to day" cx={ css.zoomButton } onClick={ this.handleZoomToDay } />
                    <Button fill="white" caption="Zoom to month" cx={ css.zoomButton } onClick={ this.handleZoomToMonth } />
                </div>
            </div>
        );
    }
}
