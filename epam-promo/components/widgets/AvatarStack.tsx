import * as React from 'react';
import { FlexRow } from '../layout/FlexItems';
import { Text } from '../typography';
import * as css from './AvatarStack.scss';
import cx from 'classnames';

export interface AvatarStackProps {
    avatarSize: '24' | '36' | '48' | '144';
    urlArray: string[];
    direction: 'right' | 'left';
    avatarsCount: number;
}

export class AvatarStack extends React.Component<AvatarStackProps> {
    getFirstElements() {
        let firstElements = this.props.urlArray.length > this.props.avatarsCount ? this.props.urlArray.slice(0, this.props.avatarsCount) : this.props.urlArray;
        return firstElements.map((url, index) => (
            <img
                src={ url }
                alt="avatar"
                width={ this.props.avatarSize }
                height={ this.props.avatarSize }
                key={ url + '-' + index }
                style={ { ['--overlap' as any]: `-${ +this.props.avatarSize / 4 }px` } }
            />
        ));
    }

    render() {
        return <FlexRow spacing='6'>
            <div className={ cx(css.avatars, css['avatar-' + this.props.direction]) }>
                { this.getFirstElements() }
            </div>
            <Text size="36" color="gray80" font="sans-semibold" >
                { this.props.urlArray.length > this.props.avatarsCount ? '+' + (this.props.urlArray.length - this.props.avatarsCount) : null }
            </Text>
        </FlexRow>;
    }
}
