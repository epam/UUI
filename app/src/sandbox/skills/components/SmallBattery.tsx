import React from 'react';
import cx from 'classnames';
import css from './SmallBattery.module.scss';
import { Text, IconContainer } from '@epam/promo';
import { ISmallBatteryProps } from '../utils';
import { ReactComponent as CrossIcon } from '../icons/navigation-close_popup-7.svg';

export function SmallBattery(props: ISmallBatteryProps) {
    switch (props.rating) {
        case 'NA':
        case 'Rank':
            return (
                <div className={ cx(css.ratingBlockAlone) }>
                    <Text cx={ css.blockAloneText }>{props.rating === 'NA' ? 'N/A' : '?'}</Text>
                </div>
            );
        case 'NoSkill':
            return (
                <div className={ cx(css.ratingBlockAlone) }>
                    <IconContainer icon={ CrossIcon } style={ { fill: '#6C6F80' } } cx={ [css.blockAloneSvgWrapper, css.iconGray60] } />
                </div>
            );
        default:
            return (
                <div className={ cx(css.ratingWrapper) }>
                    <div key="b-1" className={ cx(css.ratingBlock, props.rating >= 1 && css.active) }></div>
                    <div key="b-2" className={ cx(css.ratingBlock, props.rating >= 2 && css.active) }></div>
                    <div key="b-3" className={ cx(css.ratingBlock, props.rating >= 3 && css.active) }></div>
                    <div key="b-4" className={ cx(css.ratingBlock, props.rating === 4 && css.active) }></div>
                </div>
            );
    }
}
