import React from "react";
import css from './SmallBattery.scss';
import cx from "classnames";

interface ISmallBatteryProps {
    rating: number;
}

export const SmallBattery = (props: ISmallBatteryProps) => {

    return (
        <div className={ cx(css.ratingWrapper) }>
            <div className={ cx(css.ratingBlock, props.rating >= 1 && css.active) }></div>
            <div className={ cx(css.ratingBlock, props.rating >= 2 && css.active) }></div>
            <div className={ cx(css.ratingBlock, props.rating >= 3 && css.active) }></div>
            <div className={ cx(css.ratingBlock, props.rating === 4 && css.active) }></div>
        </div>
    );
};