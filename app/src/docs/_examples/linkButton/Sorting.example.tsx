import React, { useState } from 'react';
import { IDropdownToggler, DropdownBodyProps } from '@epam/uui-core';
import { Dropdown, DropdownMenuButton, FlexRow, LinkButton, Panel, Text } from '@epam/promo';

const dropdownMenuItems = [
    { id: 1, caption: 'Relevance'},
    { id: 2, caption: 'Price'},
    { id: 3, caption: 'Size'},
];

export default function SortingLinkButtonExample() {
    const [selectedItem, setSelectedItem] = useState(dropdownMenuItems[0]);
    const handleDropdown = (id: number) => {
        setSelectedItem(dropdownMenuItems.filter((item) => item.id === id)[0]);
    };

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <Panel background='white' shadow>
                { dropdownMenuItems.map((item) => (
                    <DropdownMenuButton key={ item.id } caption={ item.caption } onClick={ () => {
                        handleDropdown(item.id);
                        props.onClose();
                    } }/>
                )) }
            </Panel>
        );
    };

    return (
        <FlexRow columnGap={ 3 }>
            <Text>Sort by</Text>
            <Dropdown
                renderBody={ renderDropdownBody }
                renderTarget={ (props: IDropdownToggler) => <LinkButton caption={ selectedItem.caption }
                { ...props } /> }
            />
        </FlexRow>
    );
}