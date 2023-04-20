import * as React from 'react';
import range from 'lodash.range';
import {
    IHasCX, Icon, uuiMod, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import {
    FlexRow, VPanel, FlexCell, IconContainer,
} from '../layout';
import css from './Carousel.scss';

export interface CarouselProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    items: Record<string, any>[];
    renderItem: (item: Record<string, any>) => React.ReactNode;
    divideBy: number;
    arrowIcon?: Icon;
}

export interface CarouselState {
    activeSlide: number;
}

const uuiCarousel = {
    container: 'uui-carousel-container',
    item: 'uui-carousel-item',
    itemsContainer: 'uui-carousel-items-container',
    bar: 'uui-carousel-bar',
    barItem: 'uui-carousel-bar-item',
    leftArrow: 'uui-carousel-left-arrow',
    rightArrow: 'uui-carousel-right-arrow',
};

export class Carousel extends React.Component<CarouselProps, CarouselState> {
    state = {
        activeSlide: 0,
    };

    nextPage = (maxPage: number) => () => {
        if (this.state.activeSlide < maxPage) {
            this.setState((prevState) => ({ activeSlide: prevState.activeSlide + 1 }));
        } else {
            this.setState({ activeSlide: 0 });
        }
    };

    prevPage = (maxPage: number) => () => {
        if (this.state.activeSlide > 0) {
            this.setState((prevState) => ({ activeSlide: prevState.activeSlide - 1 }));
        } else {
            this.setState({ activeSlide: maxPage });
        }
    };

    renderCarouselBar = (slidesCount: number) => {
        return range(slidesCount).map((x, idx) => (
            <div
                onClick={ () => this.setState({ activeSlide: idx }) }
                key={ idx }
                className={ cx(uuiCarousel.barItem, this.state.activeSlide === idx && uuiMod.active) }
            />
        ));
    };

    render() {
        const { activeSlide } = this.state;
        const { divideBy } = this.props;
        const slidesCount = Math.ceil((this.props.items?.length || 0) / divideBy);
        const maxPage = slidesCount - 1;

        return (
            <VPanel cx={ cx(css.container, uuiCarousel.container, this.props.cx) } rawProps={ this.props.rawProps } forwardedRef={ this.props.forwardedRef }>
                <FlexRow>
                    <div className={ uuiCarousel.bar }>{this.renderCarouselBar(slidesCount)}</div>
                </FlexRow>
                <FlexRow>
                    <IconContainer cx={ uuiCarousel.leftArrow } onClick={ this.prevPage(maxPage) } icon={ this.props.arrowIcon } />
                    <div className={ uuiCarousel.itemsContainer }>
                        {this.props.items?.slice(activeSlide * divideBy, (activeSlide + 1) * divideBy).map((item, index) => (
                            <FlexCell cx={ uuiCarousel.item } key={ index } grow={ 1 }>
                                {this.props.renderItem(item)}
                            </FlexCell>
                        ))}
                    </div>
                    <IconContainer cx={ uuiCarousel.rightArrow } onClick={ this.nextPage(maxPage) } icon={ this.props.arrowIcon } />
                </FlexRow>
            </VPanel>
        );
    }
}
