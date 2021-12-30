import * as React from 'react';
import { Button, ButtonProps } from '@epam/uui-components';
import { ReactComponent as DropdownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import * as css from './SidebarButton.scss';
import { cx } from '@epam/uui';

export interface SidebarButtonProps extends ButtonProps {
    isActive: boolean;
    indent?: number;
}

export class SidebarButton extends React.Component<SidebarButtonProps, any> {
    render() {
        return <Button
            { ...this.props }
            rawProps={{
                role: this.props.isDropdown ? undefined : 'tab',
                "aria-expanded": this.props.isDropdown,
                "aria-disabled": this.props.isDisabled,
                "aria-current": this.props.isActive
            }}
            cx={ cx(
                css.root,
                this.props.isActive && css.active,
                css['indent-' + this.props.indent],
            ) }
            dropdownIcon={ DropdownIcon }
        />;
    }
}