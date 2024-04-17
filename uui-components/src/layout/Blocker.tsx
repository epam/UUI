import React, { forwardRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { IHasCX, cx, IHasRawProps } from '@epam/uui-core';
import css from './Blocker.module.scss';

export interface BlockerProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Turns the blocker on or off */
    isEnabled: boolean;
    /** Disables spinner animation display */
    hideSpinner?: boolean;
    /** Sets the minimal height in px, for cases when blocked content is empty */
    spacerHeight?: number;
    /** Replaces default spinner */
    renderSpinner?(props: any): React.ReactNode;
}

const classNames = {
    container: 'uui-blocker-container',
    blocker: 'uui-blocker',
};

const uuiBlocker = {
    enter: 'uui-blocker-enter',
    enterActive: 'uui-blocker-enter-active',
    exit: 'uui-blocker-exit',
    exitActive: 'uui-blocker-exit-active',
} as const;

export const Blocker = forwardRef<HTMLDivElement, BlockerProps>((props, ref) => {
    const transitionRef = React.createRef<HTMLDivElement>();
    return (
        <div
            className={ cx(css.container, classNames.container, props.cx) }
            style={ { minHeight: props.isEnabled && props.spacerHeight ? `${props.spacerHeight}px` : undefined } }
            ref={ ref }
            role="status"
            aria-live="polite"
            aria-busy={ props.isEnabled ? 'true' : 'false' }
            aria-label={ props.isEnabled ? 'Loading' : '' }
            { ...props.rawProps }
        >
            <CSSTransition
                in={ props.isEnabled }
                nodeRef={ transitionRef }
                classNames={ uuiBlocker }
                timeout={ { enter: 2000, exit: 1000 } }
                mountOnEnter
                unmountOnExit
            >
                <div ref={ transitionRef } className={ classNames.blocker }>
                    {!props.hideSpinner && props.renderSpinner && props.renderSpinner(props)}
                </div>
            </CSSTransition>
        </div>
    );
});
