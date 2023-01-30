import * as React from 'react';
import cx from 'classnames';
import { IHasCX, Icon, IHasRawProps, IHasForwardedRef } from '@epam/uui-core';
import { IconContainer } from '../../../index';
import css from './Burger.scss';
import { Ref } from "react";
import { PortalWithCssTransition } from "../../../overlays/portalWithCssTransition";

interface BurgerState {
    isOpen: boolean;
}

export interface BurgerProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    burgerIcon?: Icon;
    crossIcon?: Icon;
    width?: number;
    burgerContentCx?: string;
    renderBurgerContent?: (props: { onClose: () => void }) => React.ReactNode;
    bg?: string;
    logoUrl?: string;
}

export const uuiBurger = {
    menu: 'uui-burger-menu',
    menuOpen: 'uui-burger-menu-open',
    button: 'uui-burger-button',
    logoContainer: 'uui-burger-logo-container',
    logo: 'uui-burger-logo',
    overlay: 'uui-burger-overlay',
    items: 'uui-burger-items',
    overlayVisible: 'uui-burger-overlay-visible',
    itemsVisible: 'uui-burger-items-visible',
} as const;

export class Burger extends React.Component<BurgerProps, BurgerState> {
    constructor(props: BurgerProps) {
        super(props);
    }

    state: BurgerState = {
        isOpen: false,
    };

    private toggleBurgerMenu = () => {
        const isOpen = !this.state.isOpen;
        this.setState({
            isOpen: isOpen,
        });

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = null;
        }
    }

    componentWillUnmount() {
        document.body.style.overflow = null;
    }

    render() {
        return (
            <>
                <div ref={ this.props.forwardedRef } className={ cx(this.props.cx, uuiBurger.menu, css.container, this.state.isOpen && uuiBurger.menuOpen) } { ...this.props.rawProps }>
                    <div
                        className={ uuiBurger.button }
                        onClick={ this.toggleBurgerMenu }
                    >
                        <IconContainer icon={ this.state.isOpen ? this.props.crossIcon : this.props.burgerIcon } />
                    </div>
                </div>
                <PortalWithCssTransition
                    timeout={ 200 }
                    cssTransitionClass="burger-transition"
                    isOpen={ this.state.isOpen }
                    renderContent={ (ref) => {
                        return (
                            <div
                                ref={ ref as Ref<HTMLDivElement> }
                                className={ cx(this.props.cx, this.props.burgerContentCx, uuiBurger.overlay, uuiBurger.overlayVisible, css.containerContent) }
                                onClick={ this.toggleBurgerMenu }
                            >
                                <div
                                    className={ cx(this.props.cx, uuiBurger.items, uuiBurger.itemsVisible) }
                                    onClick={ (e) => e.stopPropagation() } // Temp solution
                                >
                                    { this.props.renderBurgerContent ? this.props.renderBurgerContent(({ onClose: this.toggleBurgerMenu })) : undefined }
                                </div>
                            </div>
                        );
                    } }
                />
            </>
        );
    }
}
