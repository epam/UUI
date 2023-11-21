import * as React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
    IHasCX, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import css from './Blocker.module.scss';

// TBD: move to loveship-specific mods
// import { EpamColor, SpinnerMods } from '@epam/oswald';

export interface BlockerProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    /** Turns the blocker on or off */
    isEnabled: boolean;
    /** Disables spinner animation display */
    hideSpinner?: boolean;
    /** Sets the minimal height in px, for cases when blocked content is empty */
    spacerHeight?: number;
    /** Replaces default spinner */
    renderSpinner?(props: any): React.ReactNode; // React.ComponentClass<SpinnerMods>;
}

const uuiBlocker = {
    container: 'uui-blocker-container',
    blocker: 'uui-blocker',
    enter: 'uui-blocker-enter',
    enterActive: 'uui-blocker-enter-active',
    exit: 'uui-blocker-exit',
    exitActive: 'uui-blocker-exit-active',
} as const;

export class Blocker extends React.Component<BlockerProps> {
    private transitionRef = React.createRef<HTMLDivElement>();
    render() {
        return (
            <div
                className={ cx(css.container, uuiBlocker.container, this.props.cx) }
                style={ { minHeight: this.props.isEnabled && this.props.spacerHeight ? `${this.props.spacerHeight}px` : undefined } }
                ref={ this.props.forwardedRef }
                { ...this.props.rawProps }
            >
                <TransitionGroup>
                    {this.props.isEnabled && (
                        <CSSTransition nodeRef={ this.transitionRef } classNames={ uuiBlocker } timeout={ { enter: 2000, exit: 1000 } }>
                            <div ref={ this.transitionRef } className={ uuiBlocker.blocker }>
                                {!this.props.hideSpinner && this.props.renderSpinner && this.props.renderSpinner(this.props)}
                            </div>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </div>
        );
    }
}
