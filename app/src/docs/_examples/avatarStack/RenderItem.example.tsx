import React from 'react';
import { AvatarStack, FlexCell, Tooltip } from '@epam/uui';
import css from './BasicExample.module.scss';
import { uuiMarkers } from '@epam/uui-core';

const avatarsArray = Array(10)
    .fill('')
    .map((_, index) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${index}&radius=50&backgroundColor=b6e3f4`);

export default function BasicExample() {
    const renderItem = (url: string) => {
        const handleClick = () => {

        };

        return (
            <Tooltip content="Some text" placement="bottom">
                <img src={ url } alt="avatar" width={ 36 } height={ 36 } onClick={ handleClick } className={ uuiMarkers.clickable } tabIndex={ 0 } />
            </Tooltip>
        );
    };

    return (
        <FlexCell width="auto" cx={ css.container }>
            <AvatarStack urlArray={ avatarsArray } avatarsCount={ 6 } direction="left" avatarSize="36" renderItem={ renderItem } />
        </FlexCell>
    );
}
