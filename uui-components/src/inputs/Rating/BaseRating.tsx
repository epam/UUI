import * as React from 'react';
import {
    cx, IDisableable, ICanBeReadonly, IHasCX, uuiMod, IHasRawProps, IHasForwardedRef, IControlled,
} from '@epam/uui-core';
import css from './BaseRating.module.scss';

export interface BaseRatingProps<TValue>
    extends IHasCX,
    IDisableable,
    IControlled<TValue>,
    ICanBeReadonly,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement> {
    from?: number;
    to?: number;
    /**
     * @default 1
     */
    step?: 0.5 | 1;
    renderRating?: (rating: number, markWidth: number, numberOfMarks: number) => React.ReactNode;
}

interface BaseRatingState {
    rating?: number;
    containerWidth?: number;
}

export class BaseRating extends React.Component<BaseRatingProps<number>, BaseRatingState> {
    container: HTMLElement | null;
    constructor(props: BaseRatingProps<number>) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState({
            rating: this.checkRating(this.props.value),
            containerWidth: this.getContainerWidth(),
        });
    }

    componentDidUpdate(prevProps: BaseRatingProps<number>) {
        if (this.state.containerWidth !== this.getContainerWidth()) {
            this.setState({
                containerWidth: this.getContainerWidth(),
            });
        }
        if (this.props.value !== prevProps.value) {
            this.setState({
                rating: this.checkRating(this.props.value),
            });
        }
    }

    getContainerWidth() {
        return this.container?.offsetWidth;
    }

    getContainerOffsetLeft() {
        return this.container.getBoundingClientRect().left;
    }

    getNumberOfMarks() {
        const step = this.props.step || 1;
        return (this.props.to - this.props.from) / step + 1;
    }

    getMarkWidth() {
        return this.state.containerWidth / this.getNumberOfMarks();
    }

    checkRating(rating: number): number {
        if (!rating && rating !== 0) {
            return rating;
        } else if (rating < this.props.from - this.props.step) {
            return this.props.from;
        } else if (rating > this.props.to) {
            return this.props.to;
        } else {
            return rating;
        }
    }

    getRatingFromWidth(width: number): number {
        const step = this.props.step || 1;

        return step * Math.ceil(width / this.getMarkWidth()) + (this.props.from - step);
    }

    onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const width = e.pageX - this.getContainerOffsetLeft();
        if (width > 0 && width <= this.state.containerWidth) {
            this.setState({ rating: this.checkRating(this.getRatingFromWidth(width)) });
        }
    }

    onMouseLeave() {
        this.setState({ rating: this.checkRating(this.props.value) });
    }

    onMouseUp(e: React.MouseEvent<HTMLDivElement>) {
        const width = e.pageX - this.getContainerOffsetLeft();
        this.props.onValueChange(this.checkRating(this.getRatingFromWidth(width)));
    }

    onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
        const touch = e.changedTouches[0];
        const width = touch.pageX - this.getContainerOffsetLeft();
        this.props.onValueChange(this.checkRating(this.getRatingFromWidth(width)));
    }

    onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        const { from, to } = this.props;
        const { rating } = this.state;
        const step = this.props.step || 1;

        if (e.key === 'ArrowLeft') {
            if (rating - step < from) return;
            else this.setState({ rating: rating - step });
        } else if (e.key === 'ArrowRight') {
            if (rating + step > to) return;
            else this.setState({ rating: rating + step });
        }
    }

    handleRef = (container: HTMLDivElement) => {
        this.container = container;
        (this.props.forwardedRef as React.RefCallback<HTMLDivElement>)?.(container);
    };

    render() {
        const isReadonly = this.props.isReadonly || this.props.isDisabled;

        return (
            <div
                role="slider"
                aria-valuenow={ this.props.value || 0 }
                aria-valuemax={ this.props.to }
                aria-valuemin={ this.props.from }
                tabIndex={ 0 }
                onKeyDown={ (e) => !isReadonly && this.onKeyDown(e) }
                className={ cx(css.container, this.props.isDisabled && uuiMod.disabled, isReadonly && css.containerReadonly, this.props.cx) }
                onMouseMove={ (e) => !isReadonly && this.onMouseMove(e) }
                onMouseLeave={ () => !isReadonly && this.onMouseLeave() }
                onMouseUp={ (e) => !isReadonly && this.onMouseUp(e) }
                onTouchEnd={ (e) => !isReadonly && this.onTouchEnd(e) }
                ref={ this.handleRef }
                { ...this.props.rawProps }
            >
                {this.props.renderRating(this.state.rating, this.getMarkWidth(), this.getNumberOfMarks())}
            </div>
        );
    }
}
