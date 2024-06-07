import React from 'react';
import { uuiElement, ModalWindowProps, cx } from '@epam/uui-core';
import { VPanel } from '../layout';

export const ModalWindow = React.forwardRef<HTMLDivElement, ModalWindowProps>((props, ref) => {
    return (
        <VPanel
            style={ props.style }
            cx={ cx(uuiElement.modalWindow, props.cx) }
            rawProps={ {
                'aria-modal': true,
                role: 'dialog',
                ...props.rawProps,
            } }
            forwardedRef={ ref }
        >
            {props.children}
        </VPanel>
    );
});
