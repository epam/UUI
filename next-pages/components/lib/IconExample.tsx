import {
    Avatar, AvatarStack, FlexRow, IconContainer, Panel, Tooltip, 
} from '@epam/promo';
import React from 'react';
import Icon from '@epam/assets/icons/common/action-add-18.svg';

const avatarsArray = Array(10).fill('').map((_, index) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${index}&radius=50&backgroundColor=b6e3f4`);

export function IconExample() {
    return (
        <Panel
            cx="withGap"
            rawProps={ {
                style: { borderRadius: 0 },
            } }
        >
            <FlexRow>
                <AvatarStack
                    urlArray={ avatarsArray }
                    avatarsCount={ 6 }
                    direction="right"
                    avatarSize="36"
                />
            </FlexRow>
            <FlexRow>
                <Tooltip
                    content="Some avatar"
                    placement="right"
                >
                    <Avatar
                        alt="avatar"
                        img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4"
                        size="48"
                    />
                </Tooltip>
            </FlexRow>
            <FlexRow>
                <IconContainer icon={ Icon } />
            </FlexRow>
        </Panel>
    );
}
