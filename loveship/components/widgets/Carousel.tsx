import { withMods } from '@epam/uui-core';
import { Carousel as uuiCarousel, CarouselProps } from '@epam/uui-components';
import { ReactComponent as ArrowIcon } from '../icons/folding-arrow-24.svg';
import * as types from '../types';
import css from './Carousel.scss';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';

export interface CarouselMods {
    color?: types.EpamColor;
}

function applyCarouselMods(mods: CarouselMods) {
    return [css.root, styles['color-' + (mods.color || 'sky')]];
}

export const Carousel = withMods<CarouselProps, CarouselMods>(uuiCarousel, applyCarouselMods, () => ({ arrowIcon: ArrowIcon }));
