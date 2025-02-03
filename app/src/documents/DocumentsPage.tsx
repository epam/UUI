import React, { useEffect, useMemo, useState } from 'react';
import { useUuiContext } from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { AppHeader, Page } from '../common';
import { useQuery } from '../helpers';
import { codesandboxService } from '../data/service';
import { TMode } from '../common/docs/docsConstants';
import { AppContext, type TApi, ThemeId } from '../data';
import { DocsSidebar } from '../common/docs/DocsSidebar';
import { useAppThemeContext } from '../helpers/appTheme';

type DocsQuery = {
    id: string;
    mode?: TMode;
    isSkin?: boolean;
    theme?: ThemeId;
    category?: string;
};

export function DocumentsPage() {
    const svc = useUuiContext<TApi, AppContext>();
    const queryParamId: string = useQuery('id');
    const isSkin = useQuery<DocsQuery['isSkin']>('isSkin');
    const itemsInfo = useItems(queryParamId);
    const [pageWidth, setPageWidth] = useState(window.innerWidth);
    const { theme, themesById } = useAppThemeContext();

    const redirectTo = (query: DocsQuery) =>
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query,
        });

    function useItems(selectedId: string) {
        const { docsMenuStructure } = svc.uuiApp;

        return useMemo(() => {
            if (docsMenuStructure) {
                const items = docsMenuStructure;
                const PageComponent = items.find((item) => item.id === selectedId)?.component;
                return {
                    items,
                    PageComponent,
                };
            }
        }, [docsMenuStructure, selectedId]);
    }

    useEffect(() => {
        if (itemsInfo && !itemsInfo.PageComponent) {
            redirectTo({ id: itemsInfo.items[0].id, mode: TMode.doc, isSkin: isSkin, theme: theme });
        }
    }, [itemsInfo]);

    useEffect(() => {
        codesandboxService.getFiles(theme, themesById);

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
                    <DocsSidebar />
                ) }
                { PageComponent && <PageComponent /> }
            </FlexRow>
        </Page>
    );
}
