import * as React from 'react';
import cx from 'classnames';
import * as css from './MainMenuLogo.scss';
import { IAdaptiveItem, Link, ICanRedirect } from '@epam/uui';
import { Anchor } from '../Anchor';
import {MouseEvent} from "react";

export interface MainMenuLogoProps extends IAdaptiveItem, ICanRedirect {
    logoUrl?: string;
    logoBgColor?: string;
    showArrow?: boolean;
    onContextMenu?: any;
    link?: Link;
    onClick?: (e: MouseEvent) => any;
}

export class MainMenuLogo extends React.Component<MainMenuLogoProps, any> {
    render() {
        return (
            <div onContextMenu={ this.props.onContextMenu } onClick={ this.props.onClick }>
                <Anchor cx={ css.container } link={ this.props.link } href={ this.props.href } isDisabled={ !this.props.href && !this.props.link }>
                    <img
                        className={ css.logo }
                        src={ this.props.logoUrl ? this.props.logoUrl : undefined }
                        style={ { backgroundColor: this.props.logoBgColor } }
                    />
                    { this.props.showArrow && <div className={ cx(css.logo, css.arrow) } style={ { borderLeftColor: this.props.logoBgColor } }></div> }
                </Anchor>
            </div>
        );
    }
}
