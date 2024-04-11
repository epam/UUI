import React, { forwardRef, useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
    IHasCX, cx, IHasRawProps,
} from '@epam/uui-core';
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

const uuiBlocker = {
    container: 'uui-blocker-container',
    blocker: 'uui-blocker',
    enter: 'uui-blocker-enter',
    enterActive: 'uui-blocker-enter-active',
    exit: 'uui-blocker-exit',
    exitActive: 'uui-blocker-exit-active',
} as const;

export const Blocker = /* @__PURE__ */forwardRef<HTMLDivElement, BlockerProps>((props, ref) => {
    const [isEnter, setIsEnter] = useState(false);
    const transitionRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        setIsEnter(props.isEnabled);
    }, [props.isEnabled]);

    return (
        <div
            className={ cx(css.container, uuiBlocker.container, props.cx) }
            style={ { minHeight: props.isEnabled && props.spacerHeight ? `${props.spacerHeight}px` : undefined } }
            ref={ ref }
            { ...props.rawProps }
        >
            <TransitionGroup>
                {isEnter && (
                    <CSSTransition in={ isEnter } nodeRef={ transitionRef } classNames={ uuiBlocker } timeout={ { enter: 2000, exit: 1000 } }>
                        <div ref={ transitionRef } className={ uuiBlocker.blocker } role="alert" aria-label="Loading">
                            {!props.hideSpinner && props.renderSpinner && props.renderSpinner(props)}
                        </div>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
});
