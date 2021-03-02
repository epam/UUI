import { withMods } from '@epam/uui';
import { Rating as uuiRating, RatingProps } from '@epam/uui-components';
import * as css from './Rating.scss';
import * as filledStarIcon from '@epam/assets/icons/common/fav-rates-star-24.svg';
import * as emptyStarIcon from '@epam/assets/icons/common/fav-rates-star-24.svg';
import { Tooltip } from '../overlays';

export interface RatingMods {
    size?: 18 | 24 | 30;
}

function applyRatingMods(mods: RatingMods & RatingProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
    ];
}

export const Rating = withMods<RatingProps, RatingMods>(uuiRating, applyRatingMods, () => ({ filledStarIcon, emptyStarIcon, Tooltip }));