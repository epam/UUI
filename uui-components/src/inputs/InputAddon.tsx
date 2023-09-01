import React from 'react';
import { cx, IHasCX } from '@epam/uui-core';
import css from './InputAddon.module.scss';

export interface InputAddonProps extends IHasCX {
    content: string;
}

export class InputAddon extends React.Component<InputAddonProps> {
    render() {
        return (
            <div className={ cx(css.prefixWrapper, this.props.cx, 'uui-input-addon') }>
                {this.props.content}
            </div>
        );
    }
}
