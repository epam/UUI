import { Switch as uuiSwitch, SwitchMods} from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { SwitchProps } from '@epam/uui-components';


export function applySwitchMods() {
    return [
        'uui-theme-promo',
    ];
}

export const Switch = withMods<SwitchProps, SwitchMods>(uuiSwitch, applySwitchMods);
