import React, { useState } from 'react';
import { offset } from '@floating-ui/react';
import { IDropdownMenuItemProps, DropdownMenuBody, DropdownMenuButton, DropdownMenuSwitchButton, DropdownMenuSplitter, DropdownMenuHeader, DropdownSubMenu,
    Dropdown, ControlGroup, Button, LinkButton, Tooltip } from '@epam/uui';
import { DropdownBodyProps } from '@epam/uui-core';
import { ReactComponent as LogoutIcon } from '@epam/assets/icons/common/navigation-logout-18.svg';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/common/action-delete-18.svg';
import { ReactComponent as ExportIcon } from '@epam/assets/icons/common/file-export-18.svg';
import { ReactComponent as PersonIcon } from '@epam/assets/icons/common/social-person-18.svg';

function DropdownMenuSwitchButtonElement(props: IDropdownMenuItemProps) {
    const [selected, setSelected] = useState(false);
    return <DropdownMenuSwitchButton { ...props } onValueChange={ setSelected } isSelected={ selected } />;
}

const statusOptions = [
    { id: 1, caption: 'Available' },
    { id: 2, caption: 'Busy' },
    { id: 3, caption: 'Do not disturb' },
    { id: 4, caption: 'Be right back' },
    { id: 5, caption: 'Appear away' },
];

const layerOptions = [
    { id: 1, caption: '[Link Button] Tokens' },
    { id: 2, caption: '[User Card] Create as a global component' },
    { id: 3, caption: '[Input] Rework & Improve components' },
    { id: 4, caption: '[Colors] Create accessible palette' },
    { id: 5, caption: '[Colors & Styles] Add Specification' },
];

export default function BasicDropdownMenuExample() {
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
    const [selectedItems, setSelectedItems] = useState<Record<string, Set<number>>>({});

    const handleStatusChange = (id: number) => {
        setSelectedStatus((prev) => prev === id ? null : id);
    };

    const handleItemToggle = (group: string, id: number) => {
        setSelectedItems((prev) => {
            const currentSet = prev[group] || new Set<number>();
            const newSet = new Set(currentSet);

            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }

            return {
                ...prev,
                [group]: newSet,
            };
        });
    };

    const getSubmenuLayer = (group: string) =>
        layerOptions.map((item) => (
            <DropdownMenuButton
                key={ item.id }
                caption={ item.caption }
                onClick={ () => handleItemToggle(group, item.id) }
                isActive={ selectedItems[group]?.has(item.id) || false }
            />
        ));

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownMenuBody { ...props } rawProps={ { style: { maxWidth: '250px', padding: '6px 0' } } }>
                <DropdownMenuHeader caption="Alex Smith" />
                <DropdownMenuSplitter />
                <DropdownMenuButton caption="Profile" href="#" />
                <DropdownSubMenu caption="Status">
                    {statusOptions.map((item) => (
                        <DropdownMenuButton
                            key={ item.id }
                            caption={ item.caption }
                            onClick={ () => handleStatusChange(item.id) }
                            isSelected={ selectedStatus === item.id }
                        />
                    ))}
                </DropdownSubMenu>
                <DropdownMenuButton caption="Activities" href="#" />
                <DropdownSubMenu caption="Tasks">
                    <DropdownSubMenu caption="Backlog">{getSubmenuLayer('backlog')}</DropdownSubMenu>
                    <DropdownSubMenu caption="To Do">{getSubmenuLayer('todo')}</DropdownSubMenu>
                    <DropdownSubMenu caption="Doing">{getSubmenuLayer('doing')}</DropdownSubMenu>
                    <DropdownSubMenu caption="Done">{getSubmenuLayer('done')}</DropdownSubMenu>
                    <DropdownSubMenu caption="Closed">{getSubmenuLayer('closed')}</DropdownSubMenu>
                </DropdownSubMenu>
                <DropdownMenuSplitter />
                <DropdownMenuSwitchButtonElement caption="Notifications" />
                <DropdownMenuSplitter />
                <DropdownMenuButton icon={ LogoutIcon } iconPosition="left" caption="Log Out" onClick={ () => null } />
            </DropdownMenuBody>
        );
    };

    const renderSecondDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownMenuBody { ...props }>
                <DropdownMenuButton caption="Cancel Data Loads" indent={ true } onClick={ () => {} } />
                <DropdownMenuButton caption="Deactivate" indent={ true } onClick={ () => {} } />
                <Tooltip content="You don't have permissions to perform this action">
                    <DropdownMenuButton isDisabled={ true } caption="Delete" icon={ DeleteIcon } onClick={ () => {} } />
                </Tooltip>
            </DropdownMenuBody>
        );
    };

    const renderThirdDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownMenuBody { ...props } rawProps={ { style: { padding: 0 } } }>
                <DropdownMenuButton caption="Export" icon={ ExportIcon } onClick={ () => {} } />
                <DropdownMenuButton caption="Delete" icon={ DeleteIcon } onClick={ () => {} } />
            </DropdownMenuBody>
        );
    };

    return (
        <>
            <Dropdown
                renderBody={ renderDropdownBody }
                renderTarget={ (props) => (
                    <LinkButton
                        icon={ PersonIcon }
                        caption="Alex Smith"
                        size="36"
                        { ...props }
                    />
                ) }
                middleware={ [offset(6)] }
            />
            <ControlGroup>
                <Button size="36" caption="Action with selected" onClick={ () => {} } />
                <Dropdown
                    renderBody={ renderSecondDropdownBody }
                    renderTarget={ (props) => <Button { ...props } icon={ MenuIcon } size="36" isDropdown={ false } /> }
                    placement="bottom-end"
                    middleware={ [offset(6)] }
                />
            </ControlGroup>
            <Dropdown
                renderBody={ renderThirdDropdownBody }
                renderTarget={ (props) => <Button { ...props } fill="outline" icon={ MenuIcon } size="36" isDropdown={ false } /> }
                placement="bottom-end"
                middleware={ [offset(6)] }
            />
        </>
    );
}
