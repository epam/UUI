import { withMods } from '@epam/uui';
import { Rating as uuiRating, RatingProps } from '@epam/uui-components';
import * as types from '../types';
import * as css from './Rating.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { ReactComponent as FilledStarIcon } from '../icons/star-filled.svg';
import { ReactComponent as EmptyStarIcon } from '../icons/star-empty.svg';
import { Tooltip } from '../overlays';

export interface RatingMods {
    color?: types.EpamColor;
    size?: 18 | 24 | 30;
}

function applyRatingMods(mods: RatingMods & RatingProps) {
    return [
        css.root,
        !mods.isDisabled && styles['color-' + (mods.color || 'sun')],
        css['size-' + (mods.size || '18')],
    ];
}

export const Rating = withMods<RatingProps, RatingMods>(uuiRating, applyRatingMods, () => ({ filledStarIcon: FilledStarIcon, emptyStarIcon: EmptyStarIcon, Tooltip }));