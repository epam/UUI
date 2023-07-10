import cx from 'classnames';
import * as React from 'react';


import css from './NotePluginBlock.module.scss';


export function NotePluginBlock(props: any) {

    const { attributes, type, children } = props;

    return (
        <div { ...attributes } className={ cx(css.wrapper, css[type]) }>
            <div className={ css.content }>
                { children }
            </div>
        </div>
    );
}
