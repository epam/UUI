import * as React from 'react';
import * as css from './Burger.scss';
import { IHasCX, Icon } from '@epam/uui';
import { IconContainer, Portal } from '../../../index';
import cx from 'classnames';

interface BurgerState {
    isOpen: boolean;
}

export interface BurgerProps extends IHasCX {
    burgerIcon?: Icon;
    crossIcon?: Icon;
    width: number;
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
};

export class Burger extends React.Component<BurgerProps, BurgerState> {
    constructor(props: BurgerProps) {
        super(props);

        this.state = {
            isOpen: false,
        };
    }

    private toggleBurgerMenu = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
        }));
    }

    private isBurgerWide() {
        return this.props.width <= 400;
    }

    render() {
        const burgerWidth = 60;
        const globalMenuWidth = 60;
        return (
            <>
                <div className={ cx(this.props.cx, uuiBurger.menu, css.container, this.state.isOpen && uuiBurger.menuOpen) }>
                    <div
                        className={ uuiBurger.button }
                        onClick={ this.toggleBurgerMenu }
                        style={ { backgroundColor: this.isBurgerWide() && this.props.bg } }
                    >
                        <IconContainer icon={ this.state.isOpen ? this.props.crossIcon : this.props.burgerIcon } />
                    </div>

                    { this.isBurgerWide() &&
                        this.state.isOpen && (
                            <div
                                className={ uuiBurger.logoContainer }
                                style={ {
                                    width: this.props.width - burgerWidth - globalMenuWidth + 'px',
                                    background: (this.props.bg !== 'transparent' && this.props.bg) || '#303240',
                                } }
                            >
                                <img className={ uuiBurger.logo } src={ this.props.logoUrl } />
                            </div>
                        ) }
                </div>
                <Portal>
                    <div
                        className={ cx(this.props.cx, this.props.burgerContentCx, uuiBurger.overlay, this.state.isOpen && uuiBurger.overlayVisible) }
                        onClick={ this.toggleBurgerMenu }
                    >
                        <div
                            className={ cx(this.props.cx, uuiBurger.items, this.state.isOpen && uuiBurger.itemsVisible) }
                            style={ { width: this.isBurgerWide() && this.props.width } }
                            onClick={ (e) => e.stopPropagation() } // Temp solution
                        >
                            { this.state.isOpen && this.props.renderBurgerContent ? this.props.renderBurgerContent(({ onClose: this.toggleBurgerMenu })) : undefined }
                        </div>
                    </div>
                </Portal>
            </>
        );
    }
}
