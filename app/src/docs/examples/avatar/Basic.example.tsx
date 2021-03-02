import * as React from 'react';
import { Avatar, FlexRow } from '@epam/promo';

export function BasicExample() {

    return (
        <FlexRow spacing='6'>
            <Avatar alt='avatar' img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' size='48' />
            <Avatar alt='avatar' img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' size='42' />
            <Avatar alt='avatar' img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' size='36' />
            <Avatar alt='avatar' img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' size='30' />
            <Avatar alt='avatar' img='https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50' size='24' />
        </FlexRow>
    );
}