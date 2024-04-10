import { createSkinComponent } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import css from './PromoButton.module.scss';

const DEFAULT_SIZE = '36';

interface PromoButtonMods {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '36' | '42';
}

type ButtonPropsWithOmit = Omit<ButtonProps, 'count' | 'indicator' | 'dropdownIcon' | 'dropdownIconPosition' | 'isDropdown' | 'isOpen' | 'clearIcon' | 'countIndicator' | 'onClear' | 'toggleDropdownOpening'>;

/** Represents the properties of the PromoButton component. */
export interface PromoButtonProps extends ButtonPropsWithOmit, PromoButtonMods {}

export function applyButtonMods(mods: PromoButtonProps) {
    return [
        'uui-promo-button',
        css.root,
        `uui-size-${mods.size || DEFAULT_SIZE}`,
    ];
}

export const PromoButton = /* @__PURE__ */createSkinComponent<ButtonProps, PromoButtonProps>(
    Button,
    undefined,
    applyButtonMods,
);
