import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './Rating.module.scss';
import { ReactComponent as FilledStarIcon } from '@epam/assets/icons/common/fav-rates-star-24.svg';
import { ReactComponent as EmptyStarIcon } from '@epam/assets/icons/common/fav-rates-star-24.svg';
import { Tooltip } from '../overlays';

interface RatingMods {
    /**
     * Defines component size.
     * @default '18'
     */
    size?: 18 | 24 | 30;
}

function applyRatingMods(mods: RatingMods & uuiComponents.RatingProps) {
    return [css.root, css['size-' + (mods.size || '18')]];
}

/** Represents the properties of a Rating component. */
export interface RatingProps extends Omit<uuiComponents.RatingProps, 'filledStarIcon' | 'emptyStarIcon' | 'renderRating' | 'from' | 'to'>, RatingMods {}

export const Rating = withMods<uuiComponents.RatingProps, RatingProps>(
    uuiComponents.Rating,
    applyRatingMods,
    (props) => ({
        filledStarIcon: FilledStarIcon,
        emptyStarIcon: EmptyStarIcon,
        Tooltip,
        rawProps: { ...props.rawProps, tabIndex: 0 },
    }),
);
