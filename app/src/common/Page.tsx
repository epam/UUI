import * as React from 'react';
import * as css from './Page.scss';
import { cx, IHasChildren } from '@epam/uui';
import { ErrorHandler } from '@epam/promo';

export interface PageProps extends IHasChildren {
    renderHeader?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
    contentCx?: string;
    rootRef?: React.MutableRefObject<any>;
    isFullScreen?: boolean;
}

export function Page(props: PageProps) {
    const {
        renderHeader,
        renderFooter,
        contentCx,
        children,
        rootRef,
        isFullScreen,
    } = props;

    return (
        <div ref={ rootRef } className={ css.root }>
            <header>
                { !isFullScreen && renderHeader?.() }
            </header>
            <ErrorHandler cx={ css.errorBlock }>
                <main className={ cx(css.content, contentCx) } >
                    { children }
                </main>
                <footer>
                    { !isFullScreen && renderFooter?.() }
                </footer>
            </ErrorHandler>
        </div>
    );
}
