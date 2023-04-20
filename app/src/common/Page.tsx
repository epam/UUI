import * as React from 'react';
import css from './Page.scss';
import { cx, IHasChildren } from '@epam/uui-core';
import { ErrorHandler } from '@epam/promo';

export interface PageProps extends IHasChildren {
    renderHeader?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
    contentCx?: string;
    isFullScreen?: boolean;
}

export function Page(props: PageProps) {
    const {
        renderHeader, renderFooter, contentCx, children, isFullScreen,
    } = props;

    return (
        <div className={ css.root }>
            <header>{!isFullScreen && renderHeader?.()}</header>
            <ErrorHandler cx={ css.errorBlock }>
                <main className={ cx(css.content, contentCx) }>{children}</main>
                <footer>{!isFullScreen && renderFooter?.()}</footer>
            </ErrorHandler>
        </div>
    );
}
