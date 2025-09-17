import React from 'react';
import { Avatar, Panel, Tooltip, Text, LinkButton } from '@epam/uui';
import css from './DelayExample.module.scss';

export default function TriggerConfigurationWithDelayExample() {
    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <Text fontSize="14" fontWeight="600" cx={ css.caption }>
                Project Team
            </Text>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <LinkButton
                    icon={
                        () => <Avatar size="18" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />
                    }
                    caption="Ann Zaharova"
                    href="#"
                    size="30"
                    rawProps={ {
                        'aria-describedby': '',
                        'aria-description': 'Experiance Designer',
                    } }
                />
            </Tooltip>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <LinkButton
                    icon={
                        () => <Avatar size="18" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />
                    }
                    caption="Alexander Sozonov"
                    href="#"
                    size="30"
                />
            </Tooltip>
            <Tooltip content="Experiance Designer" openDelay={ 250 }>
                <LinkButton
                    icon={
                        () => <Avatar size="18" alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" />
                    }
                    caption="Peter Drummer"
                    href="#"
                    size="30"
                />
            </Tooltip>
        </Panel>
    );
}
