import React from 'react';
import { LinkButton, Text } from '@epam/promo';
import css from './SizeExample.scss';

export default function SizeExample() {
    return (
        <div className={ css.container } >
            <LinkButton caption='link button' link={ { pathname: '/' } } captionCX={ css.caption } size='42' />
            <LinkButton caption='link button' link={ { pathname: '/' } } captionCX={ css.caption } size='36' />
            <LinkButton caption='link button' link={ { pathname: '/' } } captionCX={ css.caption } size='30' />
            <LinkButton caption='link button' link={ { pathname: '/' } } captionCX={ css.caption } size='24' />

            <Text fontSize='14'>42 px</Text>
            <Text fontSize='14'>36 px</Text>
            <Text fontSize='14'>30 px</Text>
            <Text fontSize='14'>24 px</Text>
        </div>
    );
}
