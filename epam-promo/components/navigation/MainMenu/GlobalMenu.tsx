import * as React from 'react';
import cx from 'classnames';
import * as css from './GlobalMenu.scss';
import { ReactComponent as GlobalMenuIcon } from '../../../icons/global_menu.svg';
import { IAdaptiveItem, IHasCX, IHasForwardedRef, IHasRawProps } from '@epam/uui';
import { IconContainer } from '@epam/uui-components';

export interface GlobalMenuProps extends IAdaptiveItem, IHasCX, IHasForwardedRef<HTMLDivElement>, IHasRawProps<HTMLDivElement> {}

export class GlobalMenu extends React.Component<GlobalMenuProps> {
    render() {
        return (
            <div ref={ this.props.forwardedRef } id='global_menu_toggle' className={ cx(css.globalMenuBtn, this.props.cx) } { ...this.props.rawProps }>
                <IconContainer icon={ GlobalMenuIcon } cx={ css.globalMenuIcon } />
            </div>
        );
    }
}
