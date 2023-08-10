import React, { useState } from 'react';
import { IDropdownMenuItemProps, DropdownMenuBody, DropdownMenuButton, DropdownMenuSwitchButton, DropdownMenuSplitter, DropdownMenuHeader, DropdownSubMenu,
    Dropdown, Panel, ControlGroup, Button, LinkButton } from '@epam/uui';
import { DropdownBodyProps } from '@epam/uui-core';
import { ReactComponent as LogoutIcon } from '@epam/assets/icons/common/navigation-logout-24.svg';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-12.svg';
import { ReactComponent as DeleteIcon } from '@epam/assets/icons/common/action-delete-12.svg';
import { ReactComponent as ExportIcon } from '@epam/assets/icons/common/file-export-12.svg';
import { ReactComponent as PersonIcon } from '@epam/assets/icons/common/social-person-12.svg';

function DropdownMenuSwitchButtonElement(props: IDropdownMenuItemProps) {
    const [selected, setSelected] = useState(false);
    return <DropdownMenuSwitchButton { ...props } onValueChange={ setSelected } isSelected={ selected } />;
}

const initialStatusState = [
    { id: 1, caption: 'Available', checked: false }, { id: 2, caption: 'Busy', checked: false }, { id: 3, caption: 'Do not disturb', checked: false }, { id: 4, caption: 'Be right back', checked: false }, { id: 5, caption: 'Appear away', checked: false },
];

const initialLayerState = [
    { id: 1, caption: '[Link Button] Tokens', checked: false }, { id: 2, caption: '[User Card] Create as a global component', checked: false }, { id: 3, caption: '[Input] Rework & Improve components', checked: false }, { id: 4, caption: '[Colors] Create accessible palette', checked: false }, { id: 5, caption: '[Colors & Styles] Add Specification', checked: false },
];

export default function BasicDropdownMenuExample() {
    const [status, setStatus] = useState(initialStatusState);
    const [layer, setLayer] = useState(initialLayerState);

    const setStatusHandler = (id: number, isChecked: boolean) => {
        setStatus((prevState) =>
            prevState.map((item) => {
                item.checked = item.id === id ? !isChecked : false;
                return item;
            }));
    };

    const setLayerHandler = (id: number, isActive: boolean) => {
        setLayer((prevState) =>
            prevState.map((item) => {
                item.checked = item.id === id ? !isActive : false;
                return item;
            }));
    };

    const getSubmenuLayer = () =>
        layer.map((item) => <DropdownMenuButton caption={ item.caption } onClick={ () => setLayerHandler(item.id, item.checked) } isActive={ item.checked } />);

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownMenuBody { ...props } rawProps={ { style: { maxWidth: '250px' } } }>
                <DropdownMenuHeader caption="Alex Smith" />
                <DropdownMenuSplitter />
                <DropdownMenuButton caption="Profile" />
                <DropdownSubMenu caption="Status">
                    {status.map((item) => (
                        <DropdownMenuButton caption={ item.caption } onClick={ () => setStatusHandler(item.id, item.checked) } isSelected={ item.checked } />
                    ))}
                </DropdownSubMenu>
                <DropdownMenuButton caption="Activities" />
                <DropdownSubMenu caption="Tasks">
                    <DropdownSubMenu caption="Backlog">{getSubmenuLayer()}</DropdownSubMenu>
                    <DropdownSubMenu caption="To Do">{getSubmenuLayer()}</DropdownSubMenu>
                    <DropdownSubMenu caption="Doing">{getSubmenuLayer()}</DropdownSubMenu>
                    <DropdownSubMenu caption="Done">{getSubmenuLayer()}</DropdownSubMenu>
                    <DropdownSubMenu caption="Closed">{getSubmenuLayer()}</DropdownSubMenu>
                </DropdownSubMenu>
                <DropdownMenuSplitter />
                <DropdownMenuSwitchButtonElement caption="Notifications" />
                <DropdownMenuSplitter />
                <DropdownMenuButton icon={ LogoutIcon } iconPosition="left" caption="Log Out" />
            </DropdownMenuBody>
        );
    };

    const renderSecondDropdownBody = () => {
        return (
            <Panel shadow={ true }>
                <DropdownMenuButton caption="Cancel Data Loads" onClick={ () => {} } />
                <DropdownMenuButton caption="Deactivate" onClick={ () => {} } />
                <DropdownMenuButton caption="Delete" onClick={ () => {} } />
            </Panel>
        );
    };

    const renderThirdDropdownBody = () => {
        return (
            <Panel shadow={ true }>
                <DropdownMenuButton caption="Export" icon={ ExportIcon } onClick={ () => {} } />
                <DropdownMenuButton caption="Delete" icon={ DeleteIcon } onClick={ () => {} } />
            </Panel>
        );
    };

    return (
        <>
            <Dropdown
                closeOnMouseLeave="boundary"
                closeDelay={ 400 }
                renderBody={ (props) => renderDropdownBody(props) }
                renderTarget={ (props) => (
                    <LinkButton
                        icon={ PersonIcon }
                        caption="Alex Smith"
                        size="36"
                        { ...props }
                    />
                ) }
            />
            <ControlGroup>
                <Button size="36" caption="Action with selected" onClick={ () => {} } />
                <Dropdown
                    renderBody={ renderSecondDropdownBody }
                    renderTarget={ (props) => <Button { ...props } icon={ MenuIcon } size="36" isDropdown={ false } /> }
                    placement="bottom-end"
                />
            </ControlGroup>
            <ControlGroup>
                <Dropdown
                    renderBody={ renderThirdDropdownBody }
                    renderTarget={ (props) => <Button { ...props } fill="outline" icon={ MenuIcon } size="36" isDropdown={ false } /> }
                    placement="bottom-end"
                />
            </ControlGroup>
        </>
    );
}
