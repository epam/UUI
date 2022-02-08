import * as React from 'react';
import cx from 'classnames';
import * as css from './GlobalMenu.scss';
import { ReactComponent as GlobalMenuIcon } from '../../../icons/global_menu.svg';
import { IAdaptiveItem, IHasCX, IHasRawProps } from '@epam/uui';
import { IconContainer } from '@epam/uui-components';

export interface GlobalMenuProps extends IAdaptiveItem, IHasCX, IHasRawProps<HTMLDivElement> {}

export const GlobalMenu = React.forwardRef<HTMLDivElement, GlobalMenuProps>((props, ref) => (
    <div ref={ ref } id='global_menu_toggle' className={ cx(css.globalMenuBtn, props.cx) } { ...props.rawProps }>
        <IconContainer icon={ GlobalMenuIcon } cx={ css.globalMenuIcon } />
    </div>
));
