import { createSkinComponent } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import css from './PromoButton.module.scss';

const defaultSize = '36';

export type PromoButtonSize = '36' | '42';

export interface PromoButtonMods {
    /** @default '36' */
    size?: PromoButtonSize;
}

type ButtonPropsWithOmit = Omit<ButtonProps, 'count' | 'indicator' | 'dropdownIcon' | 'dropdownIconPosition' | 'isDropdown' | 'isOpen' | 'clearIcon' | 'countIndicator' | 'onClear' | 'toggleDropdownOpening'>;

export type PromoButtonProps = ButtonPropsWithOmit & PromoButtonMods;

export function applyButtonMods(mods: PromoButtonProps) {
    return [
        'uui-promo-button',
        css.root,
        `uui-size-${mods.size || defaultSize}`,
    ];
}

export const PromoButton = createSkinComponent<ButtonProps, PromoButtonProps>(
    Button,
    undefined,
    applyButtonMods,
);
