import React from 'react';
import { Avatar, FlexRow, Panel, Tooltip, Text } from '@epam/uui';
import css from './DelayExample.module.scss';

export default function TriggerConfigurationWithDelayExample() {
    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <Text fontSize="14" fontWeight="600" cx={ css.caption }>
                Project Team
            </Text>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <FlexRow columnGap="6" size="24">
                    <Avatar size="18" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />
                    <Text fontSize="14" lineHeight="24" cx={ css.text }>
                        Ann Zaharova
                    </Text>
                </FlexRow>
            </Tooltip>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <FlexRow columnGap="6" size="24">
                    <Avatar size="18" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />
                    <Text fontSize="14" lineHeight="24" cx={ css.text }>
                        Alexander Sozonov
                    </Text>
                </FlexRow>
            </Tooltip>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <FlexRow columnGap="6" size="24">
                    <Avatar size="18" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />
                    <Text fontSize="14" lineHeight="24" cx={ css.text }>
                        Peter Drummer
                    </Text>
                </FlexRow>
            </Tooltip>
        </Panel>
    );
}
