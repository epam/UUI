import { withMods } from '@epam/uui-core';
import { InputAddon as uuiInputAddon, InputAddonProps as UuiInputAddonProps } from '@epam/uui-components';
import css from './InputAddon.module.scss';

export function applyInputAddonMods() {
    return [
        css.root,
    ];
}

export const InputAddon = withMods<UuiInputAddonProps>(uuiInputAddon, applyInputAddonMods);
