import * as React from 'react';
import css from './Slider.module.scss';
import { Slide, SlideProps } from './Slide';
import { IconButton } from '@epam/uui';
import { IAnalyticableOnChange, UuiContext, UuiContexts } from '@epam/uui-core';
import { ReactComponent as ArrowPrev } from '../../icons/navigation-left.svg';
import { ReactComponent as ArrowNext } from '../../icons/navigation-right.svg';

export interface SliderProps extends IAnalyticableOnChange<number> {
    slides: SlideProps[] | null;
}

export class Slider extends React.Component<SliderProps> {
    public static contextType = UuiContext;
    public context: UuiContexts;
    constructor(props: SliderProps) {
        super(props);
    }

    state = { activeSlide: 0 };
    handlePreviousClick = () => {
        this.setState({ activeSlide: this.state.activeSlide - 1 });

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(this.state.activeSlide - 1, this.state.activeSlide);
            this.context.uuiAnalytics.sendEvent(event);
        }
    };

    handleNextClick = () => {
        this.setState({ activeSlide: this.state.activeSlide + 1 });

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(this.state.activeSlide + 1, this.state.activeSlide);
            this.context.uuiAnalytics.sendEvent(event);
        }
    };

    render() {
        const { slides } = this.props;
        return (
            <div className={ css.slider }>
                <div className={ css.controls }>
                    <IconButton
                        rawProps={ { 'aria-label': 'Backward' } }
                        color="info"
                        isDisabled={ this.state.activeSlide === 0 }
                        icon={ ArrowPrev }
                        onClick={ this.handlePreviousClick }
                    />
                    <IconButton
                        rawProps={ { 'aria-label': 'Forward' } }
                        color="info"
                        isDisabled={ this.state.activeSlide === this.props.slides.length - 1 }
                        icon={ ArrowNext }
                        onClick={ this.handleNextClick }
                    />
                </div>
                <Slide { ...slides[this.state.activeSlide] } />
            </div>
        );
    }
}
