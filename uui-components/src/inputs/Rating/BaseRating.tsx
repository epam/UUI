import * as React from 'react';
import cx from 'classnames';
import * as css from './BaseRating.scss';
import { IDisableable, IEditable, ICanBeInvalid, ICanBeReadonly, IHasCX, uuiMod } from '@epam/uui';

export interface BaseRatingProps<TValue> extends IHasCX, IDisableable, IEditable<TValue>, ICanBeInvalid, ICanBeReadonly {
    from?: number;
    to?: number;
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

    componentDidUpdate(prevProps: BaseRatingProps<number>, prevState: BaseRatingState) {
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
        } else if (rating <= this.props.from - this.props.step) {
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

    render () {
        const isReadonly = this.props.isReadonly || this.props.isDisabled;

        return (
            <div
                className={ cx(css.container, this.props.isDisabled && uuiMod.disabled, this.props.isInvalid && uuiMod.invalid, isReadonly && css.containerReadonly, this.props.cx) }
                onMouseMove={ (e) => !isReadonly && this.onMouseMove(e) }
                onMouseLeave={ () => !isReadonly && this.onMouseLeave() }
                onMouseUp={ (e) => !isReadonly && this.onMouseUp(e) }
                onTouchEnd={ (e) => !isReadonly && this.onTouchEnd(e) }
                ref={ (container) => this.container = container }
            >
                { this.props.renderRating(this.state.rating, this.getMarkWidth(), this.getNumberOfMarks()) }
            </div>
        );
    }
}