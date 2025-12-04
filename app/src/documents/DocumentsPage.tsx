import React, { useEffect, useMemo, useState } from 'react';
import { useUuiContext } from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { AppHeader, Page } from '../common';
import { useQuery } from '../helpers';
import { codesandboxService } from '../data/service';
import { TMode } from '../common/docs/docsConstants';
import { AppContext, type TApi } from '../data';
import { DocsSidebar } from '../common/docs/DocsSidebar';
import { useAppThemeContext } from '../helpers/appTheme';
import { ThemeId } from '@epam/uui-docs';
import { DocsBlock } from '../common/docs/docsBlock/DocsBlock';
import css from './DocumentsPage.module.scss';

type DocsQuery = {
    id: string;
    mode?: TMode;
    isSkin?: boolean;
    theme?: ThemeId;
    category?: string;
};

export function DocumentsPage() {
    const svc = useUuiContext<TApi, AppContext>();
    const selectedDocId: string = useQuery('id');
    const isSkin = useQuery<DocsQuery['isSkin']>('isSkin');
    const docsStructure = svc.uuiApp.docsMenuStructure;
    const [pageWidth, setPageWidth] = useState(window.innerWidth);
    const { theme, themesById } = useAppThemeContext();

    const redirectTo = (query: DocsQuery) =>
        svc.uuiRouter.redirect({
            pathname: '/documents',
            query,
        });

    const addCanonicalLinkTag = () => {
        const existingCanonicalLink = document.querySelector('link[rel="canonical"]');
        const currentLink = svc.uuiRouter.getCurrentLink();

        if (existingCanonicalLink) {
            existingCanonicalLink.remove();
        }

        const canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', 'https://uui.epam.com' + svc.uuiRouter.createHref({
            ...currentLink,
            query: {
                ...currentLink.query,
                theme: 'loveship',
                isSkin: false,
            },
        }));
        document.head.appendChild(canonicalLink);
    };

    const selectedDoc = useMemo(() => {
        if (docsStructure) {
            return docsStructure.find((item) => item.id === selectedDocId);
        }
    }, [docsStructure, selectedDocId]);

    useEffect(() => {
        if (docsStructure && !selectedDoc) {
            redirectTo({ id: docsStructure[0].id, mode: TMode.doc, isSkin: isSkin, theme: theme });
        }
    }, [docsStructure]);

    useEffect(() => {
        addCanonicalLinkTag();
        document.title = selectedDoc?.name ? `${selectedDoc.name} | UUI` : 'UUI';
    }, [selectedDocId, selectedDoc]);

    useEffect(() => {
        codesandboxService.getFiles(theme, themesById);

        const handleResize = () => setPageWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => {
            codesandboxService.clearFiles();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const PageComponent = selectedDoc?.component;

    return (
        <Page renderHeader={ () => <AppHeader /> }>
            <FlexRow cx={ css.content } alignItems="stretch">
                { pageWidth > 768 && (
                    <DocsSidebar />
                ) }
                { PageComponent ? <PageComponent docItem={ selectedDoc } /> : <DocsBlock key={ selectedDoc.id } docItem={ selectedDoc } /> }
            </FlexRow>
        </Page>
    );
}
