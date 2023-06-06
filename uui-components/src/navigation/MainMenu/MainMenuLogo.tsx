import * as React from 'react';
import {
    IAdaptiveItem, Link, ICanRedirect, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import { Anchor } from '../Anchor';
import css from './MainMenuLogo.module.scss';

export interface MainMenuLogoProps extends IAdaptiveItem, ICanRedirect, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    logoUrl?: string;
    logoBgColor?: string;
    showArrow?: boolean;
    onContextMenu?: any;
    link?: Link;
    onClick?: (e: React.MouseEvent) => any;
}

export class MainMenuLogo extends React.Component<MainMenuLogoProps> {
    render() {
        return (
            <div
                onContextMenu={ this.props.onContextMenu }
                onClick={ this.props.onClick }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <Anchor
                    cx={ css.container }
                    link={ this.props.link }
                    href={ this.props.href }
                    target={ this.props.target }
                    isDisabled={ !this.props.href && !this.props.link }
                >
                    <img
                        className={ css.logo }
                        alt="Main Menu Logo"
                        src={ this.props.logoUrl ? this.props.logoUrl : undefined }
                        style={ { backgroundColor: this.props.logoBgColor } }
                    />
                    {this.props.showArrow && <div className={ cx(css.logo, css.arrow) } style={ { borderLeftColor: this.props.logoBgColor } }></div>}
                </Anchor>
            </div>
        );
    }
}
