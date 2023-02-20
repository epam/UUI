import React from 'react';
import { AvatarStack, FlexCell, Tooltip } from '@epam/promo';
import css from './BasicExample.scss';
import { uuiMarkers } from '@epam/uui';

const avatarsArray = Array(10)
    .fill('')
    .map((_, index) => `https://avatars.dicebear.com/api/human/avatar12${index}.svg?background=%23EBEDF5&radius=50`);

export default function BasicExample() {
    const renderItem = (url: string) => {
        const handleClick = () => {
            console.log('handleClick');
        };

        return (
            <Tooltip content="Some text" placement="bottom">
                <img src={url} alt="avatar" width={36} height={36} onClick={handleClick} className={uuiMarkers.clickable} />
            </Tooltip>
        );
    };

    return (
        <FlexCell width="auto" cx={css.container}>
            <AvatarStack urlArray={avatarsArray} avatarsCount={6} direction="right" avatarSize="36" renderItem={renderItem} />
        </FlexCell>
    );
}
