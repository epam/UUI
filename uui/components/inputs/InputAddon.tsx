import { withMods } from '@epam/uui-core';
import { InputAddon as uuiInputAddon, InputAddonProps as uuiInputAddonProps } from '@epam/uui-components';
import css from './InputAddon.module.scss';

function applyInputAddonMods() {
    return [
        css.root,
    ];
}

export const InputAddon = /* @__PURE__ */withMods<uuiInputAddonProps>(uuiInputAddon, applyInputAddonMods);
