import * as React from 'react';
import cx from 'classnames';
import FocusLock from 'react-focus-lock';
import {
    IHasCX, Icon, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import { Portal, PortalProps } from '../../../overlays';
import { IconContainer } from '../../../layout';
import css from './Burger.module.scss';
import { Ref, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

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

const uuiBurgerTransitionTimeout = {
    // Keep the timeouts in sync with the corresponding CSS style transitions.
    enter: 200,
    exit: 200,
};
const uuiBurgerTransitionClasses = {
    enter: css.burgerTransitionEnter,
    enterActive: css.burgerTransitionEnterActive,
    exit: css.burgerTransitionExit,
    exitActive: css.burgerTransitionExitActive,
};

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
    };

    componentWillUnmount() {
        if (this.state.isOpen) {
            document.body.style.overflow = null;
        }
    }

    renderContent = (ref: Ref<HTMLElement>) => {
        const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                this.toggleBurgerMenu();
            }
        };

        const handleOnClick = (e: React.SyntheticEvent) => {
            // check whether it was clicked outside of burger menu list
            if (e.target === e.currentTarget) {
                this.toggleBurgerMenu();
            }
        };

        return (
            <div
                ref={ ref as Ref<HTMLDivElement> }
                className={ cx(this.props.cx, this.props.burgerContentCx, uuiBurger.overlay, uuiBurger.overlayVisible, css.containerContent) }
                onClick={ handleOnClick }
            >
                <FocusLock
                    returnFocus
                    className={ cx(this.props.cx, uuiBurger.items, uuiBurger.itemsVisible) }
                    lockProps={ { onKeyDown: handleKeyDown } }
                >
                    {this.props.renderBurgerContent ? this.props.renderBurgerContent({ onClose: this.toggleBurgerMenu }) : undefined}
                </FocusLock>
            </div>
        );
    };

    render() {
        return (
            <>
                <div
                    ref={ this.props.forwardedRef }
                    className={ cx(this.props.cx, uuiBurger.menu, css.container, this.state.isOpen && uuiBurger.menuOpen) }
                    { ...this.props.rawProps }
                >
                    <button className={ uuiBurger.button } onClick={ this.toggleBurgerMenu }>
                        <IconContainer icon={ this.state.isOpen ? this.props.crossIcon : this.props.burgerIcon } />
                    </button>
                </div>
                <PortalWithCssTransition
                    timeout={ uuiBurgerTransitionTimeout }
                    cssTransitionClasses={ uuiBurgerTransitionClasses }
                    isOpen={ this.state.isOpen }
                    renderContent={ this.renderContent }
                />
            </>
        );
    }
}

interface PortalWithCssTransitionProps extends PortalProps {
    renderContent: (nodeRef: React.Ref<HTMLElement>) => React.ReactNode;
    cssTransitionClasses: {
        enter: string;
        enterActive: string;
        exit: string;
        exitActive: string;
    };
    timeout: {
        enter: number;
        exit: number;
    };
    isOpen: boolean;
}

/**
 * Renders portal with CSSTransition animation.
 * The portal is mounted only if isOpen=true so that it's compatible with SSR.
 */
function PortalWithCssTransition(props: PortalWithCssTransitionProps) {
    const {
        isOpen, timeout, cssTransitionClasses, ...portalProps
    } = props;
    const nodeRef = useRef<HTMLElement>(null);
    const renderContentLocal = useCallback(
        (ref: React.Ref<HTMLElement>) => {
            return <Portal { ...portalProps }>{props.renderContent(ref)}</Portal>;
        },
        [props.renderContent],
    );

    return (
        <CSSTransition nodeRef={ nodeRef } in={ isOpen } timeout={ timeout } mountOnEnter={ true } unmountOnExit={ true } classNames={ cssTransitionClasses }>
            {renderContentLocal(nodeRef)}
        </CSSTransition>
    );
}
