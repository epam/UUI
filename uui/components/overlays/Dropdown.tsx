import * as React from 'react';
import { Dropdown as UuiDropdown } from '@epam/uui-components';
import { DropdownProps } from '@epam/uui-core';

export function Dropdown(props: DropdownProps) {
    return <UuiDropdown { ...props } />;
}
