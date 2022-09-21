import React from "react";
import css from './BigBattery.scss';
import cx from "classnames";
import { Button, Dropdown, FlexRow, LinkButton, Tooltip, Text, DropdownContainer, IconContainer, IconButton } from "@epam/promo";


interface IBigBatteryProps {
    rating: number;
    setRating: (val: number) => void;
}

export const BigBattery = (props: IBigBatteryProps) => {
    return (
        <div className={ cx(css.ratingWrapper) }>
            <div className={ css.itemContainer }>
                <div
                    className={ cx(css.ratingBlock, props.rating >= 1 && css.active) }
                    onClick={ () => props.setRating(1) }
                ></div>
                <Text cx={ css.itemText }>Novice</Text>
            </div>
            <div className={ css.itemContainer }>
                <div
                    className={ cx(css.ratingBlock, props.rating >= 2 && css.active) }
                    onClick={ () => props.setRating(2) }
                ></div>
                <Text cx={ css.itemText }>Intermediate</Text>
            </div>
            <div className={ css.itemContainer }>
                <div
                    className={ cx(css.ratingBlock, props.rating >= 3 && css.active) }
                    onClick={ () => props.setRating(3) }
                ></div>
                <Text cx={ css.itemText }>Advanced</Text>
            </div>
            <div className={ css.itemContainer }>
                <div
                    className={ cx(css.ratingBlock, props.rating === 4 && css.active) }
                    onClick={ () => props.setRating(4) }
                ></div>
                <Text cx={ css.itemText }>Expert</Text>
            </div>
        </div>
    );
};