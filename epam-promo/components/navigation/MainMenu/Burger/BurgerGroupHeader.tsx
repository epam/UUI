import * as React from 'react';
import * as css from './BurgerGroupHeader.scss';

export interface BurgerGroupHeaderProps {
    caption: string;
}

export const BurgerGroupHeader = (props: BurgerGroupHeaderProps) => {
    return (
        <div className={ css.groupHeader }>
            <hr className={ css.line } />
            <span className={ css.groupName }>{ props.caption }</span>
        </div>
    );
};
