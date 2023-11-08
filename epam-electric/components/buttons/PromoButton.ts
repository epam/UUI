import { withMods } from '@epam/uui-core';
import { ButtonProps, Button } from '@epam/uui-components';
import css from './PromoButton.module.scss';

const defaultSize = '36';

export type PromoButtonSize = '36' | '42';

export interface PromoButtonMods {
    size?: PromoButtonSize;
}

type ButtonPropsWithOmit = Omit<ButtonProps, 'count' | 'indicator' | 'dropdownIcon' | 'dropdownIconPosition' | 'isDropdown' | 'isOpen' | 'clearIcon' | 'countIndicator' | 'onClear' | 'toggleDropdownOpening'>;

export type PromoButtonProps = ButtonPropsWithOmit & PromoButtonMods;

export function applyButtonMods(mods: PromoButtonProps) {
    return [
        'uui-promo-button',
        css.root,
        css[`size-${mods.size || defaultSize}`],
    ];
}

export const PromoButton = withMods<ButtonPropsWithOmit, PromoButtonMods>(
    Button,
    applyButtonMods,
);
