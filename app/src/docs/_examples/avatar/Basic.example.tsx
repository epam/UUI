import React from 'react';
import { Avatar, FlexRow } from '@epam/uui';

export default function BasicExample() {
    const avatarUrl = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4';
    return (
        <FlexRow columnGap="6">
            <Avatar alt="avatar" img={ avatarUrl } size={ 54 } />
            <Avatar alt="avatar" img={ avatarUrl } size="48" />
            <Avatar alt="avatar" img={ avatarUrl } size="42" />
            <Avatar alt="avatar" img={ avatarUrl } size="36" />
            <Avatar alt="avatar" img={ avatarUrl } size="30" />
            <Avatar alt="avatar" img={ avatarUrl } size="24" />
        </FlexRow>
    );
}
