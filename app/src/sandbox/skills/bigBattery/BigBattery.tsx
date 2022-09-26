import React, { useEffect, useState } from "react";
import css from './BigBattery.scss';
import cx from "classnames";
import { Button, FlexRow, Text } from "@epam/promo";
import { ReactComponent as CrossIcon } from "@epam/assets/icons/common/navigation-close-18.svg";
import { ISkillLevel } from "../index";


interface IBigBatteryProps {
    rating: ISkillLevel;
    setRating: (val: ISkillLevel) => void;
}

export const BigBattery = (props: IBigBatteryProps) => {
    const [localRating, setLocalRating] = useState<0 | 1 | 2 | 3 | 4>(0);

    useEffect(() => {
        switch (props.rating) {
            case 'NA':
            case "NoSkill":
            case "Rank":
                setLocalRating(0);
                break;
            default: {
                setLocalRating(props.rating);
            }
        }
    }, [props.rating]);

    return (
        <FlexRow cx={ cx(css.batteryMainContainer) }>

            <FlexRow cx={ cx(css.ratingWrapper) }>
                <div className={ css.itemContainer }>
                    <div
                        className={ cx(css.ratingBlock, localRating >= 1 && css.active) }
                        onClick={ () => props.setRating(1) }
                    ></div>
                    <Text cx={ css.itemText }>Novice</Text>
                </div>
                <div className={ css.itemContainer }>
                    <div
                        className={ cx(css.ratingBlock, localRating >= 2 && css.active) }
                        onClick={ () => props.setRating(2) }
                    ></div>
                    <Text cx={ css.itemText }>Intermediate</Text>
                </div>
                <div className={ css.itemContainer }>
                    <div
                        className={ cx(css.ratingBlock, localRating >= 3 && css.active) }
                        onClick={ () => props.setRating(3) }
                    ></div>
                    <Text cx={ css.itemText }>Advanced</Text>
                </div>
                <div className={ css.itemContainer }>
                    <div
                        className={ cx(css.ratingBlock, localRating === 4 && css.active) }
                        onClick={ () => props.setRating(4) }
                    ></div>
                    <Text cx={ css.itemText }>Expert</Text>
                </div>
            </FlexRow>

            <div className={ css.batteryDivider }></div>

            <Button fill="none" color="gray50" icon={ CrossIcon } cx={ cx(css.mainCloseBtn) } onClick={ () => props.setRating("NoSkill") }/>

        </FlexRow>
    );
};