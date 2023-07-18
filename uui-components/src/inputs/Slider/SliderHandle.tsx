import * as React from 'react';
import {
    IHasCX, uuiElement, cx, IHasRawProps,
} from '@epam/uui-core';
import css from './SliderHandle.module.scss';
import { Manager, Reference, Popper } from 'react-popper';
import { Portal } from '../../overlays/Portal';
import { uuiSlider } from './SliderBase';

interface SliderHandleProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    onUpdate(mouseX: number): void;
    onKeyDownUpdate?(type: 'right' | 'left'): void;
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
    };

    handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        this.props.handleActiveState && this.props.handleActiveState(true);
    };

    handleMouseUp = (): void => {
        if (this.props.isActive) {
            this.props.handleActiveState && this.props.handleActiveState(false);
        }
    };

    handleMouseEnter = (): void => {
        this.setState({ isHovered: true });
    };

    handleMouseLeave = (): void => {
        this.setState({ isHovered: false });
    };

    handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
        e.preventDefault();
        this.props.handleActiveState && this.props.handleActiveState(true);
        this.setState({ isHovered: true });
    };

    handleBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
        e.preventDefault();
        this.props.handleActiveState && this.props.handleActiveState(false);
        this.setState({ isHovered: false });
    };

    handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'ArrowLeft') {
            this.props.onKeyDownUpdate('left');
        } else if (e.key == 'ArrowRight') {
            this.props.onKeyDownUpdate('right');
        }
    };

    renderTooltip() {
        const content = this.props.tooltipContent;

        return <div className={ uuiElement.tooltipBody }>{content}</div>;
    }

    render() {
        return (
            <Manager>
                <Reference>
                    {(targetProps) => (
                        <div
                            tabIndex={ 0 }
                            ref={ (handle) => {
                                this.sliderHandle = handle;
                                (targetProps.ref as React.RefCallback<any>)(handle);
                            } }
                            className={ cx(uuiSlider.handle, this.props.cx) }
                            style={ { transform: `translateX(${this.props.offset || 0}px)` } }
                            onMouseDown={ this.handleMouseDown }
                            onMouseUp={ this.handleMouseUp }
                            onKeyDown={ this.handleKeyDown }
                            onFocus={ this.handleFocus }
                            onBlur={ this.handleBlur }
                            { ...this.props.rawProps }
                        />
                    )}
                </Reference>
                <Portal>
                    <Popper placement="top" key={ this.props.offset }>
                        {({ ref, style, placement }) => {
                            return (
                                (this.props.isActive || this.state.isHovered) && (
                                    <div
                                        ref={ ref }
                                        style={ style }
                                        data-placement={ placement }
                                        className={ cx(this.props.cx, css.container, uuiElement.tooltipContainer, css.tooltipWrapper) }
                                    >
                                        {this.props.showTooltip && this.renderTooltip()}
                                        <div className={ uuiElement.tooltipArrow } />
                                    </div>
                                )
                            );
                        }}
                    </Popper>
                </Portal>
            </Manager>
        );
    }
}
