import * as React from 'react';
import * as css from './Page.scss';
import { cx, IHasChildren } from '@epam/uui';
import { ErrorHandler } from '@epam/promo';
import { IFullScreenApi, useFullScreenApi } from "./services/useFullScreenApi";

export interface PageProps extends IHasChildren {
    renderHeader?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
    contentCx?: string;
}

export const PageContext = React.createContext<{ fullScreenApi: IFullScreenApi }>(null);

Page.displayName = 'Page';
export function Page(props: PageProps) {
    const {
        renderHeader,
        renderFooter,
        contentCx,
        children,
    } = props;

    const pageRootRef = React.useRef(undefined);
    const fullScreenApi = useFullScreenApi(pageRootRef);

    const pageContextValue = React.useMemo(() => {
        return {
            fullScreenApi,
        };
    }, [fullScreenApi]);

    return (
        <PageContext.Provider value={ pageContextValue }>
            <div ref={ pageRootRef } className={ css.root }>
                <header>
                    { !fullScreenApi.isFullScreen && renderHeader?.() }
                </header>
                <ErrorHandler cx={ css.errorBlock }>
                    <main id="pageMain" className={ cx(css.content, contentCx) } >
                        { children }
                    </main>
                    <footer>
                        { !fullScreenApi.isFullScreen && renderFooter?.() }
                    </footer>
                </ErrorHandler>
            </div>
        </PageContext.Provider>
    );
}
