import React, { useEffect, useMemo, useState } from 'react';
import { useUuiContext } from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { AppHeader, Page } from '../common';
import { items as itemsStructure } from './structure';
import { useQuery } from '../helpers';
import { codesandboxService } from '../data/service';
import { TMode } from '../common/docs/docsConstants';
import { AppContext, type TApi, TTheme } from '../data';
import { SidebarComponent } from '../common/docs/SidebarComponent';

type DocsQuery = {
    id: string;
    mode?: TMode;
    isSkin?: boolean;
    theme?: TTheme;
    category?: string;
};

export function DocumentsPage() {
    const svc = useUuiContext<TApi, AppContext>();
    const queryParamId: string = useQuery('id');
    const isSkin = useQuery<DocsQuery['isSkin']>('isSkin');
    const theme = useQuery<DocsQuery['theme']>('theme');
    const itemsInfo = useItems(queryParamId);
    const [pageWidth, setPageWidth] = useState(window.innerWidth);

    const redirectTo = (query: DocsQuery) =>
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query,
        });

    function useItems(selectedId: string) {
        const { apiRefItems } = svc.uuiApp;

        return useMemo(() => {
            if (apiRefItems) {
                const items = itemsStructure.concat(apiRefItems);
                const PageComponent = items.find((item) => item.id === selectedId)?.component;
                return {
                    items,
                    PageComponent,
                };
            }
        }, [apiRefItems, selectedId]);
    }

    useEffect(() => {
        if (itemsInfo && !itemsInfo.PageComponent) {
            redirectTo({ id: itemsInfo.items[0].id, mode: TMode.doc, isSkin: isSkin, theme: theme });
        }
    }, [itemsInfo]);

    useEffect(() => {
        codesandboxService.getFiles();

        const handleResize = () => setPageWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => {
            codesandboxService.clearFiles();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const PageComponent = itemsInfo?.PageComponent;

    return (
        <Page renderHeader={ () => <AppHeader /> }>
            <FlexRow alignItems="stretch">
                { pageWidth > 768 && (
                    <SidebarComponent />
                ) }
                { PageComponent && <PageComponent /> }
            </FlexRow>
        </Page>
    );
}
