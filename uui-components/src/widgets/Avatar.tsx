import * as React from 'react';
import * as css from './Avatar.scss';
import { IHasCX, cx, IHasRawProps } from '@epam/uui-core';

export interface AvatarProps extends IHasCX, IHasRawProps<HTMLDivElement> {
    alt?: string;
    img: string;
    size: '12' | '18' | '24' | '30' | '36' | '42' | '48' | '54' | '60' | '72' | '78' | '90' | '144';
    isLoading?: boolean;
}

export class Avatar extends React.Component<AvatarProps, any> {
    render() {
        return (
            <img
                className={ cx(css.avatar, this.props.cx) }
                width={ this.props.size }
                height={ this.props.size }
                src={ (this.props.isLoading || !this.props.img) ? 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg' : this.props.img }
                alt={ this.props.alt }
                { ...this.props.rawProps }
            />
        );
    }
}
