import React from 'react';
import { Button, ControlGroup, Dropdown, DropdownMenuButton, DropdownMenuBody } from '@epam/uui';
import { ReactComponent as menuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';

export default function BasicExample() {
    const renderBody = () => {
        return (
            <DropdownMenuBody>
                <DropdownMenuButton caption="Duplicate" onClick={ () => {} } />
                <DropdownMenuButton caption="Rename" onClick={ () => {} } />
                <DropdownMenuButton caption="Delete" onClick={ () => {} } />
            </DropdownMenuBody>
        );
    };

    return (
        <>
            <ControlGroup>
                <Button size="36" caption="Preset" fill="solid" onClick={ () => {} } />
                <Dropdown
                    renderBody={ renderBody }
                    renderTarget={ (props) => <Button { ...props } fill="solid" icon={ menuIcon } size="36" isDropdown={ false } /> }
                    placement="bottom-end"
                />
            </ControlGroup>

            <ControlGroup>
                <Button size="36" caption="Preset" fill="none" onClick={ () => {} } />
                <Dropdown
                    renderBody={ renderBody }
                    renderTarget={ (props) => <Button { ...props } fill="none" icon={ menuIcon } size="36" isDropdown={ false } /> }
                    placement="bottom-end"
                />
            </ControlGroup>
        </>
    );
}
