import React from 'react';
import { FlexCell, FlexRow, FlexSpacer, Panel, Text, LinkButton, IconButton, Badge, Avatar } from '@epam/promo';
import { demoData } from '@epam/uui-docs';
import { ReactComponent as TickIcon } from '@epam/assets/icons/common/notification-done-18.svg';
import { ReactComponent as PencilIcon } from '@epam/assets/icons/common/content-edit-18.svg';
import { ReactComponent as OnlineIcon } from '@epam/assets/icons/common/content-filtration-18.svg';
import { ReactComponent as TrashIcon } from '@epam/assets/icons/common/action-delete-18.svg';
import { ReactComponent as GearIcon } from '@epam/assets/icons/common/action-settings-18.svg';

const imgPath = 'https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50';

export default function BasicExample() {
    return (
        <>
            <Panel margin='24' style={ { width: '400px' } } background='white' shadow>
                <FlexRow padding='12' >
                    <Text font='sans-semibold' size='48'>Identity Document</Text>
                    <FlexSpacer />
                    <IconButton icon={ TickIcon } color='green' />
                </FlexRow>
                <FlexRow padding='12' vPadding='12' >
                    <FlexCell width='100%'>
                        <Text size='24' font='sans' color='gray60'>Passport</Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding='12'>
                    <LinkButton caption='EDIT' icon={ PencilIcon } size='30'/>
                    <FlexSpacer />
                    <Text size='18' font='sans' color='gray60'>Updated on 21 Aug 2018, 16:00</Text>
                </FlexRow>
            </Panel>
            <FlexSpacer />
            <Panel margin='24' style={ { width: '400px' } } shadow background='white'>
                <FlexRow background='gray5' padding='12'>
                    <LinkButton caption='online' icon={ OnlineIcon } color='blue' />
                    <FlexSpacer />
                    <IconButton icon={ TrashIcon } color='blue' />
                </FlexRow>
                <FlexRow padding='12' vPadding='12' borderBottom>
                    <FlexCell width='100%'>
                        <Text size='36' font='sans' color='gray60' >{ demoData.loremIpsum }</Text>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding='12' spacing='6'>
                    <LinkButton icon={ GearIcon } />
                    <Badge size='18' caption='Olivia Wilde' icon={ () => <Avatar img={ imgPath } size={ '12' } /> } />
                    <FlexSpacer />
                    <Text size='36' font='sans' color='gray60'>98%</Text>
                </FlexRow>
            </Panel>
        </>
    );
}