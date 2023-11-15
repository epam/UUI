import React from 'react';
import { AvatarStack, FlexCell } from '@epam/uui';
import css from './BasicExample.module.scss';

const avatarsArray = Array(10)
    .fill('')
    .map((_, index) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${index}&radius=50&backgroundColor=b6e3f4`);

export default function BasicExample() {
    return (
        <FlexCell width="auto" cx={ css.container }>
            <AvatarStack urlArray={ avatarsArray } avatarsCount={ 6 } direction="right" avatarSize="36" />
        </FlexCell>
    );
}
