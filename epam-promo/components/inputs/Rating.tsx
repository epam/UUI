import { withMods } from '@epam/uui-core';
import { Rating as uuiRating, RatingProps } from '@epam/uui-components';
import css from './Rating.scss';
import { ReactComponent as FilledStarIcon } from '@epam/assets/icons/common/fav-rates-star-24.svg';
import { ReactComponent as EmptyStarIcon } from '@epam/assets/icons/common/fav-rates-star-24.svg';
import { Tooltip } from '../overlays';

export interface RatingMods {
    size?: 18 | 24 | 30;
}

function applyRatingMods(mods: RatingMods & RatingProps) {
    return [css.root, css['size-' + (mods.size || '18')]];
}

export const Rating = withMods<RatingProps, RatingMods>(uuiRating, applyRatingMods, props => ({
    filledStarIcon: FilledStarIcon,
    emptyStarIcon: EmptyStarIcon,
    Tooltip,
    rawProps: { ...props.rawProps, tabIndex: 0 },
}));
