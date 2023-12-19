import { withMods } from '@epam/uui-core';
import cx from 'classnames';
import { Burger as uuiBurger, BurgerProps } from '@epam/uui-components';
import css from './Burger.module.scss';
import { ReactComponent as BurgerIcon } from '../../../../icons/burger.svg';
import { ReactComponent as CrossIcon } from '../../../../icons/burger-close.svg';

interface BurgerMods {}

function applyBurgerMods() {
    return [cx(css.root, 'uui-burger')];
}

export const Burger = withMods<BurgerProps, BurgerMods>(uuiBurger, applyBurgerMods, () => ({
    burgerIcon: BurgerIcon,
    crossIcon: CrossIcon,
    burgerContentCx: css.burgerContent,
}));
