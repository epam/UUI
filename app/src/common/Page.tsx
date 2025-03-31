import * as React from 'react';
import css from './Page.module.scss';
import { cx, IHasChildren } from '@epam/uui-core';
import { ErrorHandler } from '@epam/promo';

export interface PageProps extends IHasChildren {
    renderHeader?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
    contentCx?: string;
    rootCx?: string;
    isFullScreen?: boolean;
    wrapperRef?: React.Ref<HTMLElement>;
    onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
}

export function Page(props: PageProps) {
    const {
        renderHeader, renderFooter, contentCx, children, isFullScreen, rootCx,
    } = props;

    return (
        <div className={ cx(css.root, rootCx) }>
            <header>{!isFullScreen && renderHeader?.()}</header>
            <ErrorHandler cx={ css.errorBlock }>
                <main
                    className={ cx(css.content, contentCx) }
                    ref={ props.wrapperRef }
                    onClick={ props.onClick }
                >
                    {children}
                </main>
                <footer>{!isFullScreen && renderFooter?.()}</footer>
            </ErrorHandler>
        </div>
    );
}
