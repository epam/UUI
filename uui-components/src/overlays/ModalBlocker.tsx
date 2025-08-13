import React, { useCallback, useContext, useEffect } from 'react';
import FocusLock from 'react-focus-lock';
import css from './ModalBlocker.module.scss';
import { ModalBlockerProps, UuiContext, cx, uuiElement } from '@epam/uui-core';

export const ModalBlocker = React.forwardRef<HTMLDivElement, ModalBlockerProps>((props, ref) => {
    const context = useContext(UuiContext);

    useEffect(() => {
        let unsubscribeFromRouter: () => void | null = null;
        document.body.style.overflow = 'hidden';
        !props.disableCloseByEsc && window.addEventListener('keydown', keydownHandler);

        if (!props.disableCloseOnRouterChange) {
            unsubscribeFromRouter = context.uuiRouter.listen(() => {
                urlChangeHandler();
            });
        }

        return () => {
            !props.disableCloseByEsc && window.removeEventListener('keydown', keydownHandler);

            if (!context.uuiModals.getOperations().length) {
                document.body.style.overflow = 'visible';
            }

            if (unsubscribeFromRouter) {
                unsubscribeFromRouter();
            }
        };
    }, [props.abort]);

    const urlChangeHandler = () => {
        !props.disableCloseOnRouterChange && context.uuiModals.closeAll();
    };

    const keydownHandler = useCallback((e: KeyboardEvent) => {
        // Get current isActive status at the time of keydown
        const currentOperations = context.uuiModals.getOperations();
        const currentOperation = currentOperations.find((op) => {
            // First try to match by modalKey (new approach)
            if (props.modalKey && op.props.modalKey === props.modalKey) {
                return true;
            }
            // Fallback to key (backward compatibility)
            if (op.props.key === props.key) {
                return true;
            }
            return false;
        });
        const currentIsActive = currentOperation ? currentOperations.indexOf(currentOperation) === currentOperations.length - 1 : false;
        if (e.key === 'Escape' && currentIsActive) {
            props.abort();
        }
    }, [props.abort, props.modalKey, props.key, context.uuiModals]);

    const handleBlockerClick = () => {
        if (!props.disallowClickOutside) {
            props.abort();
        }
    };

    return (
        <div className={ cx(css.container, props.cx) } style={ { zIndex: props.zIndex } } ref={ ref } { ...props.rawProps }>
            <div
                className={ uuiElement.modalBlocker }
                onClick={ handleBlockerClick }
                aria-label="Click to close a modal"
            />
            <FocusLock returnFocus={ { preventScroll: true } } disabled={ props.disableFocusLock }>
                {props.children}
            </FocusLock>
        </div>
    );
});
