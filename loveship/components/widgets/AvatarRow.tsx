import React from 'react';
import css from './AvatarRow.module.scss';
import { Avatar } from '@epam/uui';
import { AvatarProps } from '@epam/uui-components';
import cx from 'classnames';

interface AvatarRowProps {}

export class AvatarRow extends React.Component<AvatarRowProps & AvatarProps> {
    render() {
        return (
            <div className={ css.avatarRow }>
                <Avatar { ...this.props } cx={ cx(css.avatarContent, css['size-' + this.props.size]) } />
            </div>
        );
    }
}
