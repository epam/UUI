import { createSkinComponent } from '@epam/uui-core';
import { Button } from '@epam/uui-components';
import { ButtonCoreProps } from '@epam/uui';
import css from './PromoButton.module.scss';

const defaultSize = '36';

export type PromoButtonSize = '36' | '42';

export interface PromoButtonMods {
    size?: PromoButtonSize;
}

type ButtonPropsWithOmit = Omit<ButtonCoreProps, 'count' | 'indicator' | 'dropdownIcon' | 'dropdownIconPosition' | 'isDropdown' | 'isOpen' | 'clearIcon' | 'countIndicator' | 'onClear' | 'toggleDropdownOpening'>;

export type PromoButtonProps = ButtonPropsWithOmit & PromoButtonMods;

export function applyButtonMods(mods: PromoButtonProps) {
    return [
        'uui-promo-button',
        css.root,
        `uui-size-${mods.size || defaultSize}`,
    ];
}

export const PromoButton = createSkinComponent<ButtonCoreProps, PromoButtonProps>(
    Button,
    undefined,
    applyButtonMods,
);
