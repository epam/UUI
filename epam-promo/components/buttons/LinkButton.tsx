import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { LinkButton as UuiLinkButton, LinkButtonProps } from '@epam/uui';

export interface LinkButtonMods {
    color?: types.EpamPrimaryColor;
}

function applyLinkButtonMods() {
    return [
        'uui-theme-promo',
    ];
}

export const LinkButton = withMods<LinkButtonProps, LinkButtonMods>(UuiLinkButton, applyLinkButtonMods);
