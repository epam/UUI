import React from 'react';
import {
    IHasCX, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import css from './Avatar.module.scss';

export interface AvatarProps extends IHasCX, IHasRawProps<React.ImgHTMLAttributes<HTMLImageElement>>, IHasForwardedRef<HTMLImageElement> {
    /** HTML alt attribute value */
    alt?: string;

    /** Image URL */
    img: string;

    /** Size  */
    size: '12' | '18' | '24' | '30' | '36' | '42' | '48' | '54' | '60' | '72' | '78' | '90' | '144';

    /** True to show placeholder */
    isLoading?: boolean;

    /** Click handler */
    onClick?: () => void;
}

function AvatarComponent(props: AvatarProps, ref: React.ForwardedRef<HTMLImageElement | HTMLButtonElement>) {
    const [isError, setIsError] = React.useState<boolean>(false);

    function onError() {
        if (!isError) {
            setIsError(true);
        }
    }

    const { 'aria-label': ariaLabel, ...rawProps } = props.rawProps;
    const commonProps = {
        className: cx(css.avatar, props.cx),
        width: props.size,
        height: props.size,
        src: props.isLoading || !props.img || isError
            ? 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg'
            : props.img,
        alt: props.alt,
        onError,
        ...rawProps,
    };

    if (props.onClick) {
        return (
            <button
                ref={ ref as React.ForwardedRef<HTMLButtonElement> }
                type="button"
                onClick={ props.onClick }
                className={ cx(css.avatarButton, props.cx) }
                style={ { height: `${props.size}px` } }
                aria-label={ ariaLabel }
            >
                <img { ...commonProps } />
            </button>
        );
    }

    return (
        <img
            ref={ ref as React.ForwardedRef<HTMLImageElement> }
            aria-label={ ariaLabel }
            { ...commonProps }
        />
    );
}

export const Avatar = React.forwardRef(AvatarComponent) as <AvatarComponent>(props: AvatarProps, ref: React.ForwardedRef<HTMLImageElement>) => JSX.Element;
