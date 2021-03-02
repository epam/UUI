import React from 'react';
import { BaseRating, IconContainer } from '@epam/uui-components';
import { Icon, IEditable } from '@epam/uui';
import * as css from './SliderRating.scss';
import * as lineGrayIcon from '../icons/slider-rating/line_gray_icon.svg';
import * as lineRedIcon from '../icons/slider-rating/line_red_icon.svg';
import * as lineYellowIcon from '../icons/slider-rating/line_yellow_icon.svg';
import * as lineBlueIcon from '../icons/slider-rating/line_blue_icon.svg';
import * as lineVioletIcon from '../icons/slider-rating/line_violet_icon.svg';
import * as activeMarkRedIcon from '../icons/slider-rating/active_mark_red_icon.svg';
import * as activeMarkYellowIcon from '../icons/slider-rating/active_mark_yellow_icon.svg';
import * as activeMarkGreenIcon from '../icons/slider-rating/active_mark_green_icon.svg';
import * as activeMarkBlueIcon from '../icons/slider-rating/active_mark_blue_icon.svg';
import * as activeMarkVioletIcon from '../icons/slider-rating/active_mark_violet_icon.svg';
import * as naIcon from '../icons/slider-rating/na_icon.svg';
import * as naActiveIcon from '../icons/slider-rating/na_active_icon.svg';
import { Tooltip } from '../overlays';
import cx from 'classnames';
import { i18n } from "../../i18n";

const defaultSize = '18';

export interface SliderRatingProps<TValue> extends IEditable<TValue> {
    renderTooltip?: (value: TValue) => React.ReactNode;
    from?: 1 | 2;
    withoutNa?: boolean;
    size?: '18' | '24';
    getScaleIcon?: (value: number) => Icon;
    getHandlerIcon?: (value: number) => Icon;
}

const maxValue = 5;

export class SliderRating extends React.Component<SliderRatingProps<number>> {
    handlerWidth: number;

    getScaleIcon = (rating: number) => {
        switch (rating) {
            case 1: return lineRedIcon;
            case 2: return lineYellowIcon;
            case 3: return lineGrayIcon;
            case 4: return lineBlueIcon;
            case 5: return lineVioletIcon;
            default: return lineGrayIcon;
        }
    }

    getHandlerIcon = (rating: number) => {
        switch (rating) {
            case 1: return activeMarkRedIcon;
            case 2: return activeMarkYellowIcon;
            case 3: return activeMarkGreenIcon;
            case 4: return activeMarkBlueIcon;
            case 5: return activeMarkVioletIcon;
        }
    }

    getLeftHandlerIconPosition = (rating: number, from: number, stepWidth: number) => {
        let left = !!rating ? ((rating - from) * stepWidth) - (this.handlerWidth / 2) : 0;

        if (rating && rating === from) {
            return left + 2;
        } else if (rating && rating === maxValue) {
            return left - 2;
        }

        return left;
    }

    renderTooltipBox(rating: number, stepWidth: number, count: number) {
        const fakeTooltips = [];

        for (let i = 0; i < count * 64; i++) {
            fakeTooltips.push(
                <Tooltip key={ i } placement='top' content={ this.props.renderTooltip ? this.props.renderTooltip(rating) : `${rating}` }>
                    <div style={ { width: stepWidth / 64 || 0 } }/>
                </Tooltip>,
            );
        }
        return <div className={ css.tooltipsBox }>
            { fakeTooltips }
        </div>;
    }

    renderRating = (sliderRating: number, markWidth: number, numberOfMarks: number) => {
        const rating = sliderRating || 0;
        const from = this.props.from || 1;
        const stepWidth = markWidth * numberOfMarks / (numberOfMarks - 1);
        const left = this.getLeftHandlerIconPosition(rating, from, stepWidth);
        const size = this.props.size || defaultSize;

        return (
            <>
                <div className={ cx(css.scale, css[`size-${size}`], from === 2 && css.shortScale) }>
                    <IconContainer cx={ css.scaleIcon } icon={ this.props.getScaleIcon ? this.props.getScaleIcon(rating) : this.getScaleIcon(rating) }/>
                </div>
                { this.renderTooltipBox(rating, stepWidth, 5 - from) }
                <div className={ cx(css.handler, css[`size-${size}`], !rating && css.hidden) } style={ { left: left } } ref={ (handler) => { this.handlerWidth = handler && handler.offsetWidth; } }>
                    <Tooltip content={ this.props.renderTooltip ? this.props.renderTooltip(rating) : `${rating}` }>
                        <IconContainer cx={ css.handlerIcon } icon={ this.props.getHandlerIcon ? this.props.getHandlerIcon(rating) : this.getHandlerIcon(rating) }/>
                    </Tooltip>
                </div>
            </>
        );
    }

    renderNa() {
        const isReadonly = this.props.isReadonly || this.props.isDisabled;
        const size = this.props.size || defaultSize;

        if (isReadonly && this.props.value !== 0) {
            return <IconContainer cx={ cx(css.naIcon, css[`size-${size}`], css.disabled) } icon={ naIcon }/>;
        } else {
            return (
                <Tooltip content={ this.props.renderTooltip ? this.props.renderTooltip(0) : i18n.sliderRating.notAvailableMessage }>
                    <IconContainer cx={ cx(css.naIcon, css[`size-${size}`], isReadonly && css.disabled) } icon={ this.props.value === 0 ? naActiveIcon : naIcon } onClick={ !isReadonly && (() => this.props.onValueChange(0)) }/>
                </Tooltip>
            );
        }
    }

    render() {
        return (
            <div className={ css.container }>
                <BaseRating
                    from={ this.props.from || 1 }
                    to={ maxValue }
                    step={ 1 }
                    renderRating={ this.renderRating }
                    { ...this.props }
                    value={ this.props.value === 0 ? null : this.props.value }
                    cx={ css.baseRatingContainer }
                />
                {
                    !this.props.withoutNa &&
                    <div className={ css.naIconContainer }>{ this.renderNa() }</div>
                }
            </div>
        );
    }
}