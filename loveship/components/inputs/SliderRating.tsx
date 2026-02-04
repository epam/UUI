import React, { useState } from 'react';
import cx from 'classnames';
import { BaseRating, IconContainer } from '@epam/uui-components';
import { Icon, IEditable, IHasRawProps } from '@epam/uui-core';
import { ReactComponent as LineGrayIcon } from '../icons/slider-rating/line_gray_icon.svg';
import { ReactComponent as LineRedIcon } from '../icons/slider-rating/line_red_icon.svg';
import { ReactComponent as LineYellowIcon } from '../icons/slider-rating/line_yellow_icon.svg';
import { ReactComponent as LineBlueIcon } from '../icons/slider-rating/line_blue_icon.svg';
import { ReactComponent as LineVioletIcon } from '../icons/slider-rating/line_violet_icon.svg';
import { ReactComponent as ActiveMarkRedIcon } from '../icons/slider-rating/active_mark_red_icon.svg';
import { ReactComponent as ActiveMarkYellowIcon } from '../icons/slider-rating/active_mark_yellow_icon.svg';
import { ReactComponent as ActiveMarkGreenIcon } from '../icons/slider-rating/active_mark_green_icon.svg';
import { ReactComponent as ActiveMarkBlueIcon } from '../icons/slider-rating/active_mark_blue_icon.svg';
import { ReactComponent as ActiveMarkVioletIcon } from '../icons/slider-rating/active_mark_violet_icon.svg';
import { ReactComponent as NaIcon } from '../icons/slider-rating/na_icon.svg';
import { ReactComponent as NaActiveIcon } from '../icons/slider-rating/na_active_icon.svg';
import { Tooltip } from '../overlays';
import { i18n } from '../../i18n';
import css from './SliderRating.module.scss';

const defaultSize = '18';

export interface SliderRatingProps<TValue> extends IEditable<TValue>, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /**
     * Enables to pass your custom Tooltip component instead of default.
     */
    renderTooltip?: (value: TValue) => React.ReactNode;
    /**
     * Defines start point of component.
     * @default '1'
     */
    from?: 1 | 2;
    /**
     * Defines is NotAvailable showing.
     * @default false
     */
    withoutNa?: boolean;
    /**
     * Defines component size.
     * @default '18'
     */
    size?: '18' | '24';
    /**
     * Enables to pass your ScaleIcon component instead of default.
     */
    getScaleIcon?: (value: number) => Icon;
    /**
     * Icon click handler.
     */
    getHandlerIcon?: (value: number) => Icon;
    /**
     * Defines Tooltip color.
     */
    tooltipColor?: 'white' | 'fire' | 'gray';
}

const maxValue = 5;

interface SliderRatingState {
    tooltipContent: React.ReactNode | string | null;
}

export class SliderRating extends React.Component<SliderRatingProps<number>, SliderRatingState> {
    handlerWidth: number = 0;
    tooltipBoxRef = React.createRef<HTMLDivElement>();
    markWidth: number = 0;
    numberOfMarks: number = 0;

    constructor(props: SliderRatingProps<number>) {
        super(props);
        const isReadonly = props.isReadonly || props.isDisabled;
        const initialContent = isReadonly ? null : this.getTooltipContent(props.value || 0);
        this.state = {
            tooltipContent: initialContent,
        };
    }

    getTooltipContent = (value: number): React.ReactNode | string => {
        return this.props.renderTooltip ? this.props.renderTooltip(value) : `${value}`;
    };

    getScaleIcon = (rating: number) => {
        switch (rating) {
            case 1:
                return LineRedIcon;
            case 2:
                return LineYellowIcon;
            case 3:
                return LineGrayIcon;
            case 4:
                return LineBlueIcon;
            case 5:
                return LineVioletIcon;
            default:
                return LineGrayIcon;
        }
    };

    getHandlerIcon = (rating: number) => {
        switch (rating) {
            case 1:
                return ActiveMarkRedIcon;
            case 2:
                return ActiveMarkYellowIcon;
            case 3:
                return ActiveMarkGreenIcon;
            case 4:
                return ActiveMarkBlueIcon;
            case 5:
                return ActiveMarkVioletIcon;
        }
    };

    getLeftHandlerIconPosition = (rating: number, from: number, stepWidth: number) => {
        const left = !!rating ? (rating - from) * stepWidth - this.handlerWidth / 2 : 0;

        if (rating && rating === from) {
            return left + 2;
        } else if (rating && rating === maxValue) {
            return left - 2;
        }

        return left;
    };

    getDotValueFromPosition = (clientX: number): number | null => {
        if (!this.tooltipBoxRef.current || !this.markWidth || !this.numberOfMarks || this.numberOfMarks <= 1) {
            return null;
        }

        const rect = this.tooltipBoxRef.current.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const from = this.props.from || 1;
        const stepWidth = (this.markWidth * this.numberOfMarks) / (this.numberOfMarks - 1);
        const threshold = Math.min(this.markWidth / 3, stepWidth / 4);

        // Calculate which dot index the mouse is closest to
        const dotIndex = Math.round(relativeX / stepWidth);

        // Check if dotIndex is valid and if we're close enough to the dot
        if (dotIndex >= 0 && dotIndex < this.numberOfMarks) {
            const distance = Math.abs(relativeX - dotIndex * stepWidth);
            if (distance <= threshold) {
                return from + dotIndex;
            }
        }

        return null;
    };

    handleTooltipBoxMouseMove = (clientX: number) => {
        const isReadonly = this.props.isReadonly || this.props.isDisabled;

        if (isReadonly) {
            const dotValue = this.getDotValueFromPosition(clientX);
            if (dotValue !== null) {
                const newContent = this.getTooltipContent(dotValue);
                this.setState({ tooltipContent: newContent });
            } else {
                this.setState({ tooltipContent: null });
            }
        }
    };

    componentDidUpdate(prevProps: SliderRatingProps<number>) {
        // Reset tooltip content when switching between readonly/edit modes
        const isReadonly = this.props.isReadonly || this.props.isDisabled;
        const wasReadonly = prevProps.isReadonly || prevProps.isDisabled;

        if (wasReadonly !== isReadonly) {
            if (isReadonly) {
                this.setState({ tooltipContent: null });
            } else {
                const rating = this.props.value || 0;
                this.setState({ tooltipContent: this.getTooltipContent(rating) });
            }
        }
    }

    renderTooltipBox(rating: number, markWidth: number, numberOfMarks: number) {
        const isReadonly = this.props.isReadonly || this.props.isDisabled;

        this.markWidth = markWidth;
        this.numberOfMarks = numberOfMarks;

        let tooltipContent: React.ReactNode | string | null | undefined;
        if (isReadonly) {
            tooltipContent = this.state.tooltipContent !== null ? this.state.tooltipContent : null;
        } else {
            tooltipContent = this.getTooltipContent(rating);
        }

        return (
            <TooltipBox
                tooltipColor={ this.props.tooltipColor }
                content={ tooltipContent }
                size={ this.props.size || '18' }
                onMouseMove={ this.handleTooltipBoxMouseMove }
                tooltipBoxRef={ this.tooltipBoxRef }
            />
        );
    }

    renderRating = (sliderRating: number, markWidth: number, numberOfMarks: number) => {
        const rating = sliderRating || 0;
        const from = this.props.from || 1;
        const stepWidth = (markWidth * numberOfMarks) / (numberOfMarks - 1);
        const left = this.getLeftHandlerIconPosition(rating, from, stepWidth);
        const size = this.props.size || defaultSize;

        return (
            <>
                <div className={ cx(css.scale, css[`size-${size}`], from === 2 && css.shortScale) }>
                    <IconContainer cx={ css.scaleIcon } icon={ this.props.getScaleIcon ? this.props.getScaleIcon(rating) : this.getScaleIcon(rating) } />
                </div>
                {this.renderTooltipBox(rating, markWidth, numberOfMarks)}
                <div
                    className={ cx(css.handler, css[`size-${size}`], !rating && css.hidden) }
                    style={ { left: left } }
                    ref={ (handler) => {
                        this.handlerWidth = handler && handler.offsetWidth;
                    } }
                >
                    <Tooltip color={ this.props.tooltipColor } cx={ css.tooltip } content={ this.getTooltipContent(rating) }>
                        <IconContainer
                            cx={ css.handlerIcon }
                            icon={
                                this.props.getHandlerIcon
                                    ? this.props.getHandlerIcon(rating)
                                    : (this.getHandlerIcon(rating) || ActiveMarkGreenIcon)
                            }
                        />
                    </Tooltip>
                </div>
            </>
        );
    };

    renderNa() {
        const isReadonly = this.props.isReadonly || this.props.isDisabled;
        const size = this.props.size || defaultSize;

        if (isReadonly && this.props.value !== 0) {
            return <IconContainer cx={ cx(css.naIcon, css[`size-${size}`], css.disabled) } icon={ NaIcon } />;
        } else {
            return (
                <Tooltip color={ this.props.tooltipColor } content={ this.props.renderTooltip ? this.props.renderTooltip(0) : i18n.sliderRating.notAvailableMessage }>
                    <IconContainer
                        cx={ cx(css.naIcon, css[`size-${size}`], isReadonly && css.disabled) }
                        icon={ this.props.value === 0 ? NaActiveIcon : NaIcon }
                        onClick={ !isReadonly && (() => this.props.onValueChange(0)) }
                    />
                </Tooltip>
            );
        }
    }

    handleValueChange = (value: number) => {
        if (this.props.withoutNa && value === 0) {
            return;
        }
        this.props.onValueChange(value);
    };

    render() {
        return (
            <div className={ css.container } { ...this.props.rawProps }>
                <BaseRating
                    from={ this.props.from || 1 }
                    to={ maxValue }
                    step={ 1 }
                    renderRating={ this.renderRating }
                    { ...this.props }
                    value={ this.props.value === 0 ? null : this.props.value }
                    onValueChange={ this.handleValueChange }
                    cx={ css.baseRatingContainer }
                />
                {!this.props.withoutNa && <div className={ css.naIconContainer }>{this.renderNa()}</div>}
            </div>
        );
    }
}

type TooltipBoxProps = {
    size: string;
    tooltipColor: 'white' | 'fire' | 'gray';
    content: React.ReactNode | string | null | undefined;
    onMouseMove: (clientX: number) => void;
    tooltipBoxRef: React.RefObject<HTMLDivElement>;
};

function TooltipBox(props: TooltipBoxProps) {
    const { content, size, tooltipColor, onMouseMove, tooltipBoxRef } = props;
    const [left, setLeft] = useState<number>(0);

    const topPosition = tooltipBoxRef.current?.getBoundingClientRect().y || 0;

    const handleMouseMove = (event: React.MouseEvent) => {
        const clientX = event.clientX;
        setLeft(clientX);
        onMouseMove(clientX);
    };

    return (
        <div className={ css.tooltipsBox } ref={ tooltipBoxRef } onMouseMove={ handleMouseMove }>
            <Tooltip color={ tooltipColor } placement="top" content={ content } cx={ css.tooltip }>
                <div
                    className={ css.tooltipsBoxItem }
                    style={ {
                        left: `${left - 1}px`,
                        top: `${topPosition}px`,
                        height: `${size}px`,
                    } }
                />
            </Tooltip>
            <Tooltip color={ tooltipColor } placement="top" content={ content } cx={ css.tooltip }>
                <div
                    className={ css.tooltipsBoxItem }
                    style={ {
                        left: `${left}px`,
                        top: `${topPosition}px`,
                        height: `${size}px`,
                    } }
                />
            </Tooltip>
            <Tooltip color={ tooltipColor } placement="top" content={ content } cx={ css.tooltip }>
                <div
                    className={ css.tooltipsBoxItem }
                    style={ {
                        left: `${left + 1}px`,
                        top: `${topPosition}px`,
                        height: `${size}px`,
                    } }
                />
            </Tooltip>
        </div>
    );
}
