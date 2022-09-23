import React, { useCallback } from "react";
import css from './SmallBattery.scss';
import cx from "classnames";
import { ISkillRating } from "../SkillsBattery";
import { Text, IconContainer } from "@epam/promo";
import { ReactComponent as CrossIcon } from "../icons/navigation-close_popup-7.svg";


interface ISmallBatteryProps {
    rating: ISkillRating;
}

export const SmallBattery = (props: ISmallBatteryProps) => {
    switch (props.rating) {
        case 1:
        case 2:
        case 3:
        case 4:
            return (
                <div className={ cx(css.ratingWrapper) }>
                    <div className={ cx(css.ratingBlock, props.rating >= 1 && css.active) }></div>
                    <div className={ cx(css.ratingBlock, props.rating >= 2 && css.active) }></div>
                    <div className={ cx(css.ratingBlock, props.rating >= 3 && css.active) }></div>
                    <div className={ cx(css.ratingBlock, props.rating === 4 && css.active) }></div>
                </div>
            );
        case "NA":
        case "Rank":
            return (
                <div className={ cx(css.ratingBlockAlone) }>
                    <Text cx={ css.blockAloneText }>{ props.rating === "NA" ? "N/A" : "?" }</Text>
                </div>
            );
        case "NoSkill":
            return (
                <div className={ cx(css.ratingBlockAlone) }>
                    <IconContainer icon={ CrossIcon } color="gray50" cx={ css.blockAloneSvgWrapper }/>
                </div>
            );
        default:
            return null;
    }
};