import * as React from 'react';
import { VerticalTabButton, VerticalTabButtonProps } from '@epam/uui';
import { ReactComponent as DropdownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import css from './SidebarButton.module.scss';
import { cx } from '@epam/uui-core';

export type SidebarButtonProps = VerticalTabButtonProps & {
    isActive: boolean;
    indent?: number;
};

export class SidebarButton extends React.Component<SidebarButtonProps, any> {
    render() {
        return (
            <VerticalTabButton
                { ...this.props }
                rawProps={ {
                    role: this.props.isDropdown ? undefined : 'tab',
                    'aria-expanded': this.props.isDropdown,
                    'aria-disabled': this.props.isDisabled,
                    'aria-current': this.props.isActive,
                } }
                isLinkActive={ this.props.isActive }
                cx={ cx(
                    css.root,
                    css['indent-' + this.props.indent],
                ) }
                dropdownIcon={ DropdownIcon }
                size="36"
            />
        );
    }
}
