import * as React from 'react';
import { uuiSlider } from './SliderBase';
import cx from 'classnames';
import { IHasCX, uuiElement } from '@epam/uui';
import * as css from '../../overlays/Tooltip.scss';
import { Manager, Reference, Popper } from 'react-popper';
import { Portal } from '../../overlays/Portal';

interface SliderHandleProps extends IHasCX {
    onUpdate(mouseX: number): void;
    handleActiveState?(isActive: boolean): void;
    tooltipContent: number;
    isActive: boolean;
    offset: number;
    showTooltip?: boolean;
}

interface SliderHandleState {
    isHovered: boolean;
}

export class SliderHandle extends React.Component<SliderHandleProps, SliderHandleState> {
    state = {
        isHovered: false,
    };

    sliderHandle: HTMLElement | null;

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove as React.EventHandler<any>);
        document.addEventListener('mouseup', this.handleMouseUp as React.EventHandler<any>);
        this.sliderHandle?.addEventListener('mouseenter', this.handleMouseEnter as React.EventHandler<any>);
        this.sliderHandle?.addEventListener('mouseleave', this.handleMouseLeave as React.EventHandler<any>);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove as React.EventHandler<any>);
        document.removeEventListener('mouseup', this.handleMouseUp as React.EventHandler<any>);
        this.sliderHandle?.removeEventListener('mouseenter', this.handleMouseEnter as React.EventHandler<any>);
        this.sliderHandle?.removeEventListener('mouseleave', this.handleMouseLeave as React.EventHandler<any>);
    }

    handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (this.props.isActive) {
            this.props.onUpdate(e.clientX);
        }
    }

    handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        this.props.handleActiveState && this.props.handleActiveState(true);
    }

    handleMouseUp = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (this.props.isActive) {
            this.props.handleActiveState && this.props.handleActiveState(false);
        }
    }
    handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
        this.setState({ isHovered: true });
    }
    handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>): void => {
        this.setState({ isHovered: false });
    }

    renderTooltip() {
        const content = this.props.tooltipContent;

        return (
            <div className={ uuiElement.tooltipBody }>
                { content }
            </div>
        );
    }
    render() {
        return (
            <Manager>
                <Reference>
                    { (targetProps) =>
                        <div
                            ref={ (SliderHandle) => { this.sliderHandle = SliderHandle; targetProps.ref(SliderHandle); } }
                            className={ cx(uuiSlider.handle, this.props.cx) }
                            style={ { transform: `translateX(${this.props.offset || 0}px)` } }
                            onMouseDown={ this.handleMouseDown }
                            onMouseUp={ this.handleMouseUp }
                        />
                    }
                </Reference>
                <Portal>
                    <Popper placement={ 'top' } key={ this.props.offset }>
                        {
                            ({ ref, style, placement }) => {
                                return (this.props.isActive || this.state.isHovered) && <div
                                    ref={ ref }
                                    style={ style }
                                    data-placement={ placement }
                                    className={ cx(this.props.cx, css.container, uuiElement.tooltipContainer, css.tooltipWrapper) }
                                >
                                    { this.props.showTooltip && this.renderTooltip() }
                                    <div className={ uuiElement.tooltipArrow } />
                                </div >;
                            }
                        }
                    </Popper>
                </Portal>
            </Manager>
        );
    }
}
