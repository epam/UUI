import * as React from 'react';
import * as css from './Carousel.scss';
import { FlexRow, VPanel, FlexCell, IconContainer } from "../layout";
import cx from 'classnames';
import range from 'lodash.range';
import { IHasCX, Icon, uuiMod } from '@epam/uui';

export interface CarouselProps extends IHasCX {
    items: Record<string, any>[];
    renderItem: (item: Record<string, any>) => React.ReactNode;
    divideBy: number;
    arrowIcon?: Icon;
}

export interface CarouselState {
    activeSlide: number;
}

const uuiCarousel: Record<string, string> = {
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

    nextPage = (maxPage: number) => (event: any) => {

        if (this.state.activeSlide < maxPage) {
            this.setState({ activeSlide: this.state.activeSlide + 1 });
        } else {
            this.setState({ activeSlide: 0 });
        }

    }

    prevPage = (maxPage: number) => (event: any) => {
        if (this.state.activeSlide > 0) {
            this.setState({ activeSlide: this.state.activeSlide - 1 });
        } else {
            this.setState({ activeSlide: maxPage });
        }
    }

    renderCarouselBar = (slidesCount: number) => {

        return range(slidesCount).map((x, idx) =>
            <div
                onClick={ () => this.setState({ activeSlide: idx }) }
                key={ idx }
                className={ cx(uuiCarousel.barItem, this.state.activeSlide === idx && uuiMod.active) }
            />,
        );
    }

    render() {
        const slidesCount: number = Math.ceil(this.props.items && this.props.items.length / this.props.divideBy);
        const maxPage = slidesCount - 1;

        return (
            <VPanel cx={ cx(css.container, uuiCarousel.container, this.props.cx) }>
                <FlexRow>
                    <div className={ uuiCarousel.bar }>
                        { this.renderCarouselBar(slidesCount) }
                    </div>
                </FlexRow>
                <FlexRow>
                    <IconContainer cx={ uuiCarousel.leftArrow } onClick={ this.prevPage(maxPage) } icon={ this.props.arrowIcon } />
                    <div className={ uuiCarousel.itemsContainer }>
                        {
                            this.props.items && this.props.items.slice(this.state.activeSlide * this.props.divideBy, (this.state.activeSlide + 1) * this.props.divideBy)
                                .map((item: Record<string, any>, index) => (
                                    <FlexCell cx={ uuiCarousel.item } key={ index } grow={ 1 }>
                                        { this.props.renderItem(item) }
                                    </FlexCell>))
                        }
                    </div>
                    <IconContainer cx={ uuiCarousel.rightArrow } onClick={ this.nextPage(maxPage) } icon={ this.props.arrowIcon } />
                </FlexRow>
            </VPanel>
        );
    }

}