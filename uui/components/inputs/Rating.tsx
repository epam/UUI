import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Tooltip } from '../overlays';
import { settings } from '../../settings';

import { ReactComponent as FilledStarIcon } from '../../icons/star-filled.svg';

import css from './Rating.module.scss';

interface RatingMods {
    /**
     * Defines component size.
     * @default '18'
     */
    size?: 18 | 24 | 30;
}
export interface RatingModsOverride {}

/** Represents the 'Core properties' for the Rating component. */
export type RatingCoreProps = Omit<uuiComponents.RatingProps, 'filledStarIcon' | 'emptyStarIcon' | 'renderRating' | 'from' | 'to'>;

/** Represents the properties for the Rating component. */
export interface RatingProps extends RatingCoreProps, Overwrite<RatingMods, RatingModsOverride> {}

function applyRatingMods(mods: RatingProps) {
    return [
        css.root,
        `uui-size-${mods.size || settings.sizes.defaults.rating}`,
    ];
}

export const Rating = withMods<uuiComponents.RatingProps, RatingProps>(
    uuiComponents.Rating,
    applyRatingMods,
    () => ({
        filledStarIcon: FilledStarIcon,
        emptyStarIcon: FilledStarIcon,
        Tooltip,
    }),
);
