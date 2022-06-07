import React, { useState } from 'react';
import { Dropdown, DropdownBodyProps } from '@epam/uui-components';
import {
    Avatar,
    DropdownMenuBody,
    DropdownMenuButton,
    DropdownMenuSwitchButton,
    DropdownMenuSplitter,
    DropdownMenuHeader,
    DropdownSubMenu,
    IDropdownMenuItemProps,
} from '@epam/promo';
import { ReactComponent as Icon } from '@epam/assets/icons/common/action-eye-18.svg';
import { ReactComponent as LogoutIcon } from '@epam/assets/icons/common/navigation-logout-24.svg';

// const CustomItem = (props: IDropdownMenuItemProps) => {
//     return (
//         <div
//             role="menuitem"
//             className={ cx(props.cx, props.isDisabled && uuiMod.disabled) }
//             style={ {
//                 justifyContent: "space-between",
//                 display: "flex",
//                 alignItems: "center",
//                 width: "100%",
//                 padding: "0.5em 1em",
//                 lineHeight: 1.5,
//                 boxSizing: "border-box",
//             } }
//         >
//             <Text>{ props.caption }</Text>
//             <FlexSpacer/>
//             <Badge color="green" fill="solid" caption="Status"/>
//         </div>
//     );
// };

const DropdownMenuSwitchButtonElement = (props: IDropdownMenuItemProps) => {
    const [selected, setSelected] = useState(false);

    return (
        <DropdownMenuSwitchButton
            { ...props }
            onValueChange={ setSelected }
            isSelected={ selected }
        />
    );
};

const getSubMenuLayer = () => (
    <>
        <DropdownMenuButton caption="[Link Button] Tokens"/>
        <DropdownMenuButton caption="[User Card] Create as a global component"/>
        <DropdownMenuButton caption="[Input] Rework & Improve components"/>
        <DropdownMenuButton caption="[Colors] Create accessible palette"/>
        <DropdownMenuButton caption="[Colors & Styles] Add Specification"/>
    </>
);

export default function BasicDropdownMenuExample() {
    const [selected, setSelected] = useState(false);

    const DropdownBody = ({ onClose }: DropdownBodyProps) => {
        // const clickAnalyticsEvent = {
        //     name: "DropdownMenu Item click",
        //     category: "docs",
        //     label: "static_event",
        // };

        return (
            <DropdownMenuBody onClose={ onClose } style={ { maxWidth: "250px" } }>
                <DropdownMenuHeader caption="Alex Smith"/>
                <DropdownMenuSplitter/>
                <DropdownMenuButton caption="Profile"/>
                <DropdownSubMenu caption="Status">
                    <DropdownMenuButton caption="Available"/>
                    <DropdownMenuButton caption="Busy"/>
                    <DropdownMenuButton caption="Do not disturb"/>
                    <DropdownMenuButton caption="Be right back"/>
                    <DropdownMenuButton caption="Appear away"/>
                </DropdownSubMenu>
                <DropdownMenuButton caption="Activities"/>
                <DropdownSubMenu caption="Tasks">
                    <DropdownSubMenu caption="Backlog">
                        { getSubMenuLayer() }
                    </DropdownSubMenu>
                    <DropdownSubMenu caption="To Do">
                        { getSubMenuLayer() }
                    </DropdownSubMenu>
                    <DropdownSubMenu caption="Doing">
                        { getSubMenuLayer() }
                    </DropdownSubMenu>
                    <DropdownSubMenu caption="Done">
                        { getSubMenuLayer() }
                    </DropdownSubMenu>
                    <DropdownSubMenu caption="Closed">
                        { getSubMenuLayer() }
                    </DropdownSubMenu>
                </DropdownSubMenu>
                <DropdownMenuSplitter/>
                <DropdownMenuSwitchButtonElement caption="Notifications"/>
                <DropdownMenuSplitter/>
                <DropdownMenuButton icon={ LogoutIcon } iconPosition="left" caption="Log Out"/>
                <DropdownMenuButton icon={ Icon } caption="Click to select it" onClick={ setSelected } isSelected={ selected }/>
            </DropdownMenuBody>
        );
    };

    return (
        <Dropdown
            renderBody={ props => <DropdownBody { ...props } /> }
            renderTarget={ props => <Avatar
                img={ 'https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' }
                size={ '36' } { ...props } /> }
        />
    );
}

/*
    <DropdownMenuButton icon={ Icon } caption="Menu Item with extra link" href="https://www.epam.com/" clickAnalyticsEvent={ clickAnalyticsEvent }/>
    <DropdownMenuButton caption="Disabled Menu Item" isDisabled={ true }/>
    <DropdownSubMenu caption="Menu Item with SubMenu">
        <DropdownMenuButton caption="Menu Item in Submenu"/>
        <DropdownMenuButton icon={ Icon } caption="Menu Item in Submenu with icon"/>
        <DropdownSubMenu caption="One More SubMenu">
            <DropdownMenuButton icon={ Icon } iconPosition="right" caption="Menu Item with icon in right"/>
        </DropdownSubMenu>
        <DropdownMenuButton icon={ Icon } caption="Menu Item in Submenu"/>
    </DropdownSubMenu>
    <DropdownMenuSplitter/>
    <DropdownMenuButton icon={ Icon } caption="Click to select it" onClick={ setSelected } isSelected={ selected }/>
    <DropdownMenuButton icon={ Icon } caption="Menu Item"/>
    <DropdownMenuSwitchButton caption="Menu Item with switch"/>
    <DropdownMenuButton icon={ Icon } caption="Menu Item with very long long long long long long long long caption"/>
    <DropdownMenuSplitter/>
    <DropdownMenuButton icon={ Icon } iconPosition="right" caption="Menu Item2"/>
    <DropdownMenuSplitter/>
    <CustomItem caption="Custom menu item"/>
*/