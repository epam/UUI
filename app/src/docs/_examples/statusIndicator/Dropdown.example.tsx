import React, { useState } from 'react';
import { Dropdown, DropdownContainer, DropdownMenuButton, FlexRow, StatusIndicator, StatusIndicatorProps, LinkButton } from '@epam/uui';
import { DropdownBodyProps } from '@epam/uui-core';

const dropdownMenuItems = [
    { id: 1, caption: 'In Progress', color: 'info' }, { id: 2, caption: 'Draft', color: 'neutral' }, { id: 3, caption: 'Done', color: 'success' },
];

export default function TypesExample() {
    const [selectedItem, setSelectedItem] = useState(dropdownMenuItems[0]);
    const handleDropdown = (id: number) => {
        setSelectedItem(dropdownMenuItems.filter((item) => item.id === id)[0]);
    };

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <DropdownContainer { ...props } width="auto">
                {dropdownMenuItems.map((item) => (
                    <DropdownMenuButton
                        key={ item.id }
                        caption={ <StatusIndicator caption={ item.caption } color={ item.color as StatusIndicatorProps['color'] } /> }
                        onClick={ () => {
                            handleDropdown(item.id);
                            props.onClose();
                        } }
                    />
                ))}
            </DropdownContainer>
        );
    };

    return (
        <FlexRow columnGap="18">
            <Dropdown
                renderBody={ renderDropdownBody }
                renderTarget={ (props) => (
                    <LinkButton
                        caption={ <StatusIndicator caption={ selectedItem.caption } color={ selectedItem.color as StatusIndicatorProps['color'] } /> }
                        size="36"
                        { ...props }
                    />
                ) }
                placement="bottom-end"
            />
        </FlexRow>
    );
}
