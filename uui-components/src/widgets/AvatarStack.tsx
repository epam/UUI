import React from 'react';
import * as css from './AvatarStack.scss';
import { Avatar } from "./Avatar";
import { IHasCX, cx } from "@epam/uui";
import { FlexRow } from '../';

export interface AvatarStackProps extends IHasCX {
    avatarSize: '24' | '36' | '48' | '144';
    urlArray: string[];
    direction: 'right' | 'left';
    avatarsCount?: number;
    renderItem?: (url: string) => React.ReactElement;
}

export const AvatarStack = (props: AvatarStackProps) => {

    const { avatarSize, urlArray, direction, avatarsCount, renderItem } = props;

    let firstElements = avatarsCount && (urlArray.length > avatarsCount) ? urlArray.slice(0, avatarsCount) : urlArray;

    return (
        <FlexRow cx={ props.cx }>
            <FlexRow
                rawProps={ { role:"group", style: { ['--overlap' as any]: `-${ +avatarSize / 4 }px` } } }
                cx={ cx('avatars', css.container, css['avatar-' + direction]) }
            >
                {
                    firstElements.map((avatar: string, index: number) => {
                        let avatarItem = <Avatar
                            key={ index }
                            size={ avatarSize }
                            img={ avatar }
                            alt='avatar'
                        />;
                        if (renderItem) {
                            avatarItem = <React.Fragment key={ index }>{ renderItem(avatar) }</React.Fragment>;
                        }
                        return avatarItem;
                    })
                }
            </FlexRow>
            <div className='avatarsCount' >{ urlArray.length > avatarsCount ? '+' + (urlArray.length - avatarsCount) : null }</div>
        </FlexRow>
    );
};
