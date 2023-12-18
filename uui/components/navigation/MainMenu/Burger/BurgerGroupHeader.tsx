import * as React from 'react';
import cx from 'classnames';
import css from './BurgerGroupHeader.module.scss';

interface BurgerGroupHeaderProps {
    /*
    * Defines component caption.
    */
    caption: string;
}

export function BurgerGroupHeader(props: BurgerGroupHeaderProps) {
    return (
        <div className={ cx(css.root, css.groupHeader, 'uui-burger-group-header') }>
            <hr className={ css.line } />
            <span className={ css.groupName }>{props.caption}</span>
        </div>
    );
}
