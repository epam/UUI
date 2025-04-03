import * as React from 'react';
import cx from 'classnames';
import type { IHasCX, IHasRawProps } from '@epam/uui-core';
import { Avatar } from './Avatar';
import css from './AvatarStack.module.scss';

export interface AvatarStackProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    avatarSize: '24' | '36' | '48' | '144';
    urlArray: string[];
    direction: 'right' | 'left';
    avatarsCount?: number;
    renderItem?: (url: string) => React.ReactElement;
}

export const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>((props, ref) => {
    const {
        avatarSize, urlArray, direction, avatarsCount, renderItem,
    } = props;

    const firstElements = avatarsCount && urlArray.length > avatarsCount ? urlArray.slice(0, avatarsCount) : urlArray;
    const styleObj = { '--overlap': `-${+avatarSize / 4}px` } as object;
    return (
        <div className={ cx(props.cx, css.root) } ref={ ref } { ...props.rawProps }>
            <div role="group" style={ styleObj } className={ cx('uui-avatar_stack-avatars', css.container, css['avatar-' + direction]) }>
                {firstElements.map((avatar, index) => {
                    return renderItem ? (
                        <React.Fragment key={ index }>{renderItem(avatar)}</React.Fragment>
                    ) : (
                        <Avatar key={ index } size={ avatarSize } img={ avatar } alt="avatar" />
                    );
                })}
            </div>
            <div className="uui-avatar_stack-count">{avatarsCount && urlArray.length > avatarsCount ? '+' + (urlArray.length - avatarsCount) : null}</div>
        </div>
    );
});
