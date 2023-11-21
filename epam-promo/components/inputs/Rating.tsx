import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './Rating.module.scss';
import { ReactComponent as FilledStarIcon } from '@epam/assets/icons/common/fav-rates-star-24.svg';
import { ReactComponent as EmptyStarIcon } from '@epam/assets/icons/common/fav-rates-star-24.svg';
import { Tooltip } from '../overlays';

export interface RatingMods {
    /**
     * @default '18'
     */
    size?: 18 | 24 | 30;
}

function applyRatingMods(mods: RatingMods & uuiComponents.RatingProps) {
    return [css.root, css['size-' + (mods.size || '18')]];
}

export interface RatingProps extends uuiComponents.RatingProps, RatingMods {}

export const Rating = withMods<uuiComponents.RatingProps, RatingMods>(uuiComponents.Rating, applyRatingMods, (props) => ({
    filledStarIcon: FilledStarIcon,
    emptyStarIcon: EmptyStarIcon,
    Tooltip,
    rawProps: { ...props.rawProps, tabIndex: 0 },
}));
