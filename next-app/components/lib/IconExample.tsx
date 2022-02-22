import { Avatar, AvatarStack, FlexRow, IconContainer, Panel, Tooltip } from "@epam/promo";
import React from "react";
import Icon from '@epam/assets/icons/common/action-add-18.svg';

const avatarsArray = Array(10).fill('').map((_, index) => `https://avatars.dicebear.com/api/human/avatar12${index}.svg?background=%23EBEDF5&radius=50`);

export const IconExample = () => {
    return (
        <Panel cx={ 'withGap' } rawProps={ {
            style: { borderRadius: 0 },
        } }>
            <FlexRow>
                <AvatarStack urlArray={ avatarsArray } avatarsCount={ 6 } direction='right' avatarSize='36' />
            </FlexRow>
            <FlexRow>
                <Tooltip content='Some avatar' placement={ 'right' }>
                    <Avatar alt='avatar' img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' size='48' />
                </Tooltip>
            </FlexRow>
            <FlexRow>
                <IconContainer icon={ Icon }/>
            </FlexRow>
        </Panel>
    );
};