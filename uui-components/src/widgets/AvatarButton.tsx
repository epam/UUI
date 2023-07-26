import React from 'react';
import { cx } from '@epam/uui-core';
import { AvatarProps, Avatar } from './Avatar';
import css from './AvatarButton.module.scss';

export interface AvatarButtonProps extends AvatarProps {
    /** Click handler */
    onClick?: () => void;

    /** Defines a string value that labels the current element */
    'aria-label'?: string;
}

function AvatarButtonComponent(props: AvatarButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
    return (
        <button
            type="button"
            onClick={ props.onClick }
            ref = { ref }
            className={ cx(css.avatarButton, props.cx) }
            style={ { height: `${props.size}px` } }
            aria-label={ props['aria-label'] }
        >
            <Avatar { ...props } />
        </button>
    );
}

export const AvatarButton = React.forwardRef(AvatarButtonComponent) as <AvatarButtonComponent>(
    props: AvatarButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) => JSX.Element;
