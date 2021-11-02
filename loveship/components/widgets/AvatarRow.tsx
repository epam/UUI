import React from 'react';
import * as css from './AvatarRow.scss';
import { Avatar } from './Avatar';
import { AvatarProps } from '@epam/uui-components';
import cx from 'classnames';

interface AvatarRowProps { }

export class AvatarRow extends React.Component<AvatarRowProps & AvatarProps, any> {
    render() {
        return <div className={ css.avatarRow }>
            <Avatar { ...this.props } cx={ cx(css.avatarContent, css['size-' + this.props.size]) }/>
        </div>;
    }
}
