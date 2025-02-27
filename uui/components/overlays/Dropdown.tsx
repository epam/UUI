import { Dropdown as uuiDropdown } from '@epam/uui-components';
import type { DropdownProps } from '@epam/uui-core';
import { withMods } from '@epam/uui-core';

export const Dropdown = withMods<DropdownProps, DropdownProps>(uuiDropdown);
