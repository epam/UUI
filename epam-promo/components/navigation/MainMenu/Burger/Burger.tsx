import * as React from 'react';
import { withMods } from '@epam/uui';
import * as css from './Burger.scss';
import { Burger as uuiBurger, BurgerProps } from '@epam/uui-components';
import * as burgerIcon from '../../../../icons/burger.svg';
import * as crossIcon from '../../../../icons/burger-close.svg';

export interface BurgerMods {
}

function applyBurgerMods(mods: BurgerMods) {
    return [css.root];
}

export const Burger = withMods<BurgerProps, BurgerMods>(uuiBurger, applyBurgerMods, (props) => ({
    burgerIcon,
    crossIcon,
    burgerContentCx: css.burgerContent,
}));