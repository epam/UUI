import React from 'react';
import { Dropdown as UuiDropdown } from '@epam/uui-components';
import { DropdownProps } from '@epam/uui-core';

export class Dropdown extends React.Component<DropdownProps> {
    render() {
        return (
            <UuiDropdown  { ...this.props } />
        );
    }
}
