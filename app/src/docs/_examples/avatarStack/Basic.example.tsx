import React from 'react';
import { AvatarStack, FlexCell } from '@epam/uui';
import css from './BasicExample.module.scss';

const avatarsArray = Array(10)
    .fill('')
    .map((_, index) => `https://avatars.dicebear.com/api/human/avatar12${index}.svg?background=%23EBEDF5&radius=50`);

export default function BasicExample() {
    return (
        <FlexCell width="auto" cx={ css.container }>
            <AvatarStack urlArray={ avatarsArray } avatarsCount={ 6 } direction="right" avatarSize="36" />
        </FlexCell>
    );
}
