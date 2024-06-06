import * as React from 'react';
import css from './Page.module.scss';
import { cx, IHasChildren, useUuiContext } from '@epam/uui-core';
import { ErrorHandler } from '@epam/promo';
import { useEffect } from 'react';

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

    const services = useUuiContext();

    const getPageName = (pageId: string) => {
        if (!pageId) return '';

        const capitalizedPageId = pageId.charAt(0).toUpperCase() + pageId.slice(1);
        return capitalizedPageId.replace(/([a-z])([A-Z])/g, '$1 $2');
    };

    useEffect(() => {
        const pageId = services.uuiRouter.getCurrentLink().query.id;
        const pageName = getPageName(pageId);
        document.title = pageName ? `${pageName} | UUI` : 'UUI';
    }, [services.uuiRouter.getCurrentLink().search]);

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
