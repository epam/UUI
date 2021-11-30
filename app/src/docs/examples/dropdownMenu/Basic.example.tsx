import React, { useState } from 'react';
import { uuiMod, cx } from "@epam/uui";
import { Dropdown, Text, DropdownBodyProps } from '@epam/uui-components';
import {
    Button,
    DropdownMenuBody,
    DropdownMenuButton,
    DropdownMenuSwitchButton as MenuSwitchButton,
    DropdownMenuSplitter,
    DropdownMenuHeader,
    DropdownSubMenu,
    IDropdownMenuItemProps,
    FlexSpacer,
    Badge
} from '@epam/promo';
import { ReactComponent as Icon } from '@epam/assets/icons/common/action-eye-18.svg';

const CustomItem = (props: IDropdownMenuItemProps) => {
    return (
        <div
            role="menuitem"
            className={ cx(props.cx, props.isDisabled && uuiMod.disabled) }
            style={ {
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "0.5em 1em",
                lineHeight: 1.5,
                boxSizing: "border-box",
            } }
        >
            <Text>{ props.caption }</Text>
            <FlexSpacer />
            <Badge color='green' fill='solid' caption='Status' />
        </div>
    );
};

const DropdownMenuSwitchButton = (props: IDropdownMenuItemProps) => {
    const [selected, setSelected] = useState(false);

    return (
        <MenuSwitchButton
            { ...props }
            onValueChange={ setSelected }
            isSelected={ selected }
        />
    );
};

export default function BasicDropdownMenuExample() {
    const [selected, setSelected] = useState(false);

    const DropdownBody = ({ onClose }: DropdownBodyProps) => {
        const clickAnalyticsEvent = {
            name: "DropdownMenu Item click",
            category: "docs",
            label: "static_event",
        };

        return (
            <DropdownMenuBody onClose={ onClose } style={ { maxWidth: "250px" } } >
                <DropdownMenuButton icon={ Icon } caption="Menu Item with extra link" href="https://www.epam.com/" clickAnalyticsEvent={ clickAnalyticsEvent } />
                <DropdownMenuButton caption="Disabled Menu Item" isDisabled={ true } />
                <DropdownSubMenu caption="Menu Item with SubMenu">
                    <DropdownMenuButton caption="Menu Item in Submenu" />
                    <DropdownMenuButton caption="Menu Item in Submenu" />
                    <DropdownMenuButton caption="Menu Item in Submenu" />
                    <DropdownMenuButton icon={ Icon } caption="Menu Item in Submenu with icon" />
                    <DropdownSubMenu caption="One More SubMenu">
                        <DropdownMenuButton icon={ Icon } iconPosition="right" caption="Menu Item with icon in right" />
                    </DropdownSubMenu>
                    <DropdownMenuButton icon={ Icon } caption="Menu Item in Submenu" />
                </DropdownSubMenu>
                <DropdownMenuSplitter />
                <DropdownMenuButton icon={ Icon } caption="Click to select it" onClick={ setSelected } isSelected={ selected } />
                <DropdownMenuButton icon={ Icon } caption="Menu Item" />
                <DropdownMenuSwitchButton caption="Menu Item with switch" />
                <DropdownMenuButton icon={ Icon } caption="Menu Item with very long long long long long long long long caption" />
                <DropdownMenuSplitter />
                <DropdownMenuHeader caption="An example of DropdownMenuHeader" />
                <DropdownMenuButton icon={ Icon } iconPosition="right" caption="Menu Item2" />
                <DropdownMenuSplitter />
                <DropdownMenuButton caption="A" />
                <DropdownMenuButton caption="B" />
                <DropdownMenuButton caption="C" />
                <DropdownMenuSplitter />
                <CustomItem caption="Custom menu item"/>
            </DropdownMenuBody>
        );
    };

    return (
        <Dropdown
            renderBody={ props => <DropdownBody { ...props } /> }
            renderTarget={ props => <Button caption='Click to open' { ...props } /> }
        />
    );
}