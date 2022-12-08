import React, { useState } from 'react';
import { Badge, Dropdown, DropdownMenuButton, FlexCell, FlexRow, Panel, Text } from '@epam/promo';
import { ReactComponent as mediaIcon } from '@epam/assets/icons/common/media-play-fill-18.svg';
import { ReactComponent as doneIcon } from '@epam/assets/icons/common/notification-done-24.svg';
import { ReactComponent as closeIcon } from '@epam/assets/icons/common/navigation-close-18.svg';
import { ReactComponent as navigationDownIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { DropdownBodyProps } from '@epam/uui-components';
import css from './TypesExample.scss';

const dropdownMenuItems = [
    { id: 1, caption: "In Progress"},
    { id: 2, caption: "To Do"},
    { id: 3, caption: "Done"},
];

export default function BasicExample() {
    const [selectedItem, setSelectedItem] = useState(dropdownMenuItems[0]);
    const handleDropdown = (id: number) => {
        setSelectedItem(dropdownMenuItems.filter((item) => item.id === id)[0]);
    };

    const renderDropdownBody = (props: DropdownBodyProps) => {
        return (
            <Panel background='white' shadow={ true }>
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
        <>
            <Panel style={ {rowGap: '18px', marginRight: '42px'} }>
                <FlexRow spacing='18'>
                    <Badge icon={ mediaIcon } color='orange' fill='semitransparent' caption='Video' />
                    <Text fontSize="14">Use as an attribute or label</Text>
                </FlexRow>
                <FlexRow spacing='18'>
                    <Badge icon={ doneIcon } color='green' fill='semitransparent' caption='Ready' />
                    <Text fontSize="14">View statuses</Text>
                </FlexRow>
                <FlexRow spacing='18'>
                    <Badge icon={ closeIcon } iconPosition='right' color='blue' fill='semitransparent' caption='Java'
                        onIconClick={ () => {} } />
                    <Text fontSize="14">Filter chips</Text>
                </FlexRow>
            </Panel>
            <Panel style={ {rowGap: '18px'} }>
                <FlexRow spacing='18'>
                    <Badge count={ 25 } color='red' fill='solid' caption='Rejected' />
                    <Text fontSize="14">Quick filters selection with informer</Text>
                </FlexRow>
                <FlexRow spacing='18'>
                    <Dropdown
                        renderBody={ renderDropdownBody }
                        renderTarget={ (props) =>
                            <Badge { ...props } dropdownIcon={ navigationDownIcon } dropdownIconPosition="right"
                                color='gray30' fill='semitransparent' caption={ selectedItem.caption }
                                cx={ css.badgeStyles } />
                        }
                        placement="bottom-end"
                    />
                    <Text fontSize="14">Label & trigger for selection using dropdown</Text>
                </FlexRow>
                <FlexRow spacing='18'>
                    <Badge color='gray30' fill='semitransparent' caption='Projects' />
                    <Text fontSize="14">Simple attribute or label </Text>
                </FlexRow>
            </Panel>
        </>
    );
}