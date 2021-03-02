import * as React from 'react';
import cx from 'classnames';
import { TimelineController } from './TimelineController';
import { TimelineTransform } from './TimelineTransform';

export interface BaseTimelineCanvasComponentProps {
    className?: string;
    timelineController: TimelineController;
}

export abstract class BaseTimelineCanvasComponent<TProps extends BaseTimelineCanvasComponentProps, TState = {}> 
    extends React.Component<TProps, TState> {
    canvas: HTMLCanvasElement | null;
    protected canvasHeight = 60;

    componentDidMount() {
        this.props.timelineController.subscribe(this.handleRenderCanvas);
        this.handleRenderCanvas(this.props.timelineController.getTransform());
    }

    componentDidUpdate() {
        this.handleRenderCanvas(this.props.timelineController.getTransform());
    }

    componentWillUnmount() {
        this.props.timelineController.unsubscribe(this.handleRenderCanvas); 
    }

    handleRenderCanvas = (t: TimelineTransform) => this.renderCanvas(this.canvas!.getContext('2d')!, t);

    protected abstract renderCanvas(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;

    protected renderCanvasElement(props?: any): JSX.Element {
        return <canvas
            className={ cx(this.props.className, props && props.className) }
            width={ this.props.timelineController.currentViewport.widthPx }
            height={ this.canvasHeight }
            ref={ c => { props && props.ref && props.ref(c); this.canvas = c; } }
            { ...props }
        />;
    }

    render() {
        return this.renderCanvasElement();
    }
}