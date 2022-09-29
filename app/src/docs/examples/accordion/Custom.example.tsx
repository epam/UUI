import React from 'react';
import { Accordion, FlexCell, FlexRow, Text, Avatar, Badge } from '@epam/promo';
import css from './CustomExample.scss';

const renderTitle = () => (
    <FlexRow spacing='12' padding="6" cx={ css.titleWrap }>
        <FlexCell grow={ 3 }>
            <FlexRow>
                <Avatar alt='avatar' img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' size='30' cx={ css.userAvatar } />
                <Text fontSize='16' font='sans-semibold'>John Doe</Text>
            </FlexRow>
        </FlexCell>
        <FlexCell width='auto' alignSelf="flex-end">
            <Badge color='green' fill='transparent' caption='Employee' />
        </FlexCell>
    </FlexRow>
)

const renderContent = () => (
    <FlexRow spacing='12' padding="6" cx={ css.contentWrap }>
        <FlexCell grow={ 1 }>
            <Text fontSize='16' font='sans'>UPN</Text>
        </FlexCell>
        <FlexCell grow={ 3 }>
            <Text fontSize='16' font='sans'>johndoe@epam.com</Text>
        </FlexCell>
    </FlexRow>
)

export default function BasicAccordionExample() {
    return (
        <FlexCell width='100%' cx={ css.container }>
            <Accordion title='Accordion block mode' renderTitle={renderTitle} renderContent={renderContent} mode='block' />
            <Accordion title='Accordion block mode' renderTitle={renderTitle} renderContent={renderContent} mode='block' dropdownIcon={null} />
        </FlexCell>
    );
}
