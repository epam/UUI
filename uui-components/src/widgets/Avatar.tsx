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

    /** Avatar onClick.
     *  @deprecated Property onClick is deprecated and will be removed in future release.
     * */
    onClick?: () => void;
}

function AvatarComponent(props: AvatarProps, ref: React.ForwardedRef<HTMLImageElement>) {
    const [isError, setIsError] = React.useState<boolean>(false);

    function onError() {
        if (!isError) {
            setIsError(true);
        }
    }
    return (
        <img
            onClick={ props.onClick }
            ref={ ref }
            className={ cx(css.avatar, props.cx) }
            width={ props.size }
            height={ props.size }
            src={
                props.isLoading || !props.img || isError
                    ? 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg'
                    : props.img
            }
            alt={ props.alt }
            onError={ onError }
            { ...props.rawProps }
        />
    );
}

export const Avatar = React.forwardRef(AvatarComponent) as <AvatarComponent>(props: AvatarProps, ref: React.ForwardedRef<HTMLImageElement>) => JSX.Element;
