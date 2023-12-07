import { createSkinComponent } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './Rating.module.scss';
import { ReactComponent as FilledStarIcon } from '../icons/star-filled.svg';
import { ReactComponent as EmptyStarIcon } from '../icons/star-empty.svg';
import { Tooltip } from '../overlays';

export interface RatingMods {
    /**
     * @default '18'
     */
    size?: 18 | 24 | 30;
}
export interface RatingProps extends uuiComponents.RatingProps, RatingMods {}

function applyRatingMods(mods: RatingMods & uuiComponents.RatingProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
    ];
}

export const Rating = createSkinComponent<uuiComponents.RatingProps, RatingProps>(
    uuiComponents.Rating,
    () => ({ filledStarIcon: FilledStarIcon, emptyStarIcon: EmptyStarIcon, Tooltip }),
    applyRatingMods,
);
