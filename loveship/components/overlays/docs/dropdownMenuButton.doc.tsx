import { DropdownMenuButton, DropdownMenuItemMods } from '../DropdownMenu';
import { DocBuilder } from '@epam/uui-docs';
import { ButtonProps } from '@epam/uui-components';
import { DropdownMenuContext } from '../../../docs';
import { onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconDoc, iconOptionsDoc, iCanRedirectDoc } from '../../../docs';

const dropdownMenuButtonDoc = new DocBuilder<ButtonProps & DropdownMenuItemMods>({ name: 'DropdownMenuButton', component: DropdownMenuButton })
    .implements([onClickDoc, dropdownTogglerDoc, isDisabledDoc, basicPickerTogglerDoc, iconDoc, iconOptionsDoc, iCanRedirectDoc] as any)
    .prop('caption', { examples: [
        { value: 'Click Me', isDefault: true },
        { name: 'long text', value: 'kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa kolbasa' },
        { name: 'long word', value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    ], type: 'string' })
    .prop('color', { examples: ['white', 'night'] })
    .prop('noIcon', { examples: [true] })
    .withContexts(DropdownMenuContext);

export = dropdownMenuButtonDoc;