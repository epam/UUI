import * as React from 'react';
import { Dropdown as UuiDropdown, DropdownProps } from '@epam/uui-components';

export class Dropdown extends React.Component<DropdownProps, any> {
    render() {
        return (
            <UuiDropdown  { ...this.props } />
        );
    }
}
