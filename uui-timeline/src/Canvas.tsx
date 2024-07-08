import * as React from 'react';
import cx from 'classnames';
import { TimelineController } from './TimelineController';
import { TimelineTransform } from './TimelineTransform';

export interface CanvasProps {
    canvasHeight?: number;
    className?: string;
    timelineController: TimelineController;
    renderOnTop?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
    renderCanvas?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
}
export interface CanvasState { 
    width?: number;
}

export class Canvas<TProps extends CanvasProps, TState extends CanvasState> extends React.Component<TProps, TState> {
    canvas: HTMLCanvasElement | null;
    protected canvasHeight = 60;
    constructor(props: TProps) {
        super(props);
        this.state = {} as Readonly<TState>;
    }

    componentDidMount() {
        this.props.timelineController.subscribe(this.handleRenderCanvas);
        this.props.timelineController.subscribe(this.handleResize);
        this.handleRenderCanvas(this.props.timelineController.getTransform());
    }

    componentDidUpdate() {
        this.handleRenderCanvas(this.props.timelineController.getTransform());
    }

    componentWillUnmount() {
        this.props.timelineController.unsubscribe(this.handleRenderCanvas);
        this.props.timelineController.unsubscribe(this.handleResize);
    }

    handleResize = (t: TimelineTransform) => {
        if (t.widthPx !== this.state.width) {
            this.setState((state) => ({ ...state, width: t.widthPx }));
        }
    };

    handleRenderCanvas = (t: TimelineTransform) => {
        const ctx = this.canvas!.getContext('2d')!;
        ctx.save();
        ctx.scale(devicePixelRatio, devicePixelRatio);
        this.props.renderCanvas(ctx, t);
        this.props.renderOnTop?.(ctx, t);
        ctx.restore();
    };

    protected renderCanvasElement(props?: any): JSX.Element {
        const width = this.state.width ?? this.props.timelineController.currentViewport.widthPx;
        const height = this.props.canvasHeight ?? this.canvasHeight;
        return (
            <canvas
                className={ cx(this.props.className, props && props.className) }
                style={ { width, height } }
                width={ width * devicePixelRatio }
                height={ height * devicePixelRatio }
                ref={ (c) => {
                    props && props.ref && props.ref(c);
                    this.canvas = c;
                } }
                { ...props }
            />
        );
    }

    render() {
        return this.renderCanvasElement();
    }
}
