import React, { useState } from 'react';
import {
    Badge, Dropdown, DropdownMenuButton, FlexCell, FlexRow, Panel, Text,
} from '@epam/promo';
import { ReactComponent as navigationDownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { DropdownBodyProps } from '@epam/uui-core';
import css from './DropdownExample.scss';

const dropdownMenuItems = [
    { id: 1, caption: 'In Progress', color: '#E67E17' }, { id: 2, caption: 'Draft', color: 'gray' }, { id: 3, caption: 'Done', color: '#88CC00' },
];

export default function TypesExample() {
    const [selectedItem, setSelectedItem] = useState(dropdownMenuItems[0]);
    const handleDropdown = (id: number) => {
        setSelectedItem(dropdownMenuItems.filter((item) => item.id === id)[0]);
    };

    const statusDot = (color: string) => <span className={ css.dot } style={ { backgroundColor: color } } />;

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <Panel background="white" shadow>
                {dropdownMenuItems.map((item) => (
                    <DropdownMenuButton
                        key={ item.id }
                        caption={ item.caption }
                        icon={ () => statusDot(item.color) }
                        onClick={ () => {
                            handleDropdown(item.id);
                            props.onClose();
                        } }
                    />
                ))}
            </Panel>
        );
    };

    return (
        <FlexRow spacing="18">
            <Dropdown
                renderBody={ renderDropdownBody }
                renderTarget={ (props) => (
                    <Badge
                        { ...props }
                        dropdownIcon={ navigationDownIcon }
                        dropdownIconPosition="right"
                        color="gray30"
                        icon={ () => statusDot(selectedItem.color) }
                        fill="semitransparent"
                        caption={ selectedItem.caption }
                    />
                ) }
                placement="bottom-end"
            />
        </FlexRow>
    );
}
