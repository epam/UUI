import React from 'react';
import {
    Avatar, FlexRow, Panel, Tooltip, Text,
} from '@epam/promo';
import css from './DelayExample.scss';

export default function TriggerConfigurationWithDelayExample() {
    return (
        <Panel shadow cx={ css.container }>
            <Text fontSize="14" font="sans-semibold" cx={ css.caption }>
                Project Team
            </Text>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <FlexRow spacing="6" size="24">
                    <Avatar size="18" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />
                    <Text fontSize="14" lineHeight="24" cx={ css.text }>
                        Ann Zaharova
                    </Text>
                </FlexRow>
            </Tooltip>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <FlexRow spacing="6" size="24">
                    <Avatar size="18" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />
                    <Text fontSize="14" lineHeight="24" cx={ css.text }>
                        Alexander Sozonov
                    </Text>
                </FlexRow>
            </Tooltip>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <FlexRow spacing="6" size="24">
                    <Avatar size="18" alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" />
                    <Text fontSize="14" lineHeight="24" cx={ css.text }>
                        Peter Drummer
                    </Text>
                </FlexRow>
            </Tooltip>
        </Panel>
    );
}
