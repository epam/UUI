import { withMods } from '@epam/uui-core';
import cx from 'classnames';
import { Burger as uuiBurger, BurgerProps } from '@epam/uui-components';
import css from './Burger.module.scss';
import { ReactComponent as BurgerIcon } from '@epam/assets/icons/navigation-open_side_menu-outline.svg';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/navigation-close-outline.svg';

interface BurgerMods {}

function applyBurgerMods() {
    return [cx(css.root, 'uui-burger')];
}

export const Burger = /* @__PURE__ */withMods<BurgerProps, BurgerMods>(uuiBurger, applyBurgerMods, () => ({
    burgerIcon: BurgerIcon,
    crossIcon: CrossIcon,
    burgerContentCx: css.burgerContent,
}));
