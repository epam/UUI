import React from 'react';
import { cx, IHasCX } from '@epam/uui-core';
import css from './InputAddon.module.scss';

export interface InputAddonProps extends IHasCX {
    /** Content to be rendered in addon */
    content: React.ReactNode;
}

export function InputAddon(props: InputAddonProps) {
    return (
        <div className={ cx(css.prefixWrapper, props.cx, 'uui-input-addon') }>
            { props.content }
        </div>
    );
}
