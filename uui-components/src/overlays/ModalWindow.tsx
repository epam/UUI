import React from 'react';
import { uuiElement, ModalWindowProps, cx } from '@epam/uui-core';
import { VPanel } from '../layout';

export const ModalWindow = (props: ModalWindowProps & React.RefAttributes<HTMLDivElement>) => {
    return (
        <VPanel
            style={ props.style }
            cx={ cx(uuiElement.modalWindow, props.cx) }
            rawProps={ {
                'aria-modal': true,
                role: 'dialog',
                ...props.rawProps,
            } }
            ref={ props.ref }
        >
            {props.children}
        </VPanel>
    );
};
