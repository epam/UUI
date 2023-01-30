import { Portal, PortalProps } from './Portal';
import { CSSTransition } from "react-transition-group";
import React, { useCallback, useRef } from "react";

export interface PortalWithCssTransitionProps extends PortalProps {
    renderContent: (nodeRef: React.Ref<HTMLElement>) => React.ReactNode;
    cssTransitionClass: string;
    timeout: number;
    isOpen: boolean;
}

/**
 * Renders portal with CSSTransition animation.
 * The portal is mounted only if isOpen=true so that it's compatible with SSR.
 */
export function PortalWithCssTransition(props: PortalWithCssTransitionProps) {
    const { isOpen, timeout, cssTransitionClass, ...portalProps } = props;
    const nodeRef = useRef<HTMLElement>(null);
    const renderContentLocal = useCallback((ref: React.Ref<HTMLElement>) => {
        return (
            <Portal { ...portalProps }>
                { props.renderContent(ref) }
            </Portal>
        );
    }, [props.renderContent]);

    return (
        <CSSTransition
            nodeRef={ nodeRef }
            in={ isOpen }
            timeout={ timeout }
            mountOnEnter={ true }
            unmountOnExit={ true }
            classNames={ cssTransitionClass }
        >
            { renderContentLocal(nodeRef) }
        </CSSTransition>
    );
}
