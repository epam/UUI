import * as React from 'react';
import { withMods } from '@epam/uui-core';
import css from './Burger.scss';
import { Burger as uuiBurger, BurgerProps } from '@epam/uui-components';
import { ReactComponent as BurgerIcon } from '../../../../icons/burger.svg';
import { ReactComponent as CrossIcon } from '../../../../icons/burger-close.svg';

export interface BurgerMods {}

function applyBurgerMods() {
    return [css.root];
}

export const Burger = withMods<BurgerProps, BurgerMods>(uuiBurger, applyBurgerMods, () => ({
    burgerIcon: BurgerIcon,
    crossIcon: CrossIcon,
    burgerContentCx: css.burgerContent,
}));
