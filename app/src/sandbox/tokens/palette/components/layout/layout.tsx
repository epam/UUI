import css from './layout.module.scss';
import { ScrollBars } from '@epam/uui';
import React from 'react';

export function Layout(props: { children: React.ReactNode }) {
    return (
        <div className={ css.layoutRoot }>
            <ScrollBars>
                <div className={ css.blockWrapper }>
                    {props.children}
                </div>
            </ScrollBars>
        </div>
    );
}
