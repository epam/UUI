import * as React from 'react';
import * as css from './MainMenuLogo.scss';
import { IAdaptiveItem, Link, ICanRedirect, cx, IHasRawProps } from '@epam/uui';
import { Anchor } from '../Anchor';

export interface MainMenuLogoProps extends IAdaptiveItem, ICanRedirect, IHasRawProps<HTMLDivElement> {
    logoUrl?: string;
    logoBgColor?: string;
    showArrow?: boolean;
    onContextMenu?: any;
    link?: Link;
    onClick?: (e: React.MouseEvent) => any;
}

export class MainMenuLogo extends React.Component<MainMenuLogoProps, any> {
    render() {
        return (
            <div onContextMenu={ this.props.onContextMenu } onClick={ this.props.onClick } {...this.props.rawProps}>
                <Anchor cx={ css.container } link={ this.props.link } href={ this.props.href } isDisabled={ !this.props.href && !this.props.link }>
                    <img
                        className={ css.logo }
                        alt='Main Menu Logo'
                        src={ this.props.logoUrl ? this.props.logoUrl : undefined }
                        style={ { backgroundColor: this.props.logoBgColor } }
                    />
                    { this.props.showArrow && <div className={ cx(css.logo, css.arrow) } style={ { borderLeftColor: this.props.logoBgColor } }></div> }
                </Anchor>
            </div>
        );
    }
}
