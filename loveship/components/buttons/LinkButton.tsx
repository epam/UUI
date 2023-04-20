import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { LinkButton as UuiLinkButton, LinkButtonProps } from '@epam/uui';
import { TextSettings } from '../../helpers/textLayout';

export interface LinkButtonMods extends TextSettings {
    font?: types.FontStyle;
}

export const LinkButton = withMods<LinkButtonProps, LinkButtonMods>(UuiLinkButton);
