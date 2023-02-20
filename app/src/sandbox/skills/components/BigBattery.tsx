import React from 'react';
import cx from 'classnames';
import css from './BigBattery.scss';
import { Button, FlexRow, Text } from '@epam/promo';
import { ISkillLevel } from '../index';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/common/navigation-close-18.svg';

interface IBigBatteryProps {
    rating: ISkillLevel;
    setRating: (val: ISkillLevel) => void;
    isExtended: boolean;
}

type bigBatteryRating = 0 | 1 | 2 | 3 | 4;

export const BigBattery = (props: IBigBatteryProps) => {
    const getRating = (rawRating: ISkillLevel): bigBatteryRating => {
        switch (rawRating) {
            case 'NA':
            case 'NoSkill':
            case 'Rank':
                return 0;
            default:
                return rawRating;
        }
    };

    return (
        <FlexRow cx={cx(css.batteryMainContainer)}>
            <FlexRow cx={cx(css.ratingWrapper)}>
                <div className={css.itemContainer}>
                    <div className={cx(css.ratingBlock, getRating(props.rating) >= 1 && css.active)} onClick={() => props.setRating(1)}></div>
                    <Text cx={css.itemText}>Novice</Text>
                </div>
                <div className={css.itemContainer}>
                    <div className={cx(css.ratingBlock, getRating(props.rating) >= 2 && css.active)} onClick={() => props.setRating(2)}></div>
                    <Text cx={css.itemText}>Intermediate</Text>
                </div>
                <div className={css.itemContainer}>
                    <div className={cx(css.ratingBlock, getRating(props.rating) >= 3 && css.active)} onClick={() => props.setRating(3)}></div>
                    <Text cx={css.itemText}>Advanced</Text>
                </div>
                <div className={css.itemContainer}>
                    <div className={cx(css.ratingBlock, getRating(props.rating) === 4 && css.active)} onClick={() => props.setRating(4)}></div>
                    <Text cx={css.itemText}>Expert</Text>
                </div>
            </FlexRow>
            {props.isExtended && (
                <>
                    <div className={css.batteryDivider}></div>
                    <Button fill="none" color="gray50" icon={CrossIcon} cx={cx(css.mainCloseBtn)} onClick={() => props.setRating('NoSkill')} />
                </>
            )}
        </FlexRow>
    );
};
